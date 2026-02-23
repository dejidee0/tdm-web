"use server";

import { cookies } from "next/headers";
import axios from "axios";
import apiClient from "../axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Server action for admin login
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Admin email
 * @param {string} credentials.password - Admin password
 * @param {boolean} credentials.rememberMe - Remember me flag
 * @returns {Object} Success or error response
 */
export async function adminLogin(credentials) {
  try {
    const { email, password, rememberMe = false } = credentials;

    // Validation
    if (!email || !password) {
      return {
        success: false,
        error: "Email and password are required",
      };
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    const response = await apiClient.post(`/admin/auth/login`, {
      email,
      password,
      rememberMe,
    });

    const responseData = response.data;
    console.log('🔍 Backend response from admin login:', JSON.stringify(responseData, null, 2));

    // Extract token and user from nested data structure
    // Backend returns: { success, message, data: { accessToken, user, refreshToken }, errors }
    const token = responseData.data.accessToken;
    const user = responseData.data.user;
    const refreshToken = responseData.data.refreshToken;

    console.log('✅ Extracted token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    console.log('✅ Extracted user:', user ? user.email : 'NO USER');

    // Store admin auth token in HTTP-only cookie (separate from customer auth)
    const cookieStore = await cookies();
    cookieStore.set("adminAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
      path: "/admin",
    });

    // Store refresh token if provided
    if (refreshToken) {
      cookieStore.set("adminRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/admin",
      });
    }

    return {
      success: true,
      data: {
        admin: user, // Return user as admin
        token: token, // Return accessToken as token for localStorage storage
        message: "Admin login successful",
      },
    };
  } catch (error) {
    console.error("Admin login error:", error);

    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || "Admin login failed";
      return {
        success: false,
        error: errorMessage,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Server action to refresh admin token
 * @param {string} refreshToken
 * @returns {Object} Success or error response
 */
export async function adminRefreshToken(refreshToken) {
  try {
    const response = await axios.post(`${API_URL}/admin/auth/refresh`, {
      refreshToken,
    });

    const data = response.data;

    // Update admin auth token
    const cookieStore = await cookies();
    cookieStore.set("adminAuthToken", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/admin",
    });

    return {
      success: true,
      data: {
        token: data.token,
      },
    };
  } catch (error) {
    console.error("Admin token refresh error:", error);

    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || "Token refresh failed";
      return {
        success: false,
        error: errorMessage,
      };
    }

    return {
      success: false,
      error: "Failed to refresh token",
    };
  }
}

/**
 * Server action for admin logout
 * @returns {Object} Success or error response
 */
export async function adminLogout() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("adminRefreshToken");

    // Call backend logout endpoint if refresh token exists
    if (refreshToken?.value) {
      await axios.post(`${API_URL}/admin/auth/logout`, {
        refreshToken: refreshToken.value,
      });
    }

    // Delete admin cookies
    cookieStore.delete("adminAuthToken");
    cookieStore.delete("adminRefreshToken");

    return {
      success: true,
      message: "Admin logged out successfully",
    };
  } catch (error) {
    console.error("Admin logout error:", error);

    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to logout";
      return {
        success: false,
        error: errorMessage,
      };
    }

    return {
      success: false,
      error: "Failed to logout",
    };
  }
}

/**
 * Get admin auth token from cookies
 * @returns {string|null} Admin auth token or null
 */
export async function getAdminAuthToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("adminAuthToken");
    return token?.value || null;
  } catch (error) {
    console.error("Error getting admin auth token:", error);
    return null;
  }
}
