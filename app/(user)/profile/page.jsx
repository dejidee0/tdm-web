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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-manrope">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-manrope pt-32">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">My Profile</h1>
          <p className="text-gray-500">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-primary mb-6">
            Account Information
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="text-gray-900 font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="text-gray-900 font-medium">{user?.email}</p>
                {user?.emailVerified && (
                  <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* Phone */}
            {user?.phoneNumber && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="text-gray-900 font-medium">{user?.phoneNumber}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-primary mb-6">
            Account Actions
          </h2>

          <div className="space-y-3">
            {/* Change Password Button */}
            <Link
              href="/forgot-password"
              className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  <Key className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-500">
                    Update your password for security
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            {/* Logout Button */}
            <button
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="flex items-center justify-between w-full p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-red-200">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-red-600">
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </p>
                  <p className="text-sm text-red-500">
                    Sign out of your account
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
