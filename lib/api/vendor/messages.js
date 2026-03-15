/**
 * Vendor Messages API
 * Endpoints for vendor messaging
 */

import apiClient from "@/lib/axios";

export const vendorMessagesAPI = {
  // GET /api/vendor/messages
  getMessages: async (params = {}) => {
    // Map frontend params to backend query params
    const queryParams = {
      page: params.page || 1,
      pageSize: params.pageSize || 20,
    };

    // Add optional filters
    if (params.unreadOnly !== undefined) {
      queryParams.unreadOnly = params.unreadOnly;
    }

    const response = await apiClient.get("/vendor/messages", {
      params: queryParams,
    });
    return response.data;
  },

  // POST /api/vendor/messages
  sendMessage: async (messageData) => {
    // Ensure the payload matches backend schema
    const payload = {
      subject: messageData.subject || "",
      body: messageData.body,
      to: messageData.to,
    };

    const response = await apiClient.post("/vendor/messages", payload);
    return response.data;
  },
};
