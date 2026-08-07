import Link from "next/link";
import "./globals.css";
import { ui } from "@/content/ui";

/**
 * 404 racine. Comme le site n'a pas de `app/layout.tsx` — la mise en page
 * vit sous `app/[locale]` pour porter l'attribut `lang` — ce fichier doit
 * fournir lui-même `<html>` et `<body>`.
 *
 * Cette page est atteinte pour une URL hors langue (`/nimporte-quoi`), donc
 * sans langue connue : elle affiche les deux.
 */
export default function RootNotFound() {
  return (
    <html lang="fr">
      <body>
        <main className="shell flex min-h-screen flex-col justify-center py-24">
          <p className="label">404</p>
          <h1 className="display d1 mt-5 max-w-[14ch]">{ui.notFound.title.fr}</h1>
          <p className="lede mt-6">{ui.notFound.body.fr}</p>
          <p className="lede mt-2 text-ink-3">{ui.notFound.body.en}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/fr" className="btn">
              {ui.notFound.back.fr}
            </Link>
            <Link href="/en" className="btn btn-ghost">
              {ui.notFound.back.en}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
