import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Rail, SectionHead } from "@/components/prims";
import { contact } from "@/content/pages";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
import { isPending, isLocale, type Locale } from "@/content/types";
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
    path: "/contact",
    title: contact.title[locale],
    description: contact.lede[locale],
  });
}

export default async function ContactPage({
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
              { name: contact.title[locale], path: "/contact" },
            ]),
          ),
        }}
      />

      <section className="shell railed relative pt-14 lg:pt-24">
        <Rail marks={[{ at: "0.5rem", label: "K" }]} />
        <SectionHead
          as="h1"
          index="K.00"
          eyebrow={contact.eyebrow[locale]}
          title={contact.title[locale]}
          lede={contact.lede[locale]}
        />
      </section>

      <section className="shell band-tight">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-24">
          <div>
            <ContactForm locale={locale} />
          </div>

          <aside className="lg:pt-10">
            <h2 className="label">{contact.altHeading[locale]}</h2>

            <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-2">
              {contact.bookingPitch[locale]}
            </p>
            <Link href={localePath(locale, "/rendez-vous")} className="btn btn-ghost mt-5">
              {ui.misc.seeSlots[locale]}
            </Link>

            <dl className="mt-12 border-t border-rule">
              <div className="border-b border-rule py-4">
                <dt className="label">{ui.misc.emailLabel[locale]}</dt>
                <dd className="mt-1">
                  <a href={`mailto:${site.email.contact}`} className="link">
                    {site.email.contact}
                  </a>
                </dd>
              </div>
              {!isPending(site.phone) ? (
                <div className="border-b border-rule py-4">
                  <dt className="label">{ui.misc.phoneLabel[locale]}</dt>
                  <dd className="mt-1">
                    <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="link">
                      {site.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              <div className="border-b border-rule py-4">
                <dt className="label">{ui.misc.responseTimeLabel[locale]}</dt>
                <dd className="mt-1 text-ink-2">{contact.responseTime[locale]}</dd>
              </div>
              <div className="border-b border-rule py-4">
                <dt className="label">LinkedIn</dt>
                <dd className="mt-1">
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link"
                  >
                    {ui.misc.linkedinPage[locale]}
                  </a>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
