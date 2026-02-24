/**
 * Vendor Dashboard API
 * Endpoints for vendor dashboard stats, alerts, and activity
 */

import apiClient from "@/lib/axios";

export const vendorDashboardAPI = {
  // GET /api/vendor/dashboard
  getStats: async () => {
    const response = await apiClient.get("/vendor/dashboard");
    return response.data;
  },

  // GET /api/vendor/alerts
  getAlerts: async () => {
    const response = await apiClient.get("/vendor/alerts");
    return response.data;
  },

  // GET /api/vendor/activity
  getRecentActivity: async (filter = "all") => {
    const response = await apiClient.get("/vendor/activity", {
      params: { filter },
    });
    return response.data;
  },
};
