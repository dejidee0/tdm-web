/**
 * Vendor Inventory API
 * Endpoints for vendor inventory management
 */

import apiClient from "@/lib/axios";

export const vendorInventoryAPI = {
  // GET /api/vendor/inventory
  getInventory: async (params = {}) => {
    const response = await apiClient.get("/vendor/inventory", { params });
    return response.data;
  },

  // GET /api/inventory/stats
  getStats: async () => {
    const response = await apiClient.get("/inventory/stats");
    return response.data;
  },

  // POST /api/inventory/products
  addProduct: async (productData) => {
    const response = await apiClient.post("/inventory/products", productData);
    return response.data;
  },

  // PUT /api/vendor/inventory/:productId
  updateProduct: async (productId, productData) => {
    const response = await apiClient.put(`/vendor/inventory/${productId}`, productData);
    return response.data;
  },

  // DELETE /api/inventory/products/:productId
  deleteProduct: async (productId) => {
    const response = await apiClient.delete(`/inventory/products/${productId}`);
    return response.data;
  },
};
