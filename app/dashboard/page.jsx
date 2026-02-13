// app/dashboard/page.jsx
"use client";

import ActionCards from "@/components/shared/dashboard/action-cards";
import Consultations from "@/components/shared/dashboard/consulations";
import LatestDesign from "@/components/shared/dashboard/latest-design";
import DashboardLayout from "@/components/shared/dashboard/layout";
import RecentOrder from "@/components/shared/dashboard/recent-order";
import SavedItems from "@/components/shared/dashboard/saved-items";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8 md:w-[60vw] w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-12 md:pt-0"
        >
          <h1 className="text-[28px] md:text-3xl  font-semibold text-[#0F172A] leading-tight">
            Dashboard
          </h1>
          <p className="text-base text-[#666666] mt-1">
            Manage your renovation projects and track your orders.
          </p>
        </motion.div>

        {/* Action Cards */}
        <ActionCards />

        {/* Three Column Section - Stacks on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <RecentOrder />
          <LatestDesign />
          <Consultations />
        </div>

        {/* Saved Items */}
        <SavedItems />
      </div>
    </DashboardLayout>
  );
}
