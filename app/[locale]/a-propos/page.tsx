import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PendingNotice } from "@/components/pending-notice";
import { Rail, SectionHead } from "@/components/prims";
import { about } from "@/content/pages";
import { ui } from "@/content/ui";
import { projects } from "@/content/projects";
import { expertises } from "@/content/expertise";
import { isLocale, resolve, type Locale } from "@/content/types";
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
    path: "/a-propos",
    title: about.title[locale],
    description: about.lede[locale],
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  const team = resolve(about.team);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd(locale, [
              { name: "NexPit", path: "/" },
              { name: about.title[locale], path: "/a-propos" },
            ]),
          ),
        }}
      />

      <section className="shell railed relative pt-14 lg:pt-24">
        <Rail marks={[{ at: "0.5rem", label: "A" }]} />
        <SectionHead
          as="h1"
          index="A.01"
          eyebrow={about.eyebrow[locale]}
          title={about.title[locale]}
          lede={about.lede[locale]}
        />
      </section>

      {/* ---- Méthode ---------------------------------------------------- */}
      <section className="shell railed relative band">
        <Rail marks={[{ at: "3rem", label: "01" }]} />
        <h2 className="display d2 max-w-[16ch]">{about.method.heading[locale]}</h2>
        <ul className="mt-10 border-t border-ink">
          {about.method.items[locale].map((item, i) => (
            <li key={i} className="grid gap-3 border-b border-rule py-6 sm:grid-cols-[4rem_1fr] sm:gap-8">
              <span className="label pt-1">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-ink-2 max-w-[70ch]">{item}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- Équipe ------------------------------------------------------ */}
      <section className="shell railed relative band-tight">
        <Rail marks={[{ at: "1rem", label: "02" }]} />
        <h2 className="display d2">{about.teamHeading[locale]}</h2>

        {team ? (
          <ul className="mt-10 grid gap-3">
            {team.map((member, i) => {
              const name = resolve(member.name);
              const portfolio = resolve(member.portfolio);
              const preview = resolve(member.preview);
              if (!name) return null;

              const banner = (
                <>
                  {preview ? (
                    <Image
                      src={preview}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 1280px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                  <span className="absolute inset-0 bg-black/65 transition-colors duration-300 group-hover:bg-black/45" />
                  <span className="relative flex h-full items-end justify-between gap-4 p-6 sm:p-8">
                    <span className="display d2 text-white">{name}</span>
                    {portfolio ? <span className="label shrink-0 text-white/80">Portfolio ↗</span> : null}
                  </span>
                </>
              );
              const box = "group relative block h-40 overflow-hidden bg-black sm:h-56";

              return (
                <li key={i}>
                  {portfolio ? (
                    <a href={portfolio} target="_blank" rel="noreferrer noopener" className={box}>
                      {banner}
                    </a>
                  ) : (
                    <div className={box}>{banner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <PendingNotice
            what="Noms, rôles, parcours et éventuelles photos de l'équipe (content/pages.ts, champ about.team). Tant que ce champ vaut PENDING, cette section n'apparaît pas en production."
          />
        )}
      </section>

      {/* ---- Portée ------------------------------------------------------ */}
      <section className="on-pit mt-20 lg:mt-28">
        <div className="shell band">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <p className="display d1">{expertises.length}</p>
              <p className="label mt-3">{ui.misc.countAreas[locale]}</p>
            </div>
            <div>
              <p className="display d1">{projects.length}</p>
              <p className="label mt-3">{ui.misc.countProjects[locale]}</p>
            </div>
            <div>
              <p className="display d1">2</p>
              <p className="label mt-3">{ui.misc.countLanguages[locale]}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell band-tight">
        <div className="flex flex-wrap gap-3">
          <Link href={localePath(locale, "/rendez-vous")} className="btn">
            {ui.misc.bookLong[locale]}
          </Link>
          <Link href={localePath(locale, "/projets")} className="btn btn-ghost">
            {ui.misc.seeProjects[locale]}
          </Link>
        </div>
      </section>
    </>
  );
}
