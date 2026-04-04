/**
 * Admin API client for making authenticated requests to admin endpoints
 * Uses axios with Bearer token authentication and HTTP-only cookies
 */

import { adminApiClient as apiClient } from "@/lib/axios";
import { downloadBlob } from "@/lib/download";

/**
 * Admin Dashboard API
 */
export const adminDashboardAPI = {
  // GET /admin/dashboard/stats
  getStats: async () => {
    const response = await apiClient.get("/admin/dashboard/stats");
    console.log("[getStats] raw response:", response);
    console.log("[getStats] response.data:", response.data);
    return response.data;
  },

  // GET /admin/dashboard/revenue
  getRevenue: async (timeRange = "30d") => {
    const response = await apiClient.get("/admin/dashboard/revenue", {
      params: { timeRange },
    });
    return response.data;
  },

  // GET /admin/dashboard/server-load
  getServerLoad: async () => {
    const response = await apiClient.get("/admin/dashboard/server-load");
    return response.data;
  },

  // GET /admin/dashboard/alerts
  getAlerts: async () => {
    const response = await apiClient.get("/admin/dashboard/alerts");
    return response.data;
  },

  // GET /admin/dashboard/quick-actions
  getQuickActions: async () => {
    const response = await apiClient.get("/admin/dashboard/quick-actions");
    return response.data;
  },

  // POST /admin/dashboard/refresh
  refreshDashboard: async () => {
    const response = await apiClient.post("/admin/dashboard/refresh");
    return response.data;
  },

  // POST /admin/dashboard/export
  exportReport: async () => {
    const response = await apiClient.post(
      "/admin/dashboard/export",
      {},
      { responseType: "blob" },
    );
    const filename = `admin-dashboard-export-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadBlob(response.data, filename, response.headers["content-type"]);
    return { success: true, filename };
  },
};

/**
 * Admin Analytics API
 */
export const adminAnalyticsAPI = {
  // GET /admin/analytics/overview
  getOverview: async () => {
    const response = await apiClient.get("/admin/analytics/overview");
    return response.data;
  },

  // GET /admin/analytics/monthly-revenue
  getMonthlyRevenue: async () => {
    const response = await apiClient.get("/admin/analytics/monthly-revenue");
    return response.data;
  },

  // GET /admin/analytics/payment-distribution
  getPaymentDistribution: async () => {
    const response = await apiClient.get(
      "/admin/analytics/payment-distribution",
    );
    return response.data;
  },
};

/**
 * Admin Orders API
 */
export const adminOrdersAPI = {
  // GET /admin/orders
  getOrders: async (params) => {
    const response = await apiClient.get("/admin/orders", { params });
    return response.data;
  },

  // PATCH /admin/orders/{id}/status
  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/admin/orders/${id}/status`, {
      status,
    });
    return response.data;
  },

  // PATCH /admin/orders/{id}/cancel
  cancel: async (id, reason) => {
    const response = await apiClient.patch(`/admin/orders/${id}/cancel`, {
      reason,
    });
    return response.data;
  },

  // POST /admin/orders/{id}/refund
  refund: async (id, reason) => {
    const response = await apiClient.post(`/admin/orders/${id}/refund`, {
      reason,
    });
    return response.data;
  },

  // PATCH /admin/orders/{id}/tracking
  updateTracking: async (id, trackingNumber) => {
    const response = await apiClient.patch(`/admin/orders/${id}/tracking`, {
      trackingNumber,
    });
    return response.data;
  },
};

/**
 * Admin Settings API
 */
export const adminSettingsAPI = {
  // GET /admin/settings/payment
  getPaymentSettings: async () => {
    const response = await apiClient.get("/admin/settings/payment");
    return response.data;
  },

  // PUT /admin/settings/payment
  updatePaymentSettings: async (settings) => {
    const response = await apiClient.put("/admin/settings/payment", settings);
    return response.data;
  },

  // PATCH /admin/settings/payment/gateways/{gatewayId}
  togglePaymentGateway: async (gatewayId, enabled) => {
    const response = await apiClient.patch(
      `/admin/settings/payment/gateways/${gatewayId}`,
      { enabled },
    );
    return response.data;
  },

  // GET /admin/settings/ai
  getAISettings: async () => {
    const response = await apiClient.get("/admin/settings/ai");
    return response.data;
  },

  // PUT /admin/settings/ai
  updateAISettings: async (settings) => {
    const response = await apiClient.put("/admin/settings/ai", settings);
    return response.data;
  },

  // PATCH /admin/settings/ai/models/{modelId}
  toggleAIModel: async (modelId, enabled) => {
    const response = await apiClient.patch(
      `/admin/settings/ai/models/${modelId}`,
      { enabled },
    );
    return response.data;
  },

  // GET /admin/settings/general
  getGeneralSettings: async () => {
    const response = await apiClient.get("/admin/settings/general");
    return response.data;
  },

  // PUT /admin/settings/general
  updateGeneralSettings: async (settings) => {
    const response = await apiClient.put("/admin/settings/general", settings);
    return response.data;
  },

  // GET /admin/settings/notifications
  getNotificationSettings: async () => {
    const response = await apiClient.get("/admin/settings/notifications");
    return response.data;
  },

  // PUT /admin/settings/notifications
  updateNotificationSettings: async (settings) => {
    const response = await apiClient.put(
      "/admin/settings/notifications",
      settings,
    );
    return response.data;
  },

  // PUT /admin/settings (general settings update)
  updateSettings: async (settings) => {
    const response = await apiClient.put("/admin/settings", settings);
    return response.data;
  },
};

