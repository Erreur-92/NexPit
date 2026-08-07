import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { lap, speedKmh } from "@/content/telemetry";
import { isLocale } from "@/content/types";

/**
 * Images Open Graph générées.
 *
 * Elles reprennent la trace télémétrie de la page d'accueil, pour que le
 * partage d'un lien ressemble au site plutôt qu'à un rectangle de texte.
 * Le rendu est mis en cache un an : le contenu ne dépend que des paramètres
 * d'URL.
 */

export const runtime = "nodejs";

const W = 1200;
const H = 630;

/** Sous-échantillonnage : 240 points sont inutiles à cette taille. */
function tracePath(width: number, height: number, top: number): string {
  const step = 3;
  const points: string[] = [];
  const range = lap.vMax - lap.vMin || 1;

  for (let i = 0; i < speedKmh.length; i += step) {
    const x = (i / (speedKmh.length - 1)) * width;
    const y = top + height - ((speedKmh[i] - lap.vMin) / range) * height;
    points.push(`${points.length === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join("");
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const rawTitle = params.get("title") ?? "NexPit";
    const title = rawTitle.slice(0, 110);
    const rawLocale = params.get("locale") ?? "fr";
    const locale = isLocale(rawLocale) ? rawLocale : "fr";

    const fontsDir = path.join(process.cwd(), "assets", "fonts");
    const [display, mono] = await Promise.all([
      readFile(path.join(fontsDir, "Archivo-Bold.ttf")),
      readFile(path.join(fontsDir, "MartianMono-Medium.ttf")),
    ]);

    const footer =
      locale === "fr"
        ? `${lap.track} · ${lap.car} · ${lap.lapTime} · relevé du 11.12.2025`
        : `${lap.track} · ${lap.car} · ${lap.lapTime} · recorded 2025-12-11`;

    return new ImageResponse(
      (
        <div
          style={{
            width: W,
            height: H,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#fbfbf9",
            padding: "64px 72px",
            fontFamily: "Archivo",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div
              style={{
                fontFamily: "MartianMono",
                fontSize: 20,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#111214",
              }}
            >
              NexPit
            </div>
            <div
              style={{
                fontFamily: "MartianMono",
                fontSize: 16,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6e7378",
              }}
            >
              {locale.toUpperCase()}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: title.length > 58 ? 58 : 76,
              lineHeight: 1.02,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: "#111214",
              maxWidth: 980,
            }}
          >
            {title}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <svg width={W - 144} height={120} viewBox={`0 0 ${W - 144} 120`}>
              <rect x="0" y="119" width={W - 144} height="1" fill="#b3b5af" />
              <path
                d={tracePath(W - 144, 104, 8)}
                fill="none"
                stroke="#111214"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
            <div
              style={{
                marginTop: 20,
                fontFamily: "MartianMono",
                fontSize: 16,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#6e7378",
              }}
            >
              {footer}
            </div>
          </div>
        </div>
      ),
      {
        width: W,
        height: H,
        fonts: [
          { name: "Archivo", data: display, weight: 700, style: "normal" },
          { name: "MartianMono", data: mono, weight: 500, style: "normal" },
        ],
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      },
    );
  } catch (err) {
    console.error("[og] génération impossible —", err);
    return new Response("image indisponible", { status: 500 });
  }
}
