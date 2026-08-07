import Link from "next/link";
import { ui } from "@/content/ui";

/**
 * 404 à l'intérieur d'une langue. Elle hérite de l'en-tête et du pied de page
 * du layout, donc le visiteur garde sa navigation — ce qui est le principal
 * service qu'une page d'erreur puisse rendre.
 *
 * Le segment de langue n'est pas lisible depuis un `not-found`, d'où
 * l'affichage des deux libellés plutôt qu'une supposition.
 */
export default function LocaleNotFound() {
  return (
    <section className="shell band">
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
    </section>
  );
}
