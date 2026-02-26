"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setError("No verification token found. Please check your email link.");
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/Auth/verify-email?token=${encodeURIComponent(token)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Verification failed");
        }

        // Clear any stored verification email
        if (typeof window !== "undefined") {
          localStorage.removeItem("verificationEmail");
        }

        setStatus("success");

        // Redirect to sign-in after 3 seconds
        setTimeout(() => {
          router.push("/sign-in?verified=true");
        }, 3000);
      } catch (err) {
        setStatus("error");
        setError(
          err.message || "Verification failed. The link may have expired.",
        );
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-manrope">
      <div className="w-full max-w-md text-center">
        {/* Verifying State */}
        {status === "verifying" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-primary mb-3">
              Verifying your email...
            </h1>
            <p className="text-gray-500">
              Please wait while we confirm your account.
            </p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Email Verified!
            </h1>
            <p className="text-gray-500 mb-2">
              Your account has been successfully verified.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Redirecting you to sign in...
            </p>
            <Link
              href="/sign-in"
              className="inline-block w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Continue to Sign In
            </Link>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Verification Failed
            </h1>
            <p className="text-gray-500 mb-8">{error}</p>
            <div className="space-y-3">
              <Link
                href="/sign-up"
                className="block w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Back to Sign Up
              </Link>
              <Link
                href="/sign-in"
                className="block w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Go to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
