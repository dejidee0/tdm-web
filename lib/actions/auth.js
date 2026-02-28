"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(formData) {
  try {
    const email = formData.get("email");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const phoneNumber = formData.get("phoneNumber");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (
      !email ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      return { success: false, error: "All fields are required" };
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return { success: false, error: "Invalid email format" };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters",
      };
    }

    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match" };
    }

    const response = await fetch(`${API_URL}/v1/Auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        phoneNumber,
        password,
        confirmPassword,
      }),
    });

    const rawText = await response.text();
    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch {}

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || data?.title || "Registration failed",
      };
    }

    return {
      success: true,
      data: { email, message: "Registration successful" },
    };
  } catch (error) {
    console.error("💥 [registerUser] Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function loginUser(credentials) {
  try {
    // ✅ Fixed: was destructuring from undefined `credentials` variable
    const { email, password, rememberMe = false } = credentials;

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return { success: false, error: "Invalid email format" };
    }

    const response = await fetch(`${API_URL}/v1/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const rawText = await response.text();
    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch {}

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || data?.title || "Login failed",
      };
    }

    const { accessToken, refreshToken, user } = data.data;

    const cookieStore = await cookies();

    cookieStore.set("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
      path: "/",
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return { success: true, data: { user, message: "Login successful" } };
  } catch (error) {
    console.error("💥 [loginUser] Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("authToken");
    cookieStore.delete("refreshToken");
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("💥 [logoutUser] Error:", error);
    return { success: false, error: "Failed to logout" };
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) return null;

    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64").toString("utf-8"),
    );

    if (payload.exp * 1000 < Date.now()) {
      console.warn("⚠️ [getCurrentUser] Token expired");
      return null;
    }

    return {
      id: payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ],
      email:
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName:
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      role: payload[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ],
    };
  } catch (error) {
    console.error("💥 [getCurrentUser] Error decoding token:", error);
    return null;
  }
}

export async function forgotPassword(formData) {
  try {
    const email = formData.get("email");

    if (!email) return { success: false, error: "Email is required" };
    if (!/\S+@\S+\.\S+/.test(email))
      return { success: false, error: "Invalid email format" };

    const response = await fetch(`${API_URL}/v1/Auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const rawText = await response.text();
    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch {}

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || "Failed to send reset email",
      };
    }

    return {
      success: true,
      data: { email, message: "Password reset email sent" },
    };
  } catch (error) {
    console.error("💥 [forgotPassword] Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function verifyEmail(email, code) {
  try {
    if (!email || !code) {
      return {
        success: false,
        error: "Email and verification code are required",
      };
    }

    const response = await fetch(`${API_URL}/v1/Auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const rawText = await response.text();
    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch {}

    if (!response.ok) {
      return { success: false, error: data?.message || "Verification failed" };
    }

    return { success: true, data: { message: "Email verified successfully" } };
  } catch (error) {
    console.error("💥 [verifyEmail] Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function resendVerificationCode(email) {
  try {
    if (!email) return { success: false, error: "Email is required" };

    const response = await fetch(`${API_URL}/v1/Auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const rawText = await response.text();
    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch {}

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || "Failed to resend verification code",
      };
    }

    return { success: true, data: { message: "Verification code sent" } };
  } catch (error) {
    console.error("💥 [resendVerificationCode] Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