/**
 * Admin Users API
 */
export const adminUsersAPI = {
  // GET /admin/users
  getUsers: async (params) => {
    const response = await apiClient.get("/admin/users", { params });
    return response.data;
  },

  // POST /admin/users
  createUser: async (userData) => {
    const response = await apiClient.post("/admin/users", userData);
    return response.data;
  },

  // GET /admin/users/{id}
  getUserById: async (id) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },

  // PATCH /admin/users/{id}/status
  updateUserStatus: async (id, isActive) => {
    const response = await apiClient.patch(`/admin/users/${id}/status`, {
      isActive,
    });
    return response.data;
  },

  // PATCH /admin/users/{id}/role
  updateUserRole: async (id, newRole) => {
    const response = await apiClient.patch(`/admin/users/${id}/role`, {
      newRole,
    });
    return response.data;
  },

  // PATCH /admin/users/{id}/suspend
  suspendUser: async (id) => {
    const response = await apiClient.patch(`/admin/users/${id}/suspend`);
    return response.data;
  },

  // PATCH /admin/users/{id}/reactivate
  reactivateUser: async (id) => {
    const response = await apiClient.patch(`/admin/users/${id}/reactivate`);
    return response.data;
  },

  // DELETE /admin/users/{id}
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },

  // GET /admin/users/export
  exportUsers: async (params = {}) => {
    const response = await apiClient.get("/admin/users/export", {
      params,
      responseType: "blob",
    });
    const filename = `admin-users-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadBlob(response.data, filename, response.headers["content-type"]);
    return { success: true, filename };
  },
};

/**
 * Admin Financial API
 */
export const adminFinancialAPI = {
  // GET /admin/financial/stats
  getStats: async () => {
    const response = await apiClient.get("/admin/financial/stats");
    return response.data;
  },

  // GET /admin/financial/monthly-revenue
  getMonthlyRevenue: async (months = 12) => {
    const response = await apiClient.get("/admin/financial/monthly-revenue", {
      params: { months },
    });
    return response.data;
  },

  // GET /admin/financial/revenue-by-service
  getRevenueByService: async (dateRange = "12") => {
    const response = await apiClient.get(
      "/admin/financial/revenue-by-service",
      {
        params: { dateRange },
      },
    );
    return response.data;
  },

  // GET /admin/financial/transactions
  getTransactions: async ({
    page = 1,
    limit = 20,
    search = "",
    filter = "",
  } = {}) => {
    const response = await apiClient.get("/admin/financial/transactions", {
      params: { page, limit, search, filter },
    });
    return response.data;
  },

  // GET /admin/financial/export
  exportFinancialReport: async ({ search = "", filter = "" } = {}) => {
    const response = await apiClient.get("/admin/financial/export", {
      params: { search, filter },
      responseType: "blob",
    });
    const filename = `admin-financial-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadBlob(response.data, filename, response.headers["content-type"]);
    return { success: true, filename };
  },
};

/**
 * SuperAdmin Products API
 * Endpoints are at /api/v1/products (not under /admin), but require SuperAdmin role.
 */
