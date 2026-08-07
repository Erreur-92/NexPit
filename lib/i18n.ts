import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "@/content/types";

export { DEFAULT_LOCALE, LOCALES, isLocale };
export type { Locale };

/**
 * Les segments d'URL sont identiques dans les deux langues (`/fr/projets` et
 * `/en/projets`). C'est un choix : NexPit est une structure française, la
 * version anglaise est une traduction pour des interlocuteurs étrangers, et
 * dupliquer l'arborescence pour traduire des slugs coûterait plus cher en
 * maintenance que ce qu'elle rapporterait en référencement.
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Même page, autre langue. Sert le sélecteur de langue et les liens hreflang. */
export function switchLocalePath(currentPath: string, target: Locale): string {
  const segments = currentPath.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = target;
    return `/${segments.join("/")}`;
  }
  return `/${target}${currentPath === "/" ? "" : currentPath}`;
}

export const otherLocale = (locale: Locale): Locale => (locale === "fr" ? "en" : "fr");

/** Étiquette de langue pour l'attribut `lang` et les métadonnées Open Graph. */
export const htmlLang: Record<Locale, string> = { fr: "fr-FR", en: "en" };
export const ogLocale: Record<Locale, string> = { fr: "fr_FR", en: "en_GB" };

/**
 * Formatage des nombres à la française côté serveur comme côté client :
 * l'espace insécable fine avant les milliers est ce que lit un francophone,
 * et « 1,5 » ne doit jamais s'afficher « 1.5 » sur la version française.
 */
export function formatNumber(value: number, locale: Locale, digits = 0): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
