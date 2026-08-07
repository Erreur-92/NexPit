"use client";

import { useEffect } from "react";
import "./globals.css";
import { ui } from "@/content/ui";

/** Dernier filet : une erreur survenue dans le layout lui-même. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[layout] rendu en échec —", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <main className="shell flex min-h-screen flex-col justify-center py-24">
          <p className="label">{error.digest ? `réf. ${error.digest}` : "erreur"}</p>
          <h1 className="display d1 mt-5 max-w-[14ch]">{ui.serverError.title.fr}</h1>
          <p className="lede mt-6">{ui.serverError.body.fr}</p>
          <button type="button" className="btn mt-10" onClick={reset}>
            {ui.serverError.retry.fr}
          </button>
        </main>
      </body>
    </html>
  );
}
