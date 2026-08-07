/**
 * Conversions de fuseau horaire, sans dépendance.
 *
 * Tout repose sur `Intl.DateTimeFormat`, qui embarque la base IANA du
 * moteur JavaScript. C'est la seule source de vérité disponible côté serveur
 * comme côté navigateur, et elle connaît les changements d'heure passés et à
 * venir — ce qu'une conversion à décalage fixe ne sait pas faire.
 *
 * Convention interne : tout instant est manipulé en UTC. Un fuseau n'apparaît
 * qu'au moment de composer une heure locale ou de l'afficher.
 */

export type WallClock = {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number;
};

const partsCache = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string): Intl.DateTimeFormat {
  let f = partsCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    partsCache.set(timeZone, f);
  }
  return f;
}

/** Vrai si le moteur reconnaît ce fuseau. Sert à valider une entrée client. */
export function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone || timeZone.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** Heure murale observée dans `timeZone` à l'instant `date`. */
export function toWallClock(date: Date, timeZone: string): WallClock {
  const parts = formatter(timeZone).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes): number => {
    const p = parts.find((x) => x.type === type);
    return p ? Number(p.value) : 0;
  };
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    // hourCycle h23 borne à 0-23, mais certains moteurs rendent encore 24 à
    // minuit : le modulo évite un décalage d'un jour ce jour-là.
    hour: get("hour") % 24,
    minute: get("minute"),
  };
}

/** Décalage du fuseau, en millisecondes, à l'instant donné. */
export function offsetAt(date: Date, timeZone: string): number {
  const parts = formatter(timeZone).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes): number => {
    const p = parts.find((x) => x.type === type);
    return p ? Number(p.value) : 0;
  };
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second"),
  );
  // formatToParts s'arrête à la seconde : on compare à la même résolution.
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/**
 * Instant UTC correspondant à une heure murale dans un fuseau.
 *
 * La première estimation utilise le décalage tel qu'il serait si l'heure
 * murale était déjà de l'UTC. Une seconde passe corrige les cas où cette
 * estimation tombe de l'autre côté d'un changement d'heure.
 *
 * Cas limites du printemps : 2 h 30 n'existe pas le jour où l'on passe de 2 h
 * à 3 h. La fonction rend alors l'instant qui suit le saut, ce qui est le
 * comportement attendu — le créneau correspondant est de toute façon écarté
 * en amont par la grille de disponibilités.
 */
export function fromWallClock(wc: WallClock, timeZone: string): Date {
  const naive = Date.UTC(wc.year, wc.month - 1, wc.day, wc.hour, wc.minute, 0, 0);
  const firstGuess = naive - offsetAt(new Date(naive), timeZone);
  const correctedOffset = offsetAt(new Date(firstGuess), timeZone);
  return new Date(naive - correctedOffset);
}

/** Jour ISO (AAAA-MM-JJ) observé dans `timeZone` à l'instant `date`. */
export function isoDateIn(date: Date, timeZone: string): string {
  const wc = toWallClock(date, timeZone);
  return `${wc.year}-${pad(wc.month)}-${pad(wc.day)}`;
}

/** Jour de la semaine dans `timeZone` : 0 = dimanche, 6 = samedi. */
export function weekdayIn(date: Date, timeZone: string): number {
  const wc = toWallClock(date, timeZone);
  // Date.UTC + getUTCDay donne le jour de la semaine du calendrier civil,
  // indépendamment du fuseau du serveur.
  return new Date(Date.UTC(wc.year, wc.month - 1, wc.day)).getUTCDay();
}

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Ajoute des jours à une date ISO (AAAA-MM-JJ), sans passer par un fuseau. */
export function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`;
}

export function parseIsoDate(iso: string): { year: number; month: number; day: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  // Rejette le 31 février et consorts.
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) return null;
  return { year, month, day };
}

/** "09:30" -> { hour: 9, minute: 30 } */
export function parseClock(value: string): { hour: number; minute: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

/* -------------------------------------------------------------------------- */
/* Affichage                                                                   */
/* -------------------------------------------------------------------------- */

const localeTag = (locale: string) => (locale === "fr" ? "fr-FR" : "en-GB");

export function formatDateLong(date: Date, timeZone: string, locale: string): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTime(date: Date, timeZone: string, locale: string): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateTimeWithZone(date: Date, timeZone: string, locale: string): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

/** Horodatage iCalendar en UTC : 20260812T133000Z */
export function toIcsUtc(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}
