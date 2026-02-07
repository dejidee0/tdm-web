import { adminDashboardAPI } from "@/lib/mock/admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query keys
export const ADMIN_QUERY_KEYS = {
  stats: ["admin", "dashboard", "stats"],
  revenue: (timeRange) => ["admin", "dashboard", "revenue", timeRange],
  serverLoad: ["admin", "dashboard", "server-load"],
  alerts: ["admin", "dashboard", "alerts"],
  quickActions: ["admin", "dashboard", "quick-actions"],
};

// Hook to fetch dashboard stats
export function useAdminStats() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.stats,
    queryFn: adminDashboardAPI.getStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to fetch revenue data
export function useRevenueData(timeRange = "Last 6 Months") {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.revenue(timeRange),
    queryFn: () => adminDashboardAPI.getRevenueData(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch server load
export function useServerLoad() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.serverLoad,
    queryFn: adminDashboardAPI.getServerLoad,
    staleTime: 30 * 1000, // 30 seconds (more frequent for live metrics)
  });
}

// Hook to fetch alerts
export function useAdminAlerts() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.alerts,
    queryFn: adminDashboardAPI.getAlerts,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Hook to fetch quick actions
export function useAdminQuickActions() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.quickActions,
    queryFn: adminDashboardAPI.getQuickActions,
    staleTime: 10 * 60 * 1000, // 10 minutes (static data)
  });
}

// Hook to refresh all dashboard data
export function useRefreshAdminDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminDashboardAPI.refreshDashboard,
    onSuccess: () => {
      // Invalidate all admin dashboard queries
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "revenue"],
      });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.serverLoad });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.alerts });
    },
  });
}

// Hook to export report
export function useExportReport() {
  return useMutation({
    mutationFn: adminDashboardAPI.exportReport,
  });
}
