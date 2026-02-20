"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Get email from query params or localStorage
    const emailFromQuery = searchParams.get("email");
    const emailFromStorage = localStorage.getItem("verificationEmail");
    const userEmail = emailFromQuery || emailFromStorage || "";
    setEmail(userEmail);
  }, [searchParams]);

  const handleVerifyToken = async (e) => {
    e.preventDefault();

    if (!token.trim()) {
      setError("Please enter the verification token");
      return;
    }

    setIsVerifying(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/Auth/verify-email?token=${encodeURIComponent(token.trim())}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setSuccessMessage(
        "Email verified successfully! Redirecting to sign in...",
      );

      // Clear email from localStorage
      localStorage.removeItem("verificationEmail");

      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to verify email. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    setIsResending(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend email");
      }

      setSuccessMessage("Verification email sent successfully!");
      setToken("");
    } catch (error) {
      setError(error.message || "Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-manrope pt-20">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center relative">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center transform -rotate-12">
              <Mail className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <div className="absolute top-4 right-6">
              <div className="relative">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <MessageCircle
                    className="w-4 h-4 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-primary mb-4">
          Verify Your Email
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-2">
          We sent a verification token to{" "}
          <span className="font-semibold text-gray-900">
            {email || "your email"}
          </span>
        </p>
        <p className="text-gray-600 mb-6">
          Enter the token below to verify your account
        </p>

        {/* Token Input Form */}
        <form onSubmit={handleVerifyToken} className="mb-6">
          <div className="mb-4">
            <input
              type="text"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError("");
              }}
              placeholder="Enter verification token"
              className={`w-full px-4 py-3 bg-white border ${
                error ? "border-red-500" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg tracking-wider font-mono text-primary placeholder:text-gray-300`}
              disabled={isVerifying}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 text-left">{error}</p>
            )}
            {successMessage && (
              <p className="text-green-600 text-sm mt-2 text-left">
                {successMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying || !token.trim()}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-[#334155] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-50 text-gray-500">Or</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="block w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? "Resending..." : "Resend Verification Email"}
          </button>

          <Link
            href="/sign-in"
            className="block w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Sign In
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 mt-6">
          Didn&apos;t receive the email? Check your spam folder or try
          resending.
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
