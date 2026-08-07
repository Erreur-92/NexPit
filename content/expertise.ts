import type { Expertise } from "./types";

/**
 * Trois expertises, dérivées de ce que le portefeuille contient réellement.
 * Chacune pointe vers les projets qui la démontrent : une expertise sans
 * projet en face n'a rien à faire sur ce site.
 */
export const expertises: readonly Expertise[] = [
  {
    key: "acquisition",
    index: "E.01",
    title: {
      fr: "Acquisition et exploitation de données véhicule",
      en: "Vehicle data acquisition and processing",
    },
    summary: {
      fr: "Lire ce que produit une voiture — calculateur, capteurs, simulateur — et en faire une donnée exploitable, horodatée et durable.",
      en: "Reading what a car produces — ECU, sensors, simulator — and turning it into usable, timestamped, durable data.",
    },
    body: {
      fr: [
        "Le point difficile n'est jamais la lecture d'un canal isolé. C'est de tenir une acquisition sur la durée : des capteurs qui répondent à des cadences différentes, un lien qui se coupe au premier dos-d'âne, une session qui s'arrête quand on coupe le contact, et des fichiers qui doivent rester lisibles quand le programme qui les a écrits n'existe plus.",
        "Nous travaillons l'OBD-II sur lien série et réseau, la mémoire partagée des simulateurs, et les microcontrôleurs en réseau pour le chronométrage. La donnée sort en formats ouverts, un canal par fichier, écrite de façon à survivre à une coupure brutale.",
      ],
      en: [
        "The hard part is never reading a single channel. It is sustaining an acquisition over time: sensors answering at different rates, a link dropping at the first speed bump, a session ending when the ignition is cut, and files that must stay readable when the program that wrote them no longer exists.",
        "We work with OBD-II over serial and network links, simulator shared memory, and networked microcontrollers for timing. Data comes out in open formats, one channel per file, written to survive an abrupt cut.",
      ],
    },
    deliverables: {
      fr: [
        "Chaîne d'acquisition multi-canaux avec reconnexion automatique",
        "Format de stockage documenté et relisible sans l'outil d'origine",
        "Découpage en tours, secteurs ou trajets, et rééchantillonnage",
        "Instrumentation d'affichage temps réel",
      ],
      en: [
        "Multi-channel acquisition chain with automatic reconnection",
        "Documented storage format, readable without the original tool",
        "Splitting into laps, sectors or trips, and resampling",
        "Real-time display instrumentation",
      ],
    },
    projectSlugs: ["pitlabs", "systemes-embarques"],
  },
  {
    key: "applications",
    index: "E.02",
    title: {
      fr: "Applications métier cartographiques et bases de données",
      en: "Mapping and database business applications",
    },
    summary: {
      fr: "Des outils que des professionnels utilisent tous les jours : comptes, rôles, données géographiques, contraintes d'intégrité réelles.",
      en: "Tools professionals use every day: accounts, roles, geographic data, real integrity constraints.",
    },
    body: {
      fr: [
        "Une application métier se juge sur ce qui se passe le trois-centième jour, pas le premier : ce que devient le schéma quand on ajoute un champ, ce qui arrive quand deux personnes modifient la même fiche, ce qu'on peut encore lire quand l'auteur est parti.",
        "Nous écrivons les règles d'intégrité dans la base plutôt qu'uniquement dans le code, nous versionnons les migrations dès le premier jour, et nous construisons les couches cartographiques sur des briques ouvertes pour ne pas dépendre de la grille tarifaire d'un fournisseur.",
      ],
      en: [
        "A business application is judged on what happens on day three hundred, not day one: what the schema becomes when a field is added, what happens when two people edit the same record, what remains readable once the author has left.",
        "We write integrity rules into the database rather than only into the code, we version migrations from day one, and we build map layers on open components so as not to depend on a vendor's price list.",
      ],
    },
    deliverables: {
      fr: [
        "Schéma relationnel contraint, migrations versionnées",
        "API typée avec gestion d'erreur centralisée",
        "Interface cartographique à couches, sans clé d'API propriétaire",
        "Authentification multi-rôles et limitation de débit",
      ],
      en: [
        "Constrained relational schema, versioned migrations",
        "Typed API with centralised error handling",
        "Layered mapping interface, with no proprietary API key",
        "Multi-role authentication and rate limiting",
      ],
    },
    projectSlugs: ["carwatch", "raceshare"],
  },
  {
    key: "vision",
    index: "E.03",
    title: {
      fr: "Vision par ordinateur et reconstruction 3D",
      en: "Computer vision and 3D reconstruction",
    },
    summary: {
      fr: "Faire tourner un modèle sur du matériel ordinaire, en temps contraint, avec des jeux de données constitués pour le cas d'usage réel.",
      en: "Running a model on ordinary hardware, under time constraints, with datasets built for the real use case.",
    },
    body: {
      fr: [
        "Un modèle entraîné sur un jeu de données public échoue précisément sur les cas qui comptent : le feu éteint, le panneau à contre-jour, la pièce vue sous un angle qu'aucune photo du jeu ne contient. Le travail utile est en amont, dans la constitution des images, et en aval, dans le budget de calcul accordé à chaque image.",
        "Nous constituons et annotons les jeux de données, nous mesurons où le modèle échoue avant de fusionner, et nous découplons l'inférence de l'affichage pour tenir la fluidité sur une machine sans carte graphique dédiée.",
      ],
      en: [
        "A model trained on a public dataset fails precisely on the cases that matter: the unlit traffic light, the backlit sign, the part seen from an angle no photo in the set contains. The useful work is upstream, in building the images, and downstream, in the compute budget granted to each frame.",
        "We build and annotate the datasets, we measure where the model fails before merging, and we decouple inference from display to keep things smooth on a machine without a dedicated GPU.",
      ],
    },
    deliverables: {
      fr: [
        "Jeu de données constitué, annoté et documenté",
        "Chaîne d'entraînement reproductible",
        "Intégration temps réel avec budget de calcul maîtrisé",
        "Reconstruction 3D depuis image, sortie exploitable en production",
      ],
      en: [
        "Built, annotated and documented dataset",
        "Reproducible training chain",
        "Real-time integration with a controlled compute budget",
        "Image-based 3D reconstruction, production-usable output",
      ],
    },
    projectSlugs: ["pr-venx", "nexgen3d"],
  },
];

export function expertiseByKey(key: string): Expertise | undefined {
  return expertises.find((e) => e.key === key);
}
