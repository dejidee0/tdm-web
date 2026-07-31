"use client";

import { useEffect } from "react";
import ErrorState from "@/components/common/error-state";

/**
 * Catches errors thrown anywhere below the root layout that no nearer boundary
 * handled. The root layout still renders, so Providers stay mounted and `reset`
 * can re-render the segment without a full reload.
 *
 * A nearer `error.jsx` (e.g. app/(user)/error.jsx) keeps more of the shell —
 * navbar, footer — so prefer adding one at the segment rather than relying on
 * this catch-all.
 */
export default function RootError({ error, reset }) {
  useEffect(() => {
    // The digest correlates with the server log line; the message may not exist
    // in production builds. Never render either — see ErrorState.
    console.error("[error-boundary] root:", error?.digest ?? error?.name);
  }, [error]);

  return <ErrorState error={error} reset={reset} />;
}
