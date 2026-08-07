import { NextResponse, type NextRequest } from "next/server";
import { SITE_URL } from "@/content/site";
import { isLocale, type Locale } from "@/content/types";
import { buildMail, sendMail } from "@/lib/mail";
import { mutate } from "@/lib/store";
import { emails } from "@/content/emails";

/**
 * Deuxième temps du double opt-in : c'est ce clic, et lui seul, qui fait
 * passer une adresse de « en attente » à « inscrite ».
 *
 * La route redirige toujours vers une page lisible plutôt que de rendre du
 * JSON : elle est ouverte depuis un client mail, par quelqu'un qui n'a rien
 * demandé d'autre que de voir si ça a marché.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const rawLocale = request.nextUrl.searchParams.get("locale") ?? "fr";
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";

  const target = (state: string) =>
    NextResponse.redirect(new URL(`/${locale}/newsletter?state=${state}`, SITE_URL), 303);

  if (!token) return target("invalid");

  try {
    const outcome = await mutate((data) => {
      const subscriber = data.subscribers.find((s) => s.confirmToken === token);
      if (!subscriber) return { kind: "invalid" as const };

      if (subscriber.status === "confirmed") {
        return { kind: "already" as const, subscriber };
      }

      subscriber.status = "confirmed";
      subscriber.confirmedAt = new Date().toISOString();
      // Le jeton de confirmation est à usage unique : rejouer le lien depuis
      // un cache de messagerie ne doit rien réactiver.
      subscriber.confirmToken = "";
      return { kind: "confirmed" as const, subscriber };
    });

    if (outcome.kind === "invalid") return target("invalid");
    if (outcome.kind === "already") return target("already");

    const { subscriber } = outcome;
    const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribeToken)}&locale=${subscriber.locale}`;
    const W = emails.newsletterWelcome;
    const lang = subscriber.locale;

    const mail = buildMail(
      W.title[lang],
      [
        { type: "para", text: W.body[lang] },
        { type: "note", text: W.note[lang] },
        { type: "action", href: unsubscribeUrl, label: W.action[lang] },
      ],
      `NexPit — ${SITE_URL}`,
    );

    const sent = await sendMail({
      to: subscriber.email,
      subject: W.subject[lang],
      text: mail.text,
      html: mail.html,
    });

    if (!sent.ok) {
      // L'inscription est bien enregistrée : on ne renvoie pas d'erreur au
      // visiteur pour un message de bienvenue qui n'est pas parti.
      console.error("[newsletter] message de bienvenue non envoyé —", sent.detail);
    }

    return target("confirmed");
  } catch (err) {
    console.error("[newsletter] confirmation en échec —", err);
    return target("error");
  }
}
