"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

function ResetEmailSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "codemonk123@gmail.com";

  const handleResendEmail = async () => {
    try {
      await fetch("YOUR_API_ENDPOINT/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      // Show success message or notification
      alert("Reset email sent successfully!");
    } catch (error) {
      alert("Failed to resend email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-manrope">
      <div className="w-full max-w-md text-center">
        {/* Email Icon with Next.js Image */}
        <div className="flex justify-center mb-6">
          <div className="relative w-36 h-36">
            <Image
              src="/email.png"
              alt="Email sent"
              width={132}
              height={132}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-[#1e293b] mb-4">Thank you!</h1>

        {/* Message */}
        <p className="text-gray-600 mb-2">
          We sent an email to{" "}
          <span className="font-semibold text-gray-900">{email}</span>
        </p>
        <p className="text-gray-600 mb-8">
          Click the confirmation link in the email to reset your password
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/sign-in"
            className="block w-full bg-[#1e293b] text-white py-3 rounded-lg font-semibold hover:bg-[#334155] transition-colors"
          >
            Go to Sign In
          </Link>

          <button
            onClick={handleResendEmail}
            className="block w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Resend Email
          </button>
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

export default function ResetEmailSentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      }
    >
      <ResetEmailSentContent />
    </Suspense>
  );
}
