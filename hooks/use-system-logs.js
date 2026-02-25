import { adminSystemLogsAPI } from "@/lib/api/admin";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getToken } from "@/lib/client-auth";

// Query keys
export const SYSTEM_LOGS_QUERY_KEYS = {
  stats: ["admin", "system-logs", "stats"],
  logs: (filters) => ["admin", "system-logs", "logs", filters],
};

// Hook to fetch system stats
export function useSystemStats(dateRange = "12") {
  return useQuery({
    queryKey: [...SYSTEM_LOGS_QUERY_KEYS.stats, dateRange],
    queryFn: () => adminSystemLogsAPI.getStats(dateRange),
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 30 * 1000, // 30 seconds (live metrics)
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
  });
}

// Hook to fetch logs
export function useSystemLogs({ page = 1, limit = 6, search = "", severity = "all", dateRange = "" }) {
  return useQuery({
    queryKey: SYSTEM_LOGS_QUERY_KEYS.logs({ page, limit, search, severity, dateRange }),
    queryFn: () => adminSystemLogsAPI.getLogs({
      page,
      limit,
      search,
      severity: severity === "all" ? "" : severity,
      dateRange
    }),
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 10 * 1000, // 10 seconds
    keepPreviousData: true,
  });
}

// Hook to export logs
export function useExportLogs() {
  return useMutation({
    mutationFn: (params) => adminSystemLogsAPI.exportLogs(params),
    onSuccess: (data) => {
      console.log('✅ System logs exported:', data?.filename);
    },
    onError: (error) => {
      console.error('❌ System logs export failed:', error);
    },
  });
}
