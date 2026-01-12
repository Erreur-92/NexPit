"use server";

import { ActionResult, error, success } from "./utils";
import { newsletterSchema } from "./schema";
import { sendNewsletterNotification } from "./email";

export const subscribe = async (email: string): Promise<ActionResult<string>> => {
  const parsed = newsletterSchema.safeParse({ email });

  if (!parsed.success) {
    return error("Veuillez entrer une adresse email valide");
  }

  try {
    console.log("Début subscribe pour:", parsed.data.email);
    
    const mail = await sendNewsletterNotification(parsed.data.email);

    if (!mail.ok) {
      console.error("Erreur envoi email:", mail.message);
      return error(mail.message);
    }

    console.log("Email envoyé, inscription terminée");
    return success("Merci ! Vous êtes maintenant inscrit à notre newsletter.");
  } catch (err) {
    console.error("Erreur subscribe:", err);
    return error("Une erreur s'est produite. Veuillez réessayer.");
  }
};
