import { adminDashboardAPI, adminAnalyticsAPI } from "@/lib/api/admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsAdminAuthed } from "@/hooks/use-admin-auth";

// Query keys
export const ADMIN_QUERY_KEYS = {
  stats: ["admin", "dashboard", "stats"],
  overview: ["admin", "analytics", "overview"],
  revenue: (timeRange) => ["admin", "dashboard", "revenue", timeRange],
  monthlyRevenue: ["admin", "analytics", "monthly-revenue"],
  paymentDistribution: ["admin", "analytics", "payment-distribution"],
  serverLoad: ["admin", "dashboard", "server-load"],
  alerts: ["admin", "dashboard", "alerts"],
  quickActions: ["admin", "dashboard", "quick-actions"],
};

export function useAnalyticsOverview() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.overview,
    queryFn: adminAnalyticsAPI.getOverview,
    enabled: authed,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMonthlyRevenue() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.monthlyRevenue,
    queryFn: adminAnalyticsAPI.getMonthlyRevenue,
    enabled: authed,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePaymentDistribution() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.paymentDistribution,
    queryFn: adminAnalyticsAPI.getPaymentDistribution,
    enabled: authed,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardStats() {
  const authed = useIsAdminAuthed();
  console.log("[useDashboardStats] isAuthed:", authed);
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.stats,
    queryFn: adminDashboardAPI.getStats,
    enabled: authed,
    staleTime: 2 * 60 * 1000,
  });
}

export function useDashboardRevenue(timeRange = "30d") {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.revenue(timeRange), "dashboard"],
    queryFn: () => adminDashboardAPI.getRevenue(timeRange),
    enabled: authed,
    staleTime: 5 * 60 * 1000,
  });
}

export function useServerLoad() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.serverLoad,
    queryFn: adminDashboardAPI.getServerLoad,
    enabled: authed,
    staleTime: 30 * 1000,
  });
}

export function useAdminAlerts() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.alerts,
    queryFn: adminDashboardAPI.getAlerts,
    enabled: authed,
    staleTime: 60 * 1000,
  });
}

export function useAdminQuickActions() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.quickActions,
    queryFn: adminDashboardAPI.getQuickActions,
    enabled: authed,
    staleTime: 10 * 60 * 1000,
  });
}

export function useRefreshAdminDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminDashboardAPI.refreshDashboard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.overview });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.monthlyRevenue });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard", "revenue"] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.serverLoad });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.alerts });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.quickActions });
    },
  });
}

export function useExportReport() {
  return useMutation({
    mutationFn: adminDashboardAPI.exportReport,
    onSuccess: (data) => {
      if (data?.url) {
        const link = document.createElement("a");
        link.href = data.url;
        link.download = data?.filename || "admin-dashboard-export.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    onError: (error) => {
      console.error("Export failed:", error);
    },
  });
}
