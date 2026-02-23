import { adminDashboardAPI, adminAnalyticsAPI } from "@/lib/api/admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/client-auth";

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

// Hook to fetch analytics overview (real API)
export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.overview,
    queryFn: adminAnalyticsAPI.getOverview,
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to fetch monthly revenue (real API)
export function useMonthlyRevenue() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.monthlyRevenue,
    queryFn: adminAnalyticsAPI.getMonthlyRevenue,
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch payment distribution (real API)
export function usePaymentDistribution() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.paymentDistribution,
    queryFn: adminAnalyticsAPI.getPaymentDistribution,
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch dashboard stats (real API)
export function useDashboardStats() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.stats,
    queryFn: adminDashboardAPI.getStats,
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to fetch dashboard revenue (real API)
export function useDashboardRevenue(timeRange = "30d") {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.revenue(timeRange), "dashboard"],
    queryFn: () => adminDashboardAPI.getRevenue(timeRange),
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch server load (real API)
export function useServerLoad() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.serverLoad,
    queryFn: adminDashboardAPI.getServerLoad,
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 30 * 1000, // 30 seconds (more frequent for live metrics)
  });
}

// Hook to fetch alerts (real API)
export function useAdminAlerts() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.alerts,
    queryFn: adminDashboardAPI.getAlerts,
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 60 * 1000, // 1 minute
  });
}

// Hook to fetch quick actions (real API)
export function useAdminQuickActions() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.quickActions,
    queryFn: adminDashboardAPI.getQuickActions,
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 10 * 60 * 1000, // 10 minutes (static data)
  });
}

// Hook to refresh all dashboard data (real API)
export function useRefreshAdminDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminDashboardAPI.refreshDashboard,
    onSuccess: () => {
      // Invalidate all admin dashboard queries
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.overview });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.monthlyRevenue });
      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard", "revenue"],
      });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.serverLoad });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.alerts });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.quickActions });
    },
  });
}

// Hook to export report (real API)
export function useExportReport() {
  return useMutation({
    mutationFn: adminDashboardAPI.exportReport,
    onSuccess: (data) => {
      // If backend returns a download URL, open it
      if (data?.url) {
        const link = document.createElement('a');
        link.href = data.url;
        link.download = data?.filename || 'admin-dashboard-export.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('✅ Export downloaded:', data.filename);
      }
      // If backend returns just metadata, log it
      else if (data?.filename) {
        console.log('✅ Export created:', data.filename);
        console.log('⚠️ Note: Backend returned metadata but no download URL or file content');
      }
    },
    onError: (error) => {
      console.error('❌ Export failed:', error);
    },
  });
}
