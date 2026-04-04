// hooks/use-auth.js
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  loginUser,
  registerUser,
  logoutUser,
  forgotPassword,
  verifyEmail,
  resendVerificationCode,
  resetPassword,
} from "@/lib/actions/auth";
import { cartApi } from "@/lib/api/cart";

export const authKeys = {
  all: ["auth"],
  user: () => [...authKeys.all, "user"],
};

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        if (response.status === 401) return null;
        throw new Error("Failed to fetch user");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: true,
  });
}

export function useRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (formData) => {
      const result = await registerUser(formData);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("verificationEmail", data.email);
      }
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: async (credentials) => {
      const result = await loginUser(credentials);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: async (data) => {
      // 1. Update auth state
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.invalidateQueries({ queryKey: authKeys.user() });

      // 2. Role-based redirect — vendors go to their dashboard
      if (data.role === "Vendor") {
        router.push("/vendor/dashboard");
        router.refresh();
        return;
      }

      // 3. Merge guest cart → backend (non-blocking, non-fatal)
      cartApi
        .mergeGuestCart()
        .then((result) => {
          if (result.warnings?.length) {
            console.info("[cart] merge warnings:", result.warnings);
          }
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        })
        .catch((err) => {
          console.warn("[cart] merge failed:", err.message);
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        });

      // 4. Redirect regular users
      const from = searchParams.get("from") || "/";
      router.push(from);
      router.refresh();
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await logoutUser();
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
      // Reset cart to empty so guest sees a fresh cart
      queryClient.setQueryData(["cart"], {
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        shipping: 0,
        taxRate: 0.0875,
      });

      if (typeof window !== "undefined") {
        localStorage.removeItem("verificationEmail");
        sessionStorage.clear();
      }

      router.push("/sign-in");
      router.refresh();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
}

export function useForgotPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (formData) => {
      const result = await forgotPassword(formData);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (data) => {
      router.push(`/reset-email-sent?email=${encodeURIComponent(data.email)}`);
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ email, code }) => {
      const result = await verifyEmail(email, code);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("verificationEmail");
      }
      router.push("/sign-in?verified=true");
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: async (email) => {
      const result = await resendVerificationCode(email);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

// POST /auth/reset-password — token-based password reset from email link
export function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data) => {
      const result = await resetPassword(data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      router.push("/sign-in?reset=true");
    },
  });
}

// GET /auth/providers — list available OAuth providers (public, client-side fetch)
export function useAuthProviders() {
  return useQuery({
    queryKey: ["auth", "providers"],
    queryFn: async () => {
      const res = await fetch("/api/proxy/v1/auth/providers");
      if (!res.ok) throw new Error(`Failed to fetch providers: ${res.status}`);
      return res.json();
    },
    staleTime: 10 * 60 * 1000, // providers rarely change
  });
}

export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser();
  return { isAuthenticated: !!user, isLoading, user };
}

export function useIsUserAuthed() {
  const { data } = useCurrentUser();
  return !!data;
}
