"use client";

import { useActionState } from "react";
import { submitContact } from "@/lib/actions/contact";
import { idle } from "@/lib/actions/types";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { ConsentCheck, Field, FormStatus, Honeypot } from "./form-bits";

export function ContactForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(submitContact, idle);
  const fields = state.status === "error" ? (state.fields ?? {}) : {};
  const sent = state.status === "ok";

  return (
    <form action={action} className="mt-10" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <Honeypot />

      <fieldset disabled={pending || sent} className="grid gap-6 sm:grid-cols-2">
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
        <Field
          name="subject"
          label={ui.form.subject[locale]}
          required
          error={fields.subject}
          locale={locale}
        />
        <div className="sm:col-span-2">
          <Field
            name="message"
            label={ui.form.message[locale]}
            required
            rows={7}
            error={fields.message}
            locale={locale}
          />
        </div>
        <div className="sm:col-span-2">
          <ConsentCheck locale={locale} error={fields.consent} />
        </div>
      </fieldset>

      {!sent ? (
        <button type="submit" className="btn mt-8" disabled={pending}>
          {pending ? ui.form.sending[locale] : ui.form.send[locale]}
        </button>
      ) : null}

      <FormStatus state={state} />
    </form>
  );
}
