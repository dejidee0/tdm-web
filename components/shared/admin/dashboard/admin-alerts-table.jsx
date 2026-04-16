"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ChevronDown, CheckCircle } from "lucide-react";

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
  warning: {
    dot: "bg-[#EAB308]",
    text: "text-[#EAB308]",
    badge: "bg-[#EAB3081A]",
  },
  low: {
    dot: "bg-[#22C55E]",
    text: "text-[#22C55E]",
    badge: "bg-[#22C55E1A]",
  },
  info: {
    dot: "bg-[#3B82F6]",
    text: "text-[#3B82F6]",
    badge: "bg-[#3B82F61A]",
  },
};

function formatTimestamp(value) {
  if (!value) return "N/A";
  const d = new Date(value);
  return isNaN(d) ? value : d.toLocaleString();
}

const getActionButtonStyle = (action) => {
  if (action === "Resolve") {
    return "bg-white/08 text-white/60 hover:bg-white/12";
  }
  return "bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20";
};

export default function AdminAlertsTable({ alerts }) {
  // API may return a single object or an array — normalise to array
  const alertList = Array.isArray(alerts) ? alerts : alerts ? [alerts] : [];

  // "info" severity means no real alerts — show all-clear state
  const realAlerts = alertList.filter((a) => a.severity !== "info");

  if (alertList.length === 0) return null;

  if (realAlerts.length === 0) {
    const infoMsg = alertList[0]?.message || "No operational alerts right now.";
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[#0d0b08] rounded-xl border border-white/08 px-6 py-8 flex flex-col items-center gap-3 text-center"
      >
        <div className="w-10 h-10 bg-[#22C55E1A] rounded-full flex items-center justify-center">
          <CheckCircle size={20} className="text-[#22C55E]" />
        </div>
        <h3 className="font-manrope text-[16px] font-bold text-white">
          All Systems Operational
        </h3>
        <p className="font-manrope text-[13px] text-white/50">{infoMsg}</p>
      </motion.div>
    );
  }

  const displayAlerts = realAlerts;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-[#0d0b08] rounded-xl border border-white/08"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/08">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-red-950/40 rounded-lg flex items-center justify-center mt-0.5">
              <AlertTriangle size={16} className="text-red-400" />
            </div>
            <div>
              <h2 className="font-manrope text-[18px] font-bold text-white">
                Alerts & Escalations
              </h2>
              <p className="font-manrope text-[13px] text-white/50 mt-1">
                Critical system issues requiring immediate attention
              </p>
            </div>
          </div>
          <button className="font-manrope text-[13px] text-[#D4AF37] hover:underline">
            View All Logs
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        {/* Table Header */}
        <div className="px-6 py-4 bg-white/05 border-b border-white/08">
          <div className="grid grid-cols-[140px_1fr_180px_140px] gap-4">
            <span className="font-manrope text-[11px] font-bold text-white/40 uppercase tracking-wider">
              SEVERITY
            </span>
            <span className="font-manrope text-[11px] font-bold text-white/40 uppercase tracking-wider">
              ISSUE DESCRIPTION
            </span>
            <span className="font-manrope text-[11px] font-bold text-white/40 uppercase tracking-wider">
              TIMESTAMP
            </span>
            <span className="font-manrope text-[11px] font-bold text-white/40 uppercase tracking-wider">
              ACTION
            </span>
          </div>
        </div>

        {/* Alert Rows */}
        <div className="divide-y divide-white/08">
          {displayAlerts.map((alert, index) => {
            const severityKey = alert?.severity?.toLowerCase() || "medium";
            const severity = severityStyles[severityKey] || severityStyles.medium;

            return (
              <motion.div
                key={alert?.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="px-6 py-4 hover:bg-white/03 transition-colors"
              >
                <div className="grid grid-cols-[140px_1fr_180px_140px] gap-4 items-center">
                  {/* Severity Badge with background pill */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-[10553.63px] ${severity?.badge || ''}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${severity?.dot || ''}`}
                      />
                      <span
                        className={`font-manrope text-[12px] font-bold capitalize ${severity?.text || ''}`}
                      >
                        {alert?.severity || 'N/A'}
                      </span>
                    </span>
                  </div>

                  {/* Issue Description */}
                  <div>
                    <p className="font-manrope text-[14px] font-medium text-white">
                      {alert?.message || alert?.issue || "No description"}
                    </p>
                    {alert?.description && (
                      <p className="font-manrope text-[12px] text-white/50 mt-1">
                        {alert.description}
                      </p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="font-manrope text-[13px] text-white/40">
                    {formatTimestamp(alert?.createdAt || alert?.timestamp)}
                  </span>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-4 py-1.5 rounded-[8.44px] font-manrope text-[12px] font-medium transition-colors ${getActionButtonStyle(alert?.action)}`}
                    >
                      {alert?.action || 'View'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-white/08">
        {displayAlerts.map((alert, index) => {
          const severityKey = alert?.severity?.toLowerCase() || "medium";
          const severity = severityStyles[severityKey] || severityStyles.medium;

          return (
            <motion.div
              key={alert?.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-4"
            >
              {/* Severity Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md ${severity?.badge || ''}`}
                >
                  <span className={`w-2 h-2 rounded-full ${severity?.dot || ''}`} />
                  <span
                    className={`font-manrope text-[12px] font-bold capitalize ${severity?.text || ''}`}
                  >
                    {alert?.severity || 'N/A'}
                  </span>
                </span>
                <span className="ml-auto font-manrope text-[12px] text-white/40">
                  {formatTimestamp(alert?.createdAt || alert?.timestamp)}
                </span>
              </div>

              {/* Issue */}
              <p className="font-manrope text-[14px] font-medium text-white mb-1">
                {alert?.message || alert?.issue || "No description"}
              </p>
              {alert?.description && (
                <p className="font-manrope text-[12px] text-white/50 mb-3">
                  {alert.description}
                </p>
              )}

              {/* Action Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                className={`w-full px-4 py-2 rounded-md font-manrope text-[13px] font-medium transition-colors ${getActionButtonStyle(alert?.action)}`}
              >
                {alert?.action || 'View'}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/08 flex justify-center">
        <button className="flex items-center gap-1 text-[#D4AF37] font-manrope text-[13px] font-medium hover:underline">
          Show 5 more alerts
          <ChevronDown size={14} />
        </button>
      </div>
    </motion.div>
  );
}
