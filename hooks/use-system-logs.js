import { adminSystemLogsAPI } from "@/lib/api/admin";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useIsAdminAuthed } from "@/hooks/use-admin-auth";

export const SYSTEM_LOGS_QUERY_KEYS = {
  stats: ["admin", "system-logs", "stats"],
  logs: (filters) => ["admin", "system-logs", "logs", filters],
};

export function useSystemStats(dateRange = "12") {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: [...SYSTEM_LOGS_QUERY_KEYS.stats, dateRange],
    queryFn: () => adminSystemLogsAPI.getStats(dateRange),
    enabled: authed,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

export function useSystemLogs({ page = 1, limit = 6, search = "", severity = "all", dateRange = "" }) {
  const authed = useIsAdminAuthed();
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
    enabled: authed,
    staleTime: 10 * 1000,
    keepPreviousData: true,
  });
}

export function useExportLogs() {
  return useMutation({
    mutationFn: (params) => adminSystemLogsAPI.exportLogs(params),
    onSuccess: (data) => {
      console.log("✅ System logs exported:", data?.filename);
    },
    onError: (error) => {
      console.error("❌ System logs export failed:", error);
    },
  });
}
