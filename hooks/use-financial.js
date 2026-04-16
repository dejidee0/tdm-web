import { adminAnalyticsAPI, adminFinancialAPI } from "@/lib/api/admin";
import { useQuery, useMutation } from "@tanstack/react-query";

export const FINANCIAL_QUERY_KEYS = {
  stats: ["admin", "financial", "stats"],
  monthlyRevenue: ["admin", "financial", "monthly-revenue"],
  revenueByService: ["admin", "financial", "revenue-by-service"],
  transactions: (filters) => ["admin", "financial", "transactions", filters],
  analyticsOverview: ["admin", "analytics", "overview"],
  paymentDistribution: ["admin", "analytics", "payment-distribution"],
};

export function useFinancialStats() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.stats,
    queryFn: adminFinancialAPI.getStats,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMonthlyRevenue() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.monthlyRevenue,
    queryFn: adminFinancialAPI.getMonthlyRevenue,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRevenueByService() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.revenueByService,
    queryFn: adminFinancialAPI.getRevenueByService,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTransactions({ page = 1, limit = 5, search = "", filter = "all" }) {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.transactions({ page, limit, search, filter }),
    queryFn: () => adminFinancialAPI.getTransactions({ page, limit, search, filter }),
    staleTime: 60 * 1000,
    keepPreviousData: true,
  });
}

export function useExportFinancialReport() {
  return useMutation({
    mutationFn: adminFinancialAPI.exportFinancialReport,
  });
}

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.analyticsOverview,
    queryFn: adminAnalyticsAPI.getOverview,
    staleTime: 3 * 60 * 1000,
  });
}

export function usePaymentDistribution() {
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.paymentDistribution,
    queryFn: adminAnalyticsAPI.getPaymentDistribution,
    staleTime: 5 * 60 * 1000,
  });
}
