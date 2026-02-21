"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Server action for admin login
 * @param {FormData} formData
 * @returns {Object} Success or error response
 */
export async function adminLogin(formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    const rememberMe = formData.get("rememberMe") === "true";

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

    const response = await fetch(`${API_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        rememberMe,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Admin login failed",
      };
    }

    // Store admin auth token in HTTP-only cookie (separate from customer auth)
    const cookieStore = await cookies();
    cookieStore.set("adminAuthToken", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
      path: "/admin",
    });

    // Store refresh token if provided
    if (data.refreshToken) {
      cookieStore.set("adminRefreshToken", data.refreshToken, {
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
        admin: data.admin,
        message: "Admin login successful",
      },
    };
  } catch (error) {
    console.error("Admin login error:", error);
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
    const response = await fetch(`${API_URL}/api/admin/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Token refresh failed",
      };
    }

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
      await fetch(`${API_URL}/api/admin/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: refreshToken.value }),
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
