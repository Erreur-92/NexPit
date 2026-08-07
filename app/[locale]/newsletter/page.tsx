import Link from "next/link";
import type { Metadata } from "next";
import { Rail } from "@/components/prims";
import { NewsletterForm } from "@/components/newsletter-form";
import { newsletter } from "@/content/pages";
import { ui } from "@/content/ui";
import { isLocale, type Locale } from "@/content/types";
import { localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

/**
 * Page d'atterrissage des liens de confirmation et de désinscription.
 * Elle n'est pas indexée : elle ne dit rien qu'un moteur ait besoin de lire,
 * et ses URL portent un état lié à une action qui vient d'avoir lieu.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  return pageMetadata({
    locale,
    path: "/newsletter",
    title: newsletter.heading[locale],
    description: newsletter.body[locale],
    noIndex: true,
  });
}

const STATES = {
  confirmed: (locale: Locale) => ({ tone: "ok" as const, text: ui.newsletter.confirmed[locale] }),
  already: (locale: Locale) => ({ tone: "ok" as const, text: ui.newsletter.alreadyConfirmed[locale] }),
  invalid: (locale: Locale) => ({ tone: "error" as const, text: ui.newsletter.confirmFailed[locale] }),
  unsubscribed: (locale: Locale) => ({ tone: "ok" as const, text: ui.newsletter.unsubscribed[locale] }),
  "unsub-invalid": (locale: Locale) => ({
    tone: "error" as const,
    text: ui.newsletter.unsubscribeFailed[locale],
  }),
  error: (locale: Locale) => ({ tone: "error" as const, text: ui.status.genericError[locale] }),
} as const;

export default async function NewsletterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ state?: string }>;
}) {
  const { locale: raw } = await params;
  const { state } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "fr";

  const known = state && state in STATES ? STATES[state as keyof typeof STATES](locale) : null;

  return (
    <section className="shell railed relative pt-14 lg:pt-24">
      <Rail marks={[{ at: "0.5rem", label: "N" }]} />

      <h1 className="display d1 max-w-[14ch]">{newsletter.heading[locale]}</h1>

      {known ? (
        <p
          role={known.tone === "error" ? "alert" : "status"}
          className={`mt-10 max-w-[56ch] border-l-2 py-3 pl-4 leading-relaxed ${
            known.tone === "error" ? "border-danger text-danger" : "border-ok text-ok"
          }`}
        >
          {known.text}
        </p>
      ) : null}

      <p className="lede mt-10 max-w-[56ch]">{newsletter.body[locale]}</p>

      {known?.tone !== "ok" || state === "unsubscribed" ? (
        <div className="mt-4 max-w-xl">
          <NewsletterForm locale={locale} />
          <p className="label mt-5 normal-case tracking-normal leading-relaxed">
            {newsletter.privacy[locale]}
          </p>
        </div>
      ) : null}

      <div className="mt-16 flex flex-wrap gap-3">
        <Link href={localePath(locale, "/")} className="btn btn-ghost">
          {ui.notFound.back[locale]}
        </Link>
        <Link href={localePath(locale, "/confidentialite")} className="btn btn-ghost">
          {ui.misc.privacyPolicy[locale]}
        </Link>
      </div>
    </section>
  );
}
