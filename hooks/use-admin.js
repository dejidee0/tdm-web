import {
  adminDashboardAPI,
  adminAnalyticsAPI,
  adminAIUsageAPI,
  adminObservabilityAPI,
} from "@/lib/api/admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  aiMonthlySpend: (months) => ["admin", "ai", "usage", "monthly-spend", months],
  // Observability
  health: ["admin", "observability", "health"],
  metrics: ["admin", "observability", "metrics"],
  recentErrors: ["admin", "observability", "recent-errors"],
};

// ─── Analytics ────────────────────────────────────────────────────────────────

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.overview,
    queryFn: adminAnalyticsAPI.getOverview,
    staleTime: 3 * 60 * 1000,
  });
}

export function useMonthlyRevenue() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.monthlyRevenue,
    queryFn: adminAnalyticsAPI.getMonthlyRevenue,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePaymentDistribution() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.paymentDistribution,
    queryFn: adminAnalyticsAPI.getPaymentDistribution,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.stats,
    queryFn: adminDashboardAPI.getStats,
    staleTime: 2 * 60 * 1000,
  });
}

export function useDashboardRevenue(timeRange = "30d") {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.revenue(timeRange), "dashboard"],
    queryFn: () => adminDashboardAPI.getRevenue(timeRange),
    staleTime: 5 * 60 * 1000,
  });
}

export function useServerLoad() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.serverLoad,
    queryFn: adminDashboardAPI.getServerLoad,
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000, // passive background poll every 2 min
  });
}

export function useAdminAlerts() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.alerts,
    queryFn: adminDashboardAPI.getAlerts,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminQuickActions() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.quickActions,
    queryFn: adminDashboardAPI.getQuickActions,
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
  });
}

// ─── Admin AI Usage ────────────────────────────────────────────────────────────

// GET /admin/ai/usage/monthly-spend?months=6
export function useAdminAIMonthlySpend(months = 6) {
  return useQuery({
    queryKey: ["admin", "ai", "usage", "monthly-spend", months],
    queryFn: () => adminAIUsageAPI.getMonthlySpend(months),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// GET /admin/ai/credits/{userId}
export function useAdminAIUserCredits(userId) {
  return useQuery({
    queryKey: ["admin", "ai", "credits", userId],
    queryFn: () => adminAIUsageAPI.getUserCredits(userId),
    enabled: !!userId,  // userId is the real dependency, not auth
    staleTime: 60 * 1000,
    retry: false,
  });
}

// POST /admin/ai/credits/adjust
export function useAdminAIAdjustCredits() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminAIUsageAPI.adjustUserCredits,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "ai", "credits", variables.userId] });
    },
  });
}

// GET /admin/ai/usage/user/{userId}?year=&month=
export function useAdminAIUserUsage(userId, { year, month } = {}) {
  return useQuery({
    queryKey: ["admin", "ai", "usage", "user", userId, year, month],
    queryFn: () => adminAIUsageAPI.getUserUsage(userId, { year, month }),
    enabled: !!userId,  // userId is the real dependency, not auth
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

// ─── Admin Observability ───────────────────────────────────────────────────────

export function useAdminHealth() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.health,
    queryFn: adminObservabilityAPI.getHealth,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useAdminMetrics() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.metrics,
    queryFn: adminObservabilityAPI.getMetrics,
    staleTime: 60 * 1000,
  });
}

export function useAdminRecentErrors() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.recentErrors,
    queryFn: adminObservabilityAPI.getRecentErrors,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true, // errors are the one thing worth re-checking on focus
  });
}
