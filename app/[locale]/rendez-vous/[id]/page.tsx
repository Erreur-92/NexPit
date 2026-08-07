import type { Metadata } from "next";
import Link from "next/link";
import { BookingWidget } from "@/components/booking-widget";
import { CancelBookingForm } from "@/components/cancel-booking-form";
import { Rail, SpecList } from "@/components/prims";
import { availability } from "@/content/availability";
import { ui } from "@/content/ui";
import { isLocale, type Locale } from "@/content/types";
import { generateSlots } from "@/lib/booking";
import { localePath } from "@/lib/i18n";
import { query } from "@/lib/store";
import { formatDateTimeWithZone, formatTime } from "@/lib/time";
import { tokenEquals } from "@/lib/tokens";

/* Page personnelle, atteignable uniquement avec le jeton reçu par email. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  return {
    title: ui.misc.yourAppointment[locale],
    // Jamais d'indexation : l'URL porte un secret.
    robots: { index: false, follow: false },
  };
}

export default async function ManageBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale: raw, id } = await params;
  const { token = "" } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "fr";

  const booking = await query((data) => data.bookings.find((b) => b.id === id) ?? null).catch(
    (err) => {
      console.error("[rdv] lecture impossible —", err);
      return null;
    },
  );

  const authorized = booking !== null && token.length > 0 && tokenEquals(booking.token, token);

  if (!authorized) {
    return (
      <section className="shell band">
        <h1 className="display d2">{ui.booking.notFound[locale]}</h1>
        <p className="lede mt-6 max-w-[52ch]">
          {ui.misc.manageLinkLost[locale]}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={localePath(locale, "/rendez-vous")} className="btn">
            {ui.misc.seeSlots[locale]}
          </Link>
          <Link href={localePath(locale, "/contact")} className="btn btn-ghost">
            {ui.misc.writeToUs[locale]}
          </Link>
        </div>
      </section>
    );
  }

  const start = new Date(booking.startUtc);
  const end = new Date(start.getTime() + booking.durationMin * 60_000);
  const cancelled = booking.status === "cancelled";

  const taken = await query((data) =>
    data.bookings
      .filter((b) => b.status === "confirmed" && b.id !== booking.id)
      .map((b) => b.startUtc),
  );
  const slots = generateSlots(new Date(), taken).flatMap((day) =>
    day.slots.map((s) => s.startUtc),
  );

  return (
    <>
      <section className="shell railed relative pt-14 lg:pt-24">
        <Rail marks={[{ at: "0.5rem", label: "R" }]} />
        <p className="label">{booking.id}</p>
        <h1 className="display d1 mt-5">
          {cancelled ? ui.misc.appointmentCancelled[locale] : ui.misc.yourAppointment[locale]}
        </h1>

        <div className="mt-10 max-w-3xl">
          <SpecList
            items={[
              {
                term: ui.misc.when[locale],
                value: `${formatDateTimeWithZone(start, booking.timezone, locale)} → ${formatTime(end, booking.timezone, locale)}`,
              },
              { term: ui.booking.duration[locale], value: `${booking.durationMin} min` },
              { term: ui.booking.timezone[locale], value: booking.timezone },
              { term: ui.form.name[locale], value: booking.name },
              { term: ui.form.subject[locale], value: booking.subject },
            ]}
          />
        </div>
      </section>

      {cancelled ? (
        <section className="shell band-tight">
          {/* Après annulation, le formulaire qui portait le message de retour
              disparaît avec lui : ce bandeau prend le relais, sinon le visiteur
              voit la page changer sans savoir ce qui s'est passé. */}
          <p role="status" className="max-w-[56ch] border-l-2 border-ok py-3 pl-4 leading-relaxed text-ok">
            {ui.booking.cancelled[locale]}
          </p>
          <p className="lede mt-8 max-w-[52ch]">
            {ui.misc.takeAnotherSlot[locale]}
          </p>
          <BookingWidget
            locale={locale}
            slots={slots}
            mode="reschedule"
            bookingId={booking.id}
            bookingToken={token}
          />
        </section>
      ) : (
        <>
          <section className="shell band-tight">
            <h2 className="display d2">{ui.booking.reschedule[locale]}</h2>
            <BookingWidget
              locale={locale}
              slots={slots}
              mode="reschedule"
              bookingId={booking.id}
              bookingToken={token}
              currentSlot={booking.startUtc}
            />
          </section>

          <section className="shell band-tight border-t border-rule">
            <h2 className="display d3">{ui.booking.cancel[locale]}</h2>
            <p className="mt-4 max-w-[52ch] text-ink-2">
              {`${ui.misc.cancelExplains[locale]} ${availability.timezone}.`}
            </p>
            <CancelBookingForm locale={locale} id={booking.id} token={token} />
          </section>
        </>
      )}
    </>
  );
}
