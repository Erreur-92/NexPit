import { brake, lap, speedKmh } from "@/content/telemetry";
import { ui } from "@/content/ui";
import { formatNumber, type Locale } from "@/lib/i18n";

/**
 * L'élément signature du site.
 *
 * Ce n'est pas une courbe décorative : c'est la vitesse relevée sur le tour 9
 * de la session Pitlabs du 11 décembre 2025, tracée point par point, avec les
 * zones de freinage marquées en dessous. Tout est calculé au rendu serveur —
 * la page n'embarque aucun JavaScript pour l'afficher, et le seul mouvement
 * est le tracé initial du trait, en CSS.
 */

const W = 1200;
const TOP = 28;
const BOTTOM = 196;
const BRAKE_TOP = 214;
const BRAKE_H = 12;
const H = 248;

/** Seuil au-delà duquel on considère que le pilote freine réellement. */
const BRAKE_THRESHOLD = 0.15;

function buildTrace() {
  const n = speedKmh.length;
  const range = lap.vMax - lap.vMin || 1;
  const points = speedKmh.map((v, i) => {
    const x = (i / (n - 1)) * W;
    const y = BOTTOM - ((v - lap.vMin) / range) * (BOTTOM - TOP);
    return [x, y] as const;
  });

  const d = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join("");

  // Longueur exacte de la polyligne : sert à amorcer stroke-dashoffset sans
  // avoir à mesurer le tracé côté client.
  let length = 0;
  for (let i = 1; i < points.length; i += 1) {
    length += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }

  // Zones de freinage : suites contiguës de points au-dessus du seuil.
  const zones: Array<{ x: number; w: number }> = [];
  let start: number | null = null;
  for (let i = 0; i < n; i += 1) {
    const braking = brake[i] > BRAKE_THRESHOLD;
    if (braking && start === null) start = i;
    if ((!braking || i === n - 1) && start !== null) {
      const x0 = (start / (n - 1)) * W;
      const x1 = (i / (n - 1)) * W;
      if (x1 - x0 > 1) zones.push({ x: x0, w: x1 - x0 });
      start = null;
    }
  }

  const vMaxIndex = speedKmh.indexOf(Math.max(...speedKmh));
  return { d, length, zones, vMaxX: (vMaxIndex / (n - 1)) * W };
}

const trace = buildTrace();

export function TelemetryTrace({ locale }: { locale: Locale }) {
  const brakeLabel = ui.misc.braking[locale];
  const description =
    locale === "fr"
      ? `Relevé de vitesse sur un tour du Red Bull Ring en Lotus Exos 125, du 11 décembre 2025. La vitesse varie de ${formatNumber(lap.vMin, locale, 1)} à ${formatNumber(lap.vMax, locale, 1)} kilomètres par heure sur ${formatNumber(lap.trackLength, locale, 0)} mètres, en ${lap.lapTime}. ${trace.zones.length} zones de freinage sont marquées sous la courbe.`
      : `Speed readings over one lap of the Red Bull Ring in a Lotus Exos 125, on 11 December 2025. Speed varies from ${formatNumber(lap.vMin, locale, 1)} to ${formatNumber(lap.vMax, locale, 1)} kilometres per hour over ${formatNumber(lap.trackLength, locale, 0)} metres, in ${lap.lapTime}. ${trace.zones.length} braking zones are marked below the curve.`;

  return (
    <figure className="mt-10 lg:mt-14">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label={description}
        preserveAspectRatio="none"
      >
        {/* Filets de cadre : haut = Vmax, bas = Vmin. */}
        <line x1="0" y1={TOP} x2={W} y2={TOP} stroke="var(--rule)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1={BOTTOM} x2={W} y2={BOTTOM} stroke="var(--rule-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" />

        {/* Repère vertical sur le point de vitesse maximale. */}
        <line
          x1={trace.vMaxX}
          y1={TOP - 8}
          x2={trace.vMaxX}
          y2={TOP + 8}
          stroke="var(--ink)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        {/* Bande de freinage. Le jaune signal ne sert qu'à ça sur cette page. */}
        {trace.zones.map((z, i) => (
          <rect
            key={i}
            x={z.x}
            y={BRAKE_TOP}
            width={z.w}
            height={BRAKE_H}
            fill="var(--signal)"
          />
        ))}
        <line
          x1="0"
          y1={BRAKE_TOP + BRAKE_H}
          x2={W}
          y2={BRAKE_TOP + BRAKE_H}
          stroke="var(--rule)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        <path
          className="trace-path"
          d={trace.d}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.75"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ ["--trace-len" as string]: trace.length.toFixed(0) }}
        />
      </svg>

      {/* Les étiquettes vivent hors du SVG : le SVG est étiré horizontalement
          (preserveAspectRatio="none"), du texte à l'intérieur serait déformé. */}
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="label">
          {formatNumber(lap.vMin, locale, 1)} – {formatNumber(lap.vMax, locale, 1)} km/h
        </span>
        <span className="label inline-flex items-center gap-2">
          <span aria-hidden className="inline-block h-2 w-4 bg-signal" />
          {brakeLabel} ({trace.zones.length})
        </span>
        <span className="label">
          {lap.track} · {lap.layout} · {formatNumber(lap.trackLength, locale, 0)} m
        </span>
        <span className="label">{lap.car}</span>
        <span className="label">{lap.lapTime}</span>
      </figcaption>
    </figure>
  );
}
