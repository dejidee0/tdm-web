"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Suspense } from "react";

function ResetEmailSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  const handleResendEmail = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4 py-12 font-manrope overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image src="/auth.svg" alt="" fill className="object-cover opacity-[0.04]" priority aria-hidden="true" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-poppins font-bold text-2xl tracking-tight">
              <span className="text-white">TBM</span>
              <span className="text-[#D4AF37]">.</span>
            </span>
          </Link>
        </div>

        <div
          className="rounded-2xl px-8 py-12 text-center"
          style={{ background: "#0d0b08", boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(212,175,55,0.12)", boxShadow: "0 0 0 1px rgba(212,175,55,0.2)" }}
            >
              <Mail className="w-7 h-7 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4 font-poppins">Check your email</h1>

          <p className="text-white/50 text-sm mb-1">We sent a reset link to</p>
          <p className="text-[#D4AF37] font-semibold text-sm mb-2">{email}</p>
          <p className="text-white/40 text-sm mb-8">
            Click the link in that email to reset your password.
          </p>

          <div className="space-y-3">
            <Link
              href="/sign-in"
              className="block w-full py-3 rounded-lg font-semibold text-sm text-black transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
            >
              Go to Sign In
            </Link>
            <button
              onClick={handleResendEmail}
              className="block w-full py-3 rounded-lg font-semibold text-sm text-white border border-white/15 hover:border-white/30 transition-colors"
            >
              Resend Email
            </button>
          </div>

          <p className="text-xs text-white/25 mt-6">
            Didn&apos;t receive it? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetEmailSentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetEmailSentContent />
    </Suspense>
  );
}
