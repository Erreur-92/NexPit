import { describe, expect, it } from "vitest";
import type { Availability } from "@/content/availability";
import { generateSlots, slotEnd, validateSlot } from "@/lib/booking";
import { toWallClock } from "@/lib/time";

/**
 * Le moteur de créneaux est testé avec un instant de référence injecté :
 * sans cela, la suite passerait le lundi et échouerait le samedi.
 */

const CONFIG: Availability = {
  timezone: "Europe/Paris",
  durationMin: 30,
  stepMin: 30,
  leadTimeHours: 24,
  horizonDays: 14,
  weekly: {
    0: [],
    1: [["09:30", "12:00"], ["14:00", "17:30"]],
    2: [["09:30", "12:00"], ["14:00", "17:30"]],
    3: [["09:30", "12:00"], ["14:00", "17:30"]],
    4: [["09:30", "12:00"], ["14:00", "17:30"]],
    5: [["09:30", "12:00"], ["14:00", "16:30"]],
    6: [],
  },
  blackout: [],
};

/** Mardi 11 août 2026, 10 h 00 UTC (12 h 00 à Paris). */
const NOW = new Date("2026-08-11T10:00:00Z");

const allSlots = (days: ReturnType<typeof generateSlots>) =>
  days.flatMap((d) => d.slots.map((s) => s.startUtc));

describe("generateSlots", () => {
  it("n'ouvre aucun créneau le samedi ni le dimanche", () => {
    const days = generateSlots(NOW, [], CONFIG);
    const dates = days.map((d) => d.date);
    expect(dates).not.toContain("2026-08-15"); // samedi
    expect(dates).not.toContain("2026-08-16"); // dimanche
    expect(dates).toContain("2026-08-17"); // lundi
  });

  it("respecte le délai de prévenance de 24 heures", () => {
    const days = generateSlots(NOW, [], CONFIG);
    const first = allSlots(days)[0];
    expect(Date.parse(first)).toBeGreaterThanOrEqual(NOW.getTime() + 24 * 3_600_000);
    // NOW vaut midi à Paris : le mercredi matin est encore dans les 24 heures,
    // donc le premier créneau proposé est mercredi 14 h locale.
    expect(days[0].date).toBe("2026-08-12");
    const wc = toWallClock(new Date(first), CONFIG.timezone);
    expect(`${wc.hour}:${String(wc.minute).padStart(2, "0")}`).toBe("14:00");
  });

  it("produit les bonnes heures locales, pas les heures UTC", () => {
    const days = generateSlots(NOW, [], CONFIG);
    // Jeudi : premier jour entièrement au-delà du délai de prévenance, donc
    // le seul dont on puisse attendre la grille complète.
    const thursday = days.find((d) => d.date === "2026-08-13");
    expect(thursday).toBeDefined();

    const local = thursday!.slots.map((s) => {
      const wc = toWallClock(new Date(s.startUtc), CONFIG.timezone);
      return `${String(wc.hour).padStart(2, "0")}:${String(wc.minute).padStart(2, "0")}`;
    });

    expect(local).toEqual([
      "09:30", "10:00", "10:30", "11:00", "11:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
    ]);
  });

  it("s'arrête avant la fin de plage : un créneau doit tenir entier", () => {
    const days = generateSlots(NOW, [], CONFIG);
    const friday = days.find((d) => d.date === "2026-08-14");
    // Le vendredi finit à 16 h 30, donc le dernier départ est 16 h 00.
    const last = friday!.slots[friday!.slots.length - 1];
    const wc = toWallClock(new Date(last.startUtc), CONFIG.timezone);
    expect(`${wc.hour}:${wc.minute}`).toBe("16:0");
  });

  it("retire les créneaux déjà réservés", () => {
    const before = allSlots(generateSlots(NOW, [], CONFIG));
    const taken = [before[3], before[7]];
    const after = allSlots(generateSlots(NOW, taken, CONFIG));

    expect(after).toHaveLength(before.length - 2);
    expect(after).not.toContain(taken[0]);
    expect(after).not.toContain(taken[1]);
  });

  it("saute entièrement un jour mis en exclusion", () => {
    const config = { ...CONFIG, blackout: ["2026-08-13"] };
    const dates = generateSlots(NOW, [], config).map((d) => d.date);
    expect(dates).not.toContain("2026-08-13");
    expect(dates).toContain("2026-08-12");
  });

  it("ne dépasse pas l'horizon annoncé", () => {
    const days = generateSlots(NOW, [], CONFIG);
    const last = days[days.length - 1].date;
    expect(last <= "2026-08-24").toBe(true);
  });

  it("rend des instants strictement croissants", () => {
    const slots = allSlots(generateSlots(NOW, [], CONFIG));
    const sorted = [...slots].sort();
    expect(slots).toEqual(sorted);
    expect(new Set(slots).size).toBe(slots.length);
  });

  it("garde les mêmes heures locales de part et d'autre du changement d'heure", () => {
    // La bascule a lieu le dimanche 25 octobre 2026 : on se place assez tôt
    // pour que le vendredi 23 et le lundi 26 soient tous deux hors délai.
    const now = new Date("2026-10-20T00:00:00Z");
    const days = generateSlots(now, [], CONFIG);

    const before = days.find((d) => d.date === "2026-10-23");
    const after = days.find((d) => d.date === "2026-10-26");
    expect(before && after).toBeTruthy();

    const firstLocal = (day: (typeof days)[number]) => {
      const wc = toWallClock(new Date(day.slots[0].startUtc), CONFIG.timezone);
      return `${wc.hour}:${wc.minute}`;
    };

    // Même heure au mur, décalage UTC différent : c'est tout l'enjeu.
    expect(firstLocal(before!)).toBe(firstLocal(after!));
    expect(new Date(before!.slots[0].startUtc).getUTCHours()).not.toBe(
      new Date(after!.slots[0].startUtc).getUTCHours(),
    );
  });
});

