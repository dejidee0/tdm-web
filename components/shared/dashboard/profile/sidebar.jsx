// components/dashboard/profile/sidebar.jsx (or ProfileSidebar.jsx)
"use client";

import { motion } from "framer-motion";
import { User, MapPin, Shield, Bell, Pencil } from "lucide-react";
import Image from "next/image";
import { useUploadAvatar } from "@/hooks/use-profile";
import { useRef } from "react";

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
  const fileInputRef = useRef(null);
  const uploadAvatar = useUploadAvatar();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      uploadAvatar.mutate(file, {
        onSuccess: () => {
          // Could show a success toast here
          console.log("Avatar updated successfully");
        },
        onError: (error) => {
          alert("Failed to upload avatar. Please try again.");
          console.error("Avatar upload error:", error);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4" />
            <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-40 mb-1" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl border border-[#e5e5e5] p-6 sticky top-6"
    >
      {/* Profile Avatar and Info */}
      <div className="flex flex-col items-center mb-8 pb-6 border-b border-[#e5e5e5]">
        <div className="relative mb-4">
          {/* Avatar Image */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[#f5f5f5]">
            <Image
              src={profile?.avatar || "/avatars/default-avatar.jpg"}
              alt={`${profile?.firstName} ${profile?.lastName}`}
              fill
              className="object-cover"
              sizes="96px"
              priority
            />
          </div>

          {/* Edit Button - Always Visible */}
          <button
            onClick={handleAvatarClick}
            disabled={uploadAvatar.isPending}
            className="absolute bottom-0 right-0 w-9 h-9 bg-primary rounded-full flex items-center justify-center border-[3px] border-white hover:bg-[#2a2a2a] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Edit profile picture"
          >
            {uploadAvatar.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Pencil className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload profile picture"
        />

        {/* User Info */}
        <h2 className="text-[18px] font-semibold text-primary mb-1 text-center">
          {profile?.firstName} {profile?.lastName}
        </h2>
        <p className="text-[13px] text-[#666666] mb-1 text-center">
          {profile?.email}
        </p>

        {/* Membership Badge */}
        <div className="flex items-center gap-2 mt-2">
          <span className="px-3 py-1 bg-primary text-white text-[11px] font-semibold rounded-full uppercase tracking-wide">
            {profile?.membershipType || "PREMIUM"}
          </span>
          <span className="text-[12px] text-[#999999]">
            #{profile?.id?.slice(-6) || "439620"}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="space-y-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all
                ${
                  isActive
                    ? "bg-[#f5f5f5] text-primary"
                    : "text-[#666666] hover:bg-[#fafafa] hover:text-primary"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </motion.div>
  );
}
