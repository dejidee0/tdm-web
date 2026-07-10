"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { vendorLogin, vendorLogout, vendorRefreshToken } from "@/lib/actions/vendor-auth";
import { ANON_SESSION, sessionKey, useSession } from "@/hooks/use-session";

// ---------------------------------------------------------------------------
// Auth state — derived from the single /api/auth/session query.
// ---------------------------------------------------------------------------

export function useVendorUser() {
  const { user, isVendor, isLoading } = useSession();
  return { data: isVendor ? user : null, isLoading };
}

export function useIsVendorAuthed() {
  return useSession().isVendor;
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export function useVendorLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) =>
      vendorLogin(credentials).then((result) => {
        if (!result.success) throw new Error(result.error);
        return result.data;
      }),
    onSuccess: (data) => {
      // Seed the session cache immediately so dashboard queries fire without waiting
      queryClient.setQueryData(sessionKey, { role: "vendor", user: data.vendor });
      router.push("/vendor/dashboard");
      router.refresh();
    },
    onError: (error) => {
      console.error("Vendor login failed:", error);
    },
  });
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export function useVendorLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      vendorLogout().then((result) => {
        if (!result.success) throw new Error(result.error);
        return result;
      }),
    onSuccess: () => {
      queryClient.setQueryData(sessionKey, ANON_SESSION);
      queryClient.removeQueries({ queryKey: ["vendor"] });
      router.push("/vendor/login");
      router.refresh();
    },
    onError: (error) => {
      console.error("Vendor logout failed:", error);
    },
  });
}

// ---------------------------------------------------------------------------
// Token refresh
// ---------------------------------------------------------------------------

export function useVendorRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken) =>
      vendorRefreshToken(refreshToken).then((result) => {
        if (!result.success) throw new Error(result.error);
        return result.data;
      }),
    onError: (error) => {
      console.error("Vendor token refresh failed:", error);
    },
  });
}
