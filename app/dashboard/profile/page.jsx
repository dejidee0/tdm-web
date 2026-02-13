// app/dashboard/profile/page.jsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { useProfile } from "@/hooks/use-profile";
import DashboardLayout from "@/components/shared/dashboard/layout";
import ProfileSidebar from "@/components/shared/dashboard/profile/sidebar";
import PersonalInformation from "@/components/shared/dashboard/profile/personal-info";
import AddressBook from "@/components/shared/dashboard/profile/address";
import Security from "@/components/shared/dashboard/profile/security";
import NotificationPreferences from "@/components/shared/dashboard/profile/notification";

const TABS = [
  { id: "personal", label: "Personal Details", icon: "user" },
  { id: "addresses", label: "Addresses", icon: "map-pin" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "notifications", label: "Notifications", icon: "bell" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [hasChanges, setHasChanges] = useState(false);

  const { data: profile, isLoading } = useProfile();

  const handleCancel = () => {
    setHasChanges(false);
    // Reset form data
  };

  const handleSave = () => {
    // Save changes
    setHasChanges(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pt-12 md:pt-0 md:w-[60vw] w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between pb-4 border-b border-[#e5e5e5]"
        >
          <div>
            <h1 className="text-[28px] md:text-[32px] font-semibold text-primary leading-tight">
              My Profile & Settings
            </h1>
            <p className="text-[14px] text-[#666666] mt-1">
              Manage your account settings, preferences, and delivery addresses.
            </p>
          </div>

          {/* Action Buttons */}
          {hasChanges && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 bg-white border border-[#e5e5e5] rounded-lg text-[14px] font-medium text-primary hover:bg-[#f8f8f8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2.5 bg-primary text-white rounded-lg text-[14px] font-medium hover:bg-[#2a2a2a] transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <ProfileSidebar
            profile={profile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLoading={isLoading}
          />

          {/* Main Content */}
          <div className="min-h-[600px]">
            {activeTab === "personal" && (
              <PersonalInformation
                profile={profile}
                isLoading={isLoading}
                setHasChanges={setHasChanges}
              />
            )}
            {activeTab === "addresses" && (
              <AddressBook
                profile={profile}
                isLoading={isLoading}
                setHasChanges={setHasChanges}
              />
            )}
            {activeTab === "security" && (
              <Security setHasChanges={setHasChanges} />
            )}
            {activeTab === "notifications" && (
              <NotificationPreferences
                profile={profile}
                isLoading={isLoading}
                setHasChanges={setHasChanges}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
