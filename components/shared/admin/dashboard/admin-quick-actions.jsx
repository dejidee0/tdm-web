"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import resetPasswordIcon from "@/public/assets/svgs/adminDashboardOverview/resetPassword.svg";
import clearCacheIcon from "@/public/assets/svgs/adminDashboardOverview/clearCache.svg";
import generateAuditIcon from "@/public/assets/svgs/adminDashboardOverview/generateAudit.svg";

export default function AdminQuickActions({ onClearCache, onGenerateAudit, isClearingCache, isGeneratingAudit }) {
  const router = useRouter();

  const actions = [
    {
      id: "reset-password",
      label: "Reset User Password",
      icon: resetPasswordIcon,
      iconBg: "bg-[#1E3A8A4D]",
      onClick: () => router.push("/admin/dashboard/user-management"),
      isPending: false,
    },
    {
      id: "clear-cache",
      label: isClearingCache ? "Refreshing..." : "Clear Cache",
      icon: clearCacheIcon,
      iconBg: "bg-[#78350F4D]",
      onClick: onClearCache,
      isPending: isClearingCache,
    },
    {
      id: "generate-audit",
      label: isGeneratingAudit ? "Generating..." : "Generate Audit Report",
      icon: generateAuditIcon,
      iconBg: "bg-[#581C874D]",
      onClick: onGenerateAudit,
      isPending: isGeneratingAudit,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-[#0d0b08] rounded-xl border border-white/08 p-6"
    >
      <h3 className="font-manrope text-[18px] font-bold text-white mb-4">
        Quick Actions
      </h3>

      <div className="space-y-2">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            disabled={action.isPending}
            className="w-full flex items-center justify-between p-4 bg-white/05 hover:bg-white/08 rounded-lg transition-colors group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 ${action.iconBg} rounded-lg flex items-center justify-center`}
              >
                <Image
                  src={action.icon}
                  alt={action.label}
                  width={18}
                  height={18}
                />
              </div>
              <span className="font-manrope text-[14px] font-medium text-white/80">
                {action.label}
              </span>
            </div>
            <ChevronRight
              size={18}
              className="text-white/30 group-hover:text-white/60 transition-colors"
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