export const adminProductsAPI = {
  // POST /products — create a new product
  createProduct: async (data) => {
    const response = await apiClient.post("/products", data);
    return response.data;
  },

  // PUT /products/{id} — update a product
  updateProduct: async (id, data) => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },

  // DELETE /products/{id} — delete a product
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  // POST /products/{id}/images — upload product images (multipart)
  addProductImages: async (id, files) => {
    const formData = new FormData();
    const fileArray = Array.isArray(files) ? files : [files];
    fileArray.forEach((file) => formData.append("images", file));
    const response = await apiClient.post(`/products/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // DELETE /products/images/{imageId} — delete a product image
  deleteProductImage: async (imageId) => {
    const response = await apiClient.delete(`/products/images/${imageId}`);
    return response.data;
  },

  // PUT /products/{id}/images/{imgId}/primary — set primary image
  setPrimaryImage: async (id, imgId) => {
    const response = await apiClient.put(`/products/${id}/images/${imgId}/primary`);
    return response.data;
  },
};

/**
 * SuperAdmin Categories API
 * Endpoints are at /api/v1/categories (not under /admin), but require SuperAdmin role.
 */
export const adminCategoriesAPI = {
  // POST /categories — create a new category
  createCategory: async (data) => {
    const response = await apiClient.post("/categories", data);
    return response.data;
  },

  // PUT /categories/{id} — update a category
  updateCategory: async (id, data) => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },

  // DELETE /categories/{id} — delete a category
  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};

/**
 * Admin AI Usage API
 */
export const adminAIUsageAPI = {
  // GET /admin/ai/usage/monthly — query: months (default 12)
  getMonthlyUsage: async (months = 12) => {
    const response = await apiClient.get("/admin/ai/usage/monthly", {
      params: { months },
    });
    return response.data;
  },

  // GET /admin/ai/usage/by-type — breakdown by generation type
  getUsageByType: async () => {
    const response = await apiClient.get("/admin/ai/usage/by-type");
    return response.data;
  },

  // GET /admin/ai/usage/overview — overall AI usage metrics
  getUsageOverview: async () => {
    const response = await apiClient.get("/admin/ai/usage/overview");
    return response.data;
  },
};

/**
 * Admin Observability API
 */
export const adminObservabilityAPI = {
  // GET /admin/observability/health
  getHealth: async () => {
    const response = await apiClient.get("/admin/observability/health");
    return response.data;
  },

  // GET /admin/observability/metrics
  getMetrics: async () => {
    const response = await apiClient.get("/admin/observability/metrics");
    return response.data;
  },

  // GET /admin/observability/recent-errors
  getRecentErrors: async () => {
    const response = await apiClient.get("/admin/observability/recent-errors");
    return response.data;
  },
};

/**
 * Admin Vendors API
 */
export const adminVendorsAPI = {
  // GET /admin/vendors
  getVendors: async (params) => {
    const response = await apiClient.get("/admin/vendors", { params });
    return response.data;
  },

  // GET /admin/vendors/{vendorId}
  getVendor: async (vendorId) => {
    const response = await apiClient.get(`/admin/vendors/${vendorId}`);
    return response.data;
  },

  // PUT /admin/vendors/{vendorId}/profile
  updateVendorProfile: async (vendorId, data) => {
    const response = await apiClient.put(`/admin/vendors/${vendorId}/profile`, data);
    return response.data;
  },

  // POST /admin/vendors/{productId}/ownership — assign product to vendor
  assignProductOwnership: async (productId, vendorId) => {
    const response = await apiClient.post(`/admin/vendors/${productId}/ownership`, { vendorId });
    return response.data;
  },

  // DELETE /admin/vendors/{productId}/ownership — remove product from vendor
  removeProductOwnership: async (productId) => {
    const response = await apiClient.delete(`/admin/vendors/${productId}/ownership`);
    return response.data;
  },

  // GET /admin/vendors/{vendorId}/ownership — products owned by vendor
  getVendorOwnership: async (vendorId) => {
    const response = await apiClient.get(`/admin/vendors/${vendorId}/ownership`);
    return response.data;
  },

  // POST /admin/vendors/{orderId}/assignment — assign order to vendor
  assignOrder: async (orderId, vendorId) => {
    const response = await apiClient.post(`/admin/vendors/${orderId}/assignment`, { vendorId });
    return response.data;
  },

  // DELETE /admin/vendors/{orderId}/assignment — remove order-vendor assignment
  removeOrderAssignment: async (orderId) => {
    const response = await apiClient.delete(`/admin/vendors/${orderId}/assignment`);
    return response.data;
  },
};

/**
 * Admin System Logs API
 */
export const adminSystemLogsAPI = {
  // GET /admin/system-logs/stats
  getStats: async (dateRange = "12") => {
    const response = await apiClient.get("/admin/system-logs/stats", {
      params: { dateRange },
    });
    return response.data;
  },

  // GET /admin/system-logs
  getLogs: async ({
    page = 1,
    limit = 20,
    search = "",
    severity = "",
    dateRange = "",
  } = {}) => {
    const response = await apiClient.get("/admin/system-logs", {
      params: { page, limit, search, severity, dateRange },
    });
    return response.data;
  },

  // GET /admin/system-logs/export
  exportLogs: async ({ severity = "", search = "", dateRange = "" } = {}) => {
    const response = await apiClient.get("/admin/system-logs/export", {
      params: { severity, search, dateRange },
      responseType: "blob",
    });
    const filename = `admin-system-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadBlob(response.data, filename, response.headers["content-type"]);
    return { success: true, filename };
  },
};
