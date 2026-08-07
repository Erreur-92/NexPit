"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { bookSlot, rescheduleBooking } from "@/lib/actions/booking";
import { idle } from "@/lib/actions/types";
import { ui } from "@/content/ui";
import { availability } from "@/content/availability";
import type { Locale } from "@/lib/i18n";
import { ConsentCheck, Field, FormStatus, Honeypot } from "./form-bits";

/**
 * Choix d'un créneau.
 *
 * Le serveur envoie une liste plate d'instants UTC. Le regroupement par jour
 * est fait ici, dans le fuseau du visiteur : un créneau du vendredi 18 h à
 * Paris tombe le samedi matin à Tokyo, et c'est bien samedi qu'il doit
 * apparaître pour quelqu'un à Tokyo.
 *
 * Le premier rendu utilise le fuseau de NexPit, identique côté serveur et
 * côté client, puis bascule sur le fuseau détecté après montage. Aucune
 * différence d'hydratation, et la page reste lisible si le script échoue.
 */

type Props = {
  locale: Locale;
  slots: readonly string[];
  mode?: "create" | "reschedule";
  bookingId?: string;
  bookingToken?: string;
  currentSlot?: string;
};

function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || availability.timezone;
  } catch {
    return availability.timezone;
  }
}

function zoneOptions(current: string): string[] {
  const supported =
    typeof Intl.supportedValuesOf === "function"
      ? Intl.supportedValuesOf("timeZone")
      : [availability.timezone, "Europe/London", "UTC", "America/New_York"];
  return supported.includes(current) ? [...supported] : [current, ...supported];
}

export function BookingWidget({
  locale,
  slots,
  mode = "create",
  bookingId,
  bookingToken,
  currentSlot,
}: Props) {
  const [timezone, setTimezone] = useState(availability.timezone);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setTimezone(detectTimeZone());
  }, []);

  const [state, action, pending] = useActionState(
    mode === "create" ? bookSlot : rescheduleBooking,
    idle,
  );
  const fields = state.status === "error" ? (state.fields ?? {}) : {};
  const done = state.status === "ok";

  const dayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
        timeZone: timezone,
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [locale, timezone],
  );

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale, timezone],
  );

  const keyFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    [timezone],
  );

  const days = useMemo(() => {
    const grouped = new Map<string, { label: string; slots: string[] }>();
    for (const iso of slots) {
      const date = new Date(iso);
      const key = keyFormatter.format(date);
      let entry = grouped.get(key);
      if (!entry) {
        entry = { label: dayFormatter.format(date), slots: [] };
        grouped.set(key, entry);
      }
      entry.slots.push(iso);
    }
    return [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [slots, keyFormatter, dayFormatter]);

  if (done) {
    return <FormStatus state={state} />;
  }

  if (days.length === 0) {
    return (
      <p className="mt-8 border-l-2 border-rule-strong py-3 pl-4 text-ink-2">
        {ui.booking.noSlots[locale]}
      </p>
    );
  }

  return (
    <form action={action} className="mt-10" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="timezone" value={timezone} />
      {mode === "reschedule" ? (
        <>
          <input type="hidden" name="id" value={bookingId} />
          <input type="hidden" name="token" value={bookingToken} />
        </>
      ) : null}
      <Honeypot />

      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-rule pb-4">
        <h2 className="display d3">{ui.booking.pickSlot[locale]}</h2>
        <div>
          <label htmlFor="tz" className="label">
            {ui.booking.timezone[locale]}
          </label>
          <select
            id="tz"
            className="field mt-2 max-w-[18rem]"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {zoneOptions(timezone).map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="mt-8">
        <legend className="label">
          {ui.booking.pickDay[locale]} · {availability.durationMin} {ui.booking.minutes[locale]}
        </legend>

        <div className="mt-6 space-y-8">
          {days.map(([key, day]) => (
            <div key={key} className="grid gap-3 sm:grid-cols-[13rem_1fr] sm:gap-6">
              <p className="label pt-3">{day.label}</p>
              <div className="flex flex-wrap gap-2">
                {day.slots.map((iso) => {
                  const isCurrent = iso === currentSlot;
                  const isSelected = iso === selected;
                  return (
                    <label
                      key={iso}
                      className={`mono cursor-pointer border px-3 py-2 transition-colors ${
                        isSelected
                          ? "border-ink bg-ink text-paper"
                          : "border-rule-strong hover:border-ink"
                      } ${isCurrent && !isSelected ? "bg-paper-sunk" : ""}`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        value={iso}
                        checked={isSelected}
                        onChange={() => setSelected(iso)}
                        className="sr-only"
                        required
                      />
                      {timeFormatter.format(new Date(iso))}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {fields.slot ? (
          <p role="alert" className="mt-4 text-[0.875rem] text-danger">
            {fields.slot}
          </p>
        ) : null}
      </fieldset>

      {mode === "create" ? (
        <fieldset disabled={pending} className="mt-12 grid gap-6 border-t border-rule pt-10 sm:grid-cols-2">
          <legend className="label">
            {ui.misc.yourDetails[locale]}
          </legend>
          <Field
            name="name"
            label={ui.form.name[locale]}
            required
            autoComplete="name"
            error={fields.name}
            locale={locale}
          />
          <Field
            name="email"
            label={ui.form.email[locale]}
            type="email"
            required
            autoComplete="email"
            error={fields.email}
            locale={locale}
          />
          <Field
            name="company"
            label={ui.form.company[locale]}
            autoComplete="organization"
            error={fields.company}
            locale={locale}
          />
          <div className="sm:col-span-2">
            <Field
              name="subject"
              label={ui.misc.subjectPrompt[locale]}
              required
              rows={5}
              error={fields.subject}
              locale={locale}
            />
          </div>
          <div className="sm:col-span-2">
            <ConsentCheck locale={locale} error={fields.consent} />
          </div>
        </fieldset>
      ) : null}

      <button type="submit" className="btn mt-8" disabled={pending || !selected}>
        {pending
          ? ui.form.sending[locale]
          : mode === "create"
            ? ui.booking.confirm[locale]
            : ui.booking.reschedule[locale]}
      </button>

      <FormStatus state={state} />
    </form>
  );
}
