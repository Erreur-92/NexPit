import { Pool, type PoolClient } from "pg";
import type { Locale } from "@/content/types";

/**
 * Stockage.
 *
 * Un document JSON unique, gardé dans Postgres, lu et réécrit sous verrou.
 * Ce choix reste celui d'origine — le site enregistre des inscriptions à une
 * lettre d'information et des rendez-vous, soit quelques écritures par semaine,
 * un volume qui tient dans quelques kilo-octets — mais il corrige les deux
 * limites que la version sur fichier assumait :
 *
 * - Le verrou n'est plus interne au processus. `pg_advisory_xact_lock` est pris
 *   par le serveur de base, donc deux instances de l'application qui écrivent
 *   à la même seconde s'attendent l'une l'autre. Le site peut tourner en
 *   plusieurs exemplaires, ce qu'impose un hébergement en fonctions.
 * - La persistance ne dépend plus du système de fichiers, qui est éphémère sur
 *   ce type d'hébergement.
 *
 * Le verrou est *transactionnel* : il est relâché par COMMIT ou ROLLBACK, sans
 * rien à libérer à la main. C'est aussi le seul type de verrou consultatif qui
 * survive à un pooler en mode transaction, ce qui laisse le choix d'utiliser
 * l'adresse groupée de l'hébergeur.
 *
 * L'interface exposée plus bas est inchangée : `mutate` et `query`. Aucun des
 * appelants n'a eu à bouger.
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

/**
 * Clé du verrou. Arbitraire, mais fixe : toutes les instances doivent demander
 * le même entier pour que le verrou les sérialise entre elles.
 */
const LOCK_KEY = 4_021_197;

/** Identifiant de l'unique ligne du document. */
const ROW_ID = 1;

let pool: Pool | undefined;

/**
 * Initialisation paresseuse. Next évalue le code de premier niveau des modules
 * pendant le build : construire la connexion à l'import ferait échouer
 * `next build` tant que `DATABASE_URL` n'est pas encore renseignée.
 */
function getPool(): Pool {
  if (pool) return pool;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL absente : le stockage ne peut pas démarrer. " +
        "Voir .env.example.",
    );
  }

  pool = new Pool({
    connectionString: url,
    // L'hébergement réutilise les instances entre requêtes, mais leur nombre
    // n'est pas borné : quelques connexions par instance suffisent et évitent
    // d'épuiser le quota de la base.
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    // Postgres géré : TLS obligatoire, certificat émis par une autorité
    // publique. En développement local sur une base sans TLS, on n'impose rien.
    ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: true },
  });

  return pool;
}

let ready: Promise<void> | undefined;

/**
 * Création de la table au premier accès. Idempotent, et pris sous verrou pour
 * que deux instances qui démarrent ensemble ne jouent pas le DDL en même temps.
 */
function ensureSchema(): Promise<void> {
  ready ??= (async () => {
    const client = await getPool().connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT pg_advisory_xact_lock($1)", [LOCK_KEY]);
      await client.query(`
        CREATE TABLE IF NOT EXISTS store (
          id         integer PRIMARY KEY,
          data       jsonb   NOT NULL,
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `);
      await client.query(
        "INSERT INTO store (id, data) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING",
        [ROW_ID, JSON.stringify(EMPTY)],
      );
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK").catch(() => undefined);
      // Une initialisation ratée ne doit pas être mémorisée : la tentative
      // suivante doit pouvoir réessayer plutôt que d'hériter de l'échec.
      ready = undefined;
      throw err;
    } finally {
      client.release();
    }
  })();

  return ready;
}

function parse(raw: unknown): Data {
  const parsed = (raw ?? {}) as Partial<Data>;
  return {
    subscribers: parsed.subscribers ?? [],
    bookings: parsed.bookings ?? [],
  };
}

async function withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  await ensureSchema();
  const client = await getPool().connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

/**
 * Lit, transforme et réécrit en une seule opération non interrompue.
 *
 * Le verrou est demandé avant la lecture : entre le SELECT et l'UPDATE, aucune
 * autre instance ne peut s'intercaler. C'est ce qui permet aux appelants de
 * vérifier une disponibilité et d'écrire dans le même souffle — deux visiteurs
 * qui valident le même créneau ne peuvent pas réserver tous les deux.
 */
export function mutate<T>(fn: (data: Data) => T | Promise<T>): Promise<T> {
  return withClient(async (client) => {
    try {
      await client.query("BEGIN");
      await client.query("SELECT pg_advisory_xact_lock($1)", [LOCK_KEY]);

      const res = await client.query<{ data: unknown }>(
        "SELECT data FROM store WHERE id = $1",
        [ROW_ID],
      );
      const data = parse(res.rows[0]?.data);

      const result = await fn(data);

      await client.query(
        "UPDATE store SET data = $1, updated_at = now() WHERE id = $2",
        [JSON.stringify(data), ROW_ID],
      );
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw err;
    }
  });
}

/**
 * Lecture seule, sans réécriture et sans verrou : Postgres sert un instantané
 * cohérent, et rien ici n'a besoin de bloquer une écriture concurrente.
 */
export function query<T>(fn: (data: Data) => T): Promise<T> {
  return withClient(async (client) => {
    const res = await client.query<{ data: unknown }>(
      "SELECT data FROM store WHERE id = $1",
      [ROW_ID],
    );
    return fn(parse(res.rows[0]?.data));
  });
}
