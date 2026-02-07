"use client";

import { motion } from "framer-motion";
import { Server, Cpu, HardDrive, Activity } from "lucide-react";

export default function ServerLoad({ data }) {
  if (!data) {
    return null;
  }

  const getStatusColor = (capacity) => {
    if (capacity < 50)
      return { bg: "bg-[#10B981]", text: "text-[#10B981]" };
    if (capacity < 75)
      return { bg: "bg-[#F59E0B]", text: "text-[#F59E0B]" };
    return { bg: "bg-[#EF4444]", text: "text-[#EF4444]" };
  };

  const statusColor = getStatusColor(data.capacity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-xl border border-[#E5E7EB] p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Server size={20} className="text-[#64748B]" />
        <h3 className="font-manrope text-[18px] font-bold text-[#1E293B]">
          Server Load
        </h3>
      </div>

      <p className="text-[12px] text-[#64748B] mb-4">{data.cluster}</p>

      {/* Main Capacity Metric */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[32px] font-bold text-[#1E293B]">
            {data.capacity}%
          </span>
          <span className="text-[12px] text-[#64748B]">Capacity</span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
          <motion.div
            className={`absolute h-full ${statusColor.bg} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${data.capacity}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="space-y-3">
        {[
          { label: "CPU Usage", value: data.cpuUsage, icon: Cpu },
          { label: "Memory", value: data.memoryUsage, icon: Activity },
          { label: "Disk", value: data.diskUsage, icon: HardDrive },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Icon size={14} className="text-[#64748B]" />
                <span className="text-[13px] text-[#64748B]">
                  {metric.label}
                </span>
              </div>
              <span className="text-[13px] font-bold text-[#1E293B]">
                {metric.value}%
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
