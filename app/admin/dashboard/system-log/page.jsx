"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Search, Calendar, Eye } from "lucide-react";
import Image from "next/image";
import { useSystemStats, useSystemLogs, useExportLogs } from "@/hooks/use-system-logs";
import { severityColors } from "@/lib/mock/system-logs";

export default function SystemLogPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");

  // Map service names to icon paths
  const getServiceIcon = (serviceName) => {
    const iconMap = {
      "AI_JOB_ENGINE": "/assets/svgs/system logs/ajjobengine.svg",
      "PAYMENT_GW": "/assets/svgs/system logs/paymentgw.svg",
      "USER_AUTH": "/assets/svgs/system logs/userauth.svg",
      "DB_SHARD_04": "/assets/svgs/system logs/dbshard04.svg",
      "DATA_SYNC": "/assets/svgs/system logs/datasync.svg",
      "PUBLIC_API": "/assets/svgs/system logs/publicapi.svg",
      "WEBHOOK_SRV": "/assets/svgs/system logs/publicapi.svg",
      "CACHE_LAYER": "/assets/svgs/system logs/datasync.svg",
    };
    return iconMap[serviceName] || "/assets/svgs/system logs/publicapi.svg";
  };

  const { data: stats, isLoading: statsLoading } = useSystemStats();
  const { data: logs, isLoading: logsLoading } = useSystemLogs({
    page,
    limit: 6,
    search,
    severity,
  });
  const { mutate: exportLogs, isPending: isExporting } = useExportLogs();

  const isLoading = statsLoading || logsLoading;

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#E5E7EB] border-t-[#1E293B] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#64748B] font-manrope text-[14px]">Loading system logs...</p>
          </div>
        </div>
      </div>
    );
  }

  const statsData = [
    { ...stats.criticalErrors, key: "criticalErrors", bgColor: "bg-white", icon: "/assets/svgs/system logs/criticalerrors.svg" },
    { ...stats.activeWarnings, key: "activeWarnings", bgColor: "bg-white", icon: "/assets/svgs/system logs/activewarnings.svg" },
    { ...stats.avgResponseTime, key: "avgResponseTime", bgColor: "bg-white", icon: "/assets/svgs/system logs/avgresponse.svg" },
    { ...stats.logsIngested, key: "logsIngested", bgColor: "bg-white", icon: "/assets/svgs/system logs/logsingested.svg" },
  ];

  const severityFilters = [
    { label: "All Events", value: "all" },
    { label: "Critical", value: "critical" },
    { label: "Error", value: "error" },
    { label: "Warning", value: "warning" },
    { label: "Info", value: "info" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <h1 className="font-manrope text-[20px] sm:text-[26px] md:text-[32px] font-extrabold text-[#1E293B]" style={{ fontWeight: 900 }}>
                System Logs & Monitoring
              </h1>
              <span className="px-2 sm:px-3 py-1 bg-[#D1FAE5] text-[#10B981] rounded-full font-manrope text-[9px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                • LIVE
              </span>
            </div>
            <p className="font-manrope text-[14px] text-[#64748B]">
              Real-time oversight of system events, errors, and operational metrics. Governance
              view for Super Admin.
            </p>
          </div>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => exportLogs()}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1E293B] text-white rounded-lg font-manrope text-[12px] sm:text-[13px] font-medium hover:bg-[#334155] transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <Download size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Export Logs</span>
            <span className="sm:hidden">Export</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-xl p-6 border border-[#E5E7EB] relative overflow-hidden`}
          >
            {/* Icon in top right */}
            <div className="absolute top-6 right-6 opacity-20">
              <Image
                src={stat.icon}
                alt={stat.label}
                width={26}
                height={26}
              />
            </div>

            <p className="font-manrope text-[13px] text-[#64748B] mb-2">{stat.label}</p>
            <div className="flex items-end gap-3">
              <h3 className="font-manrope text-[32px] font-bold text-[#1E293B]">{stat.value}</h3>
              {stat.change !== 0 ? (
                <span
                  className={`font-manrope text-[14px] font-bold mb-2 ${
                    stat.changeType === "increase" ? "text-[#EF4444]" : "text-[#10B981]"
                  }`}
                >
                  {stat.changeType === "increase" ? "+" : ""}
                  {stat.change}%
                </span>
              ) : (
                <span className="font-manrope text-[14px] font-bold mb-2 text-[#94A3B8]">
                  {stat.subtitle}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          {/* Search Logs */}
          <div>
            <label className="block font-manrope text-[13px] font-medium text-[#64748B] uppercase tracking-wider mb-2">
              Search Logs
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />
              <input
                type="text"
                placeholder="Search by ID, Message, Service, or User..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-[#E2E8F0] border border-[#E5E7EB] rounded-lg font-manrope text-[14px] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block font-manrope text-[13px] font-medium text-[#64748B] uppercase tracking-wider mb-2">
              Date Range
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  type="text"
                  value="Oct 26, 2023 - Oct 27, 2023"
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 bg-[#E2E8F0] border border-[#E5E7EB] rounded-lg font-manrope text-[14px] text-[#64748B] cursor-pointer"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1E293B] text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155]">
                <Image
                  src="/assets/svgs/system logs/filter.svg"
                  alt="Filter"
                  width={16}
                  height={16}
                  className="brightness-0 invert"
                />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Severity Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="font-manrope text-[11px] sm:text-[13px] font-medium text-[#64748B] uppercase tracking-wider">
            Severity:
          </span>
          {severityFilters.map((filter) => {
            const isActive = severity === filter.value;

            // Determine text color and bullet color based on filter type
            let textColor = "";
            let bulletColor = "";
            let showBullet = filter.value !== "all";

            if (filter.value === "all") {
              textColor = isActive ? "text-white" : "text-[#64748B]";
            } else if (filter.value === "critical") {
              textColor = isActive ? "text-white" : "text-[#DC2626]";
              bulletColor = "bg-[#DC2626]";
            } else if (filter.value === "error") {
              textColor = isActive ? "text-white" : "text-[#EA580C]";
              bulletColor = "bg-[#EA580C]";
            } else if (filter.value === "warning") {
              textColor = isActive ? "text-white" : "text-[#EA580C]";
              bulletColor = "bg-[#EA580C]";
            } else if (filter.value === "info") {
              textColor = isActive ? "text-white" : "text-[#2563EB]";
              bulletColor = "bg-[#2563EB]";
            }

            const buttonBg = isActive ? "bg-[#1E293B]" : "bg-white";

            return (
              <button
                key={filter.value}
                onClick={() => {
                  setSeverity(filter.value);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-manrope text-[13px] font-medium transition-colors ${buttonBg} ${textColor} hover:bg-[#E5E7EB]`}
              >
                {showBullet && !isActive && (
                  <span className={`w-2 h-2 rounded-full ${bulletColor}`} />
                )}
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-manrope text-[9px] sm:text-[11px] font-bold text-[#64748B] uppercase">
                  Timestamp
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-manrope text-[9px] sm:text-[11px] font-bold text-[#64748B] uppercase">
                  Severity
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-manrope text-[9px] sm:text-[11px] font-bold text-[#64748B] uppercase">
                  Service
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-manrope text-[9px] sm:text-[11px] font-bold text-[#64748B] uppercase">
                  Message
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-manrope text-[9px] sm:text-[11px] font-bold text-[#64748B] uppercase">
                  Actor
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-manrope text-[9px] sm:text-[11px] font-bold text-[#64748B] uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {logs?.logs.map((log, index) => {
                const severityStyle = severityColors[log.severity];

                return (
                  <tr key={log.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-2 sm:px-6 py-3 sm:py-4 font-manrope text-[11px] sm:text-[13px] text-[#64748B] whitespace-normal sm:whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex px-2 sm:px-3 py-1 rounded-md font-manrope text-[10px] sm:text-[11px] font-bold uppercase ${severityStyle.badge}`}
                      >
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#F1F5F9] rounded-lg flex items-center justify-center">
                          <Image
                            src={getServiceIcon(log.service.name)}
                            alt={log.service.displayName}
                            width={16}
                            height={16}
                            className="w-3 h-3 sm:w-4 sm:h-4"
                          />
                        </div>
                        <span className="font-manrope text-[11px] sm:text-[13px] font-medium text-[#1E293B]">
                          {log.service.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 font-manrope text-[11px] sm:text-[13px] text-[#64748B] max-w-xs sm:max-w-sm md:max-w-md truncate">
                      {log.message}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-manrope font-bold text-[9px] sm:text-[11px]"
                          style={{
                            backgroundColor: log.actor.colorScheme.bg,
                            color: log.actor.colorScheme.text,
                          }}
                        >
                          {log.actor.initials}
                        </div>
                        <span className="font-manrope text-[11px] sm:text-[13px] text-[#64748B] hidden sm:inline">
                          {log.actor.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <button className="text-[#3B82F6] hover:text-[#1E40AF]">
                        <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {logs?.pagination && (
          <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <p className="font-manrope text-[13px] text-[#64748B]">
              Showing {(page - 1) * 6 + 1}-{Math.min(page * 6, logs.pagination.total)} of{" "}
              {logs.pagination.total.toLocaleString()} entries
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg font-manrope text-[13px] font-medium text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(logs.pagination.totalPages, page + 1))}
                disabled={page === logs.pagination.totalPages}
                className="px-4 py-2 rounded-lg font-manrope text-[13px] font-medium bg-[#1E293B] text-white hover:bg-[#334155] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
