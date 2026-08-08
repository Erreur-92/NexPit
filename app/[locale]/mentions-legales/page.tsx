import type { Metadata } from "next";
import { PendingNotice } from "@/components/pending-notice";
import { Rail, SpecList } from "@/components/prims";
import { legalNotice } from "@/content/legal";
import { legalIdentity, site } from "@/content/site";
import { isLocale, resolve, type Locale } from "@/content/types";
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
    path: "/mentions-legales",
    title: legalNotice.title[locale],
    description:
      locale === "fr"
        ? "Identité de l'éditeur, hébergeur et conditions d'utilisation du site NexPit."
        : "Publisher identity, host and terms of use of the NexPit site.",
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  const L = legalNotice.labels;

  const legalName = resolve(legalIdentity.legalName);
  const legalForm = resolve(legalIdentity.legalForm);
  const rna = resolve(legalIdentity.rna);
  const siret = resolve(legalIdentity.siret);
  const ape = resolve(legalIdentity.ape);
  const vat = resolve(legalIdentity.vat);
  const capital = resolve(legalIdentity.shareCapital);
  const address = resolve(legalIdentity.address);
  const director = resolve(legalIdentity.publicationDirector);
  const registration = resolve(legalIdentity.registrationCity);
  const host = resolve(legalIdentity.host);

  type Row = { term: string; value: React.ReactNode };

  const identityRows: Row[] = ([
    legalName ? { term: L.legalName[locale], value: legalName } : null,
    legalForm ? { term: L.legalForm[locale], value: legalForm[locale] } : null,
    capital ? { term: L.shareCapital[locale], value: capital } : null,
    rna ? { term: L.rna[locale], value: rna } : null,
    siret ? { term: L.siret[locale], value: siret } : null,
    ape ? { term: L.ape[locale], value: ape } : null,
    vat ? { term: L.vat[locale], value: vat } : null,
    registration ? { term: L.registration[locale], value: registration } : null,
    address
      ? {
          term: L.address[locale],
          value: (
            <span className="whitespace-pre-line">{address.join("\n")}</span>
          ),
        }
      : null,
    director ? { term: L.director[locale], value: director } : null,
    {
      term: L.email[locale],
      value: (
        <a href={`mailto:${site.email.contact}`} className="link">
          {site.email.contact}
        </a>
      ),
    },
  ] as (Row | null)[]).filter((row): row is Row => row !== null);

  // Un identifiant suffit : SIRET pour une entreprise, RNA pour une
  // association. Les deux autres champs sont exigés dans tous les cas.
  const identityIncomplete = !legalName || (!siret && !rna) || !address || !director;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd(locale, [
              { name: "NexPit", path: "/" },
              { name: legalNotice.title[locale], path: "/mentions-legales" },
            ]),
          ),
        }}
      />

      <section className="shell railed relative pt-14 lg:pt-24">
        <Rail marks={[{ at: "0.5rem", label: "L" }]} />
        <p className="label">{legalNotice.eyebrow[locale]}</p>
        <h1 className="display d1 mt-5 max-w-[14ch]">{legalNotice.title[locale]}</h1>
      </section>

      <section className="shell band-tight max-w-4xl">
        <h2 className="display d3">{legalNotice.identityHeading[locale]}</h2>

        {/* Contrairement au reste du site, ce manque s'affiche en production :
            une page de mentions légales silencieusement vide serait pire. */}
        {/* {identityIncomplete ? (
          <p
            role="alert"
            className="mt-6 border-l-2 border-danger py-3 pl-4 leading-relaxed text-danger"
          >
            {/* {legalNotice.missingIdentity[locale]} */}
          {/* </p> } */}
        {/* ) : null} */}

        {/* <PendingNotice what="Dénomination, SIRET, code APE, TVA, adresse et directeur de la publication (content/site.ts, objet legalIdentity)." /> */}

        <div className="mt-8">
          <SpecList items={identityRows} />
        </div>

        <h2 className="display d3 mt-16">{legalNotice.hostHeading[locale]}</h2>
        {host ? (
          <div className="mt-6">
            <SpecList
              items={[
                { term: L.legalName[locale], value: host.name },
                {
                  term: L.address[locale],
                  value: <span className="whitespace-pre-line">{host.address.join("\n")}</span>,
                },
                ...(resolve(host.url)
                  ? [
                      {
                        term: "URL",
                        value: (
                          <a href={resolve(host.url)!} className="link" rel="noreferrer noopener">
                            {resolve(host.url)}
                          </a>
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        ) : (
          <p role="alert" className="mt-6 border-l-2 border-danger py-3 pl-4 leading-relaxed text-danger">
            {legalNotice.missingHost[locale]}
          </p>
        )}

        {legalNotice.sections.map((section) => (
          <section key={section.id} id={section.id} className="mt-16">
            <h2 className="display d3">{section.heading[locale]}</h2>
            <div className="prose-tech mt-5">
              {section.body[locale].map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </section>
    </>
  );
}
