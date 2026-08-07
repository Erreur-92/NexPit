import type { I18n } from "./types";

/**
 * Libellés d'interface : boutons, états, messages d'erreur, intitulés de
 * champs. Séparés du contenu éditorial parce qu'ils changent pour d'autres
 * raisons — un mot d'erreur se corrige après avoir vu un utilisateur bloqué,
 * pas en relisant la page.
 */
export const ui = {
  skipToContent: { fr: "Aller au contenu", en: "Skip to content" } satisfies I18n,
  menu: { fr: "Menu", en: "Menu" } satisfies I18n,
  close: { fr: "Fermer", en: "Close" } satisfies I18n,
  langSwitch: { fr: "English", en: "Français" } satisfies I18n,
  langSwitchLabel: { fr: "Passer en anglais", en: "Switch to French" } satisfies I18n,

  backToProjects: { fr: "Tous les projets", en: "All projects" } satisfies I18n,
  readProject: { fr: "Lire l'étude de cas", en: "Read the case study" } satisfies I18n,
  viewExpertise: { fr: "Voir l'expertise", en: "View expertise" } satisfies I18n,

  stage: {
    prototype: { fr: "Prototype interne", en: "Internal prototype" } satisfies I18n,
    beta: { fr: "Bêta", en: "Beta" } satisfies I18n,
    production: { fr: "En production", en: "In production" } satisfies I18n,
    archive: { fr: "Archivé", en: "Archived" } satisfies I18n,
  },

  sections: {
    problem: { fr: "Le problème", en: "The problem" } satisfies I18n,
    built: { fr: "Ce qui a été construit", en: "What was built" } satisfies I18n,
    decisions: { fr: "Décisions techniques", en: "Technical decisions" } satisfies I18n,
    stack: { fr: "Stack", en: "Stack" } satisfies I18n,
    metrics: { fr: "Repères", en: "Reference points" } satisfies I18n,
    diagram: { fr: "Architecture", en: "Architecture" } satisfies I18n,
    demonstrates: { fr: "Ce que ça démontre", en: "What it demonstrates" } satisfies I18n,
    period: { fr: "Période", en: "Period" } satisfies I18n,
    role: { fr: "Rôle", en: "Role" } satisfies I18n,
    deliverables: { fr: "Livrables", en: "Deliverables" } satisfies I18n,
    relatedProjects: { fr: "Projets liés", en: "Related projects" } satisfies I18n,
  },

  /* ---- Formulaires -------------------------------------------------- */
  form: {
    required: { fr: "Obligatoire", en: "Required" } satisfies I18n,
    optional: { fr: "Facultatif", en: "Optional" } satisfies I18n,
    name: { fr: "Nom", en: "Name" } satisfies I18n,
    email: { fr: "Adresse email", en: "Email address" } satisfies I18n,
    company: { fr: "Société", en: "Company" } satisfies I18n,
    subject: { fr: "Sujet", en: "Subject" } satisfies I18n,
    message: { fr: "Message", en: "Message" } satisfies I18n,
    send: { fr: "Envoyer", en: "Send" } satisfies I18n,
    sending: { fr: "Envoi en cours", en: "Sending" } satisfies I18n,
    consent: {
      fr: "J'accepte que ces informations soient utilisées pour répondre à ma demande.",
      en: "I agree to these details being used to answer my enquiry.",
    } satisfies I18n,
    consentHelp: {
      fr: "Elles ne servent qu'à cela et ne sont transmises à personne.",
      en: "They are used for that only and are shared with no one.",
    } satisfies I18n,
  },

  /* ---- Retours serveur ---------------------------------------------- */
  status: {
    contactSuccess: {
      fr: "Message envoyé. Vous recevez une copie par email ; nous répondons sous deux jours ouvrés.",
      en: "Message sent. You will receive a copy by email; we reply within two working days.",
    } satisfies I18n,
    genericError: {
      fr: "L'envoi a échoué. Réessayez dans un instant, ou écrivez directement à l'adresse indiquée plus bas.",
      en: "Sending failed. Try again shortly, or write directly to the address given below.",
    } satisfies I18n,
    rateLimited: {
      fr: "Trop de tentatives depuis cette adresse. Patientez quelques minutes.",
      en: "Too many attempts from this address. Wait a few minutes.",
    } satisfies I18n,
    invalid: {
      fr: "Le formulaire contient des erreurs. Corrigez les champs signalés.",
      en: "The form contains errors. Fix the highlighted fields.",
    } satisfies I18n,
    mailDown: {
      fr: "Le service d'envoi est momentanément indisponible. Écrivez-nous directement à l'adresse ci-dessous.",
      en: "The mail service is temporarily unavailable. Write to us directly at the address below.",
    } satisfies I18n,
  },

  /* ---- Erreurs de validation ---------------------------------------- */
  validation: {
    nameRequired: { fr: "Indiquez votre nom.", en: "Enter your name." } satisfies I18n,
    nameTooLong: { fr: "Nom trop long (120 caractères maximum).", en: "Name too long (120 characters maximum)." } satisfies I18n,
    emailRequired: { fr: "Indiquez votre adresse email.", en: "Enter your email address." } satisfies I18n,
    emailInvalid: { fr: "Cette adresse email n'est pas valide.", en: "This email address is not valid." } satisfies I18n,
    subjectRequired: { fr: "Indiquez un sujet.", en: "Enter a subject." } satisfies I18n,
    messageTooShort: {
      fr: "Message trop court : décrivez votre besoin en quelques phrases.",
      en: "Message too short: describe your need in a few sentences.",
    } satisfies I18n,
    messageTooLong: {
      fr: "Message trop long (5 000 caractères maximum).",
      en: "Message too long (5,000 characters maximum).",
    } satisfies I18n,
    consentRequired: {
      fr: "Sans cet accord, nous ne pouvons pas traiter votre demande.",
      en: "Without this agreement we cannot process your enquiry.",
    } satisfies I18n,
    slotRequired: { fr: "Choisissez un créneau.", en: "Pick a slot." } satisfies I18n,
    slotTaken: {
      fr: "Ce créneau vient d'être pris. Choisissez-en un autre.",
      en: "That slot has just been taken. Pick another one.",
    } satisfies I18n,
    slotPast: {
      fr: "Ce créneau est passé. Choisissez-en un autre.",
      en: "That slot is in the past. Pick another one.",
    } satisfies I18n,
    slotUnknown: {
      fr: "Ce créneau n'existe pas dans les disponibilités publiées.",
      en: "That slot is not part of the published availability.",
    } satisfies I18n,
  },

  /* ---- Newsletter ---------------------------------------------------- */
  newsletter: {
    placeholder: { fr: "vous@societe.fr", en: "you@company.com" } satisfies I18n,
    submit: { fr: "S'inscrire", en: "Subscribe" } satisfies I18n,
    pending: {
      fr: "Vérifiez votre boîte mail : un lien de confirmation vous attend. Sans ce clic, aucune adresse n'est enregistrée.",
      en: "Check your inbox: a confirmation link is waiting. Without that click, no address is stored.",
    } satisfies I18n,
    alreadyConfirmed: {
      fr: "Cette adresse est déjà inscrite.",
      en: "This address is already subscribed.",
    } satisfies I18n,
    confirmed: {
      fr: "Inscription confirmée.",
      en: "Subscription confirmed.",
    } satisfies I18n,
    confirmFailed: {
      fr: "Ce lien de confirmation est invalide ou a expiré. Réinscrivez-vous pour en recevoir un nouveau.",
      en: "This confirmation link is invalid or has expired. Subscribe again to get a new one.",
    } satisfies I18n,
    unsubscribed: {
      fr: "Vous êtes désinscrit. Votre adresse a été supprimée.",
      en: "You are unsubscribed. Your address has been deleted.",
    } satisfies I18n,
    unsubscribeFailed: {
      fr: "Ce lien de désinscription est invalide. Écrivez-nous et nous supprimons l'adresse à la main.",
      en: "This unsubscribe link is invalid. Write to us and we will delete the address by hand.",
    } satisfies I18n,
  },

  /* ---- Rendez-vous ---------------------------------------------------- */
  booking: {
    pickDay: { fr: "Choisir un jour", en: "Pick a day" } satisfies I18n,
    pickSlot: { fr: "Choisir un créneau", en: "Pick a slot" } satisfies I18n,
    timezone: { fr: "Fuseau horaire", en: "Time zone" } satisfies I18n,
    timezoneHelp: {
      fr: "Les horaires ci-dessous sont affichés dans ce fuseau.",
      en: "The times below are shown in this time zone.",
    } satisfies I18n,
    noSlots: {
      fr: "Aucun créneau libre sur cette période.",
      en: "No free slots in this period.",
    } satisfies I18n,
    confirm: { fr: "Confirmer le rendez-vous", en: "Confirm the appointment" } satisfies I18n,
    confirmed: {
      fr: "Rendez-vous confirmé. L'invitation calendrier et le lien d'annulation sont dans l'email que vous venez de recevoir.",
      en: "Appointment confirmed. The calendar invitation and the cancellation link are in the email you have just received.",
    } satisfies I18n,
    cancel: { fr: "Annuler ce rendez-vous", en: "Cancel this appointment" } satisfies I18n,
    reschedule: { fr: "Reporter", en: "Reschedule" } satisfies I18n,
    cancelled: {
      fr: "Rendez-vous annulé. Le créneau est de nouveau libre.",
      en: "Appointment cancelled. The slot is free again.",
    } satisfies I18n,
    rescheduled: {
      fr: "Rendez-vous reporté. Une nouvelle invitation vient de vous être envoyée.",
      en: "Appointment rescheduled. A new invitation has just been sent to you.",
    } satisfies I18n,
    notFound: {
      fr: "Ce rendez-vous n'existe pas, ou son lien a expiré.",
      en: "This appointment does not exist, or its link has expired.",
    } satisfies I18n,
    duration: { fr: "Durée", en: "Duration" } satisfies I18n,
    minutes: { fr: "minutes", en: "minutes" } satisfies I18n,
    downloadIcs: { fr: "Télécharger l'invitation (.ics)", en: "Download the invitation (.ics)" } satisfies I18n,
  },

  /* ---- Bandeau cookies ------------------------------------------------ */
  consent: {
    title: { fr: "Mesure d'audience", en: "Audience measurement" } satisfies I18n,
    body: {
      fr: "Aucun traceur n'est chargé tant que vous n'avez pas accepté. Si vous acceptez, nous chargeons une mesure d'audience pour savoir quelles pages sont lues. Aucune publicité, aucune revente, aucun partage.",
      en: "No tracker is loaded until you accept. If you accept, we load audience measurement to know which pages are read. No advertising, no resale, no sharing.",
    } satisfies I18n,
    accept: { fr: "Accepter", en: "Accept" } satisfies I18n,
    refuse: { fr: "Refuser", en: "Refuse" } satisfies I18n,
    manage: { fr: "Gérer mon choix", en: "Manage my choice" } satisfies I18n,
    saved: { fr: "Choix enregistré.", en: "Choice saved." } satisfies I18n,
  },

  /* ---- Erreurs de navigation ------------------------------------------ */
  notFound: {
    title: { fr: "Page introuvable", en: "Page not found" } satisfies I18n,
    body: {
      fr: "L'adresse demandée ne correspond à aucune page de ce site.",
      en: "The requested address does not match any page on this site.",
    } satisfies I18n,
    back: { fr: "Retour à l'accueil", en: "Back to home" } satisfies I18n,
  },
  serverError: {
    title: { fr: "Erreur serveur", en: "Server error" } satisfies I18n,
    body: {
      fr: "Quelque chose a échoué de notre côté. Réessayez, ou écrivez-nous si cela persiste.",
      en: "Something failed on our side. Try again, or write to us if it persists.",
    } satisfies I18n,
    retry: { fr: "Réessayer", en: "Try again" } satisfies I18n,
  },
  /* ---- Libellés dispersés dans les pages ------------------------------ */
  /* Regroupés ici pour qu'aucun texte visible ne vive dans un composant. */
  misc: {
    homeAria: { fr: "accueil", en: "home" } satisfies I18n,
    mainNav: { fr: "Navigation principale", en: "Main navigation" } satisfies I18n,
    footerNav: { fr: "Navigation de pied de page", en: "Footer navigation" } satisfies I18n,
    otherProjects: { fr: "Autres projets", en: "Other projects" } satisfies I18n,
    projectsCrumb: { fr: "Projets", en: "Projects" } satisfies I18n,
    bookShort: { fr: "Rendez-vous", en: "Book a call" } satisfies I18n,
    bookLong: { fr: "Prendre rendez-vous", en: "Book a call" } satisfies I18n,
    seeProjects: { fr: "Voir les projets", en: "See the projects" } satisfies I18n,
    seeSlots: { fr: "Voir les créneaux", en: "See the slots" } satisfies I18n,
    writeToUs: { fr: "Nous écrire", en: "Write to us" } satisfies I18n,
    describeNeed: { fr: "Décrire un besoin", en: "Describe a need" } satisfies I18n,
    contents: { fr: "Sommaire", en: "Contents" } satisfies I18n,
    legalNotice: { fr: "Mentions légales", en: "Legal notice" } satisfies I18n,
    privacyPolicy: { fr: "Politique de confidentialité", en: "Privacy policy" } satisfies I18n,
    braking: { fr: "Freinage", en: "Braking" } satisfies I18n,
    yourAppointment: { fr: "Votre rendez-vous", en: "Your appointment" } satisfies I18n,
    appointmentCancelled: { fr: "Rendez-vous annulé", en: "Appointment cancelled" } satisfies I18n,
    when: { fr: "Quand", en: "When" } satisfies I18n,
    yourDetails: { fr: "Vos coordonnées", en: "Your details" } satisfies I18n,
    subjectPrompt: {
      fr: "Le sujet, en quelques phrases",
      en: "The subject, in a few sentences",
    } satisfies I18n,
    emailLabel: { fr: "Email", en: "Email" } satisfies I18n,
    phoneLabel: { fr: "Téléphone", en: "Phone" } satisfies I18n,
    responseTimeLabel: { fr: "Délai de réponse", en: "Response time" } satisfies I18n,
    linkedinPage: { fr: "Page NexPit", en: "NexPit page" } satisfies I18n,
    unitProjects: { fr: "projets", en: "projects" } satisfies I18n,
    countAreas: { fr: "domaines", en: "areas" } satisfies I18n,
    countProjects: { fr: "projets menés", en: "projects run" } satisfies I18n,
    countLanguages: { fr: "langues du site", en: "site languages" } satisfies I18n,
    slotsUnavailable: {
      fr: "Les créneaux ne sont pas consultables pour le moment. Écrivez-nous, nous fixerons un horaire à la main.",
      en: "Slots are not available right now. Write to us and we will set a time by hand.",
    } satisfies I18n,
    manageLinkLost: {
      fr: "Le lien d'annulation figure dans l'email de confirmation. S'il ne fonctionne plus, écrivez-nous : nous libérons le créneau à la main.",
      en: "The cancellation link is in the confirmation email. If it no longer works, write to us: we will release the slot by hand.",
    } satisfies I18n,
    takeAnotherSlot: {
      fr: "Vous pouvez reprendre un créneau ci-dessous.",
      en: "You can take another slot below.",
    } satisfies I18n,
    titleBlockPublisher: { fr: "Éditeur", en: "Publisher" } satisfies I18n,
    titleBlockDocument: { fr: "Document", en: "Document" } satisfies I18n,
    titleBlockDocumentValue: { fr: "Site public", en: "Public site" } satisfies I18n,
    titleBlockLanguage: { fr: "Langue", en: "Language" } satisfies I18n,
    titleBlockRevision: { fr: "Révision", en: "Revision" } satisfies I18n,
    slotsFootnote: {
      fr: "Créneaux publiés dans le fuseau {tz}, convertis automatiquement dans le vôtre. Un email de confirmation avec invitation calendrier part immédiatement, et un rappel la veille.",
      en: "Slots are published in the {tz} time zone and converted automatically into yours. A confirmation email with a calendar invitation is sent immediately, and a reminder the day before.",
    } satisfies I18n,
    cancelExplains: {
      fr: "Le créneau redevient disponible immédiatement, et vous recevez une annulation calendrier.",
      en: "The slot becomes available again immediately, and you receive a calendar cancellation.",
    } satisfies I18n,
  },
} as const;
