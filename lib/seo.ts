import type { Metadata } from "next";
import { site, SITE_URL } from "@/content/site";
import { htmlLang, localePath, ogLocale, type Locale } from "./i18n";
import { LOCALES } from "@/content/types";

/**
 * Métadonnées.
 *
 * Une seule fonction pour toutes les pages : les balises canoniques et les
 * alternates hreflang sont dérivées du chemin, ce qui évite le cas classique
 * du canonical oublié sur la moitié du site.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  noIndex = false,
}: {
  locale: Locale;
  /** Chemin sans le préfixe de langue, par exemple `/projets/carwatch`. */
  path: string;
  title: string;
  description: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${localePath(locale, path)}`;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&locale=${locale}`;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[htmlLang[l]] = `${SITE_URL}${localePath(l, path)}`;
  }
  languages["x-default"] = `${SITE_URL}${localePath("fr", path)}`;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title,
      description,
      locale: ogLocale[locale],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * JSON-LD Organization. Les champs que NexPit n'a pas encore fournis sont
 * simplement absents : un balisage structuré qui affirme une adresse inventée
 * est pire qu'un balisage incomplet.
 */
export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: site.name,
    url: SITE_URL,
    description: site.tagline[locale],
    email: site.email.contact,
    logo: `${SITE_URL}/NexPit_N.svg`,
    sameAs: Object.values(site.social),
  };
}

export function serviceJsonLd(
  locale: Locale,
  service: { name: string; description: string; path: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${SITE_URL}${localePath(locale, service.path)}`,
    provider: { "@id": `${SITE_URL}#organization` },
    areaServed: "FR",
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  trail: readonly { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${localePath(locale, item.path)}`,
    })),
  };
}

/** Sérialisation sûre pour une balise script : neutralise une fermeture précoce. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
