"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, LogOut, Key } from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-manrope">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 font-manrope pt-32">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(212,175,55,0.12)" }}
          >
            <User className="w-12 h-12 text-[#D4AF37]" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-white/40">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl border border-white/08 p-6 mb-6" style={{ background: "#0d0b08" }}>
          <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
                <User className="w-5 h-5 text-white/40" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/35 mb-1">Full Name</p>
                <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
                <Mail className="w-5 h-5 text-white/40" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/35 mb-1">Email Address</p>
                <p className="text-white font-medium">{user?.email}</p>
                {user?.emailVerified && (
                  <span
                    className="inline-block mt-1 text-xs px-2 py-1 rounded"
                    style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80" }}
                  >
                    Verified
                  </span>
                )}
              </div>
            </div>

            {user?.phoneNumber && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <Phone className="w-5 h-5 text-white/40" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/35 mb-1">Phone Number</p>
                  <p className="text-white font-medium">{user?.phoneNumber}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Card */}
        <div className="rounded-xl border border-white/08 p-6" style={{ background: "#0d0b08" }}>
          <h2 className="text-xl font-semibold text-white mb-6">Account Actions</h2>

          <div className="space-y-3">
            <Link
              href="/forgot-password"
              className="flex items-center justify-between w-full p-4 rounded-lg hover:bg-white/05 transition-colors group"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/08" style={{ background: "#0d0b08" }}>
                  <Key className="w-5 h-5 text-white/40" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">Change Password</p>
                  <p className="text-sm text-white/35">Update your password for security</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <button
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="flex items-center justify-between w-full p-4 rounded-lg transition-colors group disabled:opacity-50"
              style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)" }}>
                  <LogOut className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-red-400">{isLoggingOut ? "Logging out..." : "Logout"}</p>
                  <p className="text-sm text-red-400/60">Sign out of your account</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-red-400/40 group-hover:text-red-400/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
