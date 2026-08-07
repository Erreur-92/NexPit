import Link from "next/link";
import type { Metadata } from "next";
import { Rail, SectionHead } from "@/components/prims";
import { projects } from "@/content/projects";
import { projectsPage } from "@/content/pages";
import { ui } from "@/content/ui";
import { isLocale, tx, type Locale } from "@/content/types";
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
    path: "/projets",
    title: projectsPage.title[locale],
    description: projectsPage.lede[locale],
  });
}

export default async function ProjectsPage({
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
              { name: projectsPage.title[locale], path: "/projets" },
            ]),
          ),
        }}
      />

      <section className="shell railed relative pt-14 lg:pt-24">
        <Rail marks={[{ at: "0.5rem", label: "P" }]} />
        <SectionHead
          as="h1"
          index="P.00"
          eyebrow={projectsPage.eyebrow[locale]}
          title={projectsPage.title[locale]}
          lede={projectsPage.lede[locale]}
        />
      </section>

      <section className="shell band-tight">
        <ul className="border-t border-ink">
          {projects.map((project) => (
            <li key={project.slug} className="border-b border-rule">
              <Link
                href={localePath(locale, `/projets/${project.slug}`)}
                className="group block py-10"
              >
                <div className="grid gap-6 lg:grid-cols-[5rem_minmax(0,17rem)_1fr] lg:gap-12">
                  <span className="label pt-2">{project.index}</span>

                  <div>
                    <h2 className="display d3 min-w-0">
                      <span className="box-decoration-clone transition-colors group-hover:bg-signal">
                        {project.name}
                      </span>
                    </h2>
                    <p className="label mt-3">{ui.stage[project.stage][locale]}</p>
                    <p className="label mt-1">{project.period[locale]}</p>
                  </div>

                  <div className="max-w-[62ch]">
                    <p className="text-ink-2">{project.summary[locale]}</p>
                    <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                      {project.stack.slice(0, 6).map((item) => (
                        <li key={tx(item, locale)} className="label">
                          {tx(item, locale)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
