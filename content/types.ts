/**
 * Socle de la couche de contenu.
 *
 * Deux idées structurantes :
 *
 * 1. Chaque chaîne de caractères est écrite une seule fois, avec ses deux
 *    versions accolées (`{ fr, en }`). Oublier une traduction est une erreur
 *    de compilation, pas un trou découvert en production.
 *
 * 2. Toute donnée que NexPit n'a pas encore fournie vaut `PENDING` plutôt
 *    qu'une valeur plausible. Les composants sautent ce qui est `PENDING`
 *    au lieu d'afficher une invention. `pnpm check:content` liste ce qui
 *    reste à remplir.
 */

export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Une chaîne dans les deux langues du site. */
export type I18n = { readonly fr: string; readonly en: string };
/** Une liste de chaînes dans les deux langues. */
export type I18nList = { readonly fr: readonly string[]; readonly en: readonly string[] };

export function t(value: I18n, locale: Locale): string {
  return value[locale];
}

export function tList(value: I18nList, locale: Locale): readonly string[] {
  return value[locale];
}

/** Résout indifféremment un nom propre ou une paire traduite. */
export function tx(value: string | I18n, locale: Locale): string {
  return typeof value === "string" ? value : value[locale];
}

/* -------------------------------------------------------------------------- */
/* Données manquantes                                                          */
/* -------------------------------------------------------------------------- */

export const PENDING = "__A_COMPLETER__" as const;
export type Pending = typeof PENDING;

/** Une valeur que NexPit doit encore fournir. */
export type Maybe<T> = T | Pending;

export function isPending<T>(value: Maybe<T>): value is Pending {
  return value === PENDING;
}

/** Renvoie la valeur, ou `null` si elle n'a pas encore été fournie. */
export function resolve<T>(value: Maybe<T>): T | null {
  return isPending(value) ? null : (value as T);
}

/** Ne garde que les entrées réellement renseignées. */
export function resolved<T>(values: readonly Maybe<T>[]): T[] {
  return values.filter((v): v is T => !isPending(v));
}

/* -------------------------------------------------------------------------- */
/* Modèles de contenu                                                          */
/* -------------------------------------------------------------------------- */

export type NavItem = {
  readonly key: string;
  readonly href: string;
  readonly label: I18n;
};

/** État réel d'un projet. Aucune valeur flatteuse : ce sont les seules admises. */
export type ProjectStage = "prototype" | "beta" | "production" | "archive";

export type TechDecision = {
  readonly title: I18n;
  /** Le « pourquoi ». C'est ce que lit un ingénieur, pas la liste des outils. */
  readonly body: I18n;
};

/** Un repère chiffré vérifiable. Aucun chiffre ne figure ici sans source. */
export type Metric = {
  readonly value: string;
  readonly label: I18n;
  /** D'où sort le chiffre. Obligatoire : pas de source, pas de chiffre. */
  readonly source: I18n;
};

/** Un nœud du schéma d'architecture dessiné pour chaque projet. */
export type DiagramNode = {
  readonly id: string;
  readonly label: I18n;
  readonly sub?: I18n;
  /** Colonne logique : 0 = acquisition, 1 = traitement, 2 = restitution. */
  readonly col: number;
  readonly row: number;
  readonly kind: "source" | "process" | "store" | "surface";
};

export type DiagramEdge = {
  readonly from: string;
  readonly to: string;
  readonly label?: I18n;
};

export type Diagram = {
  readonly caption: I18n;
  readonly nodes: readonly DiagramNode[];
  readonly edges: readonly DiagramEdge[];
};

export type Project = {
  readonly slug: string;
  readonly name: string;
  readonly index: string;
  readonly stage: ProjectStage;
  /** Une phrase, au présent, qui dit ce que fait le projet. */
  readonly summary: I18n;
  readonly period: I18n;
  readonly role: I18n;
  readonly problem: I18n;
  readonly built: I18nList;
  readonly decisions: readonly TechDecision[];
  /** Certaines entrées sont des noms propres, d'autres des expressions à traduire. */
  readonly stack: readonly (string | I18n)[];
  readonly metrics: readonly Metric[];
  readonly diagram: Diagram;
  /** Ce que le projet démontre comme compétence réutilisable ailleurs. */
  readonly demonstrates: I18n;
  /** Lien public s'il en existe un. */
  readonly link: Maybe<{ readonly href: string; readonly label: I18n }>;
  readonly expertiseKeys: readonly string[];
};

export type Expertise = {
  readonly key: string;
  readonly index: string;
  readonly title: I18n;
  readonly summary: I18n;
  readonly body: I18nList;
  /** Livrables concrets, pas des promesses. */
  readonly deliverables: I18nList;
  readonly projectSlugs: readonly string[];
};

export type TeamMember = {
  readonly name: Maybe<string>;
  readonly role: Maybe<I18n>;
  readonly bio: Maybe<I18n>;
  readonly photo: Maybe<string>;
  readonly linkedin: Maybe<string>;
};

export type LegalIdentity = {
  readonly legalName: Maybe<string>;
  readonly legalForm: Maybe<I18n>;
  readonly siret: Maybe<string>;
  readonly ape: Maybe<string>;
  readonly vat: Maybe<string>;
  readonly shareCapital: Maybe<string>;
  readonly address: Maybe<readonly string[]>;
  readonly publicationDirector: Maybe<string>;
  readonly registrationCity: Maybe<string>;
  readonly host: Maybe<{
    readonly name: string;
    readonly address: readonly string[];
    readonly url: Maybe<string>;
  }>;
};