describe("validateSlot", () => {
  const valid = allSlots(generateSlots(NOW, [], CONFIG))[0];

  it("accepte un créneau issu de la grille", () => {
    expect(validateSlot(valid, NOW, [], CONFIG)).toEqual({ ok: true });
  });

  it("refuse un créneau qui n'est pas dans la grille", () => {
    // Mercredi 3 h 15 du matin : jamais proposé.
    expect(validateSlot("2026-08-12T03:15:00.000Z", NOW, [], CONFIG)).toEqual({
      ok: false,
      reason: "unknown",
    });
  });

  it("refuse un créneau passé", () => {
    expect(validateSlot("2026-08-10T08:00:00.000Z", NOW, [], CONFIG)).toEqual({
      ok: false,
      reason: "past",
    });
  });

  it("refuse un créneau déjà pris", () => {
    expect(validateSlot(valid, NOW, [valid], CONFIG)).toEqual({ ok: false, reason: "taken" });
  });

  it("refuse une valeur qui n'est pas une date", () => {
    expect(validateSlot("bientôt", NOW, [], CONFIG)).toEqual({ ok: false, reason: "unknown" });
    expect(validateSlot("", NOW, [], CONFIG)).toEqual({ ok: false, reason: "unknown" });
  });

  it("refuse un créneau dans le délai de prévenance", () => {
    // Dans 2 heures : l'instant existe dans la grille d'un autre jour mais pas
    // à cette date, donc le moteur ne le propose pas.
    const soon = new Date(NOW.getTime() + 2 * 3_600_000).toISOString();
    expect(validateSlot(soon, NOW, [], CONFIG).ok).toBe(false);
  });
});

describe("slotEnd", () => {
  it("ajoute la durée au début", () => {
    expect(slotEnd("2026-08-12T07:30:00.000Z", 30).toISOString()).toBe("2026-08-12T08:00:00.000Z");
  });
});
