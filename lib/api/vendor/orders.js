/**
 * Vendor Orders API
 * Endpoints for vendor order management
 */

import apiClient from "@/lib/axios";

export const vendorOrdersAPI = {
  // POST /api/v1/Orders - Create new order
  createOrder: async (orderData) => {
    const response = await apiClient.post("/v1/Orders", orderData);
    return response.data;
  },

  // GET /api/v1/Orders
  getOrders: async (params = {}) => {
    // Map frontend params to backend query params
    const queryParams = {
      PageNumber: params.page || 1,
      PageSize: params.limit || 10,
    };

    // Add optional filters
    if (params.status && params.status !== 'all') {
      queryParams.Status = params.status;
    }
    if (params.search) {
      queryParams.SearchTerm = params.search;
    }

    const response = await apiClient.get("/v1/Orders", { params: queryParams });
    return response.data;
  },

  // GET /api/vendor/orders/:orderId
  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/vendor/orders/${orderId}`);
    return response.data;
  },

  // PATCH /api/vendor/orders/:orderId/status
  updateStatus: async (orderId, status) => {
    const response = await apiClient.patch(`/vendor/orders/${orderId}/status`, { status });
    return response.data;
  },

  // POST /api/vendor/orders/:orderId/notes
  addNote: async (orderId, note) => {
    const response = await apiClient.post(`/vendor/orders/${orderId}/notes`, note);
    return response.data;
  },

  // PATCH /api/vendor/orders/:orderId/assignment
  updateAssignment: async (orderId, assignment) => {
    const response = await apiClient.patch(`/vendor/orders/${orderId}/assignment`, assignment);
    return response.data;
  },
};
