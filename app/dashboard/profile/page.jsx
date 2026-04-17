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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const { data: profile, isLoading } = useProfile();

  return (
    <DashboardLayout>
      <div className="space-y-6 pt-12 md:pt-0 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pb-4 border-b border-white/08"
        >
          <h1 className="text-[28px] md:text-[32px] font-semibold text-white leading-tight">
            My Profile & Settings
          </h1>
          <p className="text-[14px] text-white/50 mt-1">
            Manage your account settings, preferences, and delivery addresses.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-6">
          <ProfileSidebar
            profile={profile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLoading={isLoading}
          />

          <div className="min-h-150">
            {activeTab === "personal" && (
              <PersonalInformation profile={profile} isLoading={isLoading} />
            )}
            {activeTab === "addresses" && <AddressBook />}
            {activeTab === "security" && <Security />}
            {activeTab === "notifications" && <NotificationPreferences />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
