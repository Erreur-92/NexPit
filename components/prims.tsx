import type { ReactNode } from "react";

/**
 * Primitives de mise en page.
 *
 * `Rail` et `Dim` portent la signature visuelle du site : la marge graduée
 * d'une planche de dessin et la ligne de cote. Les deux sont décoratives et
 * masquées aux technologies d'assistance — ce qu'elles mesurent est déjà écrit
 * en toutes lettres à côté.
 */

export function Shell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`shell ${className}`}>{children}</div>;
}

/** Marge graduée verticale. Absente sous 1024px. */
export function Rail({ marks = [] }: { marks?: readonly { at: string; label?: string }[] }) {
  return (
    <div className="rail" aria-hidden>
      {marks.map((m, i) => (
        <div key={i}>
          <span className="rail-tick" style={{ top: m.at }} />
          {m.label ? (
            <span className="rail-mark" style={{ top: m.at }}>
              {m.label}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** Ligne de cote. La valeur est purement visuelle. */
export function Dim({ value, className = "" }: { value: string; className?: string }) {
  return (
    <div className={`dim dim-tip ${className}`} aria-hidden>
      <span>{value}</span>
    </div>
  );
}

export function Eyebrow({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <p className="label flex items-center gap-3">
      {index ? (
        <>
          <span className="text-ink">{index}</span>
          <span aria-hidden className="h-px w-6 bg-rule-strong" />
        </>
      ) : null}
      {children}
    </p>
  );
}

export function SectionHead({
  index,
  eyebrow,
  title,
  lede,
  as: Tag = "h2",
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <header className="max-w-4xl">
      {eyebrow ? <Eyebrow index={index}>{eyebrow}</Eyebrow> : null}
      <Tag className={`display ${Tag === "h1" ? "d1" : "d2"} mt-5`}>{title}</Tag>
      {lede ? <p className="lede mt-6">{lede}</p> : null}
    </header>
  );
}

/** Liste de données en deux colonnes, façon fiche technique. */
export function SpecList({
  items,
}: {
  items: readonly { term: string; value: ReactNode }[];
}) {
  return (
    <dl className="divide-y divide-rule border-y border-rule">
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
          <dt className="label pt-0.5">{item.term}</dt>
          <dd className="text-ink-2">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
