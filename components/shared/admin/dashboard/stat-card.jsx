"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Image from "next/image";

const statusIcons = {
  platformUptime: "/assets/svgs/admin dashboard overview/platform uptime.svg",
  activeUsers: "/assets/svgs/admin dashboard overview/active  users.svg",
  avgApiLatency: "/assets/svgs/admin dashboard overview/api latency.svg",
};

export default function AdminStatCard({ data, statKey, index }) {
  const { label, value, change, changeType, subtitle } = data;

  const changeColors = {
    increase: "text-[#22C55E]",
    decrease: "text-[#EF4444]",
    neutral: "text-[#64748B]",
  };

  const TrendIcon = {
    increase: TrendingUp,
    decrease: TrendingDown,
    neutral: Minus,
  };

  const CurrentTrendIcon = TrendIcon[changeType];
  const iconPath = statusIcons[statKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-5 border border-[#E5E7EB] hover:shadow-lg transition-shadow"
    >
      {/* Header: Label + Status Icon */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#475569] font-manrope text-[13px] font-medium">
          {label}
        </h3>
        {iconPath && (
          <Image
            src={iconPath}
            alt={label}
            width={26}
            height={26}
            className="flex-shrink-0"
          />
        )}
      </div>

      {/* Value */}
      <p className="text-[#1E293B] font-manrope text-[28px] font-bold leading-none mb-3">
        {value}
      </p>

      {/* Change + Subtitle on one line */}
      <div className="flex items-center gap-1.5">
        <div className={`flex items-center gap-1 ${changeColors[changeType]}`}>
          <CurrentTrendIcon size={14} />
          <span className="font-manrope text-[13px] font-semibold">
            {change}%
          </span>
        </div>
        <span className="text-[#64748B] font-manrope text-[12px]">{subtitle}</span>
      </div>
    </motion.div>
  );
}
