"use server";

import { site, SITE_URL } from "@/content/site";
import { emails, fill } from "@/content/emails";
import { ui } from "@/content/ui";
import { isLocale, type Locale } from "@/content/types";
import { buildMail, isMailConfigured, sendMail } from "@/lib/mail";
import { checkRate, clientFingerprint, LIMITS } from "@/lib/rate-limit";
import { fieldErrors, isHoneypotFilled, makeContactSchema } from "@/lib/validation";
import { fail, ok, type FormState } from "./types";

export async function submitContact(_prev: FormState, form: FormData): Promise<FormState> {
  const rawLocale = String(form.get("locale") ?? "fr");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";

  try {
    // Pot de miel : on renvoie un succès pour ne pas apprendre au robot que
    // le piège existe, mais rien n'est envoyé.
    if (isHoneypotFilled(form)) {
      return ok(ui.status.contactSuccess[locale]);
    }

    const fingerprint = await clientFingerprint();
    const verdict = checkRate(`contact:${fingerprint}`, LIMITS.contact.limit, LIMITS.contact.windowMs);
    if (!verdict.allowed) {
      return fail(ui.status.rateLimited[locale]);
    }

    const parsed = makeContactSchema(locale).safeParse({
      name: form.get("name"),
      email: form.get("email"),
      company: form.get("company") ?? "",
      subject: form.get("subject"),
      message: form.get("message"),
      consent: form.get("consent") === "on" || form.get("consent") === "true",
      website: form.get("website") ?? "",
    });

    if (!parsed.success) {
      return fail(ui.status.invalid[locale], fieldErrors(parsed.error));
    }

    if (!isMailConfigured()) {
      console.error("[contact] SMTP non configuré, message non transmis");
      return fail(ui.status.mailDown[locale]);
    }

    const { name, email, company, subject, message } = parsed.data;
    const receivedAt = new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Europe/Paris",
    }).format(new Date());

    /* --- Notification interne ------------------------------------------- */
    const N = emails.contactNotice;
    const internal = buildMail(
      fill(N.title, { name }),
      [
        {
          type: "spec",
          rows: [
            [N.rows.name, name],
            [N.rows.email, email],
            ...(company ? ([[N.rows.company, company]] as const) : []),
            [N.rows.subject, subject],
            [N.rows.receivedAt, receivedAt],
            [N.rows.language, locale.toUpperCase()],
          ],
        },
        { type: "quote", text: message },
        { type: "note", text: N.replyHint },
      ],
      N.footer,
    );

    const internalResult = await sendMail({
      to: site.email.notify,
      subject: fill(N.subject, { subject }),
      text: internal.text,
      html: internal.html,
      replyTo: email,
    });

    if (!internalResult.ok) {
      // Si NexPit ne reçoit pas le message, l'envoi a échoué du point de vue
      // du visiteur, même si l'accusé de réception partait.
      return fail(ui.status.genericError[locale]);
    }

    /* --- Accusé de réception -------------------------------------------- */
    const A = emails.contactAck;
    const ack = buildMail(
      A.title[locale],
      [
        { type: "para", text: fill(A.greeting[locale], { name }) },
        { type: "para", text: A.body[locale] },
        { type: "spec", rows: [[A.subjectRow[locale], subject]] },
        { type: "quote", text: message },
        { type: "note", text: A.note[locale] },
      ],
      `NexPit — ${SITE_URL}`,
    );

    const ackResult = await sendMail({
      to: email,
      subject: fill(A.subject[locale], { subject }),
      text: ack.text,
      html: ack.html,
      replyTo: site.email.contact,
    });

    // L'accusé de réception est un confort. S'il échoue alors que la
    // notification est partie, le message est bien arrivé : on le journalise
    // sans faire échouer l'envoi côté visiteur.
    if (!ackResult.ok) {
      console.error("[contact] accusé de réception non envoyé à", email, "—", ackResult.detail);
    }

    return ok(ui.status.contactSuccess[locale]);
  } catch (err) {
    console.error("[contact] erreur inattendue —", err);
    return fail(ui.status.genericError[locale]);
  }
}
