// hooks/use-session.js
"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * The one auth query in the app.
 *
 * Everything that needs to know "is someone logged in, and as what?" reads
 * this. useAdminUser / useVendorUser / useIsAuthenticated are all thin
 * derivations of it, so a page render costs a single /api/auth/session call
 * no matter how many components ask.
 *
 * The payload comes from decoding the httpOnly JWT server-side, so it carries
 * identity + role only (id, email, firstName, lastName, fullName, role).
 * For the full profile — phoneNumber, emailVerified, addresses — use
 * useCurrentUser() or useProfile(), both of which are gated on this hook.
 */
export const sessionKey = ["auth", "session"];

export const ANON_SESSION = { role: null, user: null };

export function useSession() {
  const { data = ANON_SESSION, isLoading } = useQuery({
    queryKey: sessionKey,
    queryFn: async () => {
      const res = await fetch("/api/auth/session");
      if (!res.ok) return ANON_SESSION;
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user: data.user,
    role: data.role,
    isLoading,
    isAuthenticated: !!data.role,
    isAdmin: data.role === "admin",
    isVendor: data.role === "vendor",
  };
}
