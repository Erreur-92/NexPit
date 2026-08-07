import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { projects } from "@/content/projects";
import { LOCALES } from "@/content/types";
import { htmlLang, localePath } from "@/lib/i18n";

/**
 * Sitemap.
 *
 * Chaque entrée porte ses alternates hreflang, ce qui évite d'avoir à les
 * maintenir séparément dans les métadonnées et ici. Les pages qui portent un
 * état ou un secret — confirmation d'inscription, gestion d'un rendez-vous —
 * en sont volontairement absentes.
 */

const STATIC_PATHS = [
  { path: "/", priority: 1, changeFrequency: "monthly" as const },
  { path: "/expertise", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/projets", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/a-propos", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" as const },
  { path: "/rendez-vous", priority: 0.8, changeFrequency: "yearly" as const },
  { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/confidentialite", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [];

  const allPaths = [
    ...STATIC_PATHS,
    ...projects.map((p) => ({
      path: `/projets/${p.slug}`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    })),
  ];

  for (const entry of allPaths) {
    const languages: Record<string, string> = {};
    for (const locale of LOCALES) {
      languages[htmlLang[locale]] = `${SITE_URL}${localePath(locale, entry.path)}`;
    }

    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}${localePath(locale, entry.path)}`,
        lastModified,
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
