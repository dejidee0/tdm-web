/**
 * Vendor Deliveries API
 * Endpoints for vendor delivery management
 */

import apiClient from "@/lib/axios";

export const vendorDeliveriesAPI = {
  // GET /api/vendor/deliveries
  getDeliveries: async (params = {}) => {
    const response = await apiClient.get("/vendor/deliveries", { params });
    return response.data;
  },
};
