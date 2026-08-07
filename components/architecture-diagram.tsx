import type { Diagram, Locale } from "@/content/types";

/**
 * Schéma d'architecture dessiné à partir de la description dans content/.
 *
 * Les projets étant internes, aucune capture d'écran n'est publiée : ce schéma
 * tient lieu de visuel et décrit le chemin réel de la donnée dans le code.
 * Rendu côté serveur, sans bibliothèque de graphes.
 */

const NODE_W = 188;
const NODE_H = 64;
const GAP_X = 84;
const GAP_Y = 32;

const KIND_STYLE: Record<
  Diagram["nodes"][number]["kind"],
  { fill: string; stroke: string; dash?: string }
> = {
  source: { fill: "var(--paper)", stroke: "var(--ink)" },
  process: { fill: "var(--paper-sunk)", stroke: "var(--ink)" },
  store: { fill: "var(--paper)", stroke: "var(--rule-strong)", dash: "4 3" },
  surface: { fill: "var(--signal)", stroke: "var(--ink)" },
};

export function ArchitectureDiagram({
  diagram,
  locale,
}: {
  diagram: Diagram;
  locale: Locale;
}) {
  const cols = Math.max(...diagram.nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...diagram.nodes.map((n) => n.row)) + 1;

  const width = cols * NODE_W + (cols - 1) * GAP_X;
  const height = rows * NODE_H + (rows - 1) * GAP_Y;

  const x = (col: number) => col * (NODE_W + GAP_X);
  const y = (row: number) => row * (NODE_H + GAP_Y);

  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));

  return (
    <figure>
      {/* Un schéma large ne se lit pas écrasé : sous 720px il défile
          horizontalement dans son propre conteneur plutôt que de rétrécir.
          Une zone qui défile doit être atteignable au clavier, d'où le
          tabIndex : sans lui, ce schéma est inaccessible à la flèche droite. */}
      <div
        className="overflow-x-auto -mx-pad px-pad lg:mx-0 lg:px-0"
        tabIndex={0}
        role="group"
        aria-label={diagram.caption[locale]}
      >
        <svg
          viewBox={`-2 -2 ${width + 4} ${height + 24}`}
          width={width}
          height={height + 22}
          className="max-w-full h-auto min-w-[560px]"
          role="img"
          aria-label={diagram.caption[locale]}
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L8 4 L0 8 z" className="diagram-arrow" fill="var(--ink-3)" />
            </marker>
          </defs>

          {diagram.edges.map((edge, i) => {
            const from = byId.get(edge.from);
            const to = byId.get(edge.to);
            if (!from || !to) return null;

            const sameCol = from.col === to.col;
            let d: string;
            let labelX: number;
            let labelY: number;

            if (sameCol) {
              const down = to.row > from.row;
              const x0 = x(from.col) + NODE_W / 2;
              const y0 = y(from.row) + (down ? NODE_H : 0);
              const y1 = y(to.row) + (down ? 0 : NODE_H);
              d = `M${x0} ${y0} L${x0} ${y1}`;
              labelX = x0 + 8;
              labelY = (y0 + y1) / 2;
            } else {
              const x0 = x(from.col) + NODE_W;
              const y0 = y(from.row) + NODE_H / 2;
              const x1 = x(to.col);
              const y1 = y(to.row) + NODE_H / 2;
              const mid = x0 + (x1 - x0) / 2;
              d =
                y0 === y1
                  ? `M${x0} ${y0} L${x1} ${y1}`
                  : `M${x0} ${y0} L${mid} ${y0} L${mid} ${y1} L${x1} ${y1}`;
              labelX = mid + 6;
              labelY = (y0 + y1) / 2 - 6;
            }

            return (
              <g key={i}>
                <path
                  className="diagram-edge"
                  d={d}
                  fill="none"
                  stroke="var(--ink-3)"
                  strokeWidth="1"
                  markerEnd="url(#arrow)"
                />
                {edge.label ? (
                  <text
                    x={labelX}
                    y={labelY}
                    className="diagram-edge-label"
                    dominantBaseline="middle"
                  >
                    {edge.label[locale]}
                  </text>
                ) : null}
              </g>
            );
          })}

          {diagram.nodes.map((node) => {
            const style = KIND_STYLE[node.kind];
            return (
              <g key={node.id}>
                <rect
                  x={x(node.col)}
                  y={y(node.row)}
                  width={NODE_W}
                  height={NODE_H}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth="1"
                  strokeDasharray={style.dash}
                />
                <text
                  x={x(node.col) + 14}
                  y={y(node.row) + (node.sub ? 26 : 36)}
                  className="diagram-node-label"
                >
                  {node.label[locale]}
                </text>
                {node.sub ? (
                  <text
                    x={x(node.col) + 14}
                    y={y(node.row) + 45}
                    className="diagram-node-sub"
                  >
                    {node.sub[locale]}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="label mt-4">{diagram.caption[locale]}</figcaption>
    </figure>
  );
}
