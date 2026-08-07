"use server";

import { SITE_URL } from "@/content/site";
import { emails } from "@/content/emails";
import { ui } from "@/content/ui";
import { isLocale, type Locale } from "@/content/types";
import { buildMail, isMailConfigured, sendMail } from "@/lib/mail";
import { checkRate, clientFingerprint, LIMITS } from "@/lib/rate-limit";
import { mutate } from "@/lib/store";
import { newToken } from "@/lib/tokens";
import { fieldErrors, isHoneypotFilled, makeNewsletterSchema } from "@/lib/validation";
import { fail, ok, type FormState } from "./types";

/** Une inscription non confirmée est effacée passé ce délai. */
const PENDING_TTL_MS = 48 * 3600_000;

export async function subscribe(_prev: FormState, form: FormData): Promise<FormState> {
  const rawLocale = String(form.get("locale") ?? "fr");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";

  try {
    if (isHoneypotFilled(form)) {
      return ok(ui.newsletter.pending[locale]);
    }

    const fingerprint = await clientFingerprint();
    const verdict = checkRate(
      `newsletter:${fingerprint}`,
      LIMITS.newsletter.limit,
      LIMITS.newsletter.windowMs,
    );
    if (!verdict.allowed) {
      return fail(ui.status.rateLimited[locale]);
    }

    const parsed = makeNewsletterSchema(locale).safeParse({
      email: form.get("email"),
      website: form.get("website") ?? "",
    });

    if (!parsed.success) {
      return fail(ui.status.invalid[locale], fieldErrors(parsed.error));
    }

    if (!isMailConfigured()) {
      console.error("[newsletter] SMTP non configuré, aucune confirmation envoyable");
      return fail(ui.status.mailDown[locale]);
    }

    const email = parsed.data.email.toLowerCase();

    const outcome = await mutate((data) => {
      const now = Date.now();
      // Purge des inscriptions jamais confirmées : sans cela, une adresse
      // saisie par erreur resterait indéfiniment dans le fichier.
      data.subscribers = data.subscribers.filter(
        (s) => s.status === "confirmed" || now - Date.parse(s.createdAt) < PENDING_TTL_MS,
      );

      const existing = data.subscribers.find((s) => s.email === email);

      if (existing?.status === "confirmed") {
        return { kind: "already" as const };
      }

      // Réinscription en attente : on régénère le jeton plutôt que de
      // réutiliser un lien peut-être déjà parti dans une boîte mail.
      const confirmToken = newToken();
      if (existing) {
        existing.confirmToken = confirmToken;
        existing.createdAt = new Date().toISOString();
        existing.locale = locale;
      } else {
        data.subscribers.push({
          email,
          status: "pending",
          confirmToken,
          unsubscribeToken: newToken(),
          locale,
          createdAt: new Date().toISOString(),
        });
      }

      return { kind: "pending" as const, confirmToken };
    });

    if (outcome.kind === "already") {
      return ok(ui.newsletter.alreadyConfirmed[locale]);
    }

    const link = `${SITE_URL}/api/newsletter/confirm?token=${encodeURIComponent(outcome.confirmToken)}&locale=${locale}`;

    const C = emails.newsletterConfirm;
    const mail = buildMail(
      C.title[locale],
      [
        { type: "para", text: C.body[locale] },
        { type: "action", href: link, label: C.action[locale] },
        { type: "note", text: C.note[locale] },
      ],
      `NexPit — ${SITE_URL}`,
    );

    const sent = await sendMail({
      to: email,
      subject: C.subject[locale],
      text: mail.text,
      html: mail.html,
    });

    if (!sent.ok) {
      return fail(ui.status.genericError[locale]);
    }

    return ok(ui.newsletter.pending[locale]);
  } catch (err) {
    console.error("[newsletter] erreur inattendue —", err);
    return fail(ui.status.genericError[locale]);
  }
}
