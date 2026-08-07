import { availability, type Availability } from "@/content/availability";
import {
  addDaysIso,
  fromWallClock,
  isoDateIn,
  parseClock,
  parseIsoDate,
  weekdayIn,
} from "./time";

/**
 * Moteur de créneaux.
 *
 * Deux garanties recherchées :
 *
 * 1. La liste affichée au visiteur et la liste acceptée par le serveur sont
 *    produites par la même fonction. Un créneau ne peut donc pas être proposé
 *    puis refusé pour cause de grille différente.
 * 2. Un créneau déjà réservé n'apparaît jamais, et la vérification est
 *    refaite à l'enregistrement — entre l'affichage et la validation, il se
 *    passe le temps que met le visiteur à remplir le formulaire.
 */

export type Slot = {
  /** Instant de début, en UTC, au format ISO. Identifie le créneau. */
  readonly startUtc: string;
  readonly durationMin: number;
};

export type SlotDay = {
  /** Jour civil dans le fuseau de NexPit, au format AAAA-MM-JJ. */
  readonly date: string;
  readonly slots: readonly Slot[];
};

export type SlotRejection = "past" | "taken" | "unknown";

function minutesOf(clock: string): number | null {
  const parsed = parseClock(clock);
  return parsed ? parsed.hour * 60 + parsed.minute : null;
}

/**
 * Produit tous les créneaux ouverts à la réservation.
 *
 * @param now instant de référence, injecté pour rester testable
 * @param taken instants de début déjà réservés, en ISO UTC
 */
export function generateSlots(
  now: Date,
  taken: readonly string[] = [],
  config: Availability = availability,
): SlotDay[] {
  const takenSet = new Set(taken);
  const earliest = now.getTime() + config.leadTimeHours * 3_600_000;
  const blackout = new Set(config.blackout);

  const days: SlotDay[] = [];
  let date = isoDateIn(now, config.timezone);

  for (let i = 0; i < config.horizonDays; i += 1) {
    const parsed = parseIsoDate(date);
    if (!parsed) break;

    if (!blackout.has(date)) {
      const weekday = weekdayIn(
        new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day, 12)),
        "UTC",
      );
      const ranges = config.weekly[weekday] ?? [];
      const slots: Slot[] = [];

      for (const [from, to] of ranges) {
        const start = minutesOf(from);
        const end = minutesOf(to);
        if (start === null || end === null || end <= start) continue;

        for (let m = start; m + config.durationMin <= end; m += config.stepMin) {
          const instant = fromWallClock(
            {
              year: parsed.year,
              month: parsed.month,
              day: parsed.day,
              hour: Math.floor(m / 60),
              minute: m % 60,
            },
            config.timezone,
          );

          if (instant.getTime() < earliest) continue;

          const startUtc = instant.toISOString();
          if (takenSet.has(startUtc)) continue;

          slots.push({ startUtc, durationMin: config.durationMin });
        }
      }

      if (slots.length > 0) {
        // Un changement d'heure peut faire ressortir deux plages dans le
        // désordre : on trie sur l'instant réel, pas sur l'heure murale.
        slots.sort((a, b) => a.startUtc.localeCompare(b.startUtc));
        days.push({ date, slots });
      }
    }

    date = addDaysIso(date, 1);
  }

  return days;
}

/**
 * Vérifie qu'un créneau soumis est bien l'un de ceux que le moteur propose.
 * Rejeter ici plutôt que faire confiance au formulaire est ce qui empêche
 * d'enregistrer un rendez-vous à 3 h du matin un dimanche.
 */
export function validateSlot(
  startUtc: string,
  now: Date,
  taken: readonly string[] = [],
  config: Availability = availability,
): { ok: true } | { ok: false; reason: SlotRejection } {
  const parsed = Date.parse(startUtc);
  if (Number.isNaN(parsed)) return { ok: false, reason: "unknown" };
  if (parsed <= now.getTime()) return { ok: false, reason: "past" };
  if (taken.includes(startUtc)) return { ok: false, reason: "taken" };

  const exists = generateSlots(now, [], config).some((day) =>
    day.slots.some((slot) => slot.startUtc === startUtc),
  );
  return exists ? { ok: true } : { ok: false, reason: "unknown" };
}

export function slotEnd(startUtc: string, durationMin: number): Date {
  return new Date(Date.parse(startUtc) + durationMin * 60_000);
}
