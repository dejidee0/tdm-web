"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Image from "next/image";
import platformUptimeIcon from "@/public/assets/svgs/adminDashboardOverview/platformUptime.svg";
import upArrowIcon from "@/public/assets/svgs/adminDashboardOverview/upArrowIcon.svg";
import downArrowIcon from "@/public/assets/svgs/adminDashboardOverview/downArrowIcon.svg";
import wigglingUp from "@/public/assets/svgs/adminDashboardOverview/wigglingUp.svg";
import activeUsersIcon from "@/public/assets/svgs/adminDashboardOverview/activeUsers.svg";
import apiLatencyIcon from "@/public/assets/svgs/adminDashboardOverview/apiLatency.svg";

const statusIcons = {
  platformUptime: platformUptimeIcon,
  activeUsers: activeUsersIcon,
  avgApiLatency: apiLatencyIcon,
};

const statusIconBg = {
  platformUptime: "bg-[#22C55E1A]",
  activeUsers: "bg-[#3B82F61A]",
  avgApiLatency: "bg-[#F59E0B1A]",
};

export default function AdminStatCard({ data, statKey, index }) {
  const { label, value, change, changeType, subtitle } = data;

  const changeColors = {
    increase: "text-[#22C55E]",
    decrease: "text-[#22C55E]",
    steadyIncrease: "text-[#22C55E]",
  };

  const TrendIcon = {
    increase: upArrowIcon,
    decrease: downArrowIcon,
    steadyIncrease: wigglingUp,
  };

  const trendIconSrc = TrendIcon[changeType];
  const iconPath = statusIcons[statKey];
  const iconBgClass = statusIconBg[statKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-5 border border-[#E5E7EB] hover:shadow-lg transition-shadow"
    >
      {/* Header: Label + Status Icon */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#273054] font-manrope text-[13px] font-[500]">
          {label}
        </h3>
        {iconPath && (
          <div
            className={`p-2 rounded-lg ${iconBgClass} flex items-center justify-center`}
          >
            <Image
              src={iconPath}
              alt={label}
              width={26}
              height={26}
              className="flex-shrink-0"
            />
          </div>
        )}
      </div>

      {/* Value */}
      <p className="text-primary font-manrope text-[28px] font-bold leading-none mb-3">
        {value}
      </p>

      {/* Change + Subtitle on one line */}
      <div className="flex items-center gap-1.5">
        <div className={`flex items-center gap-1 ${changeColors[changeType]}`}>
          {trendIconSrc ? (
            <Image src={trendIconSrc} alt="" width={14} height={14} />
          ) : (
            <Minus size={14} />
          )}
          <span className="font-manrope text-[13px] font-semibold">
            {change}%
          </span>
        </div>
        <span className="text-[#64748B] font-manrope text-[12px]">
          {subtitle}
        </span>
      </div>
    </motion.div>
  );
}
