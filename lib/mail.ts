import nodemailer, { type Transporter } from "nodemailer";

/**
 * Envoi d'emails.
 *
 * Reprend le transport SMTP déjà en place sur le site précédent plutôt que
 * d'introduire un service tiers : les identifiants existent, l'envoi
 * fonctionne, et un relais SMTP ne facture rien de plus que ce qui est déjà
 * payé. Le seul ajout est une vérification de configuration au démarrage du
 * transport, pour que l'absence d'une variable se voie dans les journaux
 * plutôt qu'à la première tentative d'envoi.
 */

const REQUIRED = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const;

export type MailResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "send-failed"; detail: string };

let transporter: Transporter | null = null;

function missingEnv(): string[] {
  return REQUIRED.filter((key) => !process.env[key]);
}

export function isMailConfigured(): boolean {
  return missingEnv().length === 0;
}

function getTransport(): Transporter | null {
  const missing = missingEnv();
  if (missing.length > 0) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

export type Attachment = {
  filename: string;
  content: string;
  contentType: string;
  /** Rôle iCalendar, pour que les clients mail proposent « Ajouter au calendrier ». */
  method?: "REQUEST" | "CANCEL";
};

export type Mail = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: Attachment[];
};

export async function sendMail(mail: Mail): Promise<MailResult> {
  const transport = getTransport();
  if (!transport) {
    const detail = `variables SMTP manquantes : ${missingEnv().join(", ")}`;
    console.error("[mail] envoi impossible —", detail);
    return { ok: false, reason: "not-configured", detail };
  }

  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  try {
    await transport.sendMail({
      from: `NexPit <${from}>`,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      replyTo: mail.replyTo,
      attachments: mail.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.method
          ? `${a.contentType}; charset=utf-8; method=${a.method}`
          : a.contentType,
      })),
    });
    return { ok: true };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[mail] échec de l'envoi vers", mail.to, "—", detail);
    return { ok: false, reason: "send-failed", detail };
  }
}

/* -------------------------------------------------------------------------- */
/* Gabarit                                                                     */
/* -------------------------------------------------------------------------- */

export type MailBlock =
  | { type: "para"; text: string }
  | { type: "spec"; rows: readonly (readonly [string, string])[] }
  | { type: "quote"; text: string }
  | { type: "action"; href: string; label: string }
  | { type: "note"; text: string };

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Construit les deux versions d'un message d'un coup, pour qu'elles ne
 * divergent jamais. Le HTML reste volontairement pauvre : styles en ligne,
 * pas d'image, pas de police distante. C'est ce qui traverse le plus de
 * clients mail sans se déformer.
 */
export function buildMail(title: string, blocks: readonly MailBlock[], footer: string) {
  const text = [
    title.toUpperCase(),
    "=".repeat(Math.min(title.length, 60)),
    "",
    ...blocks.map((b) => {
      switch (b.type) {
        case "para":
        case "note":
          return `${b.text}\n`;
        case "quote":
          return `${b.text
            .split("\n")
            .map((l) => `> ${l}`)
            .join("\n")}\n`;
        case "spec":
          return `${b.rows.map(([k, v]) => `${k} : ${v}`).join("\n")}\n`;
        case "action":
          return `${b.label} :\n${b.href}\n`;
      }
    }),
    "—",
    footer,
  ].join("\n");

  const body = blocks
    .map((b) => {
      switch (b.type) {
        case "para":
          return `<p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#111214">${esc(b.text)}</p>`;
        case "note":
          return `<p style="margin:0 0 16px;font-size:13px;line-height:1.5;color:#6e7378">${esc(b.text)}</p>`;
        case "quote":
          return `<div style="margin:0 0 16px;padding:12px 16px;background:#f1f1ee;border-left:2px solid #111214;font-size:15px;line-height:1.55;color:#45494d;white-space:pre-wrap">${esc(b.text)}</div>`;
        case "spec":
          return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;width:100%;border-collapse:collapse">${b.rows
            .map(
              ([k, v]) =>
                `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #d9dad5;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6e7378;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;border-bottom:1px solid #d9dad5;font-size:15px;color:#111214">${esc(v)}</td></tr>`,
            )
            .join("")}</table>`;
        case "action":
          return `<p style="margin:0 0 20px"><a href="${esc(b.href)}" style="display:inline-block;padding:13px 20px;background:#111214;color:#fbfbf9;text-decoration:none;font-size:12px;letter-spacing:.1em;text-transform:uppercase">${esc(b.label)}</a></p>`;
      }
    })
    .join("");

  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="margin:0;padding:24px;background:#fbfbf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#fbfbf9">
<p style="margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6e7378">NexPit</p>
<h1 style="margin:0 0 24px;padding-bottom:16px;border-bottom:1px solid #111214;font-size:22px;line-height:1.2;color:#111214;font-weight:700">${esc(title)}</h1>
${body}
<p style="margin:28px 0 0;padding-top:16px;border-top:1px solid #d9dad5;font-size:12px;line-height:1.5;color:#6e7378">${esc(footer)}</p>
</div></body></html>`;

  return { text, html };
}
