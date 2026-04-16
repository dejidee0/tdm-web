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
      className="bg-[#0d0b08] rounded-xl border border-white/08 p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6 pb-6 border-b border-white/08">
        <div>
          <h2 className="font-inter text-[18px] font-bold text-white mb-1">
            Revenue Summary
          </h2>
          <p className="font-inter text-[13px] text-white/50">
            Monthly recurring revenue & growth trends
          </p>
        </div>
        <button className="px-4 py-2 border border-white/10 text-white/60 rounded-lg font-inter text-[13px] font-medium hover:bg-white/05 transition-colors">
          Last 6 Months
        </button>
      </div>

      {/* Revenue Metrics */}
      <div className="flex items-center gap-8 mb-6">
        <div>
          <p className="font-inter text-[13px] text-white/50 mb-1">
            Total Revenue (YTD)
          </p>
          <p className="font-inter text-[28px] font-bold text-white">
            ${data?.totalRevenue != null ? data.totalRevenue.toLocaleString() : "—"}
          </p>
        </div>
        <div>
          <p className="font-inter text-[13px] text-white/50 mb-1">
            Monthly Recurring (MRR)
          </p>
          <p className="font-inter text-[28px] font-bold text-white">
            ${data?.monthlyRecurring != null ? data.monthlyRecurring.toLocaleString() : "—"}
          </p>
        </div>
      </div>

      {/* Chart SVG */}
      <div className="w-full">
        <Image
          src={monthlyRevenueChart}
          alt="Revenue Summary"
          className="w-full h-auto"
          priority
        />
      </div>
    </motion.div>
  );
}
