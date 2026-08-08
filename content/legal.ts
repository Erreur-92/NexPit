import type { I18n, I18nList } from "./types";

/**
 * Textes légaux.
 *
 * Ce qui est écrit ici décrit ce que le site fait réellement : les traitements
 * listés correspondent aux routes qui existent dans app/api et aux fichiers
 * écrits par lib/store. Si un traitement est ajouté au code, il doit être
 * ajouté ici — c'est la seule façon que cette page reste vraie.
 *
 * Les informations d'identité (raison sociale, SIRET, hébergeur) vivent dans
 * content/site.ts et manquent encore.
 */

export type LegalSection = {
  readonly id: string;
  readonly heading: I18n;
  readonly body: I18nList;
};

export const legalNotice = {
  eyebrow: { fr: "Mentions légales", en: "Legal notice" } satisfies I18n,
  title: { fr: "Mentions légales", en: "Legal notice" } satisfies I18n,
  identityHeading: { fr: "Éditeur du site", en: "Site publisher" } satisfies I18n,
  hostHeading: { fr: "Hébergeur", en: "Host" } satisfies I18n,

  /** Affiché en clair tant que l'identité légale n'est pas renseignée. */
  missingIdentity: {
    fr: "Les informations d'identification de l'éditeur ne sont pas encore renseignées. En France, leur absence sur un site accessible au public est sanctionnée par l'article 6-III de la loi pour la confiance dans l'économie numérique. Ce site ne doit pas être mis en ligne en l'état.",
    en: "The publisher's identification details have not been filled in yet. In France, their absence on a publicly accessible site is punishable under article 6-III of the Act on confidence in the digital economy. This site must not be published as it stands.",
  } satisfies I18n,

  missingHost: {
    fr: "Le nom et l'adresse de l'hébergeur ne sont pas encore renseignés. Cette mention est obligatoire.",
    en: "The host's name and address have not been filled in yet. This mention is mandatory.",
  } satisfies I18n,

  labels: {
    legalName: { fr: "Dénomination", en: "Name" } satisfies I18n,
    legalForm: { fr: "Forme juridique", en: "Legal form" } satisfies I18n,
    rna: { fr: "Numéro RNA", en: "RNA number" } satisfies I18n,
    siret: { fr: "SIRET", en: "SIRET" } satisfies I18n,
    ape: { fr: "Code APE", en: "APE code" } satisfies I18n,
    vat: { fr: "TVA intracommunautaire", en: "VAT number" } satisfies I18n,
    shareCapital: { fr: "Capital social", en: "Share capital" } satisfies I18n,
    address: { fr: "Siège", en: "Registered office" } satisfies I18n,
    director: { fr: "Directeur de la publication", en: "Publication director" } satisfies I18n,
    registration: { fr: "Déclaration", en: "Declaration" } satisfies I18n,
    email: { fr: "Contact", en: "Contact" } satisfies I18n,
  },

  sections: [
    {
      id: "propriete",
      heading: { fr: "Propriété intellectuelle", en: "Intellectual property" },
      body: {
        fr: [
          "Les textes, schémas et éléments graphiques de ce site sont la propriété de son éditeur, à l'exception des marques citées, qui appartiennent à leurs détenteurs respectifs.",
          "Les noms de circuits, de véhicules et de logiciels mentionnés dans les études de cas le sont à titre descriptif. Leur citation n'implique aucun partenariat ni aucune approbation de leur part.",
          "Les polices de caractères utilisées, Archivo et Martian Mono, sont distribuées sous licence SIL Open Font License et hébergées sur ce serveur.",
        ],
        en: [
          "The texts, diagrams and graphic elements on this site are the property of its publisher, except for the trademarks cited, which belong to their respective holders.",
          "The names of circuits, vehicles and software mentioned in the case studies are used descriptively. Citing them implies no partnership and no endorsement on their part.",
          "The typefaces used, Archivo and Martian Mono, are distributed under the SIL Open Font License and hosted on this server.",
        ],
      },
    },
    {
      id: "donnees",
      heading: { fr: "Données affichées", en: "Data displayed" },
      body: {
        fr: [
          "Les relevés de télémétrie présentés en page d'accueil proviennent d'une session d'essai en simulateur enregistrée le 11 décembre 2025 par l'éditeur. Ils ne décrivent aucune performance réelle sur circuit.",
          "Les chiffres cités dans les études de cas proviennent des dépôts de code correspondants et sont vérifiables sur demande.",
        ],
        en: [
          "The telemetry readings shown on the home page come from a simulator test session recorded on 11 December 2025 by the publisher. They describe no real on-track performance.",
          "The figures quoted in the case studies come from the corresponding code repositories and can be verified on request.",
        ],
      },
    },
    {
      id: "responsabilite",
      heading: { fr: "Responsabilité", en: "Liability" },
      body: {
        fr: [
          "L'éditeur s'efforce de maintenir ce site exact et à jour, sans garantir l'absence d'erreur. Les informations techniques publiées le sont à titre descriptif et ne constituent pas un engagement contractuel.",
          "Les liens sortants pointent vers des sites tiers dont l'éditeur ne contrôle ni le contenu ni les pratiques.",
        ],
        en: [
          "The publisher endeavours to keep this site accurate and up to date, without guaranteeing the absence of error. The technical information published is descriptive and does not constitute a contractual commitment.",
          "Outbound links point to third-party sites whose content and practices the publisher does not control.",
        ],
      },
    },
  ] satisfies readonly LegalSection[],
} as const;

