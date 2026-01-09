"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
 * @param {FormData} formData - Form data from sign in form
 * @returns {Object} Success or error response
 */
export async function loginUser(formData) {
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

    const response = await fetch(`${API_URL}/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Login failed",
      };
    }

    // Store auth token in HTTP-only cookie for security
    const cookieStore = await cookies();
    cookieStore.set("authToken", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
      path: "/",
    });

    return {
      success: true,
      data: {
        user: data.user,
        message: "Login successful",
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Server action to log out a user
 */
export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("authToken");

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
