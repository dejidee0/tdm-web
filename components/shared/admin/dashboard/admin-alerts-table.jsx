"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ChevronDown } from "lucide-react";

const severityStyles = {
  critical: {
    dot: "bg-[#EF4444]",
    text: "text-[#EF4444]",
    badge: "bg-[#EF44441A]",
  },
  high: {
    dot: "bg-[#F97316]",
    text: "text-[#F97316]",
    badge: "bg-[#F973161A]",
  },
  medium: {
    dot: "bg-[#EAB308]",
    text: "text-[#EAB308]",
    badge: "bg-[#EAB3081A]",
  },
};

const getActionButtonStyle = (action) => {
  if (action === "Resolve") {
    return "bg-[#27305433] text-[#273054] hover:bg-[#CBD5E1]";
  }
  return "bg-[#273054] text-white hover:bg-[#334155]";
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
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#FEE2E2] rounded-lg flex items-center justify-center mt-0.5">
              <AlertTriangle size={16} className="text-[#EF4444]" />
            </div>
            <div>
              <h2 className="font-manrope text-[18px] font-bold text-[#1E293B]">
                Alerts & Escalations
              </h2>
              <p className="font-manrope text-[13px] text-[#64748B] mt-1">
                Critical system issues requiring immediate attention
              </p>
            </div>
          </div>
          <button className="font-manrope text-[13px] text-[#3B82F6] hover:underline">
            View All Logs
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        {/* Table Header */}
        <div className="px-6 py-4 bg-[#CBD5E1] border-b border-[#E5E7EB]">
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

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="px-6 py-4 hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="grid grid-cols-[140px_1fr_180px_140px] gap-4 items-center">
                  {/* Severity Badge with background pill */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-[10553.63px] ${severity.badge}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${severity.dot}`} />
                      <span
                        className={`font-manrope text-[12px] font-bold capitalize ${severity.text}`}
                      >
                        {alert.severity}
                      </span>
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
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-4 py-1.5 rounded-[8.44px] font-manrope text-[12px] font-medium transition-colors ${getActionButtonStyle(alert.action)}`}
                    >
                      {alert.action}
                    </motion.button>
                  </div>
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
                <span
                  className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md ${severity.badge}`}
                >
                  <span className={`w-2 h-2 rounded-full ${severity.dot}`} />
                  <span
                    className={`font-manrope text-[12px] font-bold capitalize ${severity.text}`}
                  >
                    {alert.severity}
                  </span>
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
                className={`w-full px-4 py-2 rounded-md font-manrope text-[13px] font-medium transition-colors ${getActionButtonStyle(alert.action)}`}
              >
                {alert.action}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-center">
        <button className="flex items-center gap-1 text-[#3B82F6] font-manrope text-[13px] font-medium hover:underline">
          Show 5 more alerts
          <ChevronDown size={14} />
        </button>
      </div>
    </motion.div>
  );
}
