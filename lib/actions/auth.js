"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('API_URL', API_URL);


/**
 * Server action to register a new user
 * @param {FormData} formData - Form data from sign up form
 * @returns {Object} Success or error response
 */
export async function registerUser(formData) {
  try {
    const email = formData.get("email");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const phoneNumber = formData.get("phoneNumber");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Validation
    if (
      !email ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      return {
        success: false,
        error: "All fields are required",
      };
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters",
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match",
      };
    }

    const response = await fetch(`${API_URL}/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        phoneNumber,
        password,
        confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Registration failed",
      };
    }

    return {
      success: true,
      data: {
        email,
        message: "Registration successful",
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Server action to log in a user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @param {boolean} credentials.rememberMe - Remember me flag
 * @returns {Object} Success or error response
 */
export async function loginUser(credentials) {
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

    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
      rememberMe,
    });

    const data = response.data;

    // Store auth token in HTTP-only cookie for security
    const cookieStore = await cookies();
    cookieStore.set("authToken", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
      path: "/",
    });

    // Store refresh token if provided by backend
    if (data.refreshToken) {
      cookieStore.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }

    return {
      success: true,
      data: {
        user: data.user,
        token: data.token, // Include token in response for client-side reference
        message: "Login successful",
      },
    };
  } catch (error) {
    console.error("Login error:", error);

    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
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
 * Server action to refresh auth token
 * @returns {Object} Success or error response
 */
export async function refreshAuthToken() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken");

    if (!refreshToken) {
      return {
        success: false,
        error: "No refresh token available",
      };
    }

    const response = await fetch(`${API_URL}/Auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshToken.value }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Token refresh failed",
      };
    }

    // Update auth token
    cookieStore.set("authToken", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return {
      success: true,
      data: {
        token: data.token,
        message: "Token refreshed successfully",
      },
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    return {
      success: false,
      error: "Failed to refresh token",
    };
  }
}

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
 * Server action to log out a user
 */
export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("authToken");
    cookieStore.delete("refreshToken");

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "Failed to logout",
    };
  }
}

/**
 * Server action to request password reset
 * @param {FormData} formData - Form data with email
 * @returns {Object} Success or error response
 */
export async function forgotPassword(formData) {
  try {
    const email = formData.get("email");

    if (!email) {
      return {
        success: false,
        error: "Email is required",
      };
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    const response = await fetch(`${API_URL}/Auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to send reset email",
      };
    }

    return {
      success: true,
      data: {
        email,
        message: "Password reset email sent",
      },
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Server action to verify email with code
 * @param {string} email - User email
 * @param {string} code - Verification code
 * @returns {Object} Success or error response
 */
export async function verifyEmail(email, code) {
  try {
    if (!email || !code) {
      return {
        success: false,
        error: "Email and verification code are required",
      };
    }

    const response = await fetch(`${API_URL}/Auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Verification failed",
      };
    }

    return {
      success: true,
      data: {
        message: "Email verified successfully",
      },
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Server action to resend verification code
 * @param {string} email - User email
 * @returns {Object} Success or error response
 */
export async function resendVerificationCode(email) {
  try {
    if (!email) {
      return {
        success: false,
        error: "Email is required",
      };
    }

    const response = await fetch(`${API_URL}/Auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to resend verification code",
      };
    }

    return {
      success: true,
      data: {
        message: "Verification code sent",
      },
    };
  } catch (error) {
    console.error("Resend verification error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
