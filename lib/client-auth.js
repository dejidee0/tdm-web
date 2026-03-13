/**
 * Auth state is now managed entirely via httpOnly cookies + React Query /me routes.
 *
 * - Admin:  GET /api/auth/admin/me  →  useAdminUser()   in hooks/use-admin-auth.js
 * - Vendor: GET /api/auth/vendor/me →  useVendorUser()  in hooks/use-vendor-auth.js
 * - User:   GET /api/auth/me        →  useCurrentUser() in hooks/use-auth.js
 *
 * This file is intentionally minimal. Do not add token storage or getToken() back here.
 */
