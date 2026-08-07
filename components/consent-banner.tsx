"use client";

import { useCallback, useEffect, useState } from "react";
import { ui } from "@/content/ui";
import { localePath, type Locale } from "@/lib/i18n";
import Link from "next/link";

/**
 * Consentement à la mesure d'audience.
 *
 * Trois partis pris :
 *
 * - Aucun script tiers n'est présent dans la page tant que le visiteur n'a
 *   pas accepté. Ce n'est pas un script chargé puis bridé : il n'est pas là.
 * - Le choix est gardé dans `localStorage`, pas dans un cookie. Il ne part
 *   jamais vers le serveur, ce qui est exactement ce qu'on veut d'un choix
 *   qui ne concerne que le navigateur.
 * - Refuser est aussi accessible qu'accepter, même taille, même place. Un
 *   bandeau où le refus est caché derrière trois écrans ne recueille pas un
 *   consentement valable.
 */

const KEY = "nexpit.analytics";
const TTL_MS = 180 * 24 * 3600_000; // six mois

type Choice = "granted" | "denied";
type Stored = { choice: Choice; at: number };

function read(): Choice | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (Date.now() - parsed.at > TTL_MS) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    return parsed.choice;
  } catch {
    return null;
  }
}

function write(choice: Choice) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ choice, at: Date.now() } satisfies Stored));
  } catch {
    // Navigation privée ou stockage plein : le bandeau réapparaîtra, ce qui
    // est préférable à charger un traceur sans pouvoir mémoriser le refus.
  }
  window.dispatchEvent(new CustomEvent("nexpit:consent", { detail: choice }));
}

/** Injecte le script de mesure, une seule fois, après acceptation. */
function loadAnalytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  if (!src) return;
  if (document.querySelector(`script[data-nexpit-analytics]`)) return;

  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  script.dataset.nexpitAnalytics = "true";
  const site = process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID;
  if (site) {
    // Umami lit data-website-id, Plausible lit data-domain : on renseigne les
    // deux, chaque script ignore l'attribut qui ne le concerne pas.
    script.setAttribute("data-website-id", site);
    script.setAttribute("data-domain", site);
  }
  document.head.appendChild(script);
}

export function ConsentBanner({ locale }: { locale: Locale }) {
  const [choice, setChoice] = useState<Choice | null | "unknown">("unknown");

  useEffect(() => {
    const stored = read();
    setChoice(stored);
    if (stored === "granted") loadAnalytics();

    const onReopen = () => setChoice(null);
    window.addEventListener("nexpit:consent-reopen", onReopen);
    return () => window.removeEventListener("nexpit:consent-reopen", onReopen);
  }, []);

  const decide = useCallback((next: Choice) => {
    write(next);
    setChoice(next);
    if (next === "granted") loadAnalytics();
  }, []);

  // "unknown" = premier rendu, avant lecture du stockage. Ne rien afficher
  // évite que le bandeau clignote sur chaque page pour qui a déjà répondu.
  if (choice !== null) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-pit-rule on-pit"
    >
      <div className="shell flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-2xl">
          <h2 id="consent-title" className="label text-pit-ink">
            {ui.consent.title[locale]}
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-pit-ink-2">
            {ui.consent.body[locale]}{" "}
            <Link href={localePath(locale, "/confidentialite")} className="link">
              {ui.misc.privacyPolicy[locale]}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button type="button" className="btn btn-ghost flex-1 justify-center" onClick={() => decide("denied")}>
            {ui.consent.refuse[locale]}
          </button>
          <button type="button" className="btn flex-1 justify-center" onClick={() => decide("granted")}>
            {ui.consent.accept[locale]}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Lien de pied de page qui rouvre le bandeau. */
export function ConsentReopen({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      className="label hover:text-pit-ink transition-colors"
      onClick={() => window.dispatchEvent(new Event("nexpit:consent-reopen"))}
    >
      {ui.consent.manage[locale]}
    </button>
  );
}
