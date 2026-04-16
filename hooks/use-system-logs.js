import { adminSystemLogsAPI } from "@/lib/api/admin";
import { useQuery, useMutation } from "@tanstack/react-query";

export const SYSTEM_LOGS_QUERY_KEYS = {
  stats: ["admin", "system-logs", "stats"],
  logs: (filters) => ["admin", "system-logs", "logs", filters],
};

export function useSystemStats(dateRange = "12") {
  return useQuery({
    queryKey: [...SYSTEM_LOGS_QUERY_KEYS.stats, dateRange],
    queryFn: () => adminSystemLogsAPI.getStats(dateRange),
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}

export function useSystemLogs({ page = 1, limit = 6, search = "", severity = "all", dateRange = "" }) {
  return useQuery({
    queryKey: SYSTEM_LOGS_QUERY_KEYS.logs({ page, limit, search, severity, dateRange }),
    queryFn: () =>
      adminSystemLogsAPI.getLogs({
        page,
        limit,
        search,
        severity: severity === "all" ? "" : severity,
        dateRange,
      }),
    staleTime: 30 * 1000,
    keepPreviousData: true,
  });
}

export function useExportLogs() {
  return useMutation({
    mutationFn: (params) => adminSystemLogsAPI.exportLogs(params),
  });
}
