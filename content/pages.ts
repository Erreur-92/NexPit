import { PENDING, type I18n, type I18nList, type Maybe, type TeamMember } from "./types";

/* ========================================================================== */
/* Accueil                                                                    */
/* ========================================================================== */

export const home = {
  eyebrow: {
    fr: "Logiciel automobile",
    en: "Automotive software",
  } satisfies I18n,

  /* La page d'accueil doit dire en cinq secondes ce que fait NexPit. Le titre
     décrit littéralement la chaîne que le portefeuille couvre : lire un
     capteur à un bout, afficher quelque chose d'utile à l'autre. */
  title: {
    fr: "Du capteur à l'écran",
    en: "From sensor to screen",
  } satisfies I18n,

  lede: {
    fr: "NexPit écrit le logiciel qui lit les voitures. Acquisition OBD-II et télémétrie, traitement de séries temporelles, vision embarquée, applications cartographiques. Six projets en portefeuille, du bus véhicule à l'interface web.",
    en: "NexPit writes the software that reads cars. OBD-II and telemetry acquisition, time-series processing, embedded vision, mapping applications. Six projects in the portfolio, from the vehicle bus to the web interface.",
  } satisfies I18n,

  ctaPrimary: { fr: "Prendre rendez-vous", en: "Book a call" } satisfies I18n,
  ctaSecondary: { fr: "Voir les projets", en: "See the projects" } satisfies I18n,
  ctaWrite: { fr: "Écrire un message", en: "Write a message" } satisfies I18n,

  traceIntro: {
    fr: "Le tracé ci-dessous n'est pas un décor. C'est la vitesse relevée sur un tour complet, extraite de nos propres captations.",
    en: "The trace below is not decoration. It is the speed recorded over one full lap, extracted from our own captures.",
  } satisfies I18n,

  expertiseHeading: {
    fr: "Trois choses que nous savons faire",
    en: "Three things we know how to do",
  } satisfies I18n,

  projectsHeading: {
    fr: "Portefeuille",
    en: "Portfolio",
  } satisfies I18n,
  projectsIntro: {
    fr: "Six projets menés en interne. Chaque page décrit le problème, l'architecture retenue et les décisions qui ont coûté quelque chose.",
    en: "Six projects run in-house. Each page describes the problem, the chosen architecture and the decisions that cost something.",
  } satisfies I18n,

  /* Bloc volontairement à contre-courant : il énonce ce que le site n'a pas.
     Il tient lieu de preuve de sérieux là où d'autres mettent des logos.
     Supprimable en retirant `readingNote` de app/[locale]/page.tsx. */
  readingNote: {
    heading: { fr: "Note de lecture", en: "Reading note" } satisfies I18n,
    items: {
      fr: [
        "Aucun témoignage client sur ce site : nous n'en avons pas encore recueilli.",
        "Aucun logo d'entreprise : nos projets sont internes, et nous ne nous attribuons pas la notoriété des autres.",
        "Aucune capture d'écran de nos applications : elles ne sont pas publiques. Les schémas d'architecture les remplacent, et ils décrivent le code réel.",
        "Chaque chiffre affiché porte sa source. Commits, échantillons, canaux, classes : tout vient d'un dépôt que nous pouvons ouvrir devant vous.",
      ],
      en: [
        "No client testimonials on this site: we have not collected any yet.",
        "No company logos: our projects are internal, and we do not borrow other people's reputations.",
        "No screenshots of our applications: they are not public. Architecture diagrams stand in for them, and they describe the actual code.",
        "Every figure shown carries its source. Commits, samples, channels, classes: all of it comes from a repository we can open in front of you.",
      ],
    } satisfies I18nList,
  },

  closing: {
    heading: {
      fr: "Un problème de données véhicule à résoudre ?",
      en: "A vehicle data problem to solve?",
    } satisfies I18n,
    body: {
      fr: "Décrivez-le en quelques lignes, ou réservez trente minutes. Nous vous dirons franchement si c'est dans nos cordes.",
      en: "Describe it in a few lines, or book thirty minutes. We will tell you straight whether it is within our reach.",
    } satisfies I18n,
  },
} as const;

/* ========================================================================== */
/* Expertise                                                                  */
/* ========================================================================== */

export const expertisePage = {
  eyebrow: { fr: "Expertise", en: "Expertise" } satisfies I18n,
  title: { fr: "Ce que nous savons faire", en: "What we know how to do" } satisfies I18n,
  lede: {
    fr: "Trois domaines, chacun démontré par des projets que nous avons menés de bout en bout. Rien ici n'est une intention : tout ce qui est listé a déjà été écrit au moins une fois.",
    en: "Three areas, each demonstrated by projects we ran end to end. Nothing here is an intention: everything listed has already been written at least once.",
  } satisfies I18n,
  closing: {
    fr: "Si votre besoin ne rentre dans aucune de ces trois cases, dites-le nous quand même. Nous répondrons non si c'est non.",
    en: "If your need fits none of these three, tell us anyway. We will say no if it is no.",
  } satisfies I18n,
} as const;

/* ========================================================================== */
/* Projets                                                                    */
/* ========================================================================== */

export const projectsPage = {
  eyebrow: { fr: "Projets", en: "Projects" } satisfies I18n,
  title: { fr: "Portefeuille", en: "Portfolio" } satisfies I18n,
  lede: {
    fr: "Six projets internes. Aucun n'est déployé chez un client : ce sont nos propres outils et nos propres bancs d'essai. Ils sont présentés ici pour ce qu'ils démontrent, pas pour ce qu'ils rapportent.",
    en: "Six internal projects. None is deployed at a client's: they are our own tools and our own test benches. They are presented here for what they demonstrate, not for what they earn.",
  } satisfies I18n,
} as const;

