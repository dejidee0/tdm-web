"use client";

import { useEffect } from "react";
import ErrorState from "@/components/common/error-state";

/**
 * Errors inside the vendor dashboard. Same reasoning as the admin boundary:
 * retry in place rather than bouncing a working vendor to the public site.
 */
export default function VendorError({ error, reset }) {
  useEffect(() => {
    console.error("[error-boundary] vendor:", error?.digest ?? error?.name);
  }, [error]);

  return (
    <ErrorState
      error={error}
      reset={reset}
      showHomeLink={false}
      title="Vendor dashboard error"
      description="This view failed to load. Retry, and quote the reference below if you report it."
    />
  );
}
