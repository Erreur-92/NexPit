"use client";

import type { FormState } from "@/lib/actions/types";
import { HONEYPOT_FIELD } from "@/lib/validation";
import type { Locale } from "@/lib/i18n";
import { ui } from "@/content/ui";

/**
 * Pot de miel.
 *
 * Hors du parcours clavier (`tabIndex={-1}`), hors de l'arbre d'accessibilité
 * (`aria-hidden`), et déplacé hors écran plutôt que masqué par `display:none`
 * — certains robots ignorent les champs non rendus mais remplissent ceux qui
 * existent dans le DOM.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        overflow: "hidden",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      <label htmlFor={HONEYPOT_FIELD}>Website</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

/**
 * Bandeau de retour du serveur. `role="status"` fait annoncer le succès sans
 * interrompre, `role="alert"` fait annoncer l'échec immédiatement.
 */
export function FormStatus({ state }: { state: FormState }) {
  if (state.status === "idle") return null;
  const isError = state.status === "error";

  return (
    <p
      role={isError ? "alert" : "status"}
      className={`mt-6 border-l-2 py-3 pl-4 text-[0.9375rem] leading-relaxed ${
        isError ? "border-danger text-danger" : "border-ok text-ok"
      }`}
    >
      {state.message}
    </p>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-[0.875rem] text-danger">
      {message}
    </p>
  );
}

export function Field({
  name,
  label,
  type = "text",
  required = false,
  autoComplete,
  rows,
  error,
  locale,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  rows?: number;
  error?: string;
  locale: Locale;
  placeholder?: string;
}) {
  const errorId = `${name}-error`;
  const shared = {
    id: name,
    name,
    required,
    autoComplete,
    placeholder,
    className: "field mt-2",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  } as const;

  return (
    <div>
      <label htmlFor={name} className="label flex items-baseline gap-2">
        {label}
        <span className="text-ink-3 normal-case tracking-normal">
          {required ? "" : `(${ui.form.optional[locale]})`}
        </span>
      </label>
      {rows ? <textarea {...shared} rows={rows} /> : <input {...shared} type={type} />}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function ConsentCheck({
  locale,
  error,
}: {
  locale: Locale;
  error?: string;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-ink"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "consent-error" : "consent-help"}
        />
        <label htmlFor="consent" className="text-[0.9375rem] leading-relaxed text-ink-2">
          {ui.form.consent[locale]}{" "}
          <span id="consent-help" className="text-ink-3">
            {ui.form.consentHelp[locale]}
          </span>
        </label>
      </div>
      <FieldError id="consent-error" message={error} />
    </div>
  );
}
