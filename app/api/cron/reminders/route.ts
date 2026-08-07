import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { sendBookingReminder } from "@/lib/booking-mail";
import { mutate, type Booking } from "@/lib/store";

/**
 * Rappels de rendez-vous.
 *
 * Route à appeler périodiquement — toutes les heures suffit. Elle est
 * idempotente : un rendez-vous déjà rappelé porte `reminderSentAt` et n'est
 * pas repris, donc l'appeler dix fois n'envoie pas dix emails.
 *
 * Pas de planificateur embarqué dans l'application : un `setInterval` dans un
 * processus Next disparaît au redémarrage sans que personne ne le remarque.
 * Une route appelée de l'extérieur échoue bruyamment, ce qui est préférable.
 * Voir le README pour le branchement (cron système, cron de l'hébergeur, ou
 * service de cron gratuit).
 */

/** Fenêtre d'envoi : entre 30 h et 6 h avant le rendez-vous. */
const WINDOW_MIN_MS = 6 * 3600_000;
const WINDOW_MAX_MS = 30 * 3600_000;

function authorized(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;

  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET) {
    console.error("[cron] CRON_SECRET absent : la route des rappels est désactivée");
    return NextResponse.json({ error: "cron non configuré" }, { status: 503 });
  }

  if (!authorized(request)) {
    return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  }

  try {
    const now = Date.now();

    // On réserve d'abord les rendez-vous à rappeler en les marquant, puis on
    // envoie. Marquer après l'envoi rouvrirait une fenêtre de double envoi si
    // deux appels se chevauchent.
    const due = await mutate((data) => {
      const picked: Booking[] = [];
      for (const booking of data.bookings) {
        if (booking.status !== "confirmed" || booking.reminderSentAt) continue;
        const delta = Date.parse(booking.startUtc) - now;
        if (delta > WINDOW_MIN_MS && delta <= WINDOW_MAX_MS) {
          booking.reminderSentAt = new Date().toISOString();
          picked.push({ ...booking });
        }
      }
      return picked;
    });

    let sent = 0;
    const failed: string[] = [];

    for (const booking of due) {
      const result = await sendBookingReminder(booking);
      if (result.ok) {
        sent += 1;
      } else {
        failed.push(booking.id);
        console.error("[cron] rappel non envoyé pour", booking.id, "—", result.detail);
        // L'envoi a échoué : on rouvre le rappel pour la prochaine passe.
        await mutate((data) => {
          const target = data.bookings.find((b) => b.id === booking.id);
          if (target) target.reminderSentAt = undefined;
        });
      }
    }

    return NextResponse.json({ considered: due.length, sent, failed });
  } catch (err) {
    console.error("[cron] passe de rappels en échec —", err);
    return NextResponse.json({ error: "échec interne" }, { status: 500 });
  }
}
