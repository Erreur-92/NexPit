import nodemailer from "nodemailer";

const REQUIRED_ENV = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
];

const hasMissingEnv = () => REQUIRED_ENV.some((key) => !process.env[key]);

const getTransport = () => {
  if (hasMissingEnv()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendNewsletterNotification = async (subscriberEmail: string) => {
  const transport = getTransport();

  if (!transport) {
    console.error("Configuration SMTP manquante - variables env:", {
      hasHost: !!process.env.SMTP_HOST,
      hasPort: !!process.env.SMTP_PORT,
      hasUser: !!process.env.SMTP_USER,
      hasPass: !!process.env.SMTP_PASS,
    });
    return { ok: false as const, message: "Configuration SMTP manquante" };
  }

  const to = process.env.NEWSLETTER_NOTIFY_TO ?? "nexpit03@gmail.com";
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  console.log("Tentative d'envoi email vers:", to, "depuis:", from);

  try {
    await transport.sendMail({
      to,
      from,
      subject: "Nouvelle inscription newsletter",
      text: `Nouvelle inscription: ${subscriberEmail}`,
    });

    console.log("Email envoyé avec succès");
    return { ok: true as const };
  } catch (err) {
    console.error("Erreur SMTP complète:", err);
    return { ok: false as const, message: `Erreur SMTP: ${err instanceof Error ? err.message : String(err)}` };
  }
};
