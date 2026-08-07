/**
 * Marqueur de contenu manquant.
 *
 * En développement, il signale à l'écran ce que NexPit doit encore fournir.
 * En production, il ne rend rien : la section entière disparaît plutôt que
 * d'afficher un texte de remplissage. C'est la règle de tout le site — mieux
 * vaut une page courte qu'une page plausible et fausse.
 *
 * `pnpm check:content` liste ces manques hors du navigateur.
 */
export function PendingNotice({ what }: { what: string }) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <p className="mt-6 border border-dashed border-signal-deep bg-signal/20 px-4 py-3 text-[0.875rem] text-ink">
      <span className="label mr-2">À compléter</span>
      {what}
    </p>
  );
}
