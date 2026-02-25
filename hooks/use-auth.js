"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  loginUser,
  registerUser,
  logoutUser,
  forgotPassword,
  verifyEmail,
  resendVerificationCode,
} from "@/lib/actions/auth";
import { setToken, removeToken, getToken } from "@/lib/client-auth";

/**
 * Query key factory for auth-related queries
 */
export const authKeys = {
  all: ["auth"],
  user: () => [...authKeys.all, "user"],
};

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      console.log('response', response);

      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        throw new Error("Failed to fetch user");
      }
      return response.json();
    },
    enabled: typeof window !== "undefined" && !!getToken(), // Only run query if token exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook for user registration
 */
export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData) => {
      const result = await registerUser(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: (data) => {
      // Store email for verification page
      if (typeof window !== "undefined") {
        localStorage.setItem("verificationEmail", data.email);
      }
      // Redirect to verification page
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
}

/**
 * Hook for user login
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const result = await loginUser(credentials);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: (data) => {
      // Store token in localStorage
      if (data.token) {
        setToken(data.token);
      }

      // Update user cache
      queryClient.setQueryData(authKeys.user(), data.user);

      // Redirect to home/dashboard
      router.push("/");
      router.refresh(); // Refresh server components
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await logoutUser();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      // Remove token from localStorage
      removeToken();

      // Clear all user-related cache
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });

      // Clear any stored data
      if (typeof window !== "undefined") {
        localStorage.removeItem("verificationEmail");
        sessionStorage.clear();
      }

      // Redirect to sign in
      router.push("/sign-in");
      router.refresh();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
}

/**
 * Hook for forgot password
 */
export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData) => {
      const result = await forgotPassword(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: (data) => {
      // Redirect to confirmation page
      router.push(`/reset-email-sent?email=${encodeURIComponent(data.email)}`);
    },
    onError: (error) => {
      console.error("Forgot password failed:", error);
    },
  });
}

/**
 * Hook for email verification
 */
export function useVerifyEmail() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, code }) => {
      const result = await verifyEmail(email, code);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: () => {
      // Clear verification email from storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("verificationEmail");
      }

      // Redirect to sign in
      router.push("/sign-in?verified=true");
    },
    onError: (error) => {
      console.error("Email verification failed:", error);
    },
  });
}

/**
 * Hook for resending verification code
 */
export function useResendVerification() {
  return useMutation({
    mutationFn: async (email) => {
      const result = await resendVerificationCode(email);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onError: (error) => {
      console.error("Resend verification failed:", error);
    },
  });
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser();

  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}
