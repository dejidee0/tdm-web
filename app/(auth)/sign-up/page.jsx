"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRegister } from "@/hooks/use-auth";

const inputClass = (hasError) =>
  `w-full px-4 py-3 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none transition-all ${
    hasError
      ? "bg-red-900/20 border border-red-500/40"
      : "bg-[#1a1a1a] border border-white/10 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20"
  }`;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const { mutate: register, isPending } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const newErrors = {};
    const email = formData.get("email");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const phoneNumber = formData.get("phoneNumber");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required";
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!phoneNumber || !/^\+?[\d\s\-()]+$/.test(phoneNumber)) newErrors.phoneNumber = "Valid phone number is required";
    if (!password || password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!agreedToTerms) newErrors.terms = "You must agree to terms & conditions";

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    register(formData, { onError: (error) => setErrors({ submit: error.message }) });
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4 py-12 font-manrope overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image src="/auth.svg" alt="" fill className="object-cover opacity-[0.04]" priority aria-hidden="true" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md py-8">
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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 font-poppins">Create Account</h1>
            <p className="text-white/45 text-sm">Join TBM and start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">Email</label>
              <input type="email" name="email" placeholder="you@example.com" className={inputClass(!!errors.email)} />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            {/* First + Last */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">First name</label>
                <input type="text" name="firstName" placeholder="John" className={inputClass(!!errors.firstName)} />
                {errors.firstName && <p className="text-red-400 text-xs mt-1.5">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">Last name</label>
                <input type="text" name="lastName" placeholder="Doe" className={inputClass(!!errors.lastName)} />
                {errors.lastName && <p className="text-red-400 text-xs mt-1.5">{errors.lastName}</p>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">Phone number</label>
              <input type="tel" name="phoneNumber" placeholder="+234 900 000 0000" className={inputClass(!!errors.phoneNumber)} />
              {errors.phoneNumber && <p className="text-red-400 text-xs mt-1.5">{errors.phoneNumber}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  className={`${inputClass(!!errors.password)} pr-12`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-widest">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat password"
                  className={`${inputClass(!!errors.confirmPassword)} pr-12`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-[#1a1a1a] accent-[#D4AF37] cursor-pointer"
                />
                <span className="text-xs text-white/50">
                  I agree with{" "}
                  <Link href="/terms" className="text-[#D4AF37] hover:text-[#D4AF37]/80 font-medium transition-colors">
                    terms & conditions
                  </Link>
                </span>
              </label>
              {errors.terms && <p className="text-red-400 text-xs mt-1.5">{errors.terms}</p>}
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
              {isPending ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-[#D4AF37] font-medium hover:text-[#D4AF37]/80 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
