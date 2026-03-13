import { adminAnalyticsAPI, adminFinancialAPI } from "@/lib/api/admin";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useIsAdminAuthed } from "@/hooks/use-admin-auth";

export const FINANCIAL_QUERY_KEYS = {
  stats: ["admin", "financial", "stats"],
  monthlyRevenue: ["admin", "financial", "monthly-revenue"],
  revenueByService: ["admin", "financial", "revenue-by-service"],
  transactions: (filters) => ["admin", "financial", "transactions", filters],
  analyticsOverview: ["admin", "analytics", "overview"],
  paymentDistribution: ["admin", "analytics", "payment-distribution"],
};

export function useFinancialStats() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.stats,
    queryFn: adminFinancialAPI.getStats,
    enabled: authed,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMonthlyRevenue() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.monthlyRevenue,
    queryFn: adminFinancialAPI.getMonthlyRevenue,
    enabled: authed,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRevenueByService() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.revenueByService,
    queryFn: adminFinancialAPI.getRevenueByService,
    enabled: authed,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTransactions({ page = 1, limit = 5, search = "", filter = "all" }) {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.transactions({ page, limit, search, filter }),
    queryFn: () => adminFinancialAPI.getTransactions({ page, limit, search, filter }),
    enabled: authed,
    staleTime: 60 * 1000,
    keepPreviousData: true,
  });
}

export function useExportFinancialReport() {
  return useMutation({
    mutationFn: adminFinancialAPI.exportFinancialReport,
    onSuccess: (data) => {
      console.log("✅ Financial report exported:", data?.filename);
    },
    onError: (error) => {
      console.error("❌ Financial report export failed:", error);
    },
  });
}

export function useAnalyticsOverview() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.analyticsOverview,
    queryFn: adminAnalyticsAPI.getOverview,
    enabled: authed,
    staleTime: 2 * 60 * 1000,
  });
}

export function usePaymentDistribution() {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: FINANCIAL_QUERY_KEYS.paymentDistribution,
    queryFn: adminAnalyticsAPI.getPaymentDistribution,
    enabled: authed,
    staleTime: 5 * 60 * 1000,
  });
}
