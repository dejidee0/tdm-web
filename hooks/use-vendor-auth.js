"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  vendorLogin,
  vendorLogout,
  vendorRefreshToken,
} from "@/lib/actions/vendor-auth";

/**
 * Query key factory for vendor auth
 */
export const vendorAuthKeys = {
  all: ["vendorAuth"],
  vendor: () => [...vendorAuthKeys.all, "vendor"],
};

/**
 * Hook for vendor login
 */
export function useVendorLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const result = await vendorLogin(credentials);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: (data) => {
      console.log('🎉 Vendor login success! Data received:', data);
      console.log('🔑 Token from response:', data.token ? 'TOKEN EXISTS' : 'NO TOKEN IN RESPONSE');

      // Store token in localStorage as vendorToken
      if (data.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("vendorToken", data.token);
          console.log('✅ Vendor token stored in localStorage');
        }
      } else {
        console.error('❌ NO TOKEN in response data - cannot authenticate!');
      }

      // Update vendor cache
      queryClient.setQueryData(vendorAuthKeys.vendor(), data.vendor);

      // Redirect to vendor dashboard
      router.push("/vendor/dashboard");
      router.refresh();
    },
    onError: (error) => {
      console.error("Vendor login failed:", error);
    },
  });
}

/**
 * Hook for vendor logout
 */
export function useVendorLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await vendorLogout();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      // Remove vendor token from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("vendorToken");
      }

      // Clear all vendor-related cache
      queryClient.setQueryData(vendorAuthKeys.vendor(), null);
      queryClient.removeQueries({ queryKey: vendorAuthKeys.all });
      queryClient.removeQueries({ queryKey: ["vendor"] }); // Clear all vendor data

      // Redirect to vendor login
      router.push("/vendor/login");
      router.refresh();
    },
    onError: (error) => {
      console.error("Vendor logout failed:", error);
    },
  });
}

/**
 * Hook for token refresh
 */
export function useVendorRefreshToken() {
  return useMutation({
    mutationFn: async (refreshToken) => {
      const result = await vendorRefreshToken(refreshToken);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onError: (error) => {
      console.error("Vendor token refresh failed:", error);
    },
  });
}
