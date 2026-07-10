"use client";

import { useEffect } from "react";
import ErrorState from "@/components/common/error-state";

/**
 * Errors inside the admin console. No "back to home" link — an admin who hits
 * this wants to retry or report it, not be dropped on the marketing site.
 */
export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error("[error-boundary] admin:", error?.digest ?? error?.name);
  }, [error]);

  return (
    <ErrorState
      error={error}
      reset={reset}
      showHomeLink={false}
      title="Admin console error"
      description="This view failed to load. Retry, and quote the reference below if you report it."
    />
  );
}
