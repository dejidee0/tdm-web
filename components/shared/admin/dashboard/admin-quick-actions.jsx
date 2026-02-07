"use client";

import { motion } from "framer-motion";
import { KeyRound, Trash2, FileText, ChevronRight } from "lucide-react";

const iconMap = {
  KeyRound,
  Trash2,
  FileText,
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
          const Icon = iconMap[action.icon];

          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-4 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Icon size={18} className="text-[#64748B]" />
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
