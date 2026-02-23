import { adminAnalyticsAPI, adminFinancialAPI } from "@/lib/api/admin";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getToken } from "@/lib/client-auth";

// Query keys
export const FINANCIAL_QUERY_KEYS = {
  stats: ["admin", "financial", "stats"],
  monthlyRevenue: ["admin", "financial", "monthly-revenue"],
  revenueByService: ["admin", "financial", "revenue-by-service"],
  transactions: (filters) => ["admin", "financial", "transactions", filters],
  analyticsOverview: ["admin", "analytics", "overview"],
  paymentDistribution: ["admin", "analytics", "payment-distribution"],
};

// Hook to fetch financial stats
export function useFinancialStats() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.stats,
    queryFn: adminFinancialAPI.getStats,
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to fetch monthly revenue trends
export function useMonthlyRevenue() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.monthlyRevenue,
    queryFn: adminFinancialAPI.getMonthlyRevenue,
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch revenue by service
export function useRevenueByService() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.revenueByService,
    queryFn: adminFinancialAPI.getRevenueByService,
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch transactions
export function useTransactions({ page = 1, limit = 5, search = "", filter = "all" }) {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.transactions({ page, limit, search, filter }),
    queryFn: () => adminFinancialAPI.getTransactions({ page, limit, search, filter }),
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 60 * 1000, // 1 minute
    keepPreviousData: true,
  });
}

// Hook to export financial report
export function useExportFinancialReport() {
  return useMutation({
    mutationFn: adminFinancialAPI.exportFinancialReport,
    onSuccess: (data) => {
      console.log('✅ Financial report exported:', data?.filename);
    },
    onError: (error) => {
      console.error('❌ Financial report export failed:', error);
    },
  });
}

// Hook to fetch analytics overview
export function useAnalyticsOverview() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.analyticsOverview,
    queryFn: adminAnalyticsAPI.getOverview,
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to fetch payment distribution
export function usePaymentDistribution() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.paymentDistribution,
    queryFn: adminAnalyticsAPI.getPaymentDistribution,
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
