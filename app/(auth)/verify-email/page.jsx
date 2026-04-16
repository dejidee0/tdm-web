"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("verifying");
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
          `${process.env.NEXT_PUBLIC_API_URL}/Auth/verify-email?token=${encodeURIComponent(token)}`,
          { method: "POST", headers: { "Content-Type": "application/json" } },
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Verification failed");
        if (typeof window !== "undefined") localStorage.removeItem("verificationEmail");
        setStatus("success");
        setTimeout(() => router.push("/sign-in?verified=true"), 3000);
      } catch (err) {
        setStatus("error");
        setError(err.message || "Verification failed. The link may have expired.");
      }
    };
    verify();
  }, [searchParams, router]);

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
          {/* Verifying */}
          {status === "verifying" && (
            <>
              <div className="flex justify-center mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(212,175,55,0.12)" }}
                >
                  <Loader2 className="w-7 h-7 text-[#D4AF37] animate-spin" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-white mb-3 font-poppins">Verifying your email…</h1>
              <p className="text-white/45 text-sm">Please wait while we confirm your account.</p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-green-900/30">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-white mb-3 font-poppins">Email Verified!</h1>
              <p className="text-white/45 text-sm mb-2">Your account has been successfully verified.</p>
              <p className="text-white/30 text-xs mb-8">Redirecting you to sign in…</p>
              <Link
                href="/sign-in"
                className="block w-full py-3 rounded-lg font-semibold text-sm text-black transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
              >
                Continue to Sign In
              </Link>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-900/30">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-white mb-3 font-poppins">Verification Failed</h1>
              <p className="text-white/45 text-sm mb-8">{error}</p>
              <div className="space-y-3">
                <Link
                  href="/sign-up"
                  className="block w-full py-3 rounded-lg font-semibold text-sm text-black transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
                >
                  Back to Sign Up
                </Link>
                <Link
                  href="/sign-in"
                  className="block w-full py-3 rounded-lg font-semibold text-sm text-white border border-white/15 hover:border-white/30 transition-colors"
                >
                  Go to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(212,175,55,0.12)" }}>
            <Loader2 className="w-7 h-7 text-[#D4AF37] animate-spin" />
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
