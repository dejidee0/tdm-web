"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('API_URL', API_URL);


export async function registerUser(formData) {
  try {
    const email = formData.get("email");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const phoneNumber = formData.get("phoneNumber");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    console.log("📝 [registerUser] Payload:", {
      email,
      firstName,
      lastName,
      phoneNumber,
      password: password ? "***" : null,
      confirmPassword: confirmPassword ? "***" : null,
    });

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

    const url = `${API_URL}/v1/Auth/register`;
    console.log("🌐 [registerUser] Fetching URL:", url);

    const requestBody = JSON.stringify({
      email,
      firstName,
      lastName,
      phoneNumber,
      password,
      confirmPassword,
    });
    console.log("📦 [registerUser] Request body:", requestBody);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });

    console.log("📡 [registerUser] Response status:", response.status);
    console.log(
      "📡 [registerUser] Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    const rawText = await response.text();
    console.log("📄 [registerUser] Raw response text:", rawText);

    let data = null;
    try {
      data = JSON.parse(rawText);
      console.log("✅ [registerUser] Parsed JSON:", data);
    } catch (parseErr) {
      console.warn("⚠️ [registerUser] Response is not JSON:", parseErr.message);
    }

    if (!response.ok) {
      const errMsg =
        data?.message ||
        data?.title ||
        data?.errors ||
        rawText?.slice(0, 300) ||
        "Registration failed";
      console.error("❌ [registerUser] Error response:", errMsg);
      return { success: false, error: errMsg };
    }

    console.log("🎉 [registerUser] Registration successful for:", email);
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

export async function loginUser(formData) {
  try {
    const { email, password, rememberMe = false } = credentials;

    console.log("📝 [loginUser] Payload:", { email, rememberMe });

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return { success: false, error: "Invalid email format" };
    }

    const url = `${API_URL}/v1/Auth/login`;
    console.log("🌐 [loginUser] Fetching URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("📡 [loginUser] Response status:", response.status);

    const rawText = await response.text();
    console.log("📄 [loginUser] Raw response text:", rawText);

    let data = null;
    try {
      data = JSON.parse(rawText);
      console.log("✅ [loginUser] Parsed JSON:", data);
    } catch (parseErr) {
      console.warn("⚠️ [loginUser] Response is not JSON:", parseErr.message);
    }

    if (!response.ok) {
      const errMsg =
        data?.message ||
        data?.title ||
        rawText?.slice(0, 300) ||
        "Login failed";
      console.error("❌ [loginUser] Error:", errMsg);
      return { success: false, error: errMsg };
    }

    // API returns: { success, message, data: { accessToken, refreshToken, expiresAt, user } }
    const { accessToken, refreshToken, expiresAt, user } = data.data;

    console.log(
      "🔑 [loginUser] accessToken received:",
      accessToken ? "yes" : "no",
    );
    console.log("👤 [loginUser] User data:", user);

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
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return {
      success: true,
      data: { user, message: "Login successful" },
    };
  } catch (error) {
    console.error("💥 [loginUser] Unexpected error:", error);
    return {
      success: false,
      error: "Failed to refresh token",
    };
  }
}

export async function logoutUser() {
  try {
    console.log("🚪 [logoutUser] Logging out...");
    const cookieStore = await cookies();
    cookieStore.delete("authToken");
    cookieStore.delete("refreshToken");
    console.log("✅ [logoutUser] Cookies deleted");
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

    // Decode JWT payload (no verification needed server-side for display purposes)
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64").toString("utf-8"),
    );

    // Check expiry
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
    console.log("📝 [forgotPassword] Email:", email);

    if (!email) return { success: false, error: "Email is required" };
    if (!/\S+@\S+\.\S+/.test(email))
      return { success: false, error: "Invalid email format" };

    const url = `${API_URL}/v1/Auth/forgot-password`;
    console.log("🌐 [forgotPassword] Fetching URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    console.log("📡 [forgotPassword] Response status:", response.status);

    const rawText = await response.text();
    console.log("📄 [forgotPassword] Raw response:", rawText);

    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch {}

    if (!response.ok) {
      const errMsg =
        data?.message || rawText?.slice(0, 300) || "Failed to send reset email";
      console.error("❌ [forgotPassword] Error:", errMsg);
      return { success: false, error: errMsg };
    }

    console.log("✅ [forgotPassword] Reset email sent to:", email);
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
    console.log("📝 [verifyEmail] Email:", email, "Code:", code);

    if (!email || !code)
      return {
        success: false,
        error: "Email and verification code are required",
      };

    const url = `${API_URL}/v1/Auth/verify-email`;
    console.log("🌐 [verifyEmail] Fetching URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    console.log("📡 [verifyEmail] Response status:", response.status);

    const rawText = await response.text();
    console.log("📄 [verifyEmail] Raw response:", rawText);

    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch {}

    if (!response.ok) {
      const errMsg =
        data?.message || rawText?.slice(0, 300) || "Verification failed";
      console.error("❌ [verifyEmail] Error:", errMsg);
      return { success: false, error: errMsg };
    }

    console.log("✅ [verifyEmail] Email verified successfully");
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
    console.log("📝 [resendVerification] Email:", email);

    if (!email) return { success: false, error: "Email is required" };

    const url = `${API_URL}/v1/Auth/resend-verification`;
    console.log("🌐 [resendVerification] Fetching URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    console.log("📡 [resendVerification] Response status:", response.status);

    const rawText = await response.text();
    console.log("📄 [resendVerification] Raw response:", rawText);

    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch {}

    if (!response.ok) {
      const errMsg =
        data?.message ||
        rawText?.slice(0, 300) ||
        "Failed to resend verification code";
      console.error("❌ [resendVerification] Error:", errMsg);
      return { success: false, error: errMsg };
    }

    console.log("✅ [resendVerification] Code resent to:", email);
    return { success: true, data: { message: "Verification code sent" } };
  } catch (error) {
    console.error("💥 [resendVerification] Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
