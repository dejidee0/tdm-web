"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({ data, icon: Icon, index }) {
  const { label, category, value, change, changeType, subtitle } = data;

  const changeColors = {
    increase: "text-[#10B981]",
    decrease: "text-[#EF4444]",
    neutral: "text-[#64748B]",
  };

  const TrendIcon = {
    increase: TrendingUp,
    decrease: TrendingDown,
    neutral: Minus,
  };

  const CurrentTrendIcon = TrendIcon[changeType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-4  min-w-[5vw] border border-[#E5E7EB] relative overflow-hidden group hover:shadow-lg transition-shadow"
    >
      {/* Background Icon */}
      <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {Icon && <Icon size={120} />}
      </div>

      {/* Category Badge */}
      <div className="flex items-start justify-between mb-4">
        <span className="inline-block px-2 py-1 bg-[#F1F5F9] text-[#64748B] text-[11px] font-manrope font-bold uppercase tracking-wider rounded">
          {category}
        </span>
      </div>

      {/* Value */}
      <div className="mb-2">
        <h3 className="text-[#94A3B8] font-manrope text-[13px] font-medium mb-2">
          {label}
        </h3>
        <div className="flex items-end gap-3">
          <p className="text-primary font-manrope text-[40px] font-bold leading-none">
            {value}
          </p>
          {change !== 0 && (
            <div
              className={`flex items-center gap-1 mb-2 ${changeColors[changeType]}`}
            >
              <CurrentTrendIcon size={16} />
              <span className="font-manrope text-[14px] font-bold">
                {change}%
              </span>
            </div>
          )}
          {change === 0 && (
            <div className="flex items-center gap-1 mb-2 text-[#64748B]">
              <Minus size={16} />
              <span className="font-manrope text-[14px] font-bold">0%</span>
            </div>
          )}
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-[#64748B] font-manrope text-[12px]">{subtitle}</p>
    </motion.div>
  );
}
