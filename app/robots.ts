import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Ces chemins portent un jeton ou un état lié à une action : ils ne
        // doivent ni être explorés ni finir dans un index.
        disallow: ["/api/", "/fr/newsletter", "/en/newsletter", "/fr/rendez-vous/", "/en/rendez-vous/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
