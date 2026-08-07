"use server";

import { revalidatePath } from "next/cache";
import { availability } from "@/content/availability";
import { ui } from "@/content/ui";
import { isLocale, type Locale } from "@/content/types";
import { validateSlot } from "@/lib/booking";
import {
  sendBookingCancellation,
  sendBookingConfirmation,
  sendBookingNotice,
} from "@/lib/booking-mail";
import { isMailConfigured } from "@/lib/mail";
import { checkRate, clientFingerprint, LIMITS } from "@/lib/rate-limit";
import { mutate, type Booking } from "@/lib/store";
import { newId, newToken, tokenEquals } from "@/lib/tokens";
import { fieldErrors, isHoneypotFilled, makeBookingSchema } from "@/lib/validation";
import { fail, ok, type FormState } from "./types";

/**
 * Réservation d'un créneau.
 *
 * La vérification de disponibilité et l'écriture ont lieu dans la même
 * opération sérialisée par le magasin : deux visiteurs qui valident le même
 * créneau à la même seconde ne peuvent pas réserver tous les deux, le second
 * reçoit « ce créneau vient d'être pris ».
 */
export async function bookSlot(_prev: FormState, form: FormData): Promise<FormState> {
  const rawLocale = String(form.get("locale") ?? "fr");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";

  try {
    if (isHoneypotFilled(form)) {
      return ok(ui.booking.confirmed[locale]);
    }

    const fingerprint = await clientFingerprint();
    const verdict = checkRate(`booking:${fingerprint}`, LIMITS.booking.limit, LIMITS.booking.windowMs);
    if (!verdict.allowed) {
      return fail(ui.status.rateLimited[locale]);
    }

    const parsed = makeBookingSchema(locale).safeParse({
      name: form.get("name"),
      email: form.get("email"),
      company: form.get("company") ?? "",
      subject: form.get("subject"),
      slot: form.get("slot"),
      timezone: form.get("timezone"),
      consent: form.get("consent") === "on" || form.get("consent") === "true",
      website: form.get("website") ?? "",
    });

    if (!parsed.success) {
      return fail(ui.status.invalid[locale], fieldErrors(parsed.error));
    }

    if (!isMailConfigured()) {
      console.error("[rdv] SMTP non configuré : réservation refusée plutôt que muette");
      return fail(ui.status.mailDown[locale]);
    }

    const { name, email, company, subject, slot, timezone } = parsed.data;

    const outcome = await mutate((data) => {
      const now = new Date();
      const taken = data.bookings
        .filter((b) => b.status === "confirmed")
        .map((b) => b.startUtc);

      const check = validateSlot(slot, now, taken);
      if (!check.ok) return { kind: "rejected" as const, reason: check.reason };

      const booking: Booking = {
        id: newId(),
        token: newToken(),
        startUtc: new Date(slot).toISOString(),
        durationMin: availability.durationMin,
        name,
        email,
        company: company || undefined,
        subject,
        timezone,
        locale,
        status: "confirmed",
        createdAt: now.toISOString(),
        sequence: 0,
      };

      data.bookings.push(booking);
      return { kind: "created" as const, booking };
    });

    if (outcome.kind === "rejected") {
      const message =
        outcome.reason === "taken"
          ? ui.validation.slotTaken[locale]
          : outcome.reason === "past"
            ? ui.validation.slotPast[locale]
            : ui.validation.slotUnknown[locale];
      return fail(message, { slot: message });
    }

    const confirmation = await sendBookingConfirmation(outcome.booking, "created");
    const notice = await sendBookingNotice(outcome.booking, "created");

    if (!confirmation.ok) {
      console.error("[rdv] confirmation non envoyée —", confirmation.detail);
    }
    if (!notice.ok) {
      console.error("[rdv] notification interne non envoyée —", notice.detail);
    }

    revalidatePath(`/${locale}/rendez-vous`);
    return ok(ui.booking.confirmed[locale]);
  } catch (err) {
    console.error("[rdv] erreur inattendue —", err);
    return fail(ui.status.genericError[locale]);
  }
}

