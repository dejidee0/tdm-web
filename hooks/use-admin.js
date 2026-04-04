import {
  adminDashboardAPI,
  adminAnalyticsAPI,
  adminAIUsageAPI,
  adminObservabilityAPI,
} from "@/lib/api/admin";
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
  // AI usage
  aiUsageMonthly: (months) => ["admin", "ai", "usage", "monthly", months],
  aiUsageByType: ["admin", "ai", "usage", "by-type"],
  aiUsageOverview: ["admin", "ai", "usage", "overview"],
  // Observability
  health: ["admin", "observability", "health"],
  metrics: ["admin", "observability", "metrics"],
  recentErrors: ["admin", "observability", "recent-errors"],
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

// ─── Admin AI Usage ────────────────────────────────────────────────────────────

export function useAdminAIUsageMonthly(months = 12) {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.aiUsageMonthly(months),
    queryFn: () => adminAIUsageAPI.getMonthlyUsage(months),
    enabled: authed,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminAIUsageByType() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.aiUsageByType,
    queryFn: adminAIUsageAPI.getUsageByType,
    enabled: authed,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminAIUsageOverview() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.aiUsageOverview,
    queryFn: adminAIUsageAPI.getUsageOverview,
    enabled: authed,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Admin Observability ───────────────────────────────────────────────────────

export function useAdminHealth() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.health,
    queryFn: adminObservabilityAPI.getHealth,
    enabled: authed,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // auto-refresh every minute
  });
}

export function useAdminMetrics() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.metrics,
    queryFn: adminObservabilityAPI.getMetrics,
    enabled: authed,
    staleTime: 60 * 1000,
  });
}

export function useAdminRecentErrors() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.recentErrors,
    queryFn: adminObservabilityAPI.getRecentErrors,
    enabled: authed,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}
