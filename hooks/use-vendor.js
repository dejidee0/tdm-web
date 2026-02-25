import { vendorDashboardAPI } from "@/lib/api/vendor";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query keys
export const VENDOR_QUERY_KEYS = {
  stats: ["vendor", "dashboard", "stats"],
  alerts: ["vendor", "dashboard", "alerts"],
  activity: (filter) => ["vendor", "dashboard", "activity", filter],
};

// Hook to fetch dashboard stats
export function useVendorStats() {
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.stats,
    queryFn: vendorDashboardAPI.getStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to fetch operational alerts
export function useVendorAlerts() {
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.alerts,
    queryFn: vendorDashboardAPI.getAlerts,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Hook to fetch recent activity
export function useVendorActivity(filter = "all") {
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.activity(filter),
    queryFn: () => vendorDashboardAPI.getRecentActivity(filter),
    staleTime: 90 * 1000, // 90 seconds
  });
}

// Hook to refresh all dashboard data
export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.stats }),
        queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.alerts }),
        queryClient.invalidateQueries({
          queryKey: ["vendor", "dashboard", "activity"],
        }),
      ]);
    },
  });
}
