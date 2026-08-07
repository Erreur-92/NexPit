import { PENDING, type I18n, type LegalIdentity, type Maybe, type NavItem } from "./types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nexpit.fr";

export const site = {
  name: "NexPit",
  /** Ce que NexPit fait, en une ligne, pour les métadonnées et le JSON-LD. */
  tagline: {
    fr: "Logiciel automobile : acquisition, traitement et restitution de données véhicule.",
    en: "Automotive software: vehicle data acquisition, processing and display.",
  } satisfies I18n,

  email: {
    /** Adresse affichée publiquement et destinataire des accusés de réception. */
    contact: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@nexpit.fr",
    /** Adresse interne qui reçoit les notifications de formulaire. */
    notify: process.env.CONTACT_NOTIFY_TO ?? "nexpit03@gmail.com",
  },

  /** Numéro de téléphone public. Non renseigné : le bloc ne s'affiche pas. */
  phone: PENDING as Maybe<string>,

  social: {
    instagram: "https://www.instagram.com/nexpit.eu",
    linkedin: "https://www.linkedin.com/company/nexpit",
    github: "https://github.com/nexpit",
  },

  /** Mois et année de création. Sert la page à propos et le JSON-LD. */
  founded: PENDING as Maybe<{ iso: string; label: I18n }>,
} as const;

/**
 * Identité légale. Tant que ces champs valent PENDING, la page mentions
 * légales affiche un encart d'avertissement au lieu d'inventer un SIRET.
 * En France, l'absence de ces informations est sanctionnée pénalement
 * (article 6-III de la LCEN) : ce sont les premiers champs à remplir.
 */
export const legalIdentity: LegalIdentity = {
  legalName: PENDING,
  legalForm: PENDING,
  siret: PENDING,
  ape: PENDING,
  vat: PENDING,
  shareCapital: PENDING,
  address: PENDING,
  publicationDirector: PENDING,
  registrationCity: PENDING,
  host: PENDING,
};

export const nav: readonly NavItem[] = [
  { key: "expertise", href: "/expertise", label: { fr: "Expertise", en: "Expertise" } },
  { key: "projects", href: "/projets", label: { fr: "Projets", en: "Projects" } },
  { key: "about", href: "/a-propos", label: { fr: "À propos", en: "About" } },
  { key: "contact", href: "/contact", label: { fr: "Contact", en: "Contact" } },
];

export const footerNav: readonly NavItem[] = [
  { key: "booking", href: "/rendez-vous", label: { fr: "Prendre rendez-vous", en: "Book a call" } },
  { key: "legal", href: "/mentions-legales", label: { fr: "Mentions légales", en: "Legal notice" } },
  {
    key: "privacy",
    href: "/confidentialite",
    label: { fr: "Politique de confidentialité", en: "Privacy policy" },
  },
];
