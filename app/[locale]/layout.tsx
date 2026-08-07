import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { ConsentBanner } from "@/components/consent-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site, SITE_URL } from "@/content/site";
import { ui } from "@/content/ui";
import { isLocale, LOCALES, type Locale } from "@/content/types";
import { htmlLang } from "@/lib/i18n";
import { jsonLdScript, organizationJsonLd } from "@/lib/seo";

/**
 * Racine de l'application. Il n'y a pas de `app/layout.tsx` : avec un
 * routage par langue, c'est ce fichier-ci qui porte `<html>` et `<body>`,
 * ce qui permet de renseigner correctement l'attribut `lang`.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#fbfbf9",
  colorScheme: "light",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${site.name} — ${site.tagline[locale]}`,
      template: `%s — ${site.name}`,
    },
    description: site.tagline[locale],
    applicationName: site.name,
    icons: { icon: "/NexPit_N.svg" },
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  return (
    <html lang={htmlLang[locale]}>
      <head>
        {/* Seul le sous-ensemble latin est préchargé : il couvre le français
            et l'anglais. latin-ext ne se charge que si un caractère l'exige. */}
        <link
          rel="preload"
          href="/fonts/archivo-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/martianmono-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd(locale)) }}
        />
      </head>
      <body>
        <a href="#contenu" className="skip-link">
          {ui.skipToContent[locale]}
        </a>
        <SiteHeader locale={locale} />
        <main id="contenu">{children}</main>
        <SiteFooter locale={locale} />
        <ConsentBanner locale={locale} />
      </body>
    </html>
  );
}
