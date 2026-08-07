import { NextResponse, type NextRequest } from "next/server";
import { SITE_URL } from "@/content/site";
import { isLocale, type Locale } from "@/content/types";
import { mutate } from "@/lib/store";

/**
 * Désinscription en un clic.
 *
 * Le lien supprime l'enregistrement : il ne le marque pas « désabonné », il
 * l'efface. Conserver une adresse dont on sait qu'elle ne veut plus rien
 * recevoir n'a aucune finalité, donc aucune base légale.
 *
 * GET pour le clic depuis un email, POST pour la désinscription automatique
 * des clients mail qui suivent la RFC 8058.
 */
async function remove(token: string): Promise<"done" | "invalid" | "error"> {
  if (!token) return "invalid";
  try {
    return await mutate((data) => {
      const index = data.subscribers.findIndex((s) => s.unsubscribeToken === token);
      if (index === -1) return "invalid" as const;
      data.subscribers.splice(index, 1);
      return "done" as const;
    });
  } catch (err) {
    console.error("[newsletter] désinscription en échec —", err);
    return "error";
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const rawLocale = request.nextUrl.searchParams.get("locale") ?? "fr";
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";

  const result = await remove(token);
  const state = result === "done" ? "unsubscribed" : result === "invalid" ? "unsub-invalid" : "error";
  return NextResponse.redirect(new URL(`/${locale}/newsletter?state=${state}`, SITE_URL), 303);
}

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const result = await remove(token);
  return new NextResponse(null, { status: result === "error" ? 500 : 204 });
}
