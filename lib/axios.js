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
        localStorage.removeItem("authToken");

        // Check if current path is admin route
        const isAdminRoute = window.location.pathname.startsWith("/admin");

        // Redirect to appropriate login page
        window.location.href = isAdminRoute ? "/admin/login" : "/sign-in";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
