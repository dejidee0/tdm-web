/**
 * Vendor Orders API
 * Endpoints for vendor order management
 */

import apiClient from "@/lib/axios";

export const vendorOrdersAPI = {
  // GET /api/vendor/orders
  getOrders: async (params = {}) => {
    const response = await apiClient.get("/vendor/orders", { params });
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
