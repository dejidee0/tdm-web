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

export default function ProfileSidebar({ profile, activeTab, setActiveTab, isLoading }) {
  const displayName =
    profile?.fullName ||
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    "Your Account";

  const initial =
    profile?.firstName?.charAt(0)?.toUpperCase() ||
    profile?.fullName?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div className="space-y-4">
      {/* Avatar Card */}
      <div className="rounded-2xl border border-white/08 p-5 flex flex-col items-center text-center" style={{ background: "#0d0b08" }}>
        {isLoading ? (
          <div className="w-16 h-16 rounded-full bg-white/06 animate-pulse mb-3" />
        ) : (
          <div
            className="relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-3 shrink-0"
            style={{ background: "rgba(212,175,55,0.12)" }}
          >
            {profile?.avatarUrl ? (
              <Image src={profile.avatarUrl} alt={displayName} fill className="object-cover" sizes="64px" />
            ) : (
              <span className="text-2xl font-bold text-[#D4AF37]">{initial}</span>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2 w-full">
            <div className="h-4 bg-white/06 rounded w-3/4 mx-auto animate-pulse" />
            <div className="h-3 bg-white/06 rounded w-1/2 mx-auto animate-pulse" />
          </div>
        ) : (
          <>
            <p className="text-[15px] font-semibold text-white truncate w-full">{displayName}</p>
            {profile?.email && (
              <p className="text-[12px] text-white/40 truncate w-full mt-0.5">{profile.email}</p>
            )}
            <span
              className="mt-2 inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
              style={
                profile?.emailVerified
                  ? { background: "rgba(34,197,94,0.12)", color: "#4ade80" }
                  : { background: "rgba(245,158,11,0.12)", color: "#fbbf24" }
              }
            >
              {profile?.emailVerified ? "Verified" : "Unverified"}
            </span>
          </>
        )}
      </div>

      {/* Tab Navigation */}
      <nav className="rounded-2xl border border-white/08 overflow-hidden" style={{ background: "#0d0b08" }}>
        {TABS.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-3 w-full px-4 py-3.5 text-left transition-colors ${
                i < TABS.length - 1 ? "border-b border-white/06" : ""
              }`}
              style={isActive ? { background: "rgba(212,175,55,0.08)" } : undefined}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = ""; }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full"
                  style={{ background: "linear-gradient(180deg, #D4AF37, #b8962e)" }}
                />
              )}
              <Icon className="w-4 h-4 shrink-0" style={{ color: isActive ? "#D4AF37" : "rgba(255,255,255,0.35)" }} />
              <span
                className="text-[14px] font-medium"
                style={{ color: isActive ? "#D4AF37" : "rgba(255,255,255,0.55)" }}
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
