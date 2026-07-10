"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { ADMIN_API_URL as API_URL } from "@/lib/env";

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

/** Extract a normalised user object from an admin JWT payload. */
function adminUserFromPayload(payload) {
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
 * Returns the current admin user, transparently refreshing the access token
 * when it is expired (as long as a valid refresh token cookie exists).
 * Used by GET /api/auth/admin/me.
 */
export async function getCurrentAdminUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("adminAuthToken")?.value;
    if (!token) return null;

    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    // Token still valid — return immediately
    if (payload.exp * 1000 > Date.now()) {
      return adminUserFromPayload(payload);
    }

    // Access token expired — attempt silent refresh
    const storedRefresh = cookieStore.get("adminRefreshToken")?.value;
    if (!storedRefresh) return null;

    const res = await axios.post(`${API_URL}/admin/auth/refresh`, {
      refreshToken: storedRefresh,
    });

    // Support both { token } and { data: { accessToken } } response shapes
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
    cookieStore.set("adminAuthToken", newAccessToken, {
      ...cookieOpts,
      httpOnly: true,
    });
    if (newRefreshToken) {
      cookieStore.set("adminRefreshToken", newRefreshToken, {
        ...cookieOpts,
        httpOnly: true,
      });
    }

    const newPayload = decodeJwtPayload(newAccessToken);
    if (!newPayload) return null;
    return adminUserFromPayload(newPayload);
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

    // Backend returns: { success, message, data: { accessToken, user, refreshToken } }
    const { accessToken: token, user, refreshToken } = responseData.data;

    const cookieStore = await cookies();
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    const cookieOpts = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    // JWT — httpOnly, never exposed to client JS (used by /api/auth/session and
    // by lib/proxy.js when it authenticates the /api/proxy/admin mount).
    cookieStore.set("adminAuthToken", token, {
      ...cookieOpts,
      httpOnly: true,
      maxAge,
    });

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
        error:
          error.response?.data?.message ||
          error.message ||
          "Admin login failed",
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// ---------------------------------------------------------------------------
// Token refresh
// ---------------------------------------------------------------------------

export async function adminRefreshToken(refreshToken) {
  try {
    const response = await axios.post(`${API_URL}/admin/auth/refresh`, {
      refreshToken,
    });
    // Response envelope: { success, data: { accessToken, refreshToken, expiresAt } }
    const newAccessToken =
      response.data?.data?.accessToken ||
      response.data?.accessToken ||
      response.data?.token;
    const newRefreshToken =
      response.data?.data?.refreshToken || response.data?.refreshToken;

    if (!newAccessToken) throw new Error("No access token in refresh response");

    const cookieStore = await cookies();
    const cookieOpts = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    };
    cookieStore.set("adminAuthToken", newAccessToken, { ...cookieOpts, httpOnly: true });
    if (newRefreshToken) {
      cookieStore.set("adminRefreshToken", newRefreshToken, {
        ...cookieOpts,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    // The refreshed token stays in the httpOnly cookie — never hand it back to
    // client JS, which is the caller of this server action.
    return { success: true };
  } catch (error) {
    console.error("Admin token refresh error:", error);
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

export async function adminLogout() {
  const cookieStore = await cookies();

  try {
    const bearerToken = cookieStore.get("adminAuthToken")?.value;
    const refreshToken = cookieStore.get("adminRefreshToken")?.value;

    if (refreshToken) {
      await axios.post(
        `${API_URL}/admin/auth/logout`,
        { refreshToken },
        bearerToken
          ? { headers: { Authorization: `Bearer ${bearerToken}` } }
          : {},
      );
    }
  } catch (error) {
    // Log but don't block logout — cookies are always cleared below
    console.error("Admin logout API error (non-fatal):", error);
  }

  cookieStore.delete("adminAuthToken");
  cookieStore.delete("adminBearerToken"); // legacy readable cookie — see LEGACY_TOKEN_COOKIES
  cookieStore.delete("adminRefreshToken");

  return { success: true, message: "Admin logged out successfully" };
}
