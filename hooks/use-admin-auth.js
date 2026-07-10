"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { adminLogin, adminLogout, adminRefreshToken } from "@/lib/actions/admin-auth";
import { ANON_SESSION, sessionKey, useSession } from "@/hooks/use-session";

// ---------------------------------------------------------------------------
// Auth state — derived from the single /api/auth/session query.
// ---------------------------------------------------------------------------

export function useAdminUser() {
  const { user, isAdmin, isLoading } = useSession();
  return { data: isAdmin ? user : null, isLoading };
}

export function useIsAdminAuthed() {
  return useSession().isAdmin;
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
      // Seed the session cache immediately so dashboard queries fire without waiting
      queryClient.setQueryData(sessionKey, { role: "admin", user: data.admin });
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
      queryClient.setQueryData(sessionKey, ANON_SESSION);
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
