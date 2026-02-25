/**
 * Vendor Messages API
 * Endpoints for vendor messaging
 */

import apiClient from "@/lib/axios";

export const vendorMessagesAPI = {
  // GET /api/vendor/messages
  getMessages: async (params = {}) => {
    const response = await apiClient.get("/vendor/messages", { params });
    return response.data;
  },

  // POST /api/vendor/messages
  sendMessage: async (messageData) => {
    const response = await apiClient.post("/vendor/messages", messageData);
    return response.data;
  },
};
