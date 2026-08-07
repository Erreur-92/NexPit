/**
 * Retour commun à toutes les actions de formulaire.
 *
 * `fields` porte les erreurs champ par champ, `message` porte ce qui s'affiche
 * en tête de formulaire. Un échec n'est jamais silencieux : chaque chemin de
 * sortie des actions renvoie l'un de ces états, y compris les cas d'erreur
 * serveur.
 */
export type FormState =
  | { status: "idle" }
  | { status: "ok"; message: string }
  | { status: "error"; message: string; fields?: Record<string, string> };

export const idle: FormState = { status: "idle" };

export const ok = (message: string): FormState => ({ status: "ok", message });

export const fail = (message: string, fields?: Record<string, string>): FormState => ({
  status: "error",
  message,
  fields,
});
