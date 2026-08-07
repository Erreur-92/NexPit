"use client";

import { useEffect } from "react";
import { ui } from "@/content/ui";

/**
 * Erreur d'exécution dans une page. Le message affiché ne contient jamais le
 * détail technique : celui-ci part dans les journaux du serveur, où il sert.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[page] rendu en échec —", error.digest ?? error.message);
  }, [error]);

  return (
    <section className="shell band">
      <p className="label">{error.digest ? `réf. ${error.digest}` : "erreur"}</p>
      <h1 className="display d1 mt-5 max-w-[14ch]">{ui.serverError.title.fr}</h1>
      <p className="lede mt-6">{ui.serverError.body.fr}</p>
      <p className="lede mt-2 text-ink-3">{ui.serverError.body.en}</p>

      <button type="button" className="btn mt-10" onClick={reset}>
        {ui.serverError.retry.fr} / {ui.serverError.retry.en}
      </button>
    </section>
  );
}
