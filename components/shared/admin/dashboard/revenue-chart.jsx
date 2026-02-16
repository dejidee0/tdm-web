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
      <div className="flex items-start justify-between mb-6 pb-6 border-b-[1.06px] border-[#334155]">
        <div>
          <h2 className="font-inter text-[18px] font-bold text-[#1E293B] mb-1">
            Revenue Summary
          </h2>
          <p className="font-inter text-[13px] text-[#64748B]">
            Monthly recurring revenue & growth trends
          </p>
        </div>
        <button className="px-4 py-2 bg-[#1E293B] text-white rounded-lg font-inter text-[13px] font-medium hover:bg-[#334155] transition-colors">
          Last 6 Months
        </button>
      </div>

      {/* Revenue Metrics */}
      <div className="flex items-center gap-8 mb-6">
        <div>
          <p className="font-inter text-[13px] text-[#64748B] mb-1">
            Total Revenue (YTD)
          </p>
          <p className="font-inter text-[28px] font-bold text-[#1E293B]">
            ${data?.totalRevenue?.toLocaleString() || '4,250,000'}
          </p>
        </div>
        <div>
          <p className="font-inter text-[13px] text-[#64748B] mb-1">
            Monthly Recurring (MRR)
          </p>
          <p className="font-inter text-[28px] font-bold text-[#1E293B]">
            ${data?.monthlyRecurring?.toLocaleString() || '355,000'}
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
