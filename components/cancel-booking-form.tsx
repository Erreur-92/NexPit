"use client";

import { useActionState } from "react";
import { cancelBooking } from "@/lib/actions/booking";
import { idle } from "@/lib/actions/types";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { FormStatus } from "./form-bits";

export function CancelBookingForm({
  locale,
  id,
  token,
}: {
  locale: Locale;
  id: string;
  token: string;
}) {
  const [state, action, pending] = useActionState(cancelBooking, idle);

  return (
    <form action={action} className="mt-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="token" value={token} />
      <button type="submit" className="btn btn-ghost" disabled={pending || state.status === "ok"}>
        {pending ? ui.form.sending[locale] : ui.booking.cancel[locale]}
      </button>
      <FormStatus state={state} />
    </form>
  );
}
