"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { apiClient } from "../api/client";
// import apiClient from "../axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Decode a JWT string and return its payload, or null on failure. */
function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    return JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

/** Extract a normalised user object from a vendor JWT payload. */
function vendorUserFromPayload(payload) {
  return {
    id: payload[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ],
    email:
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ],
    name:
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      payload.firstName,
    firstName: payload.firstName,
    lastName: payload.lastName,
    role: payload[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ],
  };
}

/**
 * Returns the current vendor user, transparently refreshing the access token
 * when it is expired (as long as a valid refresh token cookie exists).
 * Used by GET /api/auth/vendor/me.
 */
export async function getCurrentVendorUser() {
  try {
    const cookieStore = await cookies();
   // const token = cookieStore.get("vendorAuthToken")?.value;
   const token = cookieStore.get("accessToken")?.value;
    if (!token) return null;

    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    // Token still valid — return immediately
    if (payload.exp * 1000 > Date.now()) {
      return vendorUserFromPayload(payload);
    }

    // Access token expired — attempt silent refresh
    const storedRefresh = cookieStore.get("vendorRefreshToken")?.value;
    if (!storedRefresh) return null;

    const res = await axios.post(`${API_URL}/Auth/refresh-token`, {
      refreshToken: storedRefresh,
    });

    const newAccessToken =
      res.data?.token || res.data?.data?.accessToken || res.data?.accessToken;
    const newRefreshToken =
      res.data?.refreshToken || res.data?.data?.refreshToken;

    if (!newAccessToken) return null;

    const cookieOpts = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    };
    cookieStore.set("vendorAuthToken", newAccessToken, {
      ...cookieOpts,
      httpOnly: true,
    });
    cookieStore.set("vendorBearerToken", newAccessToken, {
      ...cookieOpts,
      httpOnly: false,
    });
    if (newRefreshToken) {
      cookieStore.set("vendorRefreshToken", newRefreshToken, {
        ...cookieOpts,
        httpOnly: true,
      });
    }

    const newPayload = decodeJwtPayload(newAccessToken);
    if (!newPayload) return null;
    return vendorUserFromPayload(newPayload);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export async function vendorLogin(credentials) {
  console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);
  try {
    const { email, password, rememberMe = false } = credentials;

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return { success: false, error: "Invalid email format" };
    }

    const response = await apiClient.post("/Auth/login", {
      email,
      password,
    });

    console.log(
      "🔍 Backend Raw response from vendor login:",
      JSON.stringify(response, null, 2),
    ); // check shape first
    const { accessToken: token, user, refreshToken } = response.data;

    console.log(
      "✅ Extracted token:",
      token ? `${token.substring(0, 20)}...` : "NO TOKEN",
    );
    console.log("✅ Extracted user:", user ? user.email : "NO USER");

    const cookieStore = await cookies();
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    const cookieOpts = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    // JWT — httpOnly, never exposed to client JS (used by /api/auth/vendor/me)
    cookieStore.set("vendorAuthToken", token, {
      ...cookieOpts,
      httpOnly: true,
      maxAge,
    });

    // Bearer token — readable by client JS so axios can set Authorization header
    cookieStore.set("vendorBearerToken", token, {
      ...cookieOpts,
      httpOnly: false,
      maxAge,
    });

    if (refreshToken) {
      cookieStore.set("vendorRefreshToken", refreshToken, {
        ...cookieOpts,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
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
    const message = error?.message || "Vendor login failed";
    console.error("❌ Vendor login error:", message, error?.data ?? "");
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Token refresh
// ---------------------------------------------------------------------------

export async function vendorRefreshToken(refreshToken) {
  try {
    const response = await axios.post(`${API_URL}/Auth/refresh-token`, {
      refreshToken,
    });
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
        error:
          error.response?.data?.message ||
          error.message ||
          "Token refresh failed",
      };
    }
    return { success: false, error: "Failed to refresh token" };
  }
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export async function vendorLogout() {
  const cookieStore = await cookies();

  try {
    const bearerToken = cookieStore.get("vendorBearerToken")?.value;
    const refreshToken = cookieStore.get("vendorRefreshToken")?.value;

    if (refreshToken) {
      await axios.post(
        `${API_URL}/Auth/logout`,
        { refreshToken },
        bearerToken
          ? { headers: { Authorization: `Bearer ${bearerToken}` } }
          : {},
      );
    }
  } catch (error) {
    // Log but don't block logout — cookies are always cleared below
    console.error("Vendor logout API error (non-fatal):", error);
  }

  cookieStore.delete("vendorAuthToken");
  cookieStore.delete("vendorBearerToken");
  cookieStore.delete("vendorRefreshToken");

  return { success: true, message: "Vendor logged out successfully" };
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
