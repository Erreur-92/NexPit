import { describe, expect, it } from "vitest";
import {
  addDaysIso,
  fromWallClock,
  isValidTimeZone,
  isoDateIn,
  offsetAt,
  parseClock,
  parseIsoDate,
  toIcsUtc,
  toWallClock,
  weekdayIn,
} from "@/lib/time";

/**
 * Les conversions de fuseau sont l'endroit où un site de prise de rendez-vous
 * se casse silencieusement : personne ne remarque un décalage d'une heure
 * avant le jour du changement d'heure. D'où l'insistance sur les deux dates
 * de bascule.
 */

const PARIS = "Europe/Paris";

describe("offsetAt", () => {
  it("rend +1 h en heure d'hiver et +2 h en heure d'été à Paris", () => {
    expect(offsetAt(new Date("2026-01-15T12:00:00Z"), PARIS)).toBe(3_600_000);
    expect(offsetAt(new Date("2026-07-15T12:00:00Z"), PARIS)).toBe(7_200_000);
  });

  it("rend zéro pour UTC", () => {
    expect(offsetAt(new Date("2026-07-15T12:00:00Z"), "UTC")).toBe(0);
  });

  it("suit les fuseaux à décalage non entier", () => {
    // Katmandou est à +5 h 45.
    expect(offsetAt(new Date("2026-07-15T12:00:00Z"), "Asia/Kathmandu")).toBe(
      5 * 3_600_000 + 45 * 60_000,
    );
  });
});

describe("fromWallClock", () => {
  it("convertit une heure locale d'hiver en UTC", () => {
    const d = fromWallClock({ year: 2026, month: 1, day: 15, hour: 10, minute: 30 }, PARIS);
    expect(d.toISOString()).toBe("2026-01-15T09:30:00.000Z");
  });

  it("convertit une heure locale d'été en UTC", () => {
    const d = fromWallClock({ year: 2026, month: 7, day: 15, hour: 10, minute: 30 }, PARIS);
    expect(d.toISOString()).toBe("2026-07-15T08:30:00.000Z");
  });

  it("gère la veille et le lendemain du passage à l'heure d'été", () => {
    // Bascule le dimanche 29 mars 2026 à 02:00 locale.
    const before = fromWallClock({ year: 2026, month: 3, day: 28, hour: 9, minute: 30 }, PARIS);
    const after = fromWallClock({ year: 2026, month: 3, day: 30, hour: 9, minute: 30 }, PARIS);
    expect(before.toISOString()).toBe("2026-03-28T08:30:00.000Z");
    expect(after.toISOString()).toBe("2026-03-30T07:30:00.000Z");
  });

  it("gère la veille et le lendemain du passage à l'heure d'hiver", () => {
    // Bascule le dimanche 25 octobre 2026 à 03:00 locale.
    const before = fromWallClock({ year: 2026, month: 10, day: 24, hour: 9, minute: 30 }, PARIS);
    const after = fromWallClock({ year: 2026, month: 10, day: 26, hour: 9, minute: 30 }, PARIS);
    expect(before.toISOString()).toBe("2026-10-24T07:30:00.000Z");
    expect(after.toISOString()).toBe("2026-10-26T08:30:00.000Z");
  });

  it("fait l'aller-retour sans dérive sur toute une année", () => {
    for (let month = 1; month <= 12; month += 1) {
      const wc = { year: 2026, month, day: 15, hour: 14, minute: 0 };
      const utc = fromWallClock(wc, PARIS);
      const back = toWallClock(utc, PARIS);
      expect(back).toEqual({ ...wc });
    }
  });

  it("fait l'aller-retour dans un fuseau de l'autre hémisphère", () => {
    // Sydney décale dans l'autre sens : bon détecteur d'un signe inversé.
    for (const month of [1, 4, 7, 10]) {
      const wc = { year: 2026, month, day: 15, hour: 9, minute: 30 };
      const utc = fromWallClock(wc, "Australia/Sydney");
      expect(toWallClock(utc, "Australia/Sydney")).toEqual({ ...wc });
    }
  });
});

describe("isoDateIn", () => {
  it("rend le jour observé dans le fuseau, pas celui de l'UTC", () => {
    // 23 h 30 UTC le 10 août, c'est déjà le 11 à Paris.
    expect(isoDateIn(new Date("2026-08-10T23:30:00Z"), PARIS)).toBe("2026-08-11");
    expect(isoDateIn(new Date("2026-08-10T23:30:00Z"), "UTC")).toBe("2026-08-10");
    // Et encore le 10 à New York.
    expect(isoDateIn(new Date("2026-08-10T23:30:00Z"), "America/New_York")).toBe("2026-08-10");
  });

  it("passe minuit correctement", () => {
    expect(isoDateIn(new Date("2026-08-10T22:00:00Z"), PARIS)).toBe("2026-08-11");
  });
});

describe("weekdayIn", () => {
  it("rend 1 pour un lundi et 0 pour un dimanche", () => {
    expect(weekdayIn(new Date("2026-08-10T12:00:00Z"), "UTC")).toBe(1);
    expect(weekdayIn(new Date("2026-08-09T12:00:00Z"), "UTC")).toBe(0);
    expect(weekdayIn(new Date("2026-08-15T12:00:00Z"), "UTC")).toBe(6);
  });
});

describe("addDaysIso", () => {
  it("franchit les fins de mois et les années bissextiles", () => {
    expect(addDaysIso("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDaysIso("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDaysIso("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDaysIso("2026-02-28", 1)).toBe("2026-03-01");
  });
});

describe("parseIsoDate", () => {
  it("accepte une date valide", () => {
    expect(parseIsoDate("2026-08-10")).toEqual({ year: 2026, month: 8, day: 10 });
  });

  it("refuse les dates qui n'existent pas", () => {
    expect(parseIsoDate("2026-02-31")).toBeNull();
    expect(parseIsoDate("2026-13-01")).toBeNull();
    expect(parseIsoDate("2026-00-10")).toBeNull();
    expect(parseIsoDate("10/08/2026")).toBeNull();
    expect(parseIsoDate("")).toBeNull();
  });
});

describe("parseClock", () => {
  it("accepte une heure valide", () => {
    expect(parseClock("09:30")).toEqual({ hour: 9, minute: 30 });
    expect(parseClock("23:59")).toEqual({ hour: 23, minute: 59 });
  });

  it("refuse une heure hors bornes ou mal formée", () => {
    expect(parseClock("24:00")).toBeNull();
    expect(parseClock("09:60")).toBeNull();
    expect(parseClock("9h30")).toBeNull();
  });
});

describe("isValidTimeZone", () => {
  it("accepte les identifiants IANA connus", () => {
    expect(isValidTimeZone("Europe/Paris")).toBe(true);
    expect(isValidTimeZone("UTC")).toBe(true);
  });

  it("refuse le reste", () => {
    expect(isValidTimeZone("Mars/Olympus")).toBe(false);
    expect(isValidTimeZone("")).toBe(false);
    expect(isValidTimeZone("A".repeat(200))).toBe(false);
  });
});

describe("toIcsUtc", () => {
  it("formate en horodatage iCalendar UTC", () => {
    expect(toIcsUtc(new Date("2026-08-12T13:30:00Z"))).toBe("20260812T133000Z");
    expect(toIcsUtc(new Date("2026-01-02T03:04:05Z"))).toBe("20260102T030405Z");
  });
});
