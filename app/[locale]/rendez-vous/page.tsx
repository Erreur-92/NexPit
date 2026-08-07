import type { Metadata } from "next";
import { BookingWidget } from "@/components/booking-widget";
import { Rail, SectionHead } from "@/components/prims";
import { availability } from "@/content/availability";
import { booking } from "@/content/pages";
import { ui } from "@/content/ui";
import { isLocale, type Locale } from "@/content/types";
import { generateSlots } from "@/lib/booking";
import { query } from "@/lib/store";
import { breadcrumbJsonLd, jsonLdScript, pageMetadata } from "@/lib/seo";

/* Les créneaux dépendent de l'heure courante et des réservations déjà prises :
   la page ne peut pas être mise en cache. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";
  return pageMetadata({
    locale,
    path: "/rendez-vous",
    title: booking.title[locale],
    description: booking.lede[locale],
  });
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fr";

  let slots: string[] = [];
  let storeFailed = false;

  try {
    const taken = await query((data) =>
      data.bookings.filter((b) => b.status === "confirmed").map((b) => b.startUtc),
    );
    slots = generateSlots(new Date(), taken).flatMap((day) => day.slots.map((s) => s.startUtc));
  } catch (err) {
    // Un magasin illisible ne doit pas rendre la page blanche : on le dit.
    console.error("[rdv] lecture des réservations impossible —", err);
    storeFailed = true;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd(locale, [
              { name: "NexPit", path: "/" },
              { name: booking.title[locale], path: "/rendez-vous" },
            ]),
          ),
        }}
      />

      <section className="shell railed relative pt-14 lg:pt-24">
        <Rail marks={[{ at: "0.5rem", label: "R" }]} />
        <SectionHead
          as="h1"
          index="R.00"
          eyebrow={booking.eyebrow[locale]}
          title={booking.title[locale]}
          lede={booking.lede[locale]}
        />

        <ul className="mt-12 grid gap-px border border-rule bg-rule sm:grid-cols-3">
          {booking.agenda[locale].map((item, i) => (
            <li key={i} className="bg-paper p-6">
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-3 text-[0.9375rem] text-ink-2">{item}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell band-tight">
        {storeFailed ? (
          <p role="alert" className="border-l-2 border-danger py-3 pl-4 text-danger">
            {ui.misc.slotsUnavailable[locale]}
          </p>
        ) : (
          <BookingWidget locale={locale} slots={slots} />
        )}

        <p className="label mt-12 normal-case tracking-normal leading-relaxed max-w-[60ch]">
          {ui.misc.slotsFootnote[locale].replace("{tz}", availability.timezone)}
        </p>
      </section>
    </>
  );
}
