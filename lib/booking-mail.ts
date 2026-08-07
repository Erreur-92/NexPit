import { site, SITE_URL } from "@/content/site";
import { availability } from "@/content/availability";
import { emails, fill } from "@/content/emails";
import { buildIcs } from "./ics";
import { buildMail, sendMail, type MailResult } from "./mail";
import type { Booking } from "./store";
import { formatDateTimeWithZone, formatTime } from "./time";

/**
 * Emails liés aux rendez-vous. Regroupés ici parce que la confirmation, le
 * report, l'annulation et le rappel partagent le même bloc d'informations :
 * les faire diverger produirait des messages qui se contredisent.
 *
 * Les formulations vivent dans content/emails.ts ; ce fichier ne s'occupe que
 * de l'assemblage et des pièces jointes.
 */

const B = emails.booking;

export function manageUrl(booking: Booking): string {
  return `${SITE_URL}/${booking.locale}/rendez-vous/${booking.id}?token=${encodeURIComponent(booking.token)}`;
}

function icsFor(booking: Booking, method: "REQUEST" | "CANCEL") {
  const start = new Date(booking.startUtc);
  const end = new Date(start.getTime() + booking.durationMin * 60_000);
  const url = manageUrl(booking);

  return buildIcs({
    uid: `${booking.id}@nexpit.fr`,
    start,
    end,
    summary: `NexPit — ${booking.name}`,
    description: [
      fill(B.icsSubjectLine[booking.locale], { subject: booking.subject }),
      "",
      fill(B.icsManageLine[booking.locale], { url }),
    ].join("\n"),
    organizerName: "NexPit",
    organizerEmail: site.email.contact,
    attendeeName: booking.name,
    attendeeEmail: booking.email,
    url,
    sequence: booking.sequence,
    method,
  });
}

function specRows(booking: Booking, tz: string) {
  const start = new Date(booking.startUtc);
  const end = new Date(start.getTime() + booking.durationMin * 60_000);
  const l = booking.locale;

  return [
    [
      B.rows.when[l],
      `${formatDateTimeWithZone(start, tz, l)} → ${formatTime(end, tz, l)}`,
    ],
    [B.rows.duration[l], `${booking.durationMin} min`],
    [B.rows.timezone[l], tz],
    [B.rows.reference[l], booking.id],
  ] as const;
}

/** Confirmation envoyée au visiteur, avec invitation calendrier attachée. */
export async function sendBookingConfirmation(
  booking: Booking,
  variant: "created" | "rescheduled",
): Promise<MailResult> {
  const l = booking.locale;
  const title = variant === "created" ? B.confirmedTitle[l] : B.rescheduledTitle[l];

  const mail = buildMail(
    title,
    [
      { type: "para", text: fill(B.confirmedBody[l], { name: booking.name }) },
      { type: "spec", rows: specRows(booking, booking.timezone) },
      { type: "quote", text: booking.subject },
      { type: "action", href: manageUrl(booking), label: B.manageAction[l] },
      { type: "note", text: B.manageNote[l] },
    ],
    `NexPit — ${SITE_URL}`,
  );

  return sendMail({
    to: booking.email,
    subject: `${title} — ${booking.id}`,
    text: mail.text,
    html: mail.html,
    replyTo: site.email.contact,
    attachments: [
      {
        filename: "nexpit.ics",
        content: icsFor(booking, "REQUEST"),
        contentType: "text/calendar",
        method: "REQUEST",
      },
    ],
  });
}

/** Notification interne : ce que NexPit doit lire avant l'échange. */
export async function sendBookingNotice(
  booking: Booking,
  variant: "created" | "rescheduled" | "cancelled",
): Promise<MailResult> {
  const N = B.notice;
  const label = N[variant];

  const mail = buildMail(
    `${label} — ${booking.name}`,
    [
      {
        type: "spec",
        rows: [
          [N.rows.person, booking.name],
          [N.rows.email, booking.email],
          ...(booking.company ? ([[N.rows.company, booking.company]] as const) : []),
          ...specRows(booking, availability.timezone),
          [N.rows.visitorTimezone, booking.timezone],
          [N.rows.status, booking.status],
        ],
      },
      { type: "quote", text: booking.subject },
    ],
    N.footer,
  );

  return sendMail({
    to: site.email.notify,
    subject: `RDV ${label.toLowerCase()} — ${booking.name} — ${booking.id}`,
    text: mail.text,
    html: mail.html,
    replyTo: booking.email,
  });
}

/** Rappel envoyé la veille. */
export async function sendBookingReminder(booking: Booking): Promise<MailResult> {
  const l = booking.locale;
  const mail = buildMail(
    B.reminderTitle[l],
    [
      { type: "para", text: fill(B.reminderBody[l], { name: booking.name }) },
      { type: "spec", rows: specRows(booking, booking.timezone) },
      { type: "action", href: manageUrl(booking), label: B.manageAction[l] },
    ],
    `NexPit — ${SITE_URL}`,
  );

  return sendMail({
    to: booking.email,
    subject: B.reminderSubject[l],
    text: mail.text,
    html: mail.html,
    replyTo: site.email.contact,
  });
}

/** Annulation : confirme au visiteur et retire l'événement de son agenda. */
export async function sendBookingCancellation(booking: Booking): Promise<MailResult> {
  const l = booking.locale;
  const mail = buildMail(
    B.cancelledTitle[l],
    [
      { type: "para", text: B.cancelledBody[l] },
      { type: "spec", rows: specRows(booking, booking.timezone) },
      {
        type: "para",
        text: fill(B.cancelledRebook[l], { url: `${SITE_URL}/${l}/rendez-vous` }),
      },
    ],
    `NexPit — ${SITE_URL}`,
  );

  return sendMail({
    to: booking.email,
    subject: `${B.cancelledTitle[l]} — ${booking.id}`,
    text: mail.text,
    html: mail.html,
    replyTo: site.email.contact,
    attachments: [
      {
        filename: "nexpit.ics",
        content: icsFor(booking, "CANCEL"),
        contentType: "text/calendar",
        method: "CANCEL",
      },
    ],
  });
}
