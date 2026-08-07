import { z } from "zod";
import { ui } from "@/content/ui";
import { isValidTimeZone } from "./time";
import type { Locale } from "@/content/types";

/**
 * Schémas de validation.
 *
 * Ils sont construits par langue pour que les messages d'erreur soient rendus
 * dans la langue de la page. Le serveur revalide systématiquement : la
 * validation exécutée dans le navigateur n'est qu'un confort d'affichage et
 * n'est jamais considérée comme acquise.
 *
 * Le champ `website` est un pot de miel. Il est invisible et hors du parcours
 * clavier ; un humain ne peut pas le remplir, la plupart des robots le
 * remplissent. Rempli, la requête est acceptée en apparence et jetée.
 */

const v = (locale: Locale) => ui.validation;

export const HONEYPOT_FIELD = "website";

export function makeContactSchema(locale: Locale) {
  const m = v(locale);
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: m.nameRequired[locale] })
      .max(120, { message: m.nameTooLong[locale] }),
    email: z
      .string()
      .trim()
      .min(1, { message: m.emailRequired[locale] })
      .max(254, { message: m.emailInvalid[locale] })
      .email({ message: m.emailInvalid[locale] }),
    company: z.string().trim().max(160).optional().or(z.literal("")),
    subject: z
      .string()
      .trim()
      .min(1, { message: m.subjectRequired[locale] })
      .max(200, { message: m.subjectRequired[locale] }),
    message: z
      .string()
      .trim()
      .min(20, { message: m.messageTooShort[locale] })
      .max(5000, { message: m.messageTooLong[locale] }),
    consent: z.literal(true, {
      errorMap: () => ({ message: m.consentRequired[locale] }),
    }),
    [HONEYPOT_FIELD]: z.string().max(0).optional().or(z.string()),
  });
}

export function makeNewsletterSchema(locale: Locale) {
  const m = v(locale);
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: m.emailRequired[locale] })
      .max(254, { message: m.emailInvalid[locale] })
      .email({ message: m.emailInvalid[locale] }),
    [HONEYPOT_FIELD]: z.string().max(0).optional().or(z.string()),
  });
}

export function makeBookingSchema(locale: Locale) {
  const m = v(locale);
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: m.nameRequired[locale] })
      .max(120, { message: m.nameTooLong[locale] }),
    email: z
      .string()
      .trim()
      .min(1, { message: m.emailRequired[locale] })
      .max(254, { message: m.emailInvalid[locale] })
      .email({ message: m.emailInvalid[locale] }),
    company: z.string().trim().max(160).optional().or(z.literal("")),
    subject: z
      .string()
      .trim()
      .min(20, { message: m.messageTooShort[locale] })
      .max(2000, { message: m.messageTooLong[locale] }),
    slot: z
      .string()
      .trim()
      .min(1, { message: m.slotRequired[locale] })
      .refine((s) => !Number.isNaN(Date.parse(s)), { message: m.slotUnknown[locale] }),
    timezone: z
      .string()
      .trim()
      .refine(isValidTimeZone, { message: m.slotUnknown[locale] }),
    consent: z.literal(true, {
      errorMap: () => ({ message: m.consentRequired[locale] }),
    }),
    [HONEYPOT_FIELD]: z.string().max(0).optional().or(z.string()),
  });
}

export type ContactInput = z.infer<ReturnType<typeof makeContactSchema>>;
export type NewsletterInput = z.infer<ReturnType<typeof makeNewsletterSchema>>;
export type BookingInput = z.infer<ReturnType<typeof makeBookingSchema>>;

/** Vrai si le pot de miel a été rempli, donc si la soumission vient d'un robot. */
export function isHoneypotFilled(form: FormData): boolean {
  const value = form.get(HONEYPOT_FIELD);
  return typeof value === "string" && value.trim().length > 0;
}

/** Aplatit les erreurs Zod en un objet champ -> premier message. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
