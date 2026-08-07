import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { Eyebrow, Rail, SpecList } from "@/components/prims";
import { projectBySlug, projects } from "@/content/projects";
import { expertiseByKey } from "@/content/expertise";
import { ui } from "@/content/ui";
import { isLocale, LOCALES, tx, type Locale } from "@/content/types";
import { localePath } from "@/lib/i18n";
import { breadcrumbJsonLd, jsonLdScript, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  const project = projectBySlug(slug);
  if (!project) return {};

  return pageMetadata({
    locale,
    path: `/projets/${slug}`,
    title: `${project.name} — ${ui.stage[project.stage][locale]}`,
    description: project.summary[locale],
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  const project = projectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd(locale, [
              { name: "NexPit", path: "/" },
              { name: ui.misc.projectsCrumb[locale], path: "/projets" },
              { name: project.name, path: `/projets/${slug}` },
            ]),
          ),
        }}
      />

      {/* ---- En-tête ---------------------------------------------------- */}
      <article>
        <section className="shell railed relative pt-14 lg:pt-24">
          <Rail marks={[{ at: "0.5rem", label: project.index }]} />

          <Eyebrow index={project.index}>{ui.stage[project.stage][locale]}</Eyebrow>
          <h1 className="display d1 mt-6">{project.name}</h1>
          <p className="lede mt-8 max-w-[56ch]">{project.summary[locale]}</p>

          <div className="mt-12 max-w-3xl">
            <SpecList
              items={[
                { term: ui.sections.period[locale], value: project.period[locale] },
                { term: ui.sections.role[locale], value: project.role[locale] },
                {
                  term: ui.sections.stack[locale],
                  value: (
                    <ul className="flex flex-wrap gap-x-3 gap-y-1">
                      {project.stack.map((item) => (
                        <li key={tx(item, locale)} className="mono">
                          {tx(item, locale)}
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ]}
            />
          </div>
        </section>

        {/* ---- Repères chiffrés ------------------------------------------ */}
        {project.metrics.length > 0 ? (
          <section className="shell band-tight">
            <h2 className="label">{ui.sections.metrics[locale]}</h2>
            <ul className="mt-6 grid gap-px border border-rule bg-rule sm:grid-cols-3">
              {project.metrics.map((metric, i) => (
                <li key={i} className="bg-paper p-6">
                  <p className="display d3">{metric.value}</p>
                  <p className="mt-2 text-[0.9375rem] text-ink-2">{metric.label[locale]}</p>
                  {/* La source figure sous chaque chiffre : un nombre sans
                      provenance n'a pas sa place sur ce site. */}
                  <p className="label mt-4 normal-case tracking-normal leading-relaxed">
                    {metric.source[locale]}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ---- Problème -------------------------------------------------- */}
        <section className="shell railed relative band">
          <Rail marks={[{ at: "3rem", label: "01" }]} />
          <h2 className="display d2 max-w-[16ch]">{ui.sections.problem[locale]}</h2>
          <p className="prose-tech mt-8 text-[1.0625rem] lg:text-[1.1875rem]">
            {project.problem[locale]}
          </p>
        </section>

        {/* ---- Réalisé --------------------------------------------------- */}
        <section className="shell railed relative band-tight">
          <Rail marks={[{ at: "1rem", label: "02" }]} />
          <h2 className="display d2 max-w-[16ch]">{ui.sections.built[locale]}</h2>
          <ul className="mt-8 border-t border-rule">
            {project.built[locale].map((item, i) => (
              <li key={i} className="grid gap-3 border-b border-rule py-5 sm:grid-cols-[4rem_1fr] sm:gap-6">
                <span className="label pt-1">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-ink-2 max-w-[68ch]">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Architecture ---------------------------------------------- */}
        <section className="on-pit mt-20 lg:mt-28">
          <div className="shell band">
            <h2 className="label">{ui.sections.diagram[locale]}</h2>
            <div className="mt-8">
              <ArchitectureDiagram diagram={project.diagram} locale={locale} />
            </div>
          </div>
        </section>

        {/* ---- Décisions -------------------------------------------------- */}
        <section className="shell railed relative band">
          <Rail marks={[{ at: "3rem", label: "03" }]} />
          <h2 className="display d2 max-w-[16ch]">{ui.sections.decisions[locale]}</h2>
          <div className="mt-10 space-y-12">
            {project.decisions.map((decision, i) => (
              <div key={i} className="grid gap-4 border-t border-ink pt-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
                <h3 className="display d3 min-w-0">{decision.title[locale]}</h3>
                <p className="text-ink-2 max-w-[68ch]">{decision.body[locale]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Ce que ça démontre ---------------------------------------- */}
        <section className="shell band-tight">
          <div className="border-l-2 border-signal-deep pl-6 lg:pl-8">
            <h2 className="label">{ui.sections.demonstrates[locale]}</h2>
            <p className="lede mt-4 max-w-[52ch]">{project.demonstrates[locale]}</p>
          </div>

          <ul className="mt-10 flex flex-wrap gap-2">
            {project.expertiseKeys.map((key) => {
              const expertise = expertiseByKey(key);
              if (!expertise) return null;
              return (
                <li key={key}>
                  <Link
                    href={localePath(locale, `/expertise#${key}`)}
                    className="mono inline-block border border-rule-strong px-3 py-2 transition-colors hover:border-ink hover:bg-signal"
                  >
                    {expertise.title[locale]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </article>

      {/* ---- Navigation ------------------------------------------------- */}
      <nav className="shell band-tight border-t border-rule" aria-label={ui.misc.otherProjects[locale]}>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Link href={localePath(locale, "/projets")} className="label hover:text-ink transition-colors">
            {ui.backToProjects[locale]}
          </Link>
          <Link href={localePath(locale, `/projets/${next.slug}`)} className="group text-right">
            <span className="label">{next.index}</span>
            <span className="display d3 block mt-1 group-hover:bg-signal transition-colors">
              {next.name}
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
