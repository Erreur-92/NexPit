import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email requis." })
    .email({ message: "Email invalide." }),
});

export type NewsletterSchema = z.infer<typeof newsletterSchema>;
