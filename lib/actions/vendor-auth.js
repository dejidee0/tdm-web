"use server";

import { cookies } from "next/headers";
import axios from "axios";
import apiClient from "../axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Decodes the vendorAuthToken httpOnly cookie and returns the user object.
 * Used by GET /api/auth/vendor/me.
 */
export async function getCurrentVendorUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("vendorAuthToken")?.value;
    if (!token) return null;

    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64").toString("utf-8"),
    );

    if (payload.exp * 1000 < Date.now()) return null;

    return {
      id: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      name: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || payload.firstName,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export async function vendorLogin(credentials) {
  try {
    const { email, password, rememberMe = false } = credentials;

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return { success: false, error: "Invalid email format" };
    }

    const response = await apiClient.post(`/Auth/login`, { email, password });

    const responseData = response.data;
    console.log("🔍 Backend response from vendor login:", JSON.stringify(responseData, null, 2));

    const { accessToken: token, user, refreshToken } = responseData.data;

    console.log("✅ Extracted token:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");
    console.log("✅ Extracted user:", user ? user.email : "NO USER");

    const cookieStore = await cookies();
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    // JWT — httpOnly, never exposed to client JS
    cookieStore.set("vendorAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/vendor",
    });

    if (refreshToken) {
      cookieStore.set("vendorRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/vendor",
      });
    }

    return {
      success: true,
      data: {
        vendor: user,
        message: "Vendor login successful",
      },
    };
  } catch (error) {
    console.error("Vendor login error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Vendor login failed",
      };
    }
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

// ---------------------------------------------------------------------------
// Token refresh
// ---------------------------------------------------------------------------

export async function vendorRefreshToken(refreshToken) {
  try {
    const response = await axios.post(`${API_URL}/Auth/refresh-token`, { refreshToken });
    const { token } = response.data;

    const cookieStore = await cookies();
    cookieStore.set("vendorAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/vendor",
    });

    return { success: true, data: { token } };
  } catch (error) {
    console.error("Vendor token refresh error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Token refresh failed",
      };
    }
    return { success: false, error: "Failed to refresh token" };
  }
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export async function vendorLogout() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("vendorRefreshToken");

    if (refreshToken?.value) {
      await axios.post(`${API_URL}/Auth/logout`, {
        refreshToken: refreshToken.value,
      });
    }

    cookieStore.delete("vendorAuthToken");
    cookieStore.delete("vendorRefreshToken");

    return { success: true, message: "Vendor logged out successfully" };
  } catch (error) {
    console.error("Vendor logout error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Failed to logout",
      };
    }
    return { success: false, error: "Failed to logout" };
  }
}

// ---------------------------------------------------------------------------
// Get vendor auth token (server-side use only)
// ---------------------------------------------------------------------------

export async function getVendorAuthToken() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("vendorAuthToken")?.value || null;
  } catch {
    return null;
  }
}
