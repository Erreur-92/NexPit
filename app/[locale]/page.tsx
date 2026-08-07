import Link from "next/link";
import type { Metadata } from "next";
import { TelemetryTrace } from "@/components/telemetry-trace";
import { Dim, Eyebrow, Rail } from "@/components/prims";
import { expertises } from "@/content/expertise";
import { ui } from "@/content/ui";
import { home } from "@/content/pages";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { isLocale, type Locale } from "@/content/types";
import { localePath } from "@/lib/i18n";
import { jsonLdScript, pageMetadata, serviceJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  return pageMetadata({
    locale,
    path: "/",
    title: `${site.name} — ${home.title[locale]}`,
    description: home.lede[locale],
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";

  return (
    <>
      {expertises.map((e) => (
        <script
          key={e.key}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(
              serviceJsonLd(locale, {
                name: e.title[locale],
                description: e.summary[locale],
                path: "/expertise",
              }),
            ),
          }}
        />
      ))}

      {/* ---- Héros ---------------------------------------------------- */}
      <section className="shell railed relative pt-14 lg:pt-24">
        <Rail
          marks={[
            { at: "0.5rem", label: "A" },
            { at: "35%", label: "01" },
            { at: "70%" },
          ]}
        />

        <Eyebrow index="A.00">{home.eyebrow[locale]}</Eyebrow>

        <h1 className="display d1 mt-6 max-w-[16ch]">{home.title[locale]}</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,46ch)_1fr] lg:items-end lg:gap-16">
          <p className="lede">{home.lede[locale]}</p>

          <div className="flex flex-wrap gap-3 lg:justify-end lg:pb-1">
            <Link href={localePath(locale, "/rendez-vous")} className="btn">
              {home.ctaPrimary[locale]}
            </Link>
            <Link href={localePath(locale, "/projets")} className="btn btn-ghost">
              {home.ctaSecondary[locale]}
            </Link>
          </div>
        </div>

        <p className="label mt-16 max-w-xl normal-case tracking-normal text-[0.875rem] leading-relaxed">
          {home.traceIntro[locale]}
        </p>

        <TelemetryTrace locale={locale} />
      </section>

      {/* ---- Expertises ------------------------------------------------ */}
      <section className="shell railed relative band">
        <Rail marks={[{ at: "3rem", label: "B" }]} />

        <h2 className="display d2 max-w-[18ch]">{home.expertiseHeading[locale]}</h2>

        <ul className="mt-12 border-t border-rule">
          {expertises.map((expertise) => (
            <li key={expertise.key} className="border-b border-rule">
              <Link
                href={localePath(locale, `/expertise#${expertise.key}`)}
                className="group grid gap-4 py-8 sm:grid-cols-[5rem_1fr] sm:gap-8 lg:grid-cols-[5rem_minmax(0,23rem)_1fr] lg:gap-12"
              >
                <span className="label pt-1">{expertise.index}</span>
                <h3 className="display d3 min-w-0">
                  <span className="box-decoration-clone transition-colors group-hover:bg-signal">
                    {expertise.title[locale]}
                  </span>
                </h3>
                <p className="text-ink-2 max-w-[52ch] min-w-0">{expertise.summary[locale]}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- Portefeuille ---------------------------------------------- */}
      <section className="shell railed relative band-tight">
        <Rail marks={[{ at: "1rem", label: "C" }]} />

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow index="C.00">{home.projectsHeading[locale]}</Eyebrow>
            <p className="lede mt-5 max-w-[54ch]">{home.projectsIntro[locale]}</p>
          </div>
          <Dim value={`${projects.length} ${ui.misc.unitProjects[locale]}`} />
        </div>

        <ul className="mt-12 border-t border-rule">
          {projects.map((project) => (
            <li key={project.slug} className="border-b border-rule">
              <Link
                href={localePath(locale, `/projets/${project.slug}`)}
                className="group grid gap-3 py-7 sm:grid-cols-[5rem_minmax(0,15rem)_1fr] sm:items-start sm:gap-8"
              >
                <span className="label sm:pt-2">{project.index}</span>
                <span className="display d3 min-w-0">
                  <span className="box-decoration-clone transition-colors group-hover:bg-signal">
                    {project.name}
                  </span>
                </span>
                <span className="text-ink-2 max-w-[62ch] min-w-0 sm:pt-1">
                  {project.summary[locale]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- Note de lecture ------------------------------------------- */}
      <section className="on-pit mt-24 lg:mt-32">
        <div className="shell band">
          <Eyebrow>{home.readingNote.heading[locale]}</Eyebrow>
          <ul className="mt-10 grid gap-px bg-pit-rule sm:grid-cols-2">
            {home.readingNote.items[locale].map((item, i) => (
              <li key={i} className="bg-pit p-6 lg:p-8">
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 text-pit-ink-2 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Clôture ---------------------------------------------------- */}
      <section className="shell railed relative band">
        <Rail marks={[{ at: "3rem", label: "D" }]} />
        <h2 className="display d2 max-w-[20ch]">{home.closing.heading[locale]}</h2>
        <p className="lede mt-6">{home.closing.body[locale]}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={localePath(locale, "/rendez-vous")} className="btn">
            {home.ctaPrimary[locale]}
          </Link>
          <Link href={localePath(locale, "/contact")} className="btn btn-ghost">
            {home.ctaWrite[locale]}
          </Link>
        </div>
      </section>
    </>
  );
}
