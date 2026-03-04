// components/shared/dashboard/profile/sidebar.jsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { User, MapPin, Shield, Bell } from "lucide-react";

const TABS = [
  { id: "personal", label: "Personal Details", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function ProfileSidebar({
  profile,
  activeTab,
  setActiveTab,
  isLoading,
}) {
  // profile here is already data.profile (firstName, email, avatarUrl, etc.)
  const displayName =
    profile?.fullName ||
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    "Your Account";

  const initial =
    profile?.firstName?.charAt(0)?.toUpperCase() ||
    profile?.fullName?.charAt(0)?.toUpperCase() ||
    "U";
  console.log(profile);
  return (
    <div className="space-y-4">
      {/* Avatar Card */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5 flex flex-col items-center text-center">
        {isLoading ? (
          <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mb-3" />
        ) : (
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center mb-3 shrink-0">
            {profile?.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={displayName}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <span className="text-2xl font-bold text-primary">{initial}</span>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2 w-full">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
            <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto animate-pulse" />
          </div>
        ) : (
          <>
            <p className="text-[15px] font-semibold text-primary truncate w-full">
              {displayName}
            </p>
            {profile?.email && (
              <p className="text-[12px] text-[#999] truncate w-full mt-0.5">
                {profile.email}
              </p>
            )}
            <span
              className={`mt-2 inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                profile?.emailVerified
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {profile?.emailVerified ? "Verified" : "Unverified"}
            </span>
          </>
        )}
      </div>

      {/* Tab Navigation */}
      <nav className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
        {TABS.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-3 w-full px-4 py-3.5 text-left transition-colors ${
                i < TABS.length - 1 ? "border-b border-[#f0f0f0]" : ""
              } ${isActive ? "bg-primary/5" : "hover:bg-[#fafafa]"}`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r-full"
                />
              )}
              <Icon
                className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-[#aaa]"}`}
              />
              <span
                className={`text-[14px] font-medium ${isActive ? "text-primary" : "text-[#555]"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
