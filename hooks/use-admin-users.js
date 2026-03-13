import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersAPI } from "@/lib/api/admin";
import { useIsAdminAuthed } from "@/hooks/use-admin-auth";

export const ADMIN_USERS_QUERY_KEYS = {
  all: ["admin", "users"],
  list: (filters) => [...ADMIN_USERS_QUERY_KEYS.all, "list", filters],
  detail: (id) => [...ADMIN_USERS_QUERY_KEYS.all, "detail", id],
};

export function useAdminUsers(filters = {}) {
  const authed = useIsAdminAuthed();
  const { page = 1, pageSize = 10, search = "", role = "", status = "" } = filters;

  return useQuery({
    queryKey: ADMIN_USERS_QUERY_KEYS.list({ page, pageSize, search, role, status }),
    queryFn: () => adminUsersAPI.getUsers({ page, pageSize, search, role, status }),
    enabled: authed,
    staleTime: 30 * 1000,
    keepPreviousData: true,
  });
}

export function useUserById(id) {
  const authed = useIsAdminAuthed();
  return useQuery({
    queryKey: ADMIN_USERS_QUERY_KEYS.detail(id),
    queryFn: () => adminUsersAPI.getUserById(id),
    enabled: authed && !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData) => adminUsersAPI.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("❌ Failed to create user:", error);
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => adminUsersAPI.updateUserStatus(id, isActive),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEYS.all });
      queryClient.setQueryData(ADMIN_USERS_QUERY_KEYS.detail(variables.id), data);
    },
    onError: (error) => {
      console.error("❌ Failed to update user status:", error);
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newRole }) => adminUsersAPI.updateUserRole(id, newRole),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEYS.all });
      queryClient.setQueryData(ADMIN_USERS_QUERY_KEYS.detail(variables.id), data);
    },
    onError: (error) => {
      console.error("❌ Failed to update user role:", error);
    },
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => adminUsersAPI.suspendUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("❌ Failed to suspend user:", error);
    },
  });
}

export function useReactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => adminUsersAPI.reactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("❌ Failed to reactivate user:", error);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => adminUsersAPI.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error("❌ Failed to delete user:", error);
    },
  });
}

export function useExportUsers() {
  return useMutation({
    mutationFn: (params) => adminUsersAPI.exportUsers(params),
    onSuccess: (data) => {
      console.log("✅ Users exported:", data?.filename);
    },
    onError: (error) => {
      console.error("❌ Failed to export users:", error);
    },
  });
}