/* ========================================================================== */
/* À propos                                                                   */
/* ========================================================================== */

export const about = {
  eyebrow: { fr: "À propos", en: "About" } satisfies I18n,
  title: { fr: "Qui écrit ce code", en: "Who writes this code" } satisfies I18n,
  lede: {
    fr: "NexPit travaille à l'intersection du sport automobile, de l'automobile grand public et du logiciel. C'est un croisement étroit : il demande de savoir lire une trame OBD-II le matin et un schéma relationnel l'après-midi.",
    en: "NexPit works at the intersection of motorsport, consumer automotive and software. It is a narrow crossing: it requires reading an OBD-II frame in the morning and a relational schema in the afternoon.",
  } satisfies I18n,

  method: {
    heading: { fr: "Comment nous travaillons", en: "How we work" } satisfies I18n,
    items: {
      fr: [
        "Nous écrivons les contraintes là où elles tiennent : dans la base, dans les types, dans le protocole. Pas uniquement dans la couche que l'on remplacera l'année prochaine.",
        "Nous versionnons les migrations dès le premier jour, avant même que la base contienne quoi que ce soit d'important.",
        "Nous préférons un format lisible à un format compact quand la donnée doit survivre à l'outil qui l'a produite.",
        "Nous traitons la panne du fournisseur comme un cas nominal, pas comme un incident.",
        "Nous disons non quand un besoin sort de nos compétences, plutôt que d'apprendre aux frais du client.",
      ],
      en: [
        "We write constraints where they hold: in the database, in the types, in the protocol. Not only in the layer we will replace next year.",
        "We version migrations from day one, before the database holds anything important.",
        "We prefer a readable format to a compact one when the data must outlive the tool that produced it.",
        "We treat provider failure as a nominal case, not as an incident.",
        "We say no when a need falls outside our skills, rather than learning at the client's expense.",
      ],
    } satisfies I18nList,
  },

  teamHeading: { fr: "L'équipe", en: "The team" } satisfies I18n,
  /**
   * Non renseigné : la page n'affiche aucune fiche tant que NexPit n'a pas
   * fourni les noms, rôles et parcours réels. Une équipe inventée est la
   * chose la plus vite repérée sur un site d'ingénierie.
   */
  team: PENDING as Maybe<readonly TeamMember[]>,

  /** Nombre de personnes dans la structure. Change le « nous » en « je ». */
  headcount: PENDING as Maybe<number>,
} as const;

/* ========================================================================== */
/* Contact                                                                    */
/* ========================================================================== */

export const contact = {
  eyebrow: { fr: "Contact", en: "Contact" } satisfies I18n,
  title: { fr: "Écrivez-nous", en: "Write to us" } satisfies I18n,
  lede: {
    fr: "Décrivez le problème plutôt que la solution que vous imaginez. Les contraintes — véhicule, protocole, volume, échéance — nous sont plus utiles qu'un cahier des charges.",
    en: "Describe the problem rather than the solution you have in mind. Constraints — vehicle, protocol, volume, deadline — help us more than a specification.",
  } satisfies I18n,

  /** Délai de réponse annoncé. À confirmer avant mise en ligne. */
  responseTime: {
    fr: "Nous répondons sous deux jours ouvrés.",
    en: "We reply within two working days.",
  } satisfies I18n,

  altHeading: { fr: "Autrement", en: "Otherwise" } satisfies I18n,
  bookingPitch: {
    fr: "Pour un échange de vive voix, trente minutes suffisent le plus souvent à savoir si le sujet est pour nous.",
    en: "For a spoken exchange, thirty minutes is usually enough to know whether the subject is for us.",
  } satisfies I18n,
} as const;

/* ========================================================================== */
/* Rendez-vous                                                                */
/* ========================================================================== */

export const booking = {
  eyebrow: { fr: "Rendez-vous", en: "Appointment" } satisfies I18n,
  title: { fr: "Réserver un créneau", en: "Book a slot" } satisfies I18n,
  lede: {
    fr: "Trente minutes, en visioconférence. Nous vous demandons de décrire votre sujet à la réservation : cela évite de passer le premier quart d'heure à se présenter.",
    en: "Thirty minutes, by video call. We ask you to describe your subject when booking: it avoids spending the first fifteen minutes on introductions.",
  } satisfies I18n,
  agendaHeading: { fr: "Ce qu'on fait de ces trente minutes", en: "What we do with those thirty minutes" } satisfies I18n,
  agenda: {
    fr: [
      "Vous décrivez le contexte et la contrainte qui coince.",
      "Nous disons si nous l'avons déjà rencontrée, et sur quel projet.",
      "Nous donnons un ordre de grandeur, ou nous vous orientons ailleurs.",
    ],
    en: [
      "You describe the context and the constraint that is blocking.",
      "We say whether we have met it before, and on which project.",
      "We give an order of magnitude, or we point you elsewhere.",
    ],
  } satisfies I18nList,
} as const;

/* ========================================================================== */
/* Newsletter                                                                 */
/* ========================================================================== */

export const newsletter = {
  heading: { fr: "Notes techniques", en: "Technical notes" } satisfies I18n,
  body: {
    fr: "Ce que nous apprenons en construisant : formats de données, protocoles véhicule, pièges de télémétrie. Envoi irrégulier, uniquement quand il y a quelque chose à dire.",
    en: "What we learn while building: data formats, vehicle protocols, telemetry pitfalls. Irregular sending, only when there is something to say.",
  } satisfies I18n,
  privacy: {
    fr: "Double confirmation : rien n'est enregistré tant que vous n'avez pas cliqué le lien reçu. Désinscription en un clic, sans justification.",
    en: "Double confirmation: nothing is stored until you click the link you receive. One-click unsubscribe, no reason needed.",
  } satisfies I18n,
} as const;
