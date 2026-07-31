"use client";

import { motion } from "framer-motion";
import { Plus, FileEdit, ClipboardList, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

const quickActions = [
  {
    id: 1,
    label: "Add Product",
    icon: Plus,
    color: "text-info",
    bgColor: "bg-info/10",
    hoverBg: "hover:bg-info/10",
    action: "/vendor/dashboard/inventory?open=add-product",
  },
  {
    id: 2,
    label: "Update Project",
    icon: FileEdit,
    color: "text-info",
    bgColor: "bg-info/10",
    hoverBg: "hover:bg-info/10",
    action: "/vendor/projects",
  },
  {
    id: 3,
    label: "View Orders",
    icon: ClipboardList,
    color: "text-muted",
    bgColor: "bg-white/08",
    hoverBg: "hover:bg-white/10",
    action: "/vendor/dashboard/orders",
  },
  {
    id: 4,
    label: "Respond",
    icon: MessageSquare,
    color: "text-muted",
    bgColor: "bg-white/08",
    hoverBg: "hover:bg-white/10",
    action: "/vendor/dashboard/messages",
  },
];

export default function QuickActions() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-surface rounded-xl p-4 h-full border border-white/08"
    >
      {/* Header */}
      <h2 className="font-manrope text-[18px] font-bold text-white mb-6">
        Quick Actions
      </h2>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 place-items-center grid-rows-1 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.id}
              onClick={() => router.push(action.action)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
          flex flex-col items-center justify-between gap-3 p-6 rounded-lg
          ${action.bgColor} ${action.hoverBg}
          transition-colors group cursor-pointer
        `}
            >
              <div
                className={`${action.color} group-hover:scale-110 transition-transform`}
              >
                <Icon size={20} strokeWidth={2} />
              </div>
              <span className="font-manrope text-[13px] font-medium text-white">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
