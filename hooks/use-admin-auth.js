"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { adminLogin, adminLogout, adminRefreshToken } from "@/lib/actions/admin-auth";

export const ADMIN_ME_KEY = ["auth", "admin", "me"];

// ---------------------------------------------------------------------------
// Auth state — source of truth for all admin data hooks
// ---------------------------------------------------------------------------

export function useAdminUser() {
  return useQuery({
    queryKey: ADMIN_ME_KEY,
    queryFn: () =>
      fetch("/api/auth/admin/me")
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useIsAdminAuthed() {
  const { data } = useAdminUser();
  return !!data;
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export function useAdminLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) =>
      adminLogin(credentials).then((result) => {
        if (!result.success) throw new Error(result.error);
        return result.data;
      }),
    onSuccess: (data) => {
      // Seed the /me cache immediately so dashboard queries fire without waiting
      queryClient.setQueryData(ADMIN_ME_KEY, data.admin);
      router.push("/admin/dashboard");
      router.refresh();
    },
    onError: (error) => {
      console.error("Admin login failed:", error);
    },
  });
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export function useAdminLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      adminLogout().then((result) => {
        if (!result.success) throw new Error(result.error);
        return result;
      }),
    onSuccess: () => {
      queryClient.setQueryData(ADMIN_ME_KEY, null);
      queryClient.removeQueries({ queryKey: ["admin"] });
      router.push("/admin/login");
      router.refresh();
    },
    onError: (error) => {
      console.error("Admin logout failed:", error);
    },
  });
}

// ---------------------------------------------------------------------------
// Token refresh
// ---------------------------------------------------------------------------

export function useAdminRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken) =>
      adminRefreshToken(refreshToken).then((result) => {
        if (!result.success) throw new Error(result.error);
        return result.data;
      }),
    onError: (error) => {
      console.error("Admin token refresh failed:", error);
    },
  });
}
