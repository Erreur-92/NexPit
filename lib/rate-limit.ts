import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";

/**
 * Limitation de débit.
 *
 * Fenêtre glissante en mémoire, par empreinte d'adresse IP. Suffisant pour ce
 * que ça protège : empêcher qu'un même visiteur, humain ou robot, déclenche
 * cinquante envois d'affilée. Ce n'est pas une protection anti-déni de service
 * — celle-là se place devant l'application, pas dedans.
 *
 * L'adresse IP n'est jamais stockée : seul un condensé salé l'est, et le sel
 * change à chaque redémarrage. Les entrées expirent d'elles-mêmes.
 */

const SALT = randomBytes(16).toString("hex");

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

/** Purge paresseuse : évite une minuterie qui tournerait pour rien. */
function sweep(now: number) {
  if (buckets.size < 512) return;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

export async function clientFingerprint(): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    "inconnu";
  return createHash("sha256").update(`${SALT}:${ip}`).digest("hex").slice(0, 32);
}

export type RateVerdict = { allowed: true } | { allowed: false; retryAfterSec: number };

export function checkRate(
  key: string,
  limit: number,
  windowMs: number,
): RateVerdict {
  const now = Date.now();
  sweep(now);

  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

/** Quotas par formulaire, exprimés là où on peut les comparer d'un coup d'œil. */
export const LIMITS = {
  contact: { limit: 5, windowMs: 15 * 60_000 },
  newsletter: { limit: 5, windowMs: 15 * 60_000 },
  booking: { limit: 8, windowMs: 60 * 60_000 },
} as const;
