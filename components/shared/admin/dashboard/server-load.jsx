"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import vectorIcon from "@/public/assets/svgs/adminDashboardOverview/vector.svg";

// Normalise: API returns cpuUsage/memoryUsage as fractions (0–1),
// diskUsage as a percentage (0–100). Convert fractions to percentages.
function toPercent(value) {
  if (value == null) return 0;
  return value <= 1 ? value * 100 : value;
}

function formatPercent(value) {
  return `${toPercent(value).toFixed(1)}%`;
}

const statusStyles = {
  online: { dot: "bg-[#22C55E]", label: "Online" },
  offline: { dot: "bg-[#EF4444]", label: "Offline" },
  degraded: { dot: "bg-[#EAB308]", label: "Degraded" },
};

const capacityColor = {
  healthy: "bg-[#22C55E]",
  degraded: "bg-[#EAB308]",
  critical: "bg-[#EF4444]",
};

const metrics = [
  { key: "cpuUsage", label: "CPU" },
  { key: "memoryUsage", label: "Memory" },
  { key: "diskUsage", label: "Disk" },
];

export default function ServerLoad({ data }) {
  if (!data) return null;

  const statusKey = data.status?.toLowerCase() || "online";
  const status = statusStyles[statusKey] || statusStyles.online;

  const capacityKey = data.capacity?.toLowerCase() || "healthy";
  const barColor = capacityColor[capacityKey] || "bg-[#22C55E]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-[#273054] to-[#0F172A] p-5 rounded-[12.67px]"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-manrope text-[16px] font-bold text-white mb-1">
            Server Load
          </h3>
          <p className="text-[12px] text-[#94A3B8] capitalize">{data.cluster}</p>
        </div>
        <Image
          src={vectorIcon}
          alt="Server"
          width={80}
          height={84}
          className="opacity-15 shrink-0"
        />
      </div>

      {/* Status + Capacity */}
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          <span className="text-[12px] text-[#94A3B8]">{status.label}</span>
        </span>
        <span className="text-[#94A3B8] text-[12px]">·</span>
        <span className="text-[12px] text-[#94A3B8] capitalize">{data.capacity}</span>
      </div>

      {/* Metric Bars */}
      <div className="space-y-3">
        {metrics.map(({ key, label }) => {
          const pct = toPercent(data[key]);
          return (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-[11px] text-[#94A3B8]">{label}</span>
                <span className="text-[11px] text-white font-medium">
                  {formatPercent(data[key])}
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
