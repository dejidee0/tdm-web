"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { vendorLogin, vendorLogout, vendorRefreshToken } from "@/lib/actions/vendor-auth";

export const VENDOR_ME_KEY = ["auth", "vendor", "me"];

// ---------------------------------------------------------------------------
// Auth state — source of truth for all vendor data hooks
// ---------------------------------------------------------------------------

export function useVendorUser() {
  return useQuery({
    queryKey: VENDOR_ME_KEY,
    queryFn: () =>
      fetch("/api/auth/vendor/me")
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useIsVendorAuthed() {
  const { data } = useVendorUser();
  return !!data;
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export function useVendorLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => {
      console.log("credentials", credentials);
      return vendorLogin(credentials).then((result) => {
        console.log("result", result);
        if (!result.success) throw new Error(result.error);
        return result.data;
      });
    },
    onSuccess: (data) => {
      // Seed the /me cache immediately so dashboard queries fire without waiting
      queryClient.setQueryData(VENDOR_ME_KEY, data.vendor);
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
      queryClient.setQueryData(VENDOR_ME_KEY, null);
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
