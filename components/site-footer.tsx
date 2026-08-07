import Link from "next/link";
import { LogoMark } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import { ConsentReopen } from "./consent-banner";
import { footerNav, nav, site } from "@/content/site";
import { ui } from "@/content/ui";
import { newsletter } from "@/content/pages";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Le cartouche du pied de page reprend le bloc-titre d'une planche de dessin :
 * quatre cases qui disent quel document on lit, dans quelle langue et à quelle
 * révision. C'est de la métadonnée réelle, pas un ornement.
 */
function TitleBlock({ locale }: { locale: Locale }) {
  const cells = [
    { k: ui.misc.titleBlockPublisher[locale], v: site.name },
    { k: ui.misc.titleBlockDocument[locale], v: ui.misc.titleBlockDocumentValue[locale] },
    { k: ui.misc.titleBlockLanguage[locale], v: locale.toUpperCase() },
    { k: ui.misc.titleBlockRevision[locale], v: process.env.NEXT_PUBLIC_BUILD_REV ?? "—" },
  ];

  return (
    <div className="grid grid-cols-2 border border-pit-rule sm:grid-cols-4">
      {cells.map((cell, i) => (
        <div
          key={cell.k}
          className={`px-4 py-3 ${i < cells.length - 1 ? "border-b border-pit-rule sm:border-b-0 sm:border-r" : ""} ${i === 0 ? "border-r sm:border-r" : ""}`}
        >
          <p className="label">{cell.k}</p>
          <p className="mono mt-1 text-pit-ink">{cell.v}</p>
        </div>
      ))}
    </div>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="on-pit mt-24 lg:mt-32">
      <div className="shell band-tight">
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-20">
          <div>
            <Link
              href={localePath(locale, "/")}
              className="inline-flex items-center gap-3"
              aria-label={`${site.name} — ${ui.misc.homeAria[locale]}`}
            >
              <LogoMark className="h-9 w-9" />
              <span className="display d3">{site.name}</span>
            </Link>

            <p className="lede mt-6 max-w-md">{site.tagline[locale]}</p>

            <nav
              aria-label={ui.misc.footerNav[locale]}
              className="mt-10"
            >
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {[...nav, ...footerNav].map((item) => (
                  <li key={item.key}>
                    <Link href={localePath(locale, item.href)} className="label hover:text-pit-ink transition-colors">
                      {item.label[locale]}
                    </Link>
                  </li>
                ))}
                <li>
                  <ConsentReopen locale={locale} />
                </li>
              </ul>
            </nav>

            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {Object.entries(site.social).map(([key, href]) => (
                <li key={key}>
                  <a
                    href={href}
                    rel="noreferrer noopener me"
                    target="_blank"
                    className="label hover:text-pit-ink transition-colors"
                  >
                    {key}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email.contact}`} className="label hover:text-pit-ink transition-colors">
                  {site.email.contact}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="display d3">{newsletter.heading[locale]}</h2>
            <p className="prose-tech mt-4 text-[0.9375rem]">{newsletter.body[locale]}</p>
            <NewsletterForm locale={locale} />
            <p className="label mt-4 leading-relaxed normal-case tracking-normal">
              {newsletter.privacy[locale]}
            </p>
          </div>
        </div>

        <div className="mt-16">
          <TitleBlock locale={locale} />
        </div>

        <p className="label mt-6">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
