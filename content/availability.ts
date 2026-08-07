/**
 * Disponibilités pour la prise de rendez-vous.
 *
 * C'est le seul fichier à modifier pour changer les horaires : les plages sont
 * exprimées en heure locale de NexPit, et le moteur se charge de les convertir
 * dans le fuseau du visiteur, changements d'heure compris.
 */

export type TimeRange = readonly [start: string, end: string];

export type Availability = {
  /** Fuseau de référence de NexPit. Les plages ci-dessous s'y rapportent. */
  readonly timezone: string;
  /** Durée d'un rendez-vous, en minutes. */
  readonly durationMin: number;
  /** Pas de la grille : deux créneaux consécutifs sont espacés de cette durée. */
  readonly stepMin: number;
  /** Délai minimum entre l'instant présent et le début d'un rendez-vous. */
  readonly leadTimeHours: number;
  /** Nombre de jours ouverts à la réservation à partir d'aujourd'hui. */
  readonly horizonDays: number;
  /** Plages hebdomadaires. Clé : 0 = dimanche, 1 = lundi, … 6 = samedi. */
  readonly weekly: Readonly<Record<number, readonly TimeRange[]>>;
  /** Jours entièrement fermés, au format AAAA-MM-JJ. */
  readonly blackout: readonly string[];
};

export const availability: Availability = {
  timezone: "Europe/Paris",
  durationMin: 30,
  stepMin: 30,
  leadTimeHours: 24,
  horizonDays: 14,
  weekly: {
    0: [], // dimanche
    1: [["09:30", "12:00"], ["14:00", "17:30"]],
    2: [["09:30", "12:00"], ["14:00", "17:30"]],
    3: [["09:30", "12:00"], ["14:00", "17:30"]],
    4: [["09:30", "12:00"], ["14:00", "17:30"]],
    5: [["09:30", "12:00"], ["14:00", "16:30"]],
    6: [], // samedi
  },
  blackout: [],
};
