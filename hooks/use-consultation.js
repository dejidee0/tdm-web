// hooks/use-consultation.js
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { consultationsApi } from "@/lib/api/consultations";
import { dashboardKeys } from "@/hooks/use-user-dashboard";

/**
 * Book a consultation.
 *
 * Deliberately *not* gated on a session: `POST /inspections/book` answers 200
 * anonymously (verified against the dev backend), and the product wants a
 * visitor to be able to reach a consultant without an account first. The
 * account wall on this journey is a product decision enforced in the page, not
 * an API constraint — see `app/(user)/consultation/client.jsx`.
 *
 * On success the dashboard's consultations card is invalidated so a signed-in
 * user sees the new booking without a reload. For an anonymous booking the
 * invalidation is a no-op: that query is disabled.
 */
export function useBookConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => consultationsApi.book(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.consultations() });
    },
  });
}

/**
 * Upload one supporting file and resolve its hosted URL.
 *
 * One mutation per file rather than one per batch: a 12 MB video failing must
 * not discard the three photos that already uploaded, and the caller needs
 * per-file progress to render the list.
 */
export function useUploadConsultationFile() {
  return useMutation({
    mutationFn: (file) => consultationsApi.uploadFile(file),
  });
}

/**
 * Confirm a Paystack reference against a booking.
 *
 * Unused by the booking flow today — nothing in the API can *initiate* a
 * consultation payment, so no reference is ever minted. Kept because the
 * callback half is correct and observed, and the moment the backend adds an
 * initiate endpoint this is the piece that would otherwise be written wrong.
 */
export function useVerifyConsultationPayment() {
  return useMutation({
    mutationFn: (reference) => consultationsApi.verifyPayment(reference),
  });
}
