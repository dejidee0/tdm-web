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
import { subscriptionKeys } from "@/hooks/use-subscription";
import { ANON_SESSION, sessionKey, useSession } from "@/hooks/use-session";

export const authKeys = {
  all: ["auth"],
  user: () => [...authKeys.all, "user"],
};

/**
 * The full user record from the backend — phoneNumber, emailVerified, and the
 * rest of the fields the session JWT doesn't carry.
 *
 * Gated on the session: an anonymous visitor never reaches the backend. If all
 * you need is identity or role, use useSession() instead — it costs nothing
 * extra once the page has loaded.
 */
export function useCurrentUser() {
  const { isAuthenticated, isLoading: sessionLoading } = useSession();

  const query = useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await fetch("/api/proxy/v1/auth/me");
      if (!response.ok) {
        if (response.status === 401) return null;
        throw new Error("Failed to fetch user");
      }
      const json = await response.json();
      return json?.data ?? json;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: true,
  });

  // While the session is still resolving we don't yet know whether a fetch is
  // coming, so surface that as loading rather than as "logged out".
  return { ...query, isLoading: sessionLoading || query.isLoading };
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
      // 1. Update auth state. The session is refetched rather than seeded —
      //    its user shape comes from the JWT claims, not the login response.
      queryClient.setQueryData(authKeys.user(), data.user);
      await queryClient.invalidateQueries({ queryKey: sessionKey });

      // 2. Seed subscription cache from login response so useSubscriptionState
      //    works immediately without waiting for a separate fetch.
      //    Normalize capitalized backend values to lowercase (e.g. "Premium" → "premium").
      if (data.user?.subscription) {
        const s = data.user.subscription;
        queryClient.setQueryData(subscriptionKeys.current(), {
          tier: s.tier?.toLowerCase() ?? null,
          status: s.status?.toLowerCase() ?? null,
          billingCycle: s.billingCycle?.toLowerCase() ?? null,
          startDate: s.startDate ?? null,
          endDate: s.endDate ?? null,
          generationsUsed: s.generationsUsed ?? 0,
          generationsAllowed: s.generationsLimit ?? null,
          unlimitedGenerations: s.unlimitedGenerations ?? false,
        });
      }

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
      // removeQueries on ["auth"] also drops ["auth","session"], so re-seed the
      // session as anonymous afterwards — otherwise the navbar refetches and
      // flashes a loading state on the way to /sign-in.
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.setQueryData(sessionKey, ANON_SESSION);
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

// Identity + role only, straight off the session — no backend round trip.
// Use this for gating UI (save buttons, nav state); use useCurrentUser() when
// you need profile fields the JWT doesn't carry.
export function useIsAuthenticated() {
  const { user, isAuthenticated, isLoading } = useSession();
  return { isAuthenticated, isLoading, user };
}

export function useIsUserAuthed() {
  return useSession().isAuthenticated;
}
