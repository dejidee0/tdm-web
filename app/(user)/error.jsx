"use client";

import { useEffect } from "react";
import ErrorState from "@/components/common/error-state";

/**
 * Errors inside the public site. The (user) layout survives, so the navbar,
 * footer and concierge stay on screen and the visitor can navigate away rather
 * than reaching for the back button.
 */
export default function UserError({ error, reset }) {
  useEffect(() => {
    console.error("[error-boundary] (user):", error?.digest ?? error?.name);
  }, [error]);

  return (
    <ErrorState
      error={error}
      reset={reset}
      description="This page didn't load. Try again, or browse the rest of the site."
    />
  );
}
