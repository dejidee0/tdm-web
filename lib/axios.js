import axios from "axios";
import { getToken } from "./client-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
});

// Request interceptor to add Bearer token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = getToken();

    // Debug logging
    console.log('🔑 Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    console.log('📡 Request URL:', config.url);

    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header added');
    } else {
      console.log('❌ No token - Authorization header NOT added');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    // Log error details
    console.log('❌ Error Response:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      headers: error.config?.headers,
    });

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        // Check route type
        const isAdminRoute = currentPath.startsWith("/admin");
        const isVendorRoute = currentPath.startsWith("/vendor");

        // Clear appropriate token
        if (isAdminRoute) {
          localStorage.removeItem("adminToken");
        } else if (isVendorRoute) {
          localStorage.removeItem("vendorToken");
        } else {
          localStorage.removeItem("authToken");
        }

        // Redirect to appropriate login page
        if (isAdminRoute) {
          window.location.href = "/admin/login";
        } else if (isVendorRoute) {
          window.location.href = "/vendor/login";
        } else {
          window.location.href = "/sign-in";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
