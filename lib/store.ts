import { promises as fs } from "node:fs";
import path from "node:path";
import type { Locale } from "@/content/types";

/**
 * Stockage.
 *
 * Un fichier JSON, écrit de façon atomique, sérialisé par une file d'attente
 * en mémoire. Ce choix est délibéré : le site enregistre des inscriptions à
 * une lettre d'information et des rendez-vous, soit quelques écritures par
 * semaine. Une base relationnelle ajouterait une dépendance native à la chaîne
 * de déploiement pour un volume qui tient dans un fichier de quelques kilo-octets.
 *
 * Deux limites, assumées et documentées dans le README :
 *
 * - Le verrou est interne au processus. Le site doit tourner en une seule
 *   instance Node. C'est le cas d'un déploiement classique (`next start`
 *   derrière un reverse proxy), pas d'un déploiement en fonctions sans état.
 * - Le système de fichiers doit être persistant. Sur une plateforme au
 *   système de fichiers éphémère, il faut remplacer ce module : l'interface
 *   exposée plus bas tient en six fonctions.
 */

export type SubscriberStatus = "pending" | "confirmed";

export type Subscriber = {
  email: string;
  status: SubscriberStatus;
  /** Jeton du lien de confirmation, à usage unique. */
  confirmToken: string;
  /** Jeton du lien de désinscription, valable tant que l'inscription existe. */
  unsubscribeToken: string;
  locale: Locale;
  createdAt: string;
  confirmedAt?: string;
};

export type BookingStatus = "confirmed" | "cancelled";

export type Booking = {
  id: string;
  /** Secret permettant d'annuler ou de reporter sans compte utilisateur. */
  token: string;
  startUtc: string;
  durationMin: number;
  name: string;
  email: string;
  company?: string;
  subject: string;
  /** Fuseau déclaré par le navigateur du visiteur, pour lui réafficher son heure. */
  timezone: string;
  locale: Locale;
  status: BookingStatus;
  createdAt: string;
  cancelledAt?: string;
  reminderSentAt?: string;
  /** Numéro de séquence iCalendar : incrémenté à chaque report. */
  sequence: number;
};

type Data = {
  subscribers: Subscriber[];
  bookings: Booking[];
};

const EMPTY: Data = { subscribers: [], bookings: [] };

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "nexpit.json");

/** File d'attente : toute opération passe par ici, jamais deux en parallèle. */
let queue: Promise<unknown> = Promise.resolve();

function serialize<T>(op: () => Promise<T>): Promise<T> {
  const run = queue.then(op, op);
  // La file ne doit jamais rester en état rejeté, sinon toute écriture
  // ultérieure échouerait pour la faute d'une précédente.
  queue = run.catch(() => undefined);
  return run;
}

async function readData(): Promise<Data> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<Data>;
    return {
      subscribers: parsed.subscribers ?? [],
      bookings: parsed.bookings ?? [],
    };
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return { ...EMPTY };
    // Un fichier illisible ou corrompu doit remonter : l'écraser silencieusement
    // reviendrait à perdre les rendez-vous déjà pris.
    throw err;
  }
}

async function writeData(data: Data): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  // rename est atomique sur le même système de fichiers : à aucun instant le
  // fichier de données n'existe à l'état partiel.
  await fs.rename(tmp, DATA_FILE);
}

/** Lit, transforme et réécrit en une seule opération non interrompue. */
export function mutate<T>(fn: (data: Data) => T | Promise<T>): Promise<T> {
  return serialize(async () => {
    const data = await readData();
    const result = await fn(data);
    await writeData(data);
    return result;
  });
}

/** Lecture seule, sans réécriture. */
export function query<T>(fn: (data: Data) => T): Promise<T> {
  return serialize(async () => fn(await readData()));
}