/** Annulation depuis le lien reçu par email. */
export async function cancelBooking(_prev: FormState, form: FormData): Promise<FormState> {
  const rawLocale = String(form.get("locale") ?? "fr");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";
  const id = String(form.get("id") ?? "");
  const token = String(form.get("token") ?? "");

  try {
    const outcome = await mutate((data) => {
      const booking = data.bookings.find((b) => b.id === id);
      if (!booking || !tokenEquals(booking.token, token)) {
        return { kind: "not-found" as const };
      }
      if (booking.status === "cancelled") {
        return { kind: "already" as const, booking };
      }
      booking.status = "cancelled";
      booking.cancelledAt = new Date().toISOString();
      booking.sequence += 1;
      return { kind: "cancelled" as const, booking };
    });

    if (outcome.kind === "not-found") {
      return fail(ui.booking.notFound[locale]);
    }
    if (outcome.kind === "already") {
      return ok(ui.booking.cancelled[locale]);
    }

    const notify = await sendBookingCancellation(outcome.booking);
    if (!notify.ok) {
      console.error("[rdv] confirmation d'annulation non envoyée —", notify.detail);
    }
    await sendBookingNotice(outcome.booking, "cancelled");

    revalidatePath(`/${locale}/rendez-vous`);
    return ok(ui.booking.cancelled[locale]);
  } catch (err) {
    console.error("[rdv] annulation en échec —", err);
    return fail(ui.status.genericError[locale]);
  }
}

/** Report : annule l'ancien créneau et en prend un autre, sous le même identifiant. */
export async function rescheduleBooking(_prev: FormState, form: FormData): Promise<FormState> {
  const rawLocale = String(form.get("locale") ?? "fr");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";
  const id = String(form.get("id") ?? "");
  const token = String(form.get("token") ?? "");
  const slot = String(form.get("slot") ?? "");

  try {
    if (!slot || Number.isNaN(Date.parse(slot))) {
      return fail(ui.validation.slotRequired[locale], { slot: ui.validation.slotRequired[locale] });
    }

    const outcome = await mutate((data) => {
      const booking = data.bookings.find((b) => b.id === id);
      if (!booking || !tokenEquals(booking.token, token)) {
        return { kind: "not-found" as const };
      }

      const now = new Date();
      const taken = data.bookings
        .filter((b) => b.status === "confirmed" && b.id !== booking.id)
        .map((b) => b.startUtc);

      const check = validateSlot(slot, now, taken);
      if (!check.ok) return { kind: "rejected" as const, reason: check.reason };

      booking.startUtc = new Date(slot).toISOString();
      booking.status = "confirmed";
      booking.cancelledAt = undefined;
      // Le rappel doit repartir sur la nouvelle date.
      booking.reminderSentAt = undefined;
      booking.sequence += 1;
      return { kind: "rescheduled" as const, booking };
    });

    if (outcome.kind === "not-found") {
      return fail(ui.booking.notFound[locale]);
    }
    if (outcome.kind === "rejected") {
      const message =
        outcome.reason === "taken"
          ? ui.validation.slotTaken[locale]
          : outcome.reason === "past"
            ? ui.validation.slotPast[locale]
            : ui.validation.slotUnknown[locale];
      return fail(message, { slot: message });
    }

    const confirmation = await sendBookingConfirmation(outcome.booking, "rescheduled");
    if (!confirmation.ok) {
      console.error("[rdv] confirmation de report non envoyée —", confirmation.detail);
    }
    await sendBookingNotice(outcome.booking, "rescheduled");

    revalidatePath(`/${locale}/rendez-vous`);
    return ok(ui.booking.rescheduled[locale]);
  } catch (err) {
    console.error("[rdv] report en échec —", err);
    return fail(ui.status.genericError[locale]);
  }
}
