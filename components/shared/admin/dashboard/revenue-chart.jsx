"use client";

import { motion } from "framer-motion";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import monthlyRevenueChart from "@/public/assets/svgs/financialReport/monthlyRevenue.svg";

export default function RevenueChart({ data }) {
  if (!data) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_0.98px_1.96px_0_rgba(0,0,0,0.05)] p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-inter text-[18px] font-bold text-[#111827]">
          Monthly Revenue Trends
        </h2>
        <button className="p-1">
          <EllipsisVertical size={18} className="text-[#9CA3AF]" />
        </button>
      </div>

      {/* Chart SVG */}
      <div className="w-full">
        <Image
          src={monthlyRevenueChart}
          alt="Monthly Revenue Trends"
          className="w-full h-auto"
          priority
        />
      </div>
    </motion.div>
  );
}
