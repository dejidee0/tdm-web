// hooks/use-dashboard.js
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { dashboardApi } from "@/lib/api/user-dashboard";
import { authKeys } from "@/hooks/use-auth";

/**
 * Query key factory — keeps cache keys consistent across the app.
 * Colocated here so every dashboard hook imports from one place.
 */
export const dashboardKeys = {
  all: ["dashboard"],
  recentOrder: () => [...dashboardKeys.all, "recent-order"],
  orders: (filters) => [...dashboardKeys.all, "orders", filters],
  order: (id) => [...dashboardKeys.all, "order", id],
  designs: (filters) => [...dashboardKeys.all, "designs", filters],
  latestDesign: () => [...dashboardKeys.all, "latest-design"],
  consultations: () => [...dashboardKeys.all, "consultations"],
  savedItems: () => [...dashboardKeys.all, "saved-items"],
  profile: () => [...dashboardKeys.all, "profile"],
};

/**
 * Base hook — reads from the auth cache that the Navbar already populated.
 * ZERO extra fetches: if useCurrentUser already ran, this is instant.
 */
function useAuthGuard() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Read directly from cache — no network call
  const user = queryClient.getQueryData(authKeys.user());
  const isAuthenticated = !!user;

  useEffect(() => {
    // Only redirect if cache is settled and user is not authenticated
    const state = queryClient.getQueryState(authKeys.user());
    const settled = state?.status === "success" || state?.status === "error";
    if (settled && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isAuthenticated, queryClient, router]);

  return { user, isAuthenticated };
}

/** Shared options for dashboard queries — tune once, apply everywhere */
const dashboardQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 min — data considered fresh
  gcTime: 10 * 60 * 1000, // 10 min — keep in cache after unmount
  retry: 1,
  refetchOnWindowFocus: false,
};

const consultationQueryOptions = {
  ...dashboardQueryOptions,
  staleTime: 2 * 60 * 1000, // 2 min — appointments need fresher data
  refetchOnWindowFocus: true, // re-check when user switches tabs
};

// ─── Individual hooks ──────────────────────────────────────────────────────

export function useDashboardUser() {
  return useAuthGuard();
}

export function useRecentOrder() {
  const { isAuthenticated } = useAuthGuard();
  return useQuery({
    queryKey: dashboardKeys.recentOrder(),
    queryFn: dashboardApi.getRecentOrder,
    enabled: isAuthenticated,
    ...dashboardQueryOptions,
  });
}

export function useOrders(filters = {}) {
  const { isAuthenticated } = useAuthGuard();
  return useQuery({
    queryKey: dashboardKeys.orders(filters),
    queryFn: () => dashboardApi.getOrders(filters),
    enabled: isAuthenticated,
    ...dashboardQueryOptions,
    placeholderData: (prev) => prev, // keepPreviousData equivalent in v5
  });
}

export function useOrder(id) {
  const { isAuthenticated } = useAuthGuard();
  return useQuery({
    queryKey: dashboardKeys.order(id),
    queryFn: () => dashboardApi.getOrder(id),
    enabled: isAuthenticated && !!id,
    ...dashboardQueryOptions,
  });
}

export function useLatestDesign() {
  const { isAuthenticated } = useAuthGuard();
  return useQuery({
    queryKey: dashboardKeys.latestDesign(),
    queryFn: dashboardApi.getLatestDesign,
    enabled: isAuthenticated,
    ...dashboardQueryOptions,
  });
}

export function useDesigns(filters = {}) {
  const { isAuthenticated } = useAuthGuard();
  return useQuery({
    queryKey: dashboardKeys.designs(filters),
    queryFn: () => dashboardApi.getDesigns(filters),
    enabled: isAuthenticated,
    ...dashboardQueryOptions,
    placeholderData: (prev) => prev,
  });
}

export function useConsultations() {
  const { isAuthenticated } = useAuthGuard();
  return useQuery({
    queryKey: dashboardKeys.consultations(),
    queryFn: dashboardApi.getConsultations,
    enabled: isAuthenticated,
    ...consultationQueryOptions,
  });
}

export function useSavedItems() {
  const { isAuthenticated } = useAuthGuard();
  return useQuery({
    queryKey: dashboardKeys.savedItems(),
    queryFn: dashboardApi.getSavedItems,
    enabled: isAuthenticated,
    ...dashboardQueryOptions,
  });
}

export function useDashboardProfile() {
  const { isAuthenticated } = useAuthGuard();
  return useQuery({
    queryKey: dashboardKeys.profile(),
    queryFn: dashboardApi.getProfile,
    enabled: isAuthenticated,
    ...dashboardQueryOptions,
  });
}

/**
 * Prefetch all dashboard data at once.
 * Call this in the layout or a parent component for instant child renders.
 *
 * Usage:
 *   const prefetch = usePrefetchDashboard();
 *   useEffect(() => { prefetch(); }, []);
 */
export function usePrefetchDashboard() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthGuard();

  return () => {
    if (!isAuthenticated) return;

    queryClient.prefetchQuery({
      queryKey: dashboardKeys.recentOrder(),
      queryFn: dashboardApi.getRecentOrder,
      ...dashboardQueryOptions,
    });
    queryClient.prefetchQuery({
      queryKey: dashboardKeys.latestDesign(),
      queryFn: dashboardApi.getLatestDesign,
      ...dashboardQueryOptions,
    });
    queryClient.prefetchQuery({
      queryKey: dashboardKeys.consultations(),
      queryFn: dashboardApi.getConsultations,
      ...consultationQueryOptions,
    });
    queryClient.prefetchQuery({
      queryKey: dashboardKeys.savedItems(),
      queryFn: dashboardApi.getSavedItems,
      ...dashboardQueryOptions,
    });
  };
}
