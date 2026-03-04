// lib/api/dashboard.js

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Authenticated fetch helper — reads the HTTP-only cookie automatically.
 * Throws on non-2xx so React Query can catch and handle errors.
 */
async function authFetch(path) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include", // sends HTTP-only authToken cookie
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error(`API error: ${res.status}`);

  return res.json();
}

export const dashboardApi = {
  /** Recent/latest order for dashboard overview */
  getRecentOrder: () => authFetch("/v1/Orders/recent"),

  /** All user orders with optional filters */
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`/v1/Orders?${query}`);
  },

  /** Single order detail */
  getOrder: (id) => authFetch(`/v1/Orders/${id}`),

  /** Latest AI design */
  getLatestDesign: () => authFetch("/v1/AIDesigns/latest"),

  /** All AI designs */
  getDesigns: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`/v1/AIDesigns?${query}`);
  },

  /** Upcoming consultations */
  getConsultations: () => authFetch("/v1/Consultations"),

  /** Saved/wishlist items */
  getSavedItems: () => authFetch("/v1/SavedItems"),

  /** User profile */
  getProfile: () => authFetch("/v1/Users/profile"),
};