export const privacy = {
  eyebrow: { fr: "Confidentialité", en: "Privacy" } satisfies I18n,
  title: { fr: "Politique de confidentialité", en: "Privacy policy" } satisfies I18n,
  lede: {
    fr: "Ce site collecte le strict nécessaire à ce qu'il fait : répondre à un message, confirmer une inscription, tenir un rendez-vous. Rien d'autre n'est enregistré, et rien n'est transmis à un tiers à des fins commerciales.",
    en: "This site collects strictly what it needs to do its job: answer a message, confirm a subscription, hold an appointment. Nothing else is stored, and nothing is passed to a third party for commercial purposes.",
  } satisfies I18n,

  sections: [
    {
      id: "responsable",
      heading: { fr: "Responsable du traitement", en: "Data controller" },
      body: {
        fr: [
          "Le responsable du traitement est l'éditeur du site, identifié dans les mentions légales. Toute demande relative à vos données se fait à l'adresse de contact qui y figure.",
        ],
        en: [
          "The data controller is the site publisher, identified in the legal notice. Any request concerning your data goes to the contact address given there.",
        ],
      },
    },
    {
      id: "formulaire",
      heading: { fr: "Formulaire de contact", en: "Contact form" },
      body: {
        fr: [
          "Données collectées : nom, adresse email, société si vous la renseignez, sujet, message, et l'horodatage de l'envoi.",
          "Finalité : répondre à votre demande. Base légale : votre consentement, recueilli par la case à cocher du formulaire.",
          "Destinataires : l'éditeur uniquement. Les messages transitent par le serveur d'envoi indiqué dans la section « Sous-traitants ».",
          "Conservation : trois ans à compter du dernier échange, délai au terme duquel une demande commerciale sans suite n'a plus d'objet.",
          "Une empreinte technique non réversible de votre adresse IP est conservée quinze minutes, uniquement pour limiter les envois répétés. Elle ne permet pas de retrouver l'adresse d'origine.",
        ],
        en: [
          "Data collected: name, email address, company if you provide it, subject, message, and the timestamp of the submission.",
          "Purpose: answering your enquiry. Legal basis: your consent, collected via the form's checkbox.",
          "Recipients: the publisher only. Messages transit through the sending server named in the “Processors” section.",
          "Retention: three years from the last exchange, after which an enquiry with no follow-up no longer has a purpose.",
          "A non-reversible technical fingerprint of your IP address is kept for fifteen minutes, solely to limit repeated submissions. It does not allow the original address to be recovered.",
        ],
      },
    },
    {
      id: "newsletter",
      heading: { fr: "Notes techniques", en: "Technical notes" },
      body: {
        fr: [
          "Données collectées : adresse email, date d'inscription, date de confirmation.",
          "Finalité : vous envoyer les notes techniques. Base légale : votre consentement, matérialisé par le clic sur le lien de confirmation.",
          "Aucune adresse n'est enregistrée durablement avant ce clic : une inscription non confirmée est effacée au bout de quarante-huit heures.",
          "Chaque envoi porte un lien de désinscription qui supprime l'adresse immédiatement, sans demander de justification ni de mot de passe.",
        ],
        en: [
          "Data collected: email address, subscription date, confirmation date.",
          "Purpose: sending you the technical notes. Legal basis: your consent, expressed by clicking the confirmation link.",
          "No address is stored durably before that click: an unconfirmed subscription is erased after forty-eight hours.",
          "Every mailing carries an unsubscribe link that deletes the address immediately, with no justification and no password required.",
        ],
      },
    },
    {
      id: "rendezvous",
      heading: { fr: "Prise de rendez-vous", en: "Appointment booking" },
      body: {
        fr: [
          "Données collectées : nom, adresse email, société si renseignée, sujet de l'échange, créneau choisi et fuseau horaire de votre navigateur.",
          "Finalité : organiser et tenir le rendez-vous, vous envoyer la confirmation, l'invitation calendrier et le rappel.",
          "Base légale : l'exécution de mesures précontractuelles prises à votre demande.",
          "Conservation : un an après la date du rendez-vous. Un rendez-vous annulé est conservé trente jours, le temps de traiter une éventuelle reprise de contact.",
        ],
        en: [
          "Data collected: name, email address, company if provided, subject of the exchange, chosen slot and your browser's time zone.",
          "Purpose: organising and holding the appointment, sending you the confirmation, the calendar invitation and the reminder.",
          "Legal basis: performance of pre-contractual measures taken at your request.",
          "Retention: one year after the appointment date. A cancelled appointment is kept for thirty days, long enough to handle any renewed contact.",
        ],
      },
    },
    {
      id: "mesure",
      heading: { fr: "Mesure d'audience", en: "Audience measurement" },
      body: {
        fr: [
          "Aucun script de mesure n'est chargé tant que vous ne l'avez pas accepté. Refuser n'enlève aucune fonctionnalité du site.",
          "Votre choix est conservé dans votre navigateur, dans un stockage local, pendant six mois. Ce n'est pas un cookie et il n'est jamais envoyé au serveur.",
          "Vous pouvez changer d'avis à tout moment depuis le lien présent en pied de page.",
        ],
        en: [
          "No measurement script is loaded until you have accepted it. Refusing removes no functionality from the site.",
          "Your choice is kept in your browser, in local storage, for six months. It is not a cookie and is never sent to the server.",
          "You can change your mind at any time via the link in the footer.",
        ],
      },
    },
    {
      id: "sous-traitants",
      heading: { fr: "Sous-traitants", en: "Processors" },
      body: {
        fr: [
          "Serveur d'envoi d'emails : les messages de ce site partent par un serveur SMTP tiers, qui traite les adresses le temps de l'acheminement.",
          "Hébergeur : identifié dans les mentions légales. Il traite les données techniques nécessaires à la mise à disposition du site.",
          "Aucun autre destinataire. Les données de ce site ne sont ni vendues, ni louées, ni utilisées pour de la publicité.",
        ],
        en: [
          "Email sending server: messages from this site leave through a third-party SMTP server, which processes addresses for the duration of delivery.",
          "Host: identified in the legal notice. It processes the technical data needed to make the site available.",
          "No other recipient. Data from this site is neither sold, nor rented, nor used for advertising.",
        ],
      },
    },
    {
      id: "droits",
      heading: { fr: "Vos droits", en: "Your rights" },
      body: {
        fr: [
          "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité sur les données vous concernant.",
          "Écrivez à l'adresse de contact indiquée dans les mentions légales. Nous répondons sous un mois. Aucune pièce justificative n'est demandée pour une simple demande de suppression envoyée depuis l'adresse concernée.",
          "En cas de désaccord, vous pouvez saisir la Commission nationale de l'informatique et des libertés, 3 place de Fontenoy, 75007 Paris.",
        ],
        en: [
          "You have rights of access, rectification, erasure, restriction, objection and portability over data concerning you.",
          "Write to the contact address given in the legal notice. We reply within one month. No supporting document is required for a simple deletion request sent from the address concerned.",
          "In case of disagreement, you may refer the matter to the Commission nationale de l'informatique et des libertés, 3 place de Fontenoy, 75007 Paris, France.",
        ],
      },
    },
  ] satisfies readonly LegalSection[],
} as const;
