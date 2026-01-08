"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useForgotPassword } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const [errors, setErrors] = useState({});

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);

    // Client-side validation
    const email = formData.get("email");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Valid email is required" });
      return;
    }

    // Submit with React Query
    forgotPassword(formData, {
      onError: (error) => {
        setErrors({ submit: error.message });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-manrope">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1e293b] mb-2">
            Lost your password?
          </h1>
          <p className="text-gray-500">Enter your details to recover</p>
          <p className="text-gray-400 text-sm mt-1">
            Enter your details to proceed further
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              placeholder="codemonk123@gmail.com"
              className={`w-full px-4 py-3 bg-white border ${
                errors.email || errors.submit
                  ? "border-red-500"
                  : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 placeholder:text-gray-200 text-primary focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#1e293b] text-white py-3 rounded-lg font-semibold hover:bg-[#334155] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Sending..." : "Send"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/sign-in"
            className="text-sm text-gray-600 hover:text-[#1e293b] transition-colors"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
