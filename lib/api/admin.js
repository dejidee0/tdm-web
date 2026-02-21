/**
 * Admin API client for making authenticated requests to admin endpoints
 * Uses client-side fetch with HTTP-only cookies automatically sent by browser
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Make authenticated admin API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response
 */
async function adminFetch(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Include HTTP-only cookies
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Admin Analytics API
 */
export const adminAnalyticsAPI = {
  // GET /api/admin/analytics/overview
  getOverview: () => adminFetch("/api/admin/analytics/overview"),

  // GET /api/admin/analytics/monthly-revenue
  getMonthlyRevenue: () => adminFetch("/api/admin/analytics/monthly-revenue"),

  // GET /api/admin/analytics/payment-distribution
  getPaymentDistribution: () => adminFetch("/api/admin/analytics/payment-distribution"),
};

/**
 * Admin Orders API
 */
export const adminOrdersAPI = {
  // GET /api/admin/orders
  getOrders: (params) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.pageSize) queryParams.append("pageSize", params.pageSize);
    if (params.status) queryParams.append("status", params.status);
    if (params.search) queryParams.append("search", params.search);

    return adminFetch(`/api/admin/orders?${queryParams.toString()}`);
  },

  // PATCH /api/admin/orders/{id}/status
  updateStatus: (id, status) =>
    adminFetch(`/api/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // PATCH /api/admin/orders/{id}/cancel
  cancel: (id, reason) =>
    adminFetch(`/api/admin/orders/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),

  // POST /api/admin/orders/{id}/refund
  refund: (id, reason) =>
    adminFetch(`/api/admin/orders/${id}/refund`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  // PATCH /api/admin/orders/{id}/tracking
  updateTracking: (id, trackingNumber) =>
    adminFetch(`/api/admin/orders/${id}/tracking`, {
      method: "PATCH",
      body: JSON.stringify({ trackingNumber }),
    }),
};

/**
 * Admin Settings API
 */
export const adminSettingsAPI = {
  // GET /api/admin/settings/payment
  getPaymentSettings: () => adminFetch("/api/admin/settings/payment"),

  // PUT /api/admin/settings/payment
  updatePaymentSettings: (settings) =>
    adminFetch("/api/admin/settings/payment", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  // GET /api/admin/settings/ai
  getAISettings: () => adminFetch("/api/admin/settings/ai"),

  // PUT /api/admin/settings/ai
  updateAISettings: (settings) =>
    adminFetch("/api/admin/settings/ai", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  // GET /api/admin/settings/general
  getGeneralSettings: () => adminFetch("/api/admin/settings/general"),

  // PUT /api/admin/settings/general
  updateGeneralSettings: (settings) =>
    adminFetch("/api/admin/settings/general", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
};

/**
 * Admin Users API
 */
export const adminUsersAPI = {
  // GET /api/admin/users
  getUsers: (params) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.pageSize) queryParams.append("pageSize", params.pageSize);
    if (params.search) queryParams.append("search", params.search);

    return adminFetch(`/api/admin/users?${queryParams.toString()}`);
  },

  // PATCH /api/admin/users/{id}/suspend
  suspendUser: (id) =>
    adminFetch(`/api/admin/users/${id}/suspend`, {
      method: "PATCH",
    }),

  // PATCH /api/admin/users/{id}/reactivate
  reactivateUser: (id) =>
    adminFetch(`/api/admin/users/${id}/reactivate`, {
      method: "PATCH",
    }),

  // DELETE /api/admin/users/{id}
  deleteUser: (id) =>
    adminFetch(`/api/admin/users/${id}`, {
      method: "DELETE",
    }),
};
