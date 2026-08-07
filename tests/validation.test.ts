import { describe, expect, it } from "vitest";
import {
  HONEYPOT_FIELD,
  fieldErrors,
  isHoneypotFilled,
  makeBookingSchema,
  makeContactSchema,
  makeNewsletterSchema,
} from "@/lib/validation";

const good = {
  name: "Camille Rousseau",
  email: "camille@equipementier.fr",
  company: "Équipementier SA",
  subject: "Acquisition CAN sur banc",
  message:
    "Nous cherchons à enregistrer huit canaux CAN sur un banc d'essai, avec horodatage commun.",
  consent: true as const,
};

describe("schéma de contact", () => {
  it("accepte une demande complète", () => {
    const r = makeContactSchema("fr").safeParse(good);
    expect(r.success).toBe(true);
  });

  it("accepte une société vide", () => {
    const r = makeContactSchema("fr").safeParse({ ...good, company: "" });
    expect(r.success).toBe(true);
  });

  it("refuse une adresse invalide", () => {
    const r = makeContactSchema("fr").safeParse({ ...good, email: "camille@" });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).email).toBe("Cette adresse email n'est pas valide.");
  });

  it("refuse un message trop court", () => {
    const r = makeContactSchema("fr").safeParse({ ...good, message: "Bonjour" });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).message).toContain("trop court");
  });

  it("refuse un message trop long", () => {
    const r = makeContactSchema("fr").safeParse({ ...good, message: "a".repeat(5001) });
    expect(r.success).toBe(false);
  });

  it("refuse l'absence de consentement", () => {
    const r = makeContactSchema("fr").safeParse({ ...good, consent: false });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).consent).toContain("accord");
  });

  it("rend les messages dans la langue demandée", () => {
    const fr = makeContactSchema("fr").safeParse({ ...good, name: "" });
    const en = makeContactSchema("en").safeParse({ ...good, name: "" });
    expect(fr.success).toBe(false);
    expect(en.success).toBe(false);
    if (!fr.success && !en.success) {
      expect(fieldErrors(fr.error).name).toBe("Indiquez votre nom.");
      expect(fieldErrors(en.error).name).toBe("Enter your name.");
    }
  });

  it("nettoie les espaces autour des valeurs", () => {
    const r = makeContactSchema("fr").safeParse({ ...good, name: "  Camille  " });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.name).toBe("Camille");
  });

  it("refuse un nom démesuré", () => {
    const r = makeContactSchema("fr").safeParse({ ...good, name: "a".repeat(121) });
    expect(r.success).toBe(false);
  });
});

describe("schéma newsletter", () => {
  it("accepte une adresse valide", () => {
    expect(makeNewsletterSchema("fr").safeParse({ email: "a@b.fr" }).success).toBe(true);
  });

  it("refuse une adresse vide", () => {
    const r = makeNewsletterSchema("fr").safeParse({ email: "" });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).email).toBe("Indiquez votre adresse email.");
  });
});

describe("schéma de rendez-vous", () => {
  const booking = {
    name: "Camille Rousseau",
    email: "camille@equipementier.fr",
    company: "",
    subject:
      "Nous voulons instrumenter un véhicule de développement et relire les données trois ans plus tard.",
    slot: "2026-08-12T07:30:00.000Z",
    timezone: "Europe/Paris",
    consent: true as const,
  };

  it("accepte une réservation complète", () => {
    expect(makeBookingSchema("fr").safeParse(booking).success).toBe(true);
  });

  it("refuse un fuseau horaire inconnu", () => {
    const r = makeBookingSchema("fr").safeParse({ ...booking, timezone: "Mars/Olympus" });
    expect(r.success).toBe(false);
  });

  it("refuse un créneau qui n'est pas une date", () => {
    const r = makeBookingSchema("fr").safeParse({ ...booking, slot: "demain" });
    expect(r.success).toBe(false);
  });

  it("exige un sujet développé", () => {
    const r = makeBookingSchema("fr").safeParse({ ...booking, subject: "Un projet" });
    expect(r.success).toBe(false);
  });
});

describe("pot de miel", () => {
  it("détecte un champ rempli", () => {
    const form = new FormData();
    form.set(HONEYPOT_FIELD, "https://spam.example");
    expect(isHoneypotFilled(form)).toBe(true);
  });

  it("laisse passer un champ vide ou absent", () => {
    const empty = new FormData();
    expect(isHoneypotFilled(empty)).toBe(false);
    empty.set(HONEYPOT_FIELD, "   ");
    expect(isHoneypotFilled(empty)).toBe(false);
  });
});

describe("fieldErrors", () => {
  it("ne garde que la première erreur par champ", () => {
    const r = makeContactSchema("fr").safeParse({ name: "", email: "", subject: "", message: "", consent: false });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = fieldErrors(r.error);
      expect(Object.keys(errors).sort()).toEqual(["consent", "email", "message", "name", "subject"]);
      expect(Object.values(errors).every((v) => typeof v === "string" && v.length > 0)).toBe(true);
    }
  });
});
