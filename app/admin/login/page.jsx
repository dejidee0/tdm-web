"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import { useAdminLogin } from "@/hooks/use-admin-auth";
import { signInSchema } from "@/lib/validations/auth";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { mutate: login, isPending } = useAdminLogin();

  const formik = useFormik({
    initialValues: {
      email: "Ifemicheal2@gmail.com",
      password: "Nisotgreg0",
      rememberMe: true,
    },
    validationSchema: signInSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError("");

      // Submit with React Query
      login(values, {
        onError: (error) => {
          setSubmitError(error.message);
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
      {/* Faded background image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/auth.svg"
          alt=""
          fill
          className="object-cover opacity-10"
          priority
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Login
          </h1>
          <p className="text-white/50">Sign in to access the admin dashboard</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-white/60 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 bg-[#1a1a1a] border ${
                formik.errors.email && formik.touched.email ? "border-red-500" : "border-white/10"
              } rounded-lg focus:outline-none focus:ring-2 placeholder:text-white/20 text-white focus:ring-[#D4AF37]/40 focus:border-transparent transition-all`}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-white/60 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border ${
                  formik.errors.password && formik.touched.password ? "border-red-500" : "border-white/10"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-transparent placeholder:text-white/20 text-white transition-all pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formik.errors.password && formik.touched.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="rememberMe" className="flex items-center gap-2 cursor-pointer">
              <input
                id="rememberMe"
                type="checkbox"
                name="rememberMe"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-4 h-4 text-[#D4AF37] border-white/20 rounded focus:ring-[#D4AF37]/40 bg-[#1a1a1a]"
              />
              <span className="text-sm text-white/60">Remember me</span>
            </label>
          </div>

          {submitError && (
            <div className="bg-red-950/30 border border-red-800/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={formik.isSubmitting || isPending}
            className="w-full py-3 rounded-lg font-semibold text-black transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
          >
            {formik.isSubmitting || isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-white/30 mt-6">
          Admin access only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
