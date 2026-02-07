import { systemLogsAPI } from "@/lib/mock/system-logs";
import { useQuery, useMutation } from "@tanstack/react-query";

// Query keys
export const SYSTEM_LOGS_QUERY_KEYS = {
  stats: ["admin", "system-logs", "stats"],
  logs: (filters) => ["admin", "system-logs", "logs", filters],
};

// Hook to fetch system stats
export function useSystemStats() {
  return useQuery({
    queryKey: SYSTEM_LOGS_QUERY_KEYS.stats,
    queryFn: systemLogsAPI.getStats,
    staleTime: 30 * 1000, // 30 seconds (live metrics)
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
  });
}

// Hook to fetch logs
export function useSystemLogs({ page = 1, limit = 6, search = "", severity = "all", dateRange = null }) {
  return useQuery({
    queryKey: SYSTEM_LOGS_QUERY_KEYS.logs({ page, limit, search, severity, dateRange }),
    queryFn: () => systemLogsAPI.getLogs({ page, limit, search, severity, dateRange }),
    staleTime: 10 * 1000, // 10 seconds
    keepPreviousData: true,
  });
}

// Hook to export logs
export function useExportLogs() {
  return useMutation({
    mutationFn: systemLogsAPI.exportLogs,
  });
}
