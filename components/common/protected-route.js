"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated } from "@/lib/hooks/useAuth";

/**
 * Protected Route Component
 * Redirects unauthenticated users to sign-in page
 * Shows loading state while checking authentication
 */
export default function ProtectedRoute({ children, fallback = null }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the intended destination
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    );
  }

  // User is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
