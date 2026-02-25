"use client";

import { useState } from "react";
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-manrope">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Admin Login
          </h1>
          <p className="text-gray-500">Sign in to access the admin dashboard</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1.5">
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
              className={`w-full px-4 py-3 bg-white border ${
                formik.errors.email && formik.touched.email ? "border-red-500" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 placeholder:text-gray-300 text-primary focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-600 mb-1.5">
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
                className={`w-full px-4 py-3 bg-white border ${
                  formik.errors.password && formik.touched.password ? "border-red-500" : "border-gray-200"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 text-primary transition-all pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={formik.isSubmitting || isPending}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-[#334155] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting || isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Admin access only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
