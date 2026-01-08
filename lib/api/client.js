import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Get auth token from cookies
 * @returns {string|null} Auth token or null
 */
export async function getAuthToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken");
    return token?.value || null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

/**
 * Get current authenticated user from API
 * @returns {Object|null} User object or null
 */
export async function getCurrentUser() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_URL}/Auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Don't cache user data
    });

    if (!response.ok) {
      // Token might be invalid
      if (response.status === 401) {
        // Clear invalid token
        const cookieStore = await cookies();
        cookieStore.delete("authToken");
      }
      return null;
    }

    const data = await response.json();
    return data.user || data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

/**
 * Make authenticated API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response
 */
export async function authenticatedFetch(endpoint, options = {}) {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Client-side API utilities
 */
export const apiClient = {
  /**
   * Make GET request
   */
  get: async (endpoint, options = {}) => {
    return authenticatedFetch(endpoint, {
      method: "GET",
      ...options,
    });
  },

  /**
   * Make POST request
   */
  post: async (endpoint, body, options = {}) => {
    return authenticatedFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
  },

  /**
   * Make PUT request
   */
  put: async (endpoint, body, options = {}) => {
    return authenticatedFetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    });
  },

  /**
   * Make PATCH request
   */
  patch: async (endpoint, body, options = {}) => {
    return authenticatedFetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    });
  },

  /**
   * Make DELETE request
   */
  delete: async (endpoint, options = {}) => {
    return authenticatedFetch(endpoint, {
      method: "DELETE",
      ...options,
    });
  },
};
