"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, LogOut, Key } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Get token from localStorage or sessionStorage
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        router.push("/sign-in");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          router.push("/sign-in");
          return;
        }
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      setError(error.message || "Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    router.push("/sign-in");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-manrope">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1e293b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-manrope">
        <div className="w-full max-w-md text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-600 font-semibold mb-2">Error</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchCurrentUser}
            className="bg-[#1e293b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#334155] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-manrope pt-32">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#1e293b] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2">My Profile</h1>
          <p className="text-gray-500">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#1e293b] mb-6">
            Account Information
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="text-gray-900 font-medium">
                    {user?.phoneNumber}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-[#1e293b] mb-6">
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
              onClick={handleLogout}
              className="flex items-center justify-between w-full p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-red-200">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-red-600">Logout</p>
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
