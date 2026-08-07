import { toIcsUtc } from "./time";

/**
 * Génération d'invitations calendrier (RFC 5545).
 *
 * Écrite à la main plutôt qu'importée : le format tient en une centaine de
 * lignes, et les deux points qui font échouer un import — le pliage à 75
 * octets et l'échappement des séparateurs — sont précisément ce qu'une
 * dépendance masquerait le jour où ça ne marche pas.
 */

export type IcsEvent = {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
  description: string;
  organizerName: string;
  organizerEmail: string;
  attendeeName: string;
  attendeeEmail: string;
  url?: string;
  /** Incrémenté à chaque modification d'un même UID. */
  sequence: number;
  method: "REQUEST" | "CANCEL";
};

/** Échappe les caractères qui ont un sens structurel dans un fichier iCalendar. */
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Plie les lignes à 75 octets, pas 75 caractères : un « é » en compte deux, et
 * couper au milieu d'une séquence UTF-8 produit un fichier que certains
 * clients refusent d'ouvrir.
 */
function fold(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;

  const out: string[] = [];
  let start = 0;
  let limit = 75;

  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // Recule tant qu'on est au milieu d'un caractère multioctet.
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) {
      end -= 1;
    }
    out.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
    limit = 74; // les lignes suivantes commencent par une espace
  }

  return out.join("\r\n ");
}

export function buildIcs(event: IcsEvent): string {
  const now = new Date();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NexPit//Rendez-vous//FR",
    "CALSCALE:GREGORIAN",
    `METHOD:${event.method}`,
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${toIcsUtc(now)}`,
    `DTSTART:${toIcsUtc(event.start)}`,
    `DTEND:${toIcsUtc(event.end)}`,
    `SEQUENCE:${event.sequence}`,
    `STATUS:${event.method === "CANCEL" ? "CANCELLED" : "CONFIRMED"}`,
    `SUMMARY:${esc(event.summary)}`,
    `DESCRIPTION:${esc(event.description)}`,
    `ORGANIZER;CN=${esc(event.organizerName)}:mailto:${event.organizerEmail}`,
    `ATTENDEE;CN=${esc(event.attendeeName)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${event.attendeeEmail}`,
    ...(event.url ? [`URL:${event.url}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  // CRLF obligatoire : quelques clients rejettent un fichier en LF seul.
  return `${lines.map(fold).join("\r\n")}\r\n`;
}
