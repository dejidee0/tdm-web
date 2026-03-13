import { vendorDashboardAPI } from "@/lib/api/vendor";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsVendorAuthed } from "@/hooks/use-vendor-auth";

export const VENDOR_QUERY_KEYS = {
  stats: ["vendor", "dashboard", "stats"],
  alerts: ["vendor", "dashboard", "alerts"],
  activity: (filter) => ["vendor", "dashboard", "activity", filter],
};

export function useVendorStats() {
  const authed = useIsVendorAuthed();
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.stats,
    queryFn: vendorDashboardAPI.getStats,
    enabled: authed,
    staleTime: 2 * 60 * 1000,
  });
}

export function useVendorAlerts() {
  const authed = useIsVendorAuthed();
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.alerts,
    queryFn: vendorDashboardAPI.getAlerts,
    enabled: authed,
    staleTime: 60 * 1000,
  });
}

export function useVendorActivity(filter = "all") {
  const authed = useIsVendorAuthed();
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.activity(filter),
    queryFn: () => vendorDashboardAPI.getRecentActivity(filter),
    enabled: authed,
    staleTime: 90 * 1000,
  });
}

export function useRefreshDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.stats }),
        queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.alerts }),
        queryClient.invalidateQueries({ queryKey: ["vendor", "dashboard", "activity"] }),
      ]);
    },
  });
}
