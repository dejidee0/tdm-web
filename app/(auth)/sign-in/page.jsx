"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import { useLogin } from "@/hooks/use-auth";
import { signInSchema } from "@/lib/validations/auth";

function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { mutate: login, isPending } = useLogin();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: signInSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError("");
      login(values, {
        onError: (error) => {
          const raw = error.message || "Something went wrong. Please try again.";
          setSubmitError(raw.replace(/^\[\d+\]\s*/, ""));
          setSubmitting(false);
        },
        onSettled: () => {
          setSubmitting(false);
        },
      });
    },
  });

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4 py-12 font-manrope overflow-hidden">
      {/* Faded background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/auth.svg"
          alt=""
          fill
          className="object-cover opacity-[0.04]"
          priority
          aria-hidden="true"
        />
        {/* subtle radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)",
          }}
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

        {/* Card */}
        <div
          className="rounded-2xl px-8 py-10"
          style={{
            background: "#0d0b08",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 font-poppins">
              Welcome Back
            </h1>
            <p className="text-white/45 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none transition-all ${
                  formik.errors.email && formik.touched.email
                    ? "bg-red-900/20 border border-red-500/40 focus:border-red-500/60"
                    : "bg-[#1a1a1a] border border-white/10 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20"
                }`}
              />
              {formik.errors.email && formik.touched.email && (
                <p className="text-red-400 text-xs mt-1.5">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 pr-12 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none transition-all ${
                    formik.errors.password && formik.touched.password
                      ? "bg-red-900/20 border border-red-500/40 focus:border-red-500/60"
                      : "bg-[#1a1a1a] border border-white/10 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formik.errors.password && formik.touched.password && (
                <p className="text-red-400 text-xs mt-1.5">{formik.errors.password}</p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label htmlFor="rememberMe" className="flex items-center gap-2 cursor-pointer">
                <input
                  id="rememberMe"
                  type="checkbox"
                  name="rememberMe"
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                  className="w-4 h-4 rounded border-white/20 bg-[#1a1a1a] accent-[#D4AF37] cursor-pointer"
                />
                <span className="text-xs text-white/50">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-xs text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {submitError && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{submitError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={formik.isSubmitting || isPending}
              className="w-full py-3 rounded-lg font-semibold text-sm text-black transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
            >
              {formik.isSubmitting || isPending ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-[#D4AF37] font-medium hover:text-[#D4AF37]/80 transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
