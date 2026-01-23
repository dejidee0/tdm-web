import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsAPI } from "@/lib/mock/notifications";

// Query keys
export const NOTIFICATIONS_QUERY_KEYS = {
  all: ["notifications"],
  list: (filters) => ["notifications", "list", filters],
};

// Hook to fetch notifications
export function useNotifications(filters = {}) {
  const { category = "all", search = "" } = filters;

  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.list({ category, search }),
    queryFn: () => notificationsAPI.getNotifications({ category, search }),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Hook to mark all as read
export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsAPI.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all });
    },
  });
}

// Hook to mark single notification as read
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => notificationsAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all });
    },
  });
}
