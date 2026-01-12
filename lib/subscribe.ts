"use server";

import { ActionResult, error, success } from "./utils";
import { newsletterSchema } from "./schema";

export const subscribe = async (email: string): Promise<ActionResult<string>> => {
  const parsed = newsletterSchema.safeParse({ email });

  if (!parsed.success) {
    return error("Veuillez entrer une adresse email valide");
  }

  try {
    const response = await fetch("https://n8n.realitek.fr/webhook/1ad827a3-59cd-4805-9932-5e9d8786df83", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: parsed.data.email,
        timestamp: new Date().toISOString(),
        source: "website_newsletter"
      }),
    });

    if (response.ok) {
      return success("Merci ! Vous êtes maintenant inscrit à notre newsletter.");
    } else {
      return error("Une erreur s'est produite. Veuillez réessayer.");
    }
  } catch (err) {
    return error("Une erreur s'est produite. Veuillez réessayer.");
  }
};
