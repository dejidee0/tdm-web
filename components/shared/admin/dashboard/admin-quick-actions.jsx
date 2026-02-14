"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import resetPasswordIcon from "@/public/assets/svgs/adminDashboardOverview/resetPassword.svg";
import clearCacheIcon from "@/public/assets/svgs/adminDashboardOverview/clearCache.svg";
import generateAuditIcon from "@/public/assets/svgs/adminDashboardOverview/generateAudit.svg";

const iconMap = {
  KeyRound: resetPasswordIcon,
  Trash2: clearCacheIcon,
  FileText: generateAuditIcon,
};

const iconColors = {
  KeyRound: { bg: "bg-[#1E3A8A4D]" },
  Trash2: { bg: "bg-[#78350F4D]" },
  FileText: { bg: "bg-[#581C874D]" },
};

export default function AdminQuickActions({ actions }) {
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl border border-[#E5E7EB] p-6"
    >
      <h3 className="font-manrope text-[18px] font-bold text-[#1E293B] mb-4">
        Quick Actions
      </h3>

      <div className="space-y-2">
        {actions.map((action, index) => {
          const iconPath = iconMap[action.icon];
          const colors = iconColors[action.icon] || { bg: "bg-[#F1F5F9]" };

          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-4 bg-[#2730541A] hover:bg-[#F1F5F9] rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  {iconPath && (
                    <Image
                      src={iconPath}
                      alt={action.label}
                      width={18}
                      height={18}
                    />
                  )}
                </div>
                <span className="font-manrope text-[14px] font-medium text-[#1E293B]">
                  {action.label}
                </span>
              </div>
              <ChevronRight
                size={18}
                className="text-[#94A3B8] group-hover:text-[#64748B] transition-colors"
              />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
