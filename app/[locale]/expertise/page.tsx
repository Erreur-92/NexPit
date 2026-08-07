import Link from "next/link";
import type { Metadata } from "next";
import { Eyebrow, Rail, SectionHead } from "@/components/prims";
import { expertises } from "@/content/expertise";
import { expertisePage } from "@/content/pages";
import { projectBySlug } from "@/content/projects";
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
    path: "/expertise",
    title: expertisePage.title[locale],
    description: expertisePage.lede[locale],
  });
}

export default async function ExpertisePage({
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
              { name: expertisePage.title[locale], path: "/expertise" },
            ]),
          ),
        }}
      />

      <section className="shell railed relative pt-14 lg:pt-24">
        <Rail marks={[{ at: "0.5rem", label: "E" }]} />
        <SectionHead
          as="h1"
          index="E.00"
          eyebrow={expertisePage.eyebrow[locale]}
          title={expertisePage.title[locale]}
          lede={expertisePage.lede[locale]}
        />
      </section>

      {expertises.map((expertise, i) => (
        <section
          key={expertise.key}
          id={expertise.key}
          className={`shell railed relative band ${i > 0 ? "" : ""} scroll-mt-8`}
        >
          <Rail marks={[{ at: "3rem", label: expertise.index }]} />

          <div className="border-t border-ink pt-8">
            <Eyebrow index={expertise.index}>{expertise.summary[locale]}</Eyebrow>
            <h2 className="display d2 mt-6 max-w-[20ch]">{expertise.title[locale]}</h2>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-20">
            <div className="prose-tech">
              {expertise.body[locale].map((paragraph, j) => (
                <p key={j}>{paragraph}</p>
              ))}
            </div>

            <div>
              <h3 className="label">{ui.sections.deliverables[locale]}</h3>
              <ul className="mt-5 border-t border-rule">
                {expertise.deliverables[locale].map((item, j) => (
                  <li key={j} className="border-b border-rule py-3 text-[0.9375rem] text-ink-2">
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="label mt-10">{ui.sections.relatedProjects[locale]}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {expertise.projectSlugs.map((slug) => {
                  const project = projectBySlug(slug);
                  if (!project) return null;
                  return (
                    <li key={slug}>
                      <Link
                        href={localePath(locale, `/projets/${slug}`)}
                        className="mono border border-rule-strong px-3 py-2 hover:border-ink hover:bg-signal transition-colors inline-block"
                      >
                        {project.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section className="shell band-tight">
        <p className="lede max-w-[60ch]">{expertisePage.closing[locale]}</p>
        <Link href={localePath(locale, "/contact")} className="btn mt-8">
          {ui.misc.describeNeed[locale]}
        </Link>
      </section>
    </>
  );
}
