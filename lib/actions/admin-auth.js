"use server";

import { cookies } from "next/headers";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_WV1;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Decodes the adminAuthToken httpOnly cookie and returns the user object.
 * Used by GET /api/auth/admin/me.
 */
export async function getCurrentAdminUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("adminAuthToken")?.value;
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

export async function adminLogin(credentials) {
  try {
    const { email, password, rememberMe = false } = credentials;

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return { success: false, error: "Invalid email format" };
    }

    const response = await axios.post(`${API_URL}/admin/auth/login`, {
      email,
      password,
      rememberMe,
    });

    const responseData = response.data;
    console.log("🔍 Backend response from admin login:", JSON.stringify(responseData, null, 2));

    // Backend returns: { success, message, data: { accessToken, user, refreshToken } }
    const { accessToken: token, user, refreshToken } = responseData.data;

    console.log("✅ Extracted token:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");
    console.log("✅ Extracted user:", user ? user.email : "NO USER");

    const cookieStore = await cookies();
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    const cookieOpts = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    // JWT — httpOnly, never exposed to client JS (used by /api/auth/admin/me)
    cookieStore.set("adminAuthToken", token, { ...cookieOpts, httpOnly: true, maxAge });

    // Bearer token — readable by client JS so axios can set Authorization header
    cookieStore.set("adminBearerToken", token, { ...cookieOpts, httpOnly: false, maxAge });

    if (refreshToken) {
      cookieStore.set("adminRefreshToken", refreshToken, {
        ...cookieOpts,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return {
      success: true,
      data: {
        admin: user,
        message: "Admin login successful",
      },
    };
  } catch (error) {
    console.error("Admin login error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Admin login failed",
      };
    }
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

// ---------------------------------------------------------------------------
// Token refresh
// ---------------------------------------------------------------------------

export async function adminRefreshToken(refreshToken) {
  try {
    const response = await axios.post(`${API_URL}/admin/auth/refresh`, { refreshToken });
    const { token } = response.data;

    const cookieStore = await cookies();
    const cookieOpts = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    };
    cookieStore.set("adminAuthToken", token, { ...cookieOpts, httpOnly: true });
    cookieStore.set("adminBearerToken", token, { ...cookieOpts, httpOnly: false });

    return { success: true, data: { token } };
  } catch (error) {
    console.error("Admin token refresh error:", error);
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

export async function adminLogout() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("adminRefreshToken");

    if (refreshToken?.value) {
      await axios.post(`${API_URL}/admin/auth/logout`, {
        refreshToken: refreshToken.value,
      });
    }

    cookieStore.delete("adminAuthToken");
    cookieStore.delete("adminBearerToken");
    cookieStore.delete("adminRefreshToken");

    return { success: true, message: "Admin logged out successfully" };
  } catch (error) {
    console.error("Admin logout error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Failed to logout",
      };
    }
    return { success: false, error: "Failed to logout" };
  }
}
