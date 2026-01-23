"use client";

import { motion } from "framer-motion";
import { Plus, FileEdit, ClipboardList, MessageSquare } from "lucide-react";

const quickActions = [
  {
    id: 1,
    label: "Add Product",
    icon: Plus,
    color: "text-[#06B6D4]",
    bgColor: "bg-[#ECFEFF]",
    hoverBg: "hover:bg-[#CFFAFE]",
  },
  {
    id: 2,
    label: "Update Project",
    icon: FileEdit,
    color: "text-[#3B82F6]",
    bgColor: "bg-[#EFF6FF]",
    hoverBg: "hover:bg-[#DBEAFE]",
  },
  {
    id: 3,
    label: "View Orders",
    icon: ClipboardList,
    color: "text-[#64748B]",
    bgColor: "bg-[#F1F5F9]",
    hoverBg: "hover:bg-[#E2E8F0]",
  },
  {
    id: 4,
    label: "Respond",
    icon: MessageSquare,
    color: "text-[#64748B]",
    bgColor: "bg-[#F1F5F9]",
    hoverBg: "hover:bg-[#E2E8F0]",
  },
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-xl p-4 h-full border border-[#E5E7EB]"
    >
      {/* Header */}
      <h2 className="font-manrope text-[18px] font-bold text-[#1E293B] mb-6">
        Quick Actions
      </h2>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 place-items-center grid-rows-1 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
          flex flex-col items-center justify-between gap-3 p-6 rounded-lg
          ${action.bgColor} ${action.hoverBg}
          transition-colors group
        `}
            >
              <div
                className={`${action.color} group-hover:scale-110 transition-transform`}
              >
                <Icon size={20} strokeWidth={2} />
              </div>
              <span className="font-manrope text-[13px] font-medium text-[#1E293B]">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
