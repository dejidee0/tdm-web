"use client";

import { useEffect } from "react";
import ErrorState from "@/components/common/error-state";

/**
 * Errors inside the signed-in dashboard. `reset` re-runs the segment, which
 * re-runs its queries — usually enough when the failure was a transient 5xx.
 */
export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error("[error-boundary] dashboard:", error?.digest ?? error?.name);
  }, [error]);

  return (
    <ErrorState
      error={error}
      reset={reset}
      title="We couldn't load your dashboard"
      description="Something went wrong fetching your data. Try again — if it persists, our team can help."
    />
  );
}
