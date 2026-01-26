// hooks/useDashboard.js

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/mock/user-dashboard";

export function useRecentOrder() {
  return useQuery({
    queryKey: ["dashboard", "recent-order"],
    queryFn: dashboardApi.getRecentOrder,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useLatestDesign() {
  return useQuery({
    queryKey: ["dashboard", "latest-design"],
    queryFn: dashboardApi.getLatestDesign,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useConsultations() {
  return useQuery({
    queryKey: ["dashboard", "consultations"],
    queryFn: dashboardApi.getConsultations,
    staleTime: 2 * 60 * 1000, // 2 minutes (fresher data for appointments)
    refetchOnWindowFocus: true,
  });
}

export function useSavedItems() {
  return useQuery({
    queryKey: ["dashboard", "saved-items"],
    queryFn: dashboardApi.getSavedItems,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}
