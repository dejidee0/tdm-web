import { usersAPI } from "@/lib/mock/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query keys
export const USERS_QUERY_KEYS = {
  users: (filters) => ["admin", "users", filters],
  userById: (id) => ["admin", "users", id],
};

// Hook to fetch users with pagination and filters
export function useUsers({ page = 1, limit = 5, search = "", role = "all", status = "any" }) {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.users({ page, limit, search, role, status }),
    queryFn: () => usersAPI.getUsers({ page, limit, search, role, status }),
    staleTime: 60 * 1000, // 1 minute
    keepPreviousData: true, // Keep previous data while fetching new page
  });
}

// Hook to fetch user by ID
export function useUserById(id) {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.userById(id),
    queryFn: () => usersAPI.getUserById(id),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!id, // Only fetch if ID is provided
  });
}

// Hook to toggle user status
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => usersAPI.toggleUserStatus(userId),
    onSuccess: () => {
      // Invalidate users queries to refetch
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

// Hook to update user role
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, newRole }) => usersAPI.updateUserRole(userId, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

// Hook to delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => usersAPI.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

// Hook to export users
export function useExportUsers() {
  return useMutation({
    mutationFn: usersAPI.exportUsers,
  });
}
