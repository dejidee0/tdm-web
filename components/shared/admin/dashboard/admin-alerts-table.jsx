"use client";

import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const severityStyles = {
  critical: {
    icon: AlertTriangle,
    bg: "bg-[#FEE2E2]",
    text: "text-[#991B1B]",
    badge: "bg-[#EF4444] text-white",
  },
  high: {
    icon: AlertCircle,
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    badge: "bg-[#F59E0B] text-white",
  },
  medium: {
    icon: Info,
    bg: "bg-[#DBEAFE]",
    text: "text-[#1E40AF]",
    badge: "bg-[#3B82F6] text-white",
  },
};

export default function AdminAlertsTable({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-xl border border-[#E5E7EB]"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-manrope text-[18px] font-bold text-[#1E293B]">
              Alerts & Escalations
            </h2>
            <p className="font-manrope text-[13px] text-[#64748B] mt-1">
              Critical system issues requiring immediate attention
            </p>
          </div>
          <button className="font-manrope text-[13px] text-[#3B82F6] hover:underline">
            View All Logs
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        {/* Table Header */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E5E7EB]">
          <div className="grid grid-cols-[140px_1fr_180px_140px] gap-4">
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              SEVERITY
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              ISSUE DESCRIPTION
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              TIMESTAMP
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              ACTION
            </span>
          </div>
        </div>

        {/* Alert Rows */}
        <div className="divide-y divide-[#E5E7EB]">
          {alerts.map((alert, index) => {
            const severity = severityStyles[alert.severity];
            const Icon = severity.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="px-6 py-4 hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="grid grid-cols-[140px_1fr_180px_140px] gap-4 items-center">
                  {/* Severity Badge */}
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={severity.text} />
                    <span
                      className={`px-3 py-1 rounded-full font-manrope text-[11px] font-bold uppercase ${severity.badge}`}
                    >
                      {alert.severity}
                    </span>
                  </div>

                  {/* Issue Description */}
                  <div>
                    <p className="font-manrope text-[14px] font-medium text-[#1E293B]">
                      {alert.issue}
                    </p>
                    {alert.description && (
                      <p className="font-manrope text-[12px] text-[#64748B] mt-1">
                        {alert.description}
                      </p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="font-manrope text-[13px] text-[#64748B]">
                    {alert.timestamp}
                  </span>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded-lg font-manrope text-[13px] font-medium transition-colors ${
                      alert.actionType === "resolve"
                        ? "bg-[#EF4444] text-white hover:bg-[#DC2626]"
                        : alert.actionType === "investigate"
                        ? "bg-[#F59E0B] text-white hover:bg-[#D97706]"
                        : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                    }`}
                  >
                    {alert.action}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-[#E5E7EB]">
        {alerts.map((alert, index) => {
          const severity = severityStyles[alert.severity];
          const Icon = severity.icon;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-4"
            >
              {/* Severity Badge */}
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className={severity.text} />
                <span
                  className={`px-3 py-1 rounded-full font-manrope text-[11px] font-bold uppercase ${severity.badge}`}
                >
                  {alert.severity}
                </span>
                <span className="ml-auto font-manrope text-[12px] text-[#64748B]">
                  {alert.timestamp}
                </span>
              </div>

              {/* Issue */}
              <p className="font-manrope text-[14px] font-medium text-[#1E293B] mb-1">
                {alert.issue}
              </p>
              {alert.description && (
                <p className="font-manrope text-[12px] text-[#64748B] mb-3">
                  {alert.description}
                </p>
              )}

              {/* Action Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                className={`w-full px-4 py-2 rounded-lg font-manrope text-[13px] font-medium transition-colors ${
                  alert.actionType === "resolve"
                    ? "bg-[#EF4444] text-white"
                    : alert.actionType === "investigate"
                    ? "bg-[#F59E0B] text-white"
                    : "bg-[#F1F5F9] text-[#64748B]"
                }`}
              >
                {alert.action}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-center">
        <button className="text-[#3B82F6] font-manrope text-[13px] font-medium hover:underline">
          Show 5 more alerts
        </button>
      </div>
    </motion.div>
  );
}
