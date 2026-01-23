// Mock data for account settings
export const mockUserProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@vendor-inc.com",
  phone: "+1 (555) 012-3456",
  avatar: null,
  isVerifiedVendor: true,
  companyName: "Acme Supplies Ltd.",
  vendorId: "VND-9839-2023",
  canChangeVendorId: false,
};

export const mockSecuritySettings = {
  twoFactorEnabled: false,
};

export const mockNotificationSettings = {
  orderUpdates: true,
  inventoryAlerts: true,
  marketing: false,
};

export const mockBrandAccess = [
  {
    id: 1,
    brandName: "Bogat Operations",
    brandDescription: "HQ Logistics",
    brandIcon: "🏢",
    brandColor: "#3B82F6",
    role: "Tier 1 Vendor",
    status: "Active",
    statusColor: "success",
  },
  {
    id: 2,
    brandName: "TBM Renovations",
    brandDescription: "Regional Sites",
    brandIcon: "🏗️",
    brandColor: "#F59E0B",
    role: "Contractor Supply",
    status: "Active",
    statusColor: "success",
  },
  {
    id: 3,
    brandName: "Apex Logistics",
    brandDescription: "Delivery Partner",
    brandIcon: "🚚",
    brandColor: "#64748B",
    role: "Viewer",
    status: "Pending",
    statusColor: "warning",
  },
];

// Simulated API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service for account settings
export const accountSettingsAPI = {
  // GET /api/account/profile
  getProfile: async () => {
    await delay(500);
    return mockUserProfile;
  },

  // PUT /api/account/profile
  updateProfile: async (updates) => {
    await delay(600);
    Object.assign(mockUserProfile, updates);
    return { success: true, profile: mockUserProfile };
  },

  // PUT /api/account/password
  changePassword: async (currentPassword, newPassword) => {
    await delay(700);
    return { success: true };
  },

  // GET /api/account/security
  getSecuritySettings: async () => {
    await delay(400);
    return mockSecuritySettings;
  },

  // PUT /api/account/security/2fa
  toggle2FA: async (enabled) => {
    await delay(500);
    mockSecuritySettings.twoFactorEnabled = enabled;
    return { success: true };
  },

  // GET /api/account/notifications
  getNotificationSettings: async () => {
    await delay(400);
    return mockNotificationSettings;
  },

  // PUT /api/account/notifications
  updateNotificationSettings: async (updates) => {
    await delay(500);
    Object.assign(mockNotificationSettings, updates);
    return { success: true };
  },

  // GET /api/account/brand-access
  getBrandAccess: async () => {
    await delay(500);
    return mockBrandAccess;
  },

  // POST /api/account/deactivate
  deactivateAccount: async () => {
    await delay(600);
    return { success: true };
  },
};

// Commented out real API calls for future use
/*
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const accountSettingsAPI = {
  getProfile: async () => {
    const response = await axios.get(`${API_BASE_URL}/account/profile`);
    return response.data;
  },

  updateProfile: async (updates) => {
    const response = await axios.put(`${API_BASE_URL}/account/profile`, updates);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await axios.put(`${API_BASE_URL}/account/password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getSecuritySettings: async () => {
    const response = await axios.get(`${API_BASE_URL}/account/security`);
    return response.data;
  },

  toggle2FA: async (enabled) => {
    const response = await axios.put(`${API_BASE_URL}/account/security/2fa`, { enabled });
    return response.data;
  },

  getNotificationSettings: async () => {
    const response = await axios.get(`${API_BASE_URL}/account/notifications`);
    return response.data;
  },

  updateNotificationSettings: async (updates) => {
    const response = await axios.put(`${API_BASE_URL}/account/notifications`, updates);
    return response.data;
  },

  getBrandAccess: async () => {
    const response = await axios.get(`${API_BASE_URL}/account/brand-access`);
    return response.data;
  },

  deactivateAccount: async () => {
    const response = await axios.post(`${API_BASE_URL}/account/deactivate`);
    return response.data;
  },
};
*/
