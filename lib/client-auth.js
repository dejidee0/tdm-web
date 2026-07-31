/**
 * Auth state is managed entirely via httpOnly cookies + one React Query session route.
 *
 * - GET /api/auth/session → useSession() in hooks/use-session.js
 *
 * useAdminUser(), useVendorUser(), useIsAuthenticated() and friends are all thin
 * derivations of useSession(), so the whole app costs one auth request per page.
 *
 * This file is intentionally minimal. Do not add token storage or getToken() back here.
 */
