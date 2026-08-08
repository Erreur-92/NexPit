import {
  PENDING,
  SANS_OBJET,
  type I18n,
  type LegalIdentity,
  type Maybe,
  type NavItem,
} from "./types";

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

  // ← À COMPLÉTER — l'article 6-III-1 de la LCEN impose un numéro de téléphone
  //   pour un éditeur personne physique. Un numéro secondaire ou VoIP convient ;
  //   ce n'est pas nécessairement votre portable personnel.
  //   Exemple :  phone: "+33 6 12 34 56 78" as Maybe<string>,
  phone: "+33 6 82 80 87 97" as Maybe<string>,

  social: {
    instagram: "https://www.instagram.com/nexpit.eu",
    linkedin: "https://www.linkedin.com/company/nexpit",
    github: "https://github.com/nexpit",
  },

  // ← À COMPLÉTER — date de début d'activité figurant sur l'avis de situation
  //   INSEE, pas la date de dépôt du domaine.
  //   Exemple :  founded: { iso: "2026-01", label: { fr: "Janvier 2026", en: "January 2026" } } as Maybe<...>,
  founded: PENDING as Maybe<{ iso: string; label: I18n }>,
} as const;

/* ==========================================================================
   IDENTITÉ LÉGALE — LE SEUL BLOC À REMPLIR AVANT MISE EN LIGNE
   ==========================================================================

   Remplacez chaque `PENDING` par la valeur entre guillemets. Rien d'autre
   n'est à toucher : la page /mentions-legales se remplit toute seule, dans
   les deux langues, et le bandeau rouge disparaît quand tout est là.

   Vérifier après chaque modification :   pnpm check:content

   Structure préparée : entreprise. Pas de capital ni de RCS en micro-entreprise,
   d'où les SANS_OBJET — à remplir si vous partez sur une société.

   ATTENTION — l'éditeur déclaré doit être celui qui publie réellement le site
   au moment de la mise en ligne. Si le site part en ligne avant la création de
   l'entreprise, c'est l'association qui édite, et c'est elle qu'il faut
   déclarer. Le jeu de valeurs correspondant est prêt en bas de ce fichier :
   voir `legalIdentityAssociation`, il suffit d'échanger les deux noms.
   ========================================================================== */

export const legalIdentity: LegalIdentity = {
  // ← À COMPLÉTER — en micro-entreprise, la dénomination légale est le nom
  //   civil, suivi de la mention EI obligatoire depuis le 15 mai 2022.
  //   En société, la raison sociale : "NexPit SAS".
  //   Exemple :  legalName: "Evan Verplaetse (EI)",
  legalName: "NexPit",

  // ← À COMPLÉTER — adapter si vous partez sur une société.
  legalForm: {
    fr: "Entrepreneur individuel, régime de la micro-entreprise",
    en: "Sole trader under the French micro-entreprise regime",
  },

  // Une entreprise n'a pas de numéro RNA : c'est propre aux associations.
  rna: SANS_OBJET,

  // ← À COMPLÉTER — les 14 chiffres du SIRET, sur l'avis de situation INSEE.
  //   Le SIREN seul (9 chiffres) ne suffit pas.
  //   Exemple :  siret: "123 456 789 00012",
  siret: "621 568 201 21602",

  // ← À COMPLÉTER — code APE INSEE. Pour du développement logiciel, en général
  //   62.01Z « Programmation informatique ».
  //   Exemple :  ape: "62.01Z",
  ape: "62.01Z",

  // ← À COMPLÉTER — l'un des deux :
  //   • franchise en base :  vat: "TVA non applicable, article 293 B du CGI",
  //   • assujetti :          vat: "FR 12 345678901",
  vat: "TVA non applicable, article 293 B du CGI",

  // Pas de capital en entreprise individuelle. En société, par exemple :
  //   shareCapital: "1 000 €",
  shareCapital: SANS_OBJET,

  // ← À COMPLÉTER — adresse de l'établissement telle que déclarée à l'INSEE.
  //   Une ligne par élément. C'est le champ qui rend le site publiable ou non.
  //   Exemple :  address: ["12 rue des Ateliers", "03000 Moulins", "France"],
  address: ["03000 Moulins", "France"],

  // ← À COMPLÉTER — le représentant légal, donc vous. Sans la mention EI ici.
  //   Exemple :  publicationDirector: "Evan Verplaetse",
  publicationDirector: "Evan Verplaetse",

  // Une activité libérale non réglementée (62.01Z) n'est inscrite ni au RCS ni
  // au répertoire des métiers. En société, mettre par exemple :
  //   registrationCity: "RCS Cusset",
  registrationCity: SANS_OBJET,

  // Rempli : relevé le 7 août 2026 sur ovh.com/fr/support/mentions-legales.
  // À corriger si vous quittez OVH — c'est l'hébergeur réel qui doit figurer.
  host: {
    name: "OVH SAS",
    address: [
      "2 rue Kellermann",
      "59100 Roubaix",
      "France",
      "SAS au capital de 50 000 000 €",
      "RCS Lille Métropole 424 761 419 00045",
    ],
    url: "https://www.ovhcloud.com",
  },
};

/**
 * Variante à utiliser tant que l'éditeur réel est l'association.
 * Pour l'activer : renommer cet objet en `legalIdentity` et renommer l'autre.
 */
export const legalIdentityAssociation: LegalIdentity = {
  legalName: PENDING, // dénomination déclarée en préfecture
  legalForm: {
    fr: "Association déclarée régie par la loi du 1er juillet 1901",
    en: "Non-profit association under the French law of 1 July 1901",
  },
  rna: SANS_OBJET, // W + 9 chiffres, sur le récépissé de déclaration
  siret: SANS_OBJET, // sauf si l'association en a demandé un
  ape: SANS_OBJET,
  vat: SANS_OBJET, // en général : "TVA non applicable, association non assujettie"
  shareCapital: SANS_OBJET,
  address: SANS_OBJET, // siège social ; la mairie domicilie souvent gratuitement
  publicationDirector: SANS_OBJET, // le président
  registrationCity: SANS_OBJET, // préfecture de déclaration et date
  host: {
    name: "OVH SAS",
    address: [
      "2 rue Kellermann",
      "59100 Roubaix",
      "France",
      "SAS au capital de 50 000 000 €",
      "RCS Lille Métropole 424 761 419 00045",
    ],
    url: "https://www.ovhcloud.com",
  },
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
