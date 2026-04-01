import apiClient from "../axios";

export const lookupsAPI = {
    getMaterialTypes : async () => {
    const response = await apiClient.get("/lookups/material-types");
    return response.data;
    },

    getBrandTypes : async () => {
    const response = await apiClient.get("/lookups/brand-types");
    return response.data;
    },

    getProductTypes : async () => {
    const response = await apiClient.get("/lookups/product-types");
    return response.data;
    },

    getQualityTiers : async () => {
    const response = await apiClient.get("/lookups/quality-tiers");
    return response.data;
    },

    getOrderStatuses : async () => {
    const response = await apiClient.get("/lookups/order-statuses");
    return response.data;
    },
}