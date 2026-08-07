"use client";

import { useActionState } from "react";
import { subscribe } from "@/lib/actions/newsletter";
import { idle } from "@/lib/actions/types";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { FormStatus, Honeypot } from "./form-bits";

export function NewsletterForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(subscribe, idle);
  const error = state.status === "error" ? state.fields?.email : undefined;

  return (
    <form action={action} className="mt-6" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <Honeypot />

      <label htmlFor="newsletter-email" className="label">
        {ui.form.email[locale]}
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={ui.newsletter.placeholder[locale]}
          className="field flex-1"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-email-error" : undefined}
        />
        <button type="submit" className="btn justify-center" disabled={pending}>
          {pending ? ui.form.sending[locale] : ui.newsletter.submit[locale]}
        </button>
      </div>

      {error ? (
        <p id="newsletter-email-error" className="mt-2 text-[0.875rem] text-danger">
          {error}
        </p>
      ) : null}

      <FormStatus state={state} />
    </form>
  );
}
