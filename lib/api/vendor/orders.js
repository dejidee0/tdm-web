/**
 * Vendor Orders API
 * Endpoints for vendor order management
 */

import apiClient from "@/lib/axios";

export const vendorOrdersAPI = {
  // POST /api/v1/Orders - Create new order
  createOrder: async (orderData) => {
    const response = await apiClient.post("/vendor/orders", orderData);
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

    const response = await apiClient.get("/vendor/orders", { params: queryParams });
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
    const response = await apiClient.post(`/vendor/orders/${orderId}/status`, note);
    return response.data;
  },

  // PATCH /api/vendor/orders/:orderId/assignment
  updateAssignment: async (orderId, assignment) => {
    const response = await apiClient.patch(`/vendor/orders/${orderId}/assignment`, assignment);
    return response.data;
  },

  // GET /api/v1/vendor/orders/export
  exportOrders: async (params = {}) => {
    const queryParams = {};

    // Add optional filters
    if (params.status !== undefined && params.status !== 'all') {
      queryParams.status = params.status;
    }
    if (params.search) {
      queryParams.search = params.search;
    }
    if (params.fromDate) {
      queryParams.fromDate = params.fromDate;
    }
    if (params.toDate) {
      queryParams.toDate = params.toDate;
    }
    if (params.assignedOnly !== undefined) {
      queryParams.assignedOnly = params.assignedOnly;
    }
    if (params.type) {
      queryParams.type = params.type;
    }

    const response = await apiClient.get("/vendor/orders/export", {
      params: queryParams,
      responseType: 'blob', // Important for file download
    });

    // Create a download link
    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'text/csv'
    });
    const url = window.URL.createObjectURL(blob);
    const filename = `vendor-orders-export-${new Date().toISOString().slice(0, 10)}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, filename };
  },

  // POST /api/v1/vendor/orders/import
  importOrders: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post("/vendor/orders/import", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
