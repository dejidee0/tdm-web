/**
 * Vendor Notifications API
 * Endpoints for vendor notifications
 */

import apiClient from "@/lib/axios";

export const vendorNotificationsAPI = {
  // GET /api/vendor/notifications
  getNotifications: async (params = {}) => {
    const response = await apiClient.get("/vendor/notifications", { params });
    return response.data;
  },

  // PATCH /api/vendor/notifications/:notificationId/read
  markAsRead: async (notificationId) => {
    const response = await apiClient.patch(`/vendor/notifications/${notificationId}/read`);
    return response.data;
  },
};
