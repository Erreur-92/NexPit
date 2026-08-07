import Link from "next/link";
import type { Metadata } from "next";
import { Rail } from "@/components/prims";
import { privacy } from "@/content/legal";
import { ui } from "@/content/ui";
import { isLocale, type Locale } from "@/content/types";
import { localePath } from "@/lib/i18n";
import { breadcrumbJsonLd, jsonLdScript, pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  return pageMetadata({
    locale,
    path: "/confidentialite",
    title: privacy.title[locale],
    description: privacy.lede[locale],
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd(locale, [
              { name: "NexPit", path: "/" },
              { name: privacy.title[locale], path: "/confidentialite" },
            ]),
          ),
        }}
      />

      <section className="shell railed relative pt-14 lg:pt-24">
        <Rail marks={[{ at: "0.5rem", label: "C" }]} />
        <p className="label">{privacy.eyebrow[locale]}</p>
        <h1 className="display d1 mt-5 max-w-[16ch]">{privacy.title[locale]}</h1>
        <p className="lede mt-8">{privacy.lede[locale]}</p>
      </section>

      <section className="shell band-tight max-w-4xl">
        {/* Sommaire : la page est longue par nature, et quelqu'un qui la
            consulte cherche généralement un traitement précis. */}
        <nav aria-label={ui.misc.contents[locale]} className="border-y border-rule py-6">
          <ol className="grid gap-2 sm:grid-cols-2">
            {privacy.sections.map((section, i) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="label hover:text-ink transition-colors">
                  <span className="text-ink">{String(i + 1).padStart(2, "0")}</span>{" "}
                  {section.heading[locale]}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {privacy.sections.map((section, i) => (
          <section key={section.id} id={section.id} className="mt-14 scroll-mt-8">
            <p className="label">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="display d3 mt-3">{section.heading[locale]}</h2>
            <ul className="mt-6 border-t border-rule">
              {section.body[locale].map((line, j) => (
                <li key={j} className="border-b border-rule py-4 text-ink-2 leading-relaxed">
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-16">
          <Link href={localePath(locale, "/mentions-legales")} className="link">
            {ui.misc.legalNotice[locale]}
          </Link>
        </p>
      </section>
    </>
  );
}
