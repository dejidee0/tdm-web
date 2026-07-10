"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ChevronDown, CheckCircle } from "lucide-react";

// Ordered severity ramp: critical > high > medium > low > info.
// "warning" is an alias the API also sends for the medium tier.
const severityStyles = {
  critical: { dot: "bg-danger", text: "text-danger", badge: "bg-danger/10" },
  high: {
    dot: "bg-severity-high",
    text: "text-severity-high",
    badge: "bg-severity-high/10",
  },
  medium: { dot: "bg-warning", text: "text-warning", badge: "bg-warning/10" },
  warning: { dot: "bg-warning", text: "text-warning", badge: "bg-warning/10" },
  low: { dot: "bg-success-solid", text: "text-success", badge: "bg-success/10" },
  info: { dot: "bg-info", text: "text-info", badge: "bg-info/10" },
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
  return "bg-white/05 text-accent hover:bg-white/10";
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
        className="bg-surface rounded-xl border border-white/08 px-6 py-8 flex flex-col items-center gap-3 text-center"
      >
        <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
          <CheckCircle size={20} className="text-success" />
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
      className="bg-surface rounded-xl border border-white/08"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/08">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-danger/10 rounded-lg flex items-center justify-center mt-0.5">
              <AlertTriangle size={16} className="text-danger" />
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
          <button className="font-manrope text-[13px] text-accent hover:underline">
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
        <button className="flex items-center gap-1 text-accent font-manrope text-[13px] font-medium hover:underline">
          Show 5 more alerts
          <ChevronDown size={14} />
        </button>
      </div>
    </motion.div>
  );
}
