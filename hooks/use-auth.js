// hooks/use-auth.js — updated useLogin to handle ?from= redirect
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
} from "@/lib/actions/auth";
import { removeToken } from "@/lib/client-auth";

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
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.invalidateQueries({ queryKey: authKeys.user() });

      // Redirect back to the page they were trying to visit, or home
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
      removeToken();
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });

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

export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser();
  return { isAuthenticated: !!user, isLoading, user };
}
