"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { KeyRound } from "lucide-react";
import { useForgotPassword } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const [errors, setErrors] = useState({});
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Valid email is required" });
      return;
    }
    forgotPassword(formData, { onError: (error) => setErrors({ submit: error.message }) });
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
          className="rounded-2xl px-8 py-10"
          style={{ background: "#0d0b08", boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(212,175,55,0.12)", boxShadow: "0 0 0 1px rgba(212,175,55,0.2)" }}
            >
              <KeyRound className="w-7 h-7 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 font-poppins">Forgot Password?</h1>
            <p className="text-white/45 text-sm leading-relaxed">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none transition-all ${
                  errors.email || errors.submit
                    ? "bg-red-900/20 border border-red-500/40"
                    : "bg-[#1a1a1a] border border-white/10 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20"
                }`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {errors.submit && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-lg font-semibold text-sm text-black transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
            >
              {isPending ? "Sending…" : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/sign-in" className="text-sm text-white/40 hover:text-white/70 transition-colors">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
