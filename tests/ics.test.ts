import { describe, expect, it } from "vitest";
import { buildIcs, type IcsEvent } from "@/lib/ics";

const base: IcsEvent = {
  uid: "abc123@nexpit.fr",
  start: new Date("2026-08-12T07:30:00Z"),
  end: new Date("2026-08-12T08:00:00Z"),
  summary: "NexPit — Camille Rousseau",
  description: "Sujet : acquisition CAN",
  organizerName: "NexPit",
  organizerEmail: "contact@nexpit.fr",
  attendeeName: "Camille Rousseau",
  attendeeEmail: "camille@equipementier.fr",
  sequence: 0,
  method: "REQUEST",
};

const lines = (ics: string) => ics.split("\r\n");

describe("buildIcs", () => {
  it("produit une enveloppe iCalendar complète", () => {
    const l = lines(buildIcs(base));
    expect(l[0]).toBe("BEGIN:VCALENDAR");
    expect(l).toContain("VERSION:2.0");
    expect(l).toContain("BEGIN:VEVENT");
    expect(l).toContain("END:VEVENT");
    expect(l).toContain("END:VCALENDAR");
  });

  it("n'utilise que des fins de ligne CRLF", () => {
    const ics = buildIcs(base);
    expect(ics.includes("\r\n")).toBe(true);
    expect(ics.replace(/\r\n/g, "")).not.toContain("\n");
  });

  it("écrit les horodatages en UTC", () => {
    const ics = buildIcs(base);
    expect(ics).toContain("DTSTART:20260812T073000Z");
    expect(ics).toContain("DTEND:20260812T080000Z");
  });

  it("échappe les séparateurs qui casseraient le format", () => {
    const ics = buildIcs({
      ...base,
      description: "Ligne 1\nLigne 2; avec point-virgule, et virgule\\et antislash",
    });
    const line = lines(ics).find((l) => l.startsWith("DESCRIPTION:"));
    expect(line).toBeDefined();
    expect(ics).toContain("\\n");
    expect(ics).toContain("\\;");
    expect(ics).toContain("\\,");
    expect(ics).toContain("\\\\");
  });

  it("plie les lignes trop longues avec une continuation en espace", () => {
    const ics = buildIcs({ ...base, description: "x".repeat(400) });
    for (const line of lines(ics)) {
      if (line === "") continue;
      expect(Buffer.from(line, "utf8").length).toBeLessThanOrEqual(76);
    }
    // Les lignes de continuation commencent bien par une espace.
    const folded = lines(ics).filter((l) => l.startsWith(" "));
    expect(folded.length).toBeGreaterThan(0);
  });

  it("ne coupe jamais au milieu d'un caractère accentué", () => {
    const ics = buildIcs({ ...base, description: "é".repeat(200) });
    // Un dépliage doit restituer exactement la chaîne d'origine.
    const unfolded = ics.replace(/\r\n /g, "");
    expect(unfolded).toContain("é".repeat(200));
    for (const line of lines(ics)) {
      expect(Buffer.from(line, "utf8").length).toBeLessThanOrEqual(76);
    }
  });

  it("marque l'annulation avec la bonne méthode et le bon statut", () => {
    const ics = buildIcs({ ...base, method: "CANCEL", sequence: 2 });
    expect(ics).toContain("METHOD:CANCEL");
    expect(ics).toContain("STATUS:CANCELLED");
    expect(ics).toContain("SEQUENCE:2");
  });

  it("garde le même UID entre la demande et l'annulation", () => {
    const request = buildIcs(base);
    const cancel = buildIcs({ ...base, method: "CANCEL", sequence: 1 });
    expect(request).toContain("UID:abc123@nexpit.fr");
    expect(cancel).toContain("UID:abc123@nexpit.fr");
  });

  it("porte l'organisateur et le participant", () => {
    const ics = buildIcs(base);
    expect(ics).toContain("mailto:contact@nexpit.fr");
    expect(ics).toContain("mailto:camille@equipementier.fr");
  });
});
