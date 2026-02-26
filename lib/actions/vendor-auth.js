"use server";

import { cookies } from "next/headers";
import axios from "axios";
import apiClient from "../axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Server action for vendor login
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Vendor email
 * @param {string} credentials.password - Vendor password
 * @param {boolean} credentials.rememberMe - Remember me flag
 * @returns {Object} Success or error response
 */
export async function vendorLogin(credentials) {    
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

    const response = await apiClient.post(`/v1/Auth/login`, {
      email,
      password,
    //   rememberMe,
    });

    const responseData = response.data;
    console.log('🔍 Backend response from vendor login:', JSON.stringify(responseData, null, 2));

    // Extract token and user from nested data structure
    // Backend returns: { success, message, data: { accessToken, user, refreshToken }, errors }
    const token = responseData.data.accessToken;
    const user = responseData.data.user;
    const refreshToken = responseData.data.refreshToken;

    console.log('✅ Extracted token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    console.log('✅ Extracted user:', user ? user.email : 'NO USER');

    // Store vendor auth token in HTTP-only cookie (separate from customer auth)
    const cookieStore = await cookies();
    cookieStore.set("vendorAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
      path: "/vendor",
    });

    // Store refresh token if provided
    if (refreshToken) {
      cookieStore.set("vendorRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/vendor",
      });
    }

    return {
      success: true,
      data: {
        vendor: user, // Return user as vendor
        token: token, // Return accessToken as token for localStorage storage
        message: "Vendor login successful",
      },
    };
  } catch (error) {
    console.error("Vendor login error:", error);

    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || "Vendor login failed";
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
 * Server action to refresh vendor token
 * @param {string} refreshToken
 * @returns {Object} Success or error response
 */
export async function vendorRefreshToken(refreshToken) {
  try {
    const response = await axios.post(`${API_URL}/Auth/refresh-token`, {
      refreshToken,
    });

    const data = response.data;

    // Update vendor auth token
    const cookieStore = await cookies();
    cookieStore.set("vendorAuthToken", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/vendor",
    });

    return {
      success: true,
      data: {
        token: data.token,
      },
    };
  } catch (error) {
    console.error("Vendor token refresh error:", error);

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
 * Server action for vendor logout
 * @returns {Object} Success or error response
 */
export async function vendorLogout() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("vendorRefreshToken");

    // Call backend logout endpoint if refresh token exists
    if (refreshToken?.value) {
      await axios.post(`${API_URL}/Auth/logout`, {
        refreshToken: refreshToken.value,
      });
    }



    // Delete vendor cookies
    cookieStore.delete("vendorAuthToken");
    cookieStore.delete("vendorRefreshToken");

    return {
      success: true,
      message: "Vendor logged out successfully",
    };
  } catch (error) {
    console.error("Vendor logout error:", error);

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
 * Get vendor auth token from cookies
 * @returns {string|null} Vendor auth token or null
 */
export async function getVendorAuthToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("vendorAuthToken");
    return token?.value || null;
  } catch (error) {
    console.error("Error getting vendor auth token:", error);
    return null;
  }
}
