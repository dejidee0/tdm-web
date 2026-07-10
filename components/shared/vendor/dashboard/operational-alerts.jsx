"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Mail, Clock } from "lucide-react";

const alertIcons = {
  stock: AlertTriangle,
  message: Mail,
};

const alertStyles = {
  high: {
    bg: "bg-danger/10",
    icon: "text-danger",
    badge: "bg-danger-solid",
  },
  medium: {
    bg: "bg-warning/10",
    icon: "text-warning",
    badge: "bg-warning",
  },
  low: {
    bg: "bg-info/10",
    icon: "text-info",
    badge: "bg-info",
  },
};

export default function OperationalAlerts({ alerts }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-surface rounded-xl border border-white/08"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 py-4 px-4">
        <div className="flex items-center gap-2 px-4">
          <AlertTriangle size={20} className="text-warning" />
          <h2 className="font-manrope text-[18px] font-bold text-white">
            Operational Alerts
          </h2>
        </div>
        <span className="text-muted font-manrope text-[12px]">
          Updated 2m ago
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const Icon = alertIcons[alert.type];
          const styles = alertStyles[alert.severity];

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={` rounded-lg p-4 flex gap-4`}
            >
              {/* Icon */}
              <div className={`${styles.icon} shrink-0 mt-1`}>
                <Icon size={20} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-manrope text-[14px] font-bold text-white">
                    {alert.title}
                  </h3>
                  <span className="shrink-0 text-muted font-manrope text-[11px] whitespace-nowrap">
                    {alert.time}
                  </span>
                </div>
                <p className="text-muted font-manrope text-[13px] mb-3">
                  {alert.description}
                </p>
                <button className="text-white font-manrope text-[13px] font-bold hover:underline">
                  {alert.action}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
