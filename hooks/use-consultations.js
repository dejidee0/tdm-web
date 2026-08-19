// hooks/use-consultations.js
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { consultationsApi } from "@/lib/api/consultations";
import { useSession } from "@/hooks/use-session";

/** GET /consultations/types — public, five real types with fee/duration/format. */
export function useConsultationTypes() {
  return useQuery({
    queryKey: ["consultations", "types"],
    queryFn: consultationsApi.getTypes,
    select: (res) => res?.data ?? [],
    staleTime: Infinity, // a near-static catalogue, not user data
  });
}

/** GET /consultations/availability — public. Disabled until a type is chosen. */
export function useConsultationAvailability(typeKey, date) {
  return useQuery({
    queryKey: ["consultations", "availability", typeKey, date ?? "default"],
    queryFn: () => consultationsApi.getAvailability(typeKey, date),
    select: (res) => res?.data,
    enabled: Boolean(typeKey),
    staleTime: 30 * 1000, // slots can be taken by someone else
  });
}

/**
 * POST /consultations. Not gated on `isAuthenticated` — the endpoint itself
 * works anonymously — but this app's booking page only exposes the submit
 * button once signed in (product decision, lib/api/consultations.js).
 */
export function useBookConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => consultationsApi.book(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations", "mine"] });
      // Booking a slot removes it from availability for everyone.
      queryClient.invalidateQueries({ queryKey: ["consultations", "availability"] });
    },
  });
}

/** POST /consultations/{id}/initialize-payment — safe to call more than once; see lib/api/consultations.js. */
export function useInitializeConsultationPayment() {
  return useMutation({
    mutationFn: ({ id, email }) => consultationsApi.initializePayment(id, email),
  });
}

/** POST /consultations/verify-payment */
export function useVerifyConsultationPayment() {
  return useMutation({
    mutationFn: (reference) => consultationsApi.verifyPayment(reference),
  });
}

/** GET /consultations/{id} */
export function useConsultation(id) {
  return useQuery({
    queryKey: ["consultations", "detail", id],
    queryFn: () => consultationsApi.getConsultation(id),
    select: (res) => res?.data,
    enabled: Boolean(id),
  });
}

/** GET /consultations/mine */
export function useMyConsultations() {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: ["consultations", "mine"],
    queryFn: consultationsApi.getMyConsultations,
    select: (res) => res?.data ?? [],
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

export function useRescheduleConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, scheduledStart }) => consultationsApi.reschedule(id, scheduledStart),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["consultations", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["consultations", "detail", id] });
    },
  });
}

export function useCancelConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => consultationsApi.cancel(id, reason),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["consultations", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["consultations", "detail", id] });
    },
  });
}
