import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersAPI } from "@/lib/api/admin";

// Query keys
export const ADMIN_USERS_QUERY_KEYS = {
  all: ["admin", "users"],
  list: (filters) => [...ADMIN_USERS_QUERY_KEYS.all, "list", filters],
  detail: (id) => [...ADMIN_USERS_QUERY_KEYS.all, "detail", id],
};

/**
 * Hook to fetch admin users with filters
 */
export function useAdminUsers(filters = {}) {
  const { page = 1, pageSize = 10, search = "" } = filters;

  return useQuery({
    queryKey: ADMIN_USERS_QUERY_KEYS.list({ page, pageSize, search }),
    queryFn: () => adminUsersAPI.getUsers({ page, pageSize, search }),
    staleTime: 30 * 1000, // 30 seconds
    keepPreviousData: true, // Keep previous page data while fetching new page
  });
}

/**
 * Hook to suspend a user
 */
export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => adminUsersAPI.suspendUser(userId),
    onSuccess: () => {
      // Invalidate users list to refetch with updated status
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook to reactivate a user
 */
export function useReactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => adminUsersAPI.reactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => adminUsersAPI.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEYS.all });
    },
  });
}
