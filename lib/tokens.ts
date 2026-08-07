import { randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Jetons de lien : confirmation d'inscription, désinscription, annulation et
 * report de rendez-vous.
 *
 * Ils remplacent un compte utilisateur. Quelqu'un qui reçoit le lien peut
 * agir, ce qui est exactement l'intention : on ne demande pas à un prospect
 * de créer un mot de passe pour annuler trente minutes de visioconférence.
 * 192 bits d'entropie rendent la découverte par tâtonnement inutile, et les
 * liens ne sont jamais indexés (voir app/robots.ts).
 */

export function newToken(): string {
  return randomBytes(24).toString("base64url");
}

export function newId(): string {
  return randomBytes(8).toString("base64url");
}

/** Comparaison à durée constante : évite de fuiter le jeton octet par octet. */
export function tokenEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
