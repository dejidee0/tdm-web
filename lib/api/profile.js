// lib/api/profile.js

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUserProfile = {
  id: "user-001",
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (650) 612-3456",
  avatar: "/profile.png",
  membershipType: "PREMIUM",
  memberSince: "2023-01-15",
  addresses: [
    {
      id: "addr-001",
      label: "Home",
      isDefault: true,
      recipient: "Alex Johnson",
      addressLine1: "123 Renovation Lane, Apt 4B",
      addressLine2: "",
      city: "Design City",
      state: "CA",
      zipCode: "90210",
      country: "United States",
    },
    {
      id: "addr-002",
      label: "Office",
      isDefault: false,
      recipient: "TBM Architecture Inc.",
      addressLine1: "456 Commerce Blvd, Suite 201",
      addressLine2: "",
      city: "Design City",
      state: "CA",
      zipCode: "90212",
      country: "United States",
    },
  ],
  notifications: {
    orderUpdates: true,
    designConsultations: true,
    promotionsInspiration: false,
  },
};

export const profileApi = {
  // Get user profile
  getProfile: async () => {
    await delay(800);
    return mockUserProfile;
  },

  // Update personal information
  updatePersonalInfo: async (data) => {
    await delay(600);
    Object.assign(mockUserProfile, data);
    return { success: true, data: mockUserProfile };
  },

  // Update email
  updateEmail: async (newEmail) => {
    await delay(600);
    mockUserProfile.email = newEmail;
    return { success: true, message: "Email updated successfully" };
  },

  // Update phone
  updatePhone: async (newPhone) => {
    await delay(600);
    mockUserProfile.phone = newPhone;
    return { success: true, message: "Phone updated successfully" };
  },

  // Add address
  addAddress: async (address) => {
    await delay(700);
    const newAddress = {
      id: `addr-${Date.now()}`,
      ...address,
    };
    mockUserProfile.addresses.push(newAddress);
    return { success: true, data: newAddress };
  },

  // Update address
  updateAddress: async (addressId, data) => {
    await delay(600);
    const index = mockUserProfile.addresses.findIndex(
      (a) => a.id === addressId,
    );
    if (index > -1) {
      mockUserProfile.addresses[index] = {
        ...mockUserProfile.addresses[index],
        ...data,
      };
    }
    return { success: true };
  },

  // Delete address
  deleteAddress: async (addressId) => {
    await delay(500);
    const index = mockUserProfile.addresses.findIndex(
      (a) => a.id === addressId,
    );
    if (index > -1) {
      mockUserProfile.addresses.splice(index, 1);
    }
    return { success: true };
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    await delay(500);
    mockUserProfile.addresses.forEach((addr) => {
      addr.isDefault = addr.id === addressId;
    });
    return { success: true };
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    await delay(800);
    // In production, validate current password
    return { success: true, message: "Password changed successfully" };
  },

  // Update notification preferences
  updateNotifications: async (preferences) => {
    await delay(500);
    mockUserProfile.notifications = {
      ...mockUserProfile.notifications,
      ...preferences,
    };
    return { success: true };
  },

  // Delete account
  deleteAccount: async (password) => {
    await delay(1000);
    return { success: true, message: "Account deleted successfully" };
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    await delay(1000);
    // In production, upload file and get URL
    const avatarUrl = URL.createObjectURL(file);
    mockUserProfile.avatar = avatarUrl;
    return { success: true, avatarUrl };
  },
};
