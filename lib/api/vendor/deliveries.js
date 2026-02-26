/**
 * Vendor Deliveries API
 * Endpoints for vendor delivery management
 */

import apiClient from "@/lib/axios";

export const vendorDeliveriesAPI = {
  // GET /api/vendor/deliveries
  getDeliveries: async (params = {}) => {
    // Map frontend params to backend query params
    const queryParams = {
      page: params.page || 1,
      pageSize: params.limit || 20,
    };

    // Add optional filters
    if (params.status && params.status !== "all") {
      queryParams.status = params.status;
    }
    if (params.search) {
      queryParams.search = params.search;
    }
    if (params.dateRange) {
      queryParams.dateRange = params.dateRange;
    }

    const response = await apiClient.get("/vendor/deliveries", {
      params: queryParams,
    });
    return response.data;
  },
};
