"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  adminLogin,
  adminLogout,
  adminRefreshToken,
} from "@/lib/actions/admin-auth";
import { setToken, removeToken } from "@/lib/client-auth";

/**
 * Query key factory for admin auth
 */
export const adminAuthKeys = {
  all: ["adminAuth"],
  admin: () => [...adminAuthKeys.all, "admin"],
};

/**
 * Hook for admin login
 */
export function useAdminLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const result = await adminLogin(credentials);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: (data) => {
      console.log('🎉 Admin login success! Data received:', data);
      console.log('🔑 Token from response:', data.token ? 'TOKEN EXISTS' : 'NO TOKEN IN RESPONSE');

      // Store token in localStorage
      if (data.token) {
        setToken(data.token);
        console.log('✅ Token stored in localStorage');
      } else {
        console.error('❌ NO TOKEN in response data - cannot authenticate!');
      }

      // Update admin cache
      queryClient.setQueryData(adminAuthKeys.admin(), data.admin);

      // Redirect to admin dashboard
      router.push("/admin/dashboard");
      router.refresh();
    },
    onError: (error) => {
      console.error("Admin login failed:", error);
    },
  });
}

/**
 * Hook for admin logout
 */
export function useAdminLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await adminLogout();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      // Remove token from localStorage
      removeToken();

      // Clear all admin-related cache
      queryClient.setQueryData(adminAuthKeys.admin(), null);
      queryClient.removeQueries({ queryKey: adminAuthKeys.all });
      queryClient.removeQueries({ queryKey: ["admin"] }); // Clear all admin data

      // Redirect to admin login
      router.push("/admin/login");
      router.refresh();
    },
    onError: (error) => {
      console.error("Admin logout failed:", error);
    },
  });
}

/**
 * Hook for token refresh
 */
export function useAdminRefreshToken() {
  return useMutation({
    mutationFn: async (refreshToken) => {
      const result = await adminRefreshToken(refreshToken);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onError: (error) => {
      console.error("Admin token refresh failed:", error);
    },
  });
}
