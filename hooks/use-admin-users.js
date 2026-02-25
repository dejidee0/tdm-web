import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersAPI } from "@/lib/api/admin";
import { getToken } from "@/lib/client-auth";

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
  const { page = 1, pageSize = 10, search = "", role = "", status = "" } = filters;

  return useQuery({
    queryKey: ADMIN_USERS_QUERY_KEYS.list({ page, pageSize, search, role, status }),
    queryFn: () => adminUsersAPI.getUsers({ page, pageSize, search, role, status }),
    enabled: typeof window !== "undefined" && !!getToken(),
    staleTime: 30 * 1000, // 30 seconds
    keepPreviousData: true, // Keep previous page data while fetching new page
  });
}

/**
 * Hook to fetch a single user by ID
 */
export function useUserById(id) {
  return useQuery({
    queryKey: ADMIN_USERS_QUERY_KEYS.detail(id),
    queryFn: () => adminUsersAPI.getUserById(id),
    enabled: typeof window !== "undefined" && !!getToken() && !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => adminUsersAPI.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error('❌ Failed to create user:', error);
    },
  });
}

/**
 * Hook to update user status (active/inactive)
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => adminUsersAPI.updateUserStatus(id, isActive),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEYS.all });
      queryClient.setQueryData(ADMIN_USERS_QUERY_KEYS.detail(variables.id), data);
    },
    onError: (error) => {
      console.error('❌ Failed to update user status:', error);
    },
  });
}

/**
 * Hook to update user role
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newRole }) => adminUsersAPI.updateUserRole(id, newRole),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEYS.all });
      queryClient.setQueryData(ADMIN_USERS_QUERY_KEYS.detail(variables.id), data);
    },
    onError: (error) => {
      console.error('❌ Failed to update user role:', error);
    },
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
    onError: (error) => {
      console.error('❌ Failed to suspend user:', error);
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
    onError: (error) => {
      console.error('❌ Failed to reactivate user:', error);
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
    onError: (error) => {
      console.error('❌ Failed to delete user:', error);
    },
  });
}

/**
 * Hook to export users to CSV
 */
export function useExportUsers() {
  return useMutation({
    mutationFn: (params) => adminUsersAPI.exportUsers(params),
    onSuccess: (data) => {
      console.log('✅ Users exported:', data?.filename);
    },
    onError: (error) => {
      console.error('❌ Failed to export users:', error);
    },
  });
}
