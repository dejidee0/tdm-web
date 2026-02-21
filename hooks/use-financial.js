import { financialAPI } from "@/lib/mock/financial";
import { adminAnalyticsAPI } from "@/lib/api/admin";
import { useQuery, useMutation } from "@tanstack/react-query";

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
    queryFn: financialAPI.getStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to fetch monthly revenue trends
export function useMonthlyRevenue() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.monthlyRevenue,
    queryFn: financialAPI.getMonthlyRevenue,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch revenue by service
export function useRevenueByService() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.revenueByService,
    queryFn: financialAPI.getRevenueByService,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch transactions
export function useTransactions({ page = 1, limit = 5, search = "", filter = "all" }) {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.transactions({ page, limit, search, filter }),
    queryFn: () => financialAPI.getTransactions({ page, limit, search, filter }),
    staleTime: 60 * 1000, // 1 minute
    keepPreviousData: true,
  });
}

// Hook to export financial report
export function useExportFinancialReport() {
  return useMutation({
    mutationFn: financialAPI.exportReport,
  });
}

// Hook to fetch analytics overview
export function useAnalyticsOverview() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.analyticsOverview,
    queryFn: adminAnalyticsAPI.getOverview,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to fetch payment distribution
export function usePaymentDistribution() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.paymentDistribution,
    queryFn: adminAnalyticsAPI.getPaymentDistribution,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
