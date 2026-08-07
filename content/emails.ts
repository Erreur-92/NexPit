import type { I18n } from "./types";

/**
 * Formulations des emails.
 *
 * Le découpage est volontaire : les mots vivent ici, l'assemblage des blocs
 * reste dans `lib/`. On peut donc réécrire n'importe quelle phrase envoyée
 * par le site sans toucher à une ligne de code d'envoi.
 *
 * Les accolades marquent les valeurs injectées : `{name}`, `{subject}`, `{tz}`.
 * Elles doivent être conservées à l'identique dans les deux langues.
 */

export const emails = {
  /* ---- Formulaire de contact ------------------------------------------ */
  contactNotice: {
    /** Notification interne : jamais lue par un visiteur, donc en français. */
    title: "Demande de {name}",
    subject: "Contact — {subject}",
    footer: "Formulaire de contact — nexpit.fr",
    replyHint: "Répondre à ce message écrit directement à l'expéditeur.",
    rows: {
      name: "Nom",
      email: "Email",
      company: "Société",
      subject: "Sujet",
      receivedAt: "Reçu le",
      language: "Langue",
    },
  },

  contactAck: {
    title: { fr: "Message bien reçu", en: "Message received" } satisfies I18n,
    subject: {
      fr: "Votre message à NexPit — {subject}",
      en: "Your message to NexPit — {subject}",
    } satisfies I18n,
    greeting: { fr: "Bonjour {name},", en: "Hello {name}," } satisfies I18n,
    body: {
      fr: "Votre message est arrivé chez NexPit. Nous répondons sous deux jours ouvrés. Voici la copie de ce que vous avez envoyé :",
      en: "Your message reached NexPit. We reply within two working days. Here is a copy of what you sent:",
    } satisfies I18n,
    subjectRow: { fr: "Sujet", en: "Subject" } satisfies I18n,
    note: {
      fr: "Si vous souhaitez ajouter quelque chose, répondez simplement à cet email.",
      en: "If you want to add anything, just reply to this email.",
    } satisfies I18n,
  },

  /* ---- Newsletter ------------------------------------------------------ */
  newsletterConfirm: {
    title: {
      fr: "Confirmez votre inscription",
      en: "Confirm your subscription",
    } satisfies I18n,
    subject: {
      fr: "Confirmez votre inscription — NexPit",
      en: "Confirm your subscription — NexPit",
    } satisfies I18n,
    body: {
      fr: "Vous avez demandé à recevoir les notes techniques de NexPit. Un clic pour confirmer, et c'est fait.",
      en: "You asked to receive NexPit's technical notes. One click to confirm and it is done.",
    } satisfies I18n,
    action: {
      fr: "Confirmer l'inscription",
      en: "Confirm subscription",
    } satisfies I18n,
    note: {
      fr: "Sans ce clic, votre adresse n'est pas enregistrée : la demande est effacée au bout de quarante-huit heures. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.",
      en: "Without that click your address is not stored: the request is erased after forty-eight hours. If you did not make this request, ignore this email.",
    } satisfies I18n,
  },

  newsletterWelcome: {
    title: { fr: "Inscription confirmée", en: "Subscription confirmed" } satisfies I18n,
    subject: {
      fr: "Inscription confirmée — NexPit",
      en: "Subscription confirmed — NexPit",
    } satisfies I18n,
    body: {
      fr: "Vous recevrez les notes techniques de NexPit : formats de données, protocoles véhicule, pièges de télémétrie. Envoi irrégulier, uniquement quand il y a quelque chose à dire.",
      en: "You will receive NexPit's technical notes: data formats, vehicle protocols, telemetry pitfalls. Irregular sending, only when there is something to say.",
    } satisfies I18n,
    note: {
      fr: "Gardez cet email : le lien ci-dessous vous désinscrit en un clic, à tout moment, sans justification.",
      en: "Keep this email: the link below unsubscribes you in one click, at any time, with no justification.",
    } satisfies I18n,
    action: { fr: "Se désinscrire", en: "Unsubscribe" } satisfies I18n,
  },

  /* ---- Rendez-vous ----------------------------------------------------- */
  booking: {
    confirmedTitle: { fr: "Rendez-vous confirmé", en: "Appointment confirmed" } satisfies I18n,
    rescheduledTitle: { fr: "Rendez-vous reporté", en: "Appointment rescheduled" } satisfies I18n,
    cancelledTitle: { fr: "Rendez-vous annulé", en: "Appointment cancelled" } satisfies I18n,
    reminderTitle: { fr: "Rendez-vous demain", en: "Appointment tomorrow" } satisfies I18n,

    confirmedBody: {
      fr: "Bonjour {name}, votre créneau est réservé. L'invitation calendrier est jointe à cet email.",
      en: "Hello {name}, your slot is booked. The calendar invitation is attached to this email.",
    } satisfies I18n,
    reminderBody: {
      fr: "Bonjour {name}, un rappel pour le créneau réservé avec NexPit.",
      en: "Hello {name}, a reminder for the slot booked with NexPit.",
    } satisfies I18n,
    cancelledBody: {
      fr: "Le créneau est libéré. Rien d'autre à faire de votre côté.",
      en: "The slot has been released. Nothing else to do on your side.",
    } satisfies I18n,
    cancelledRebook: {
      fr: "Pour reprendre un créneau : {url}",
      en: "To book another slot: {url}",
    } satisfies I18n,

    manageAction: {
      fr: "Annuler ou reporter",
      en: "Cancel or reschedule",
    } satisfies I18n,
    manageNote: {
      fr: "Ce lien reste valable jusqu'au rendez-vous. Gardez cet email : c'est le seul moyen d'annuler sans nous écrire.",
      en: "This link stays valid until the appointment. Keep this email: it is the only way to cancel without writing to us.",
    } satisfies I18n,

    reminderSubject: {
      fr: "Rappel — rendez-vous NexPit demain",
      en: "Reminder — NexPit appointment tomorrow",
    } satisfies I18n,

    /** Intitulés du tableau récapitulatif présent dans chaque message. */
    rows: {
      when: { fr: "Quand", en: "When" } satisfies I18n,
      duration: { fr: "Durée", en: "Duration" } satisfies I18n,
      timezone: { fr: "Fuseau", en: "Time zone" } satisfies I18n,
      reference: { fr: "Référence", en: "Reference" } satisfies I18n,
    },

    /** Notification interne. */
    notice: {
      created: "Nouveau",
      rescheduled: "Reporté",
      cancelled: "Annulé",
      footer: "Prise de rendez-vous — nexpit.fr",
      rows: {
        person: "Personne",
        email: "Email",
        company: "Société",
        visitorTimezone: "Fuseau du visiteur",
        status: "Statut",
      },
    },

    icsSubjectLine: { fr: "Sujet : {subject}", en: "Subject: {subject}" } satisfies I18n,
    icsManageLine: {
      fr: "Annuler ou reporter : {url}",
      en: "Cancel or reschedule: {url}",
    } satisfies I18n,
  },
} as const;

/** Remplace les `{clés}` d'un gabarit par les valeurs fournies. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
