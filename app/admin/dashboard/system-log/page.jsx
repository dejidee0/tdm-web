"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Eye } from "lucide-react";
import Image from "next/image";
import {
  useSystemStats,
  useSystemLogs,
  useExportLogs,
} from "@/hooks/use-system-logs";
import { severityColors } from "@/lib/mock/system-logs";
import aiJobEngineIcon from "@/public/assets/svgs/systemLogs/ajJobEngine.svg";
import paymentGwIcon from "@/public/assets/svgs/systemLogs/paymentGw.svg";
import userAuthIcon from "@/public/assets/svgs/systemLogs/userAuth.svg";
import dbShard04Icon from "@/public/assets/svgs/systemLogs/dbShard04.svg";
import dataSyncIcon from "@/public/assets/svgs/systemLogs/dataSync.svg";
import publicApiIcon from "@/public/assets/svgs/systemLogs/publicApi.svg";
import criticalErrorsIcon from "@/public/assets/svgs/systemLogs/criritcalErrors.svg";
import activeWarningsIcon from "@/public/assets/svgs/systemLogs/activeWarnings.svg";
import avgResponseIcon from "@/public/assets/svgs/systemLogs/avgResponseTime.svg";
import logsIngestedIcon from "@/public/assets/svgs/systemLogs/logsIngested.svg";
import filterIcon from "@/public/assets/svgs/systemLogs/filter.svg";
import calendarIcon from "@/public/assets/svgs/systemLogs/calendar.svg";
import searchIcon from "@/public/assets/svgs/systemLogs/search.svg";

export default function SystemLogPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");

  // Map service names to icon paths
  const getServiceIcon = (serviceName) => {
    const iconMap = {
      AI_JOB_ENGINE: aiJobEngineIcon,
      PAYMENT_GW: paymentGwIcon,
      USER_AUTH: userAuthIcon,
      DB_SHARD_04: dbShard04Icon,
      DATA_SYNC: dataSyncIcon,
      PUBLIC_API: publicApiIcon,
      WEBHOOK_SRV: publicApiIcon,
      CACHE_LAYER: dataSyncIcon,
    };
    return iconMap[serviceName] || publicApiIcon;
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
            <div className="w-16 h-16 border-4 border-[#E5E7EB] border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#64748B] font-inter text-[14px]">
              Loading system logs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Transform backend stats to UI format
  const formatStatsValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value?.toString() || "0";
  };

  const statsData = stats ? [
    {
      label: "Critical Errors (24H)",
      value: stats?.errorCount?.toString() || "0",
      change: 0,
      changeType: "neutral",
      subtitle: "Errors",
      key: "criticalErrors",
      bgColor: "bg-white",
      icon: criticalErrorsIcon,
    },
    {
      label: "Active Warnings",
      value: stats?.warningCount?.toString() || "0",
      change: 0,
      changeType: "neutral",
      subtitle: "Warnings",
      key: "activeWarnings",
      bgColor: "bg-white",
      icon: activeWarningsIcon,
    },
    {
      label: "Info Logs",
      value: stats?.infoCount?.toString() || "0",
      change: 0,
      changeType: "neutral",
      subtitle: "Info",
      key: "avgResponseTime",
      bgColor: "bg-white",
      icon: avgResponseIcon,
    },
    {
      label: "Total Logs",
      value: formatStatsValue(stats?.totalLogs || 0),
      change: 0,
      changeType: "neutral",
      subtitle: "All logs",
      key: "logsIngested",
      bgColor: "bg-white",
      icon: logsIngestedIcon,
    },
  ] : [];

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
      <div className="mb-6 sm:mb-8 pb-6 border-b border-[#314368]/50">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <h1 className="font-inter text-[28px] sm:text-[34px] md:text-[40px] font-black text-[#273054] tracking-[-1.34px] leading-[1.1]">
                System Logs & Monitoring
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 rounded-full font-inter text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.67px] whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                LIVE
              </span>
            </div>
            <p className="font-inter text-[14px] sm:text-[16px] md:text-[18px] text-[#273054]">
              Real-time oversight of system events, errors, and operational
              metrics. Governance view for Super Admin.
            </p>
          </div>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => exportLogs()}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-white rounded-lg font-inter text-[13px] sm:text-[14px] md:text-[16px] font-bold hover:bg-[#334155] transition-colors disabled:opacity-50 whitespace-nowrap"
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
            className={`${stat.bgColor} rounded-xl p-6 border border-[#E5E7EB] shadow-[0_0.98px_1.96px_0_rgba(0,0,0,0.05)] relative overflow-hidden`}
          >
            {/* Icon in top right */}
            <div className="absolute top-6 right-6">
              <Image src={stat.icon} alt={stat.label} width={44} height={44} />
            </div>

            <p className="font-inter text-[13px] sm:text-[14px] md:text-[16px] font-medium text-[#273054] uppercase tracking-[0.39px] mb-2">
              {stat.label}
            </p>
            <div className="flex items-end gap-3">
              <h3 className="font-inter text-[28px] sm:text-[32px] md:text-[34px] font-bold text-[#273054] leading-none">
                {stat.value}
              </h3>
              {stat.change !== 0 ? (
                <span
                  className={`font-inter text-[13px] sm:text-[14px] md:text-[16px] font-medium mb-2 px-2 py-0.5 rounded-[4.5px] ${
                    (stat.changeType === "increase" &&
                      stat.label === "Avg Response Time") ||
                    stat.label === "Logs Ingested"
                      ? "text-[#4ADE80] bg-[#4ADE801A]"
                      : "text-[#F87171] bg-[#F871711A]"
                  }`}
                >
                  {stat.changeType === "increase" ? "↑" : "↓"}
                  {stat.change}%
                </span>
              ) : (
                <span className="font-inter text-[13px] sm:text-[14px] md:text-[16px] font-medium mb-2 text-[#273054]">
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
            <label className="block font-inter text-[13px] font-semibold text-[#64748B] uppercase tracking-[0.67px] mb-2">
              Search Logs
            </label>
            <div className="relative">
              <Image
                src={searchIcon}
                alt="Search"
                width={18}
                height={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Search by ID, Message, Service, or User..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-[#273054]/10 border border-[#273054]/20 rounded-[9px] font-inter text-[14px] sm:text-[16px] md:text-[18px] placeholder:text-[#273054]/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block font-inter text-[13px] font-semibold text-[#64748B] uppercase tracking-[0.67px] mb-2">
              Date Range
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Image
                  src={calendarIcon}
                  alt="Calendar"
                  width={18}
                  height={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                />
                <input
                  type="text"
                  value="Oct 26, 2023 - Oct 27, 2023"
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 bg-[#273054]/10 border border-[#273054]/20 rounded-[9px] font-inter text-[14px] text-[#64748B] cursor-pointer"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#273054] text-white rounded-[9px] font-inter text-[14px] sm:text-[16px] md:text-[18px] font-medium hover:bg-primary transition-colors">
                <Image
                  src={filterIcon}
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
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-4 border-t border-[#314368]/50">
          <span className="font-inter text-[11px] sm:text-[13px] font-medium text-[#273054] uppercase">
            Severity:
          </span>
          {severityFilters.map((filter) => {
            const isActive = severity === filter.value;

            // Bullet and text color for each severity type
            let bulletColor = "";
            let textColor = "text-white";
            if (filter.value === "critical") {
              bulletColor = "bg-[#F87171]";
              textColor = "text-[#F87171]";
            } else if (filter.value === "error") {
              bulletColor = "bg-[#FB923C]";
              textColor = "text-[#FB923C]";
            } else if (filter.value === "warning") {
              bulletColor = "bg-[#FACC15]";
              textColor = "text-[#FACC15]";
            } else if (filter.value === "info") {
              bulletColor = "bg-white";
              textColor = "text-white";
            }

            return (
              <button
                key={filter.value}
                onClick={() => {
                  setSeverity(filter.value);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border border-[#273054] bg-[#273054] ${textColor} font-inter text-[15.74px] font-medium transition-colors ${isActive ? "shadow-[0_1.12px_2.25px_0_rgba(0,0,0,0.05)]" : ""}`}
              >
                {filter.value !== "all" && (
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
            <thead className="bg-[#273054]/10 [&_tr:first-child_th:first-child]:rounded-tl-xl [&_tr:first-child_th:last-child]:rounded-tr-xl">
              <tr className="border-b-[1.12px] border-[#314368]">
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-inter text-[9px] sm:text-[11px] md:text-[13px] font-semibold text-[#273054] uppercase tracking-[0.67px]">
                  Timestamp
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-inter text-[9px] sm:text-[11px] md:text-[13px] font-semibold text-[#273054] uppercase tracking-[0.67px]">
                  Severity
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-inter text-[9px] sm:text-[11px] md:text-[13px] font-semibold text-[#273054] uppercase tracking-[0.67px]">
                  Service Source
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-inter text-[9px] sm:text-[11px] md:text-[13px] font-semibold text-[#273054] uppercase tracking-[0.67px]">
                  Message
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-inter text-[9px] sm:text-[11px] md:text-[13px] font-semibold text-[#273054] uppercase tracking-[0.67px]">
                  User/Actor
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-inter text-[9px] sm:text-[11px] md:text-[13px] font-semibold text-[#273054] uppercase tracking-[0.67px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {logs?.logs?.map((log, index) => {
                const severityStyle = severityColors[log?.severity] || severityColors.INFO;

                return (
                  <tr
                    key={log?.id || index}
                    className="bg-white border-t-[1.12px] border-[#273054]/50"
                  >
                    <td className="px-2 sm:px-6 py-3 sm:py-4 font-inter text-[11px] sm:text-[13px] md:text-[16px] text-[#273054] whitespace-normal sm:whitespace-nowrap">
                      {log?.timestamp || log?.createdAt || "N/A"}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex px-2 sm:px-3 py-1 rounded-[4.5px] font-inter text-[10px] sm:text-[11px] md:text-[13px] font-bold uppercase ${severityStyle?.badge}`}
                      >
                        {log?.severity || "N/A"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Image
                          src={getServiceIcon(log?.service?.name || log?.category)}
                          alt={log?.service?.displayName || log?.category || "Service"}
                          width={20}
                          height={20}
                        />
                        <span className="font-inter text-[11px] sm:text-[13px] md:text-[16px] font-medium text-[#273054]">
                          {log?.service?.name || log?.category || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 font-inter text-[11px] sm:text-[13px] md:text-[16px] text-[#273054] max-w-xs sm:max-w-sm md:max-w-md truncate">
                      {log?.message || log?.action || "N/A"}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div
                          className="w-[27px] h-[27px] rounded-full flex items-center justify-center font-inter font-bold text-[11.24px] text-white"
                          style={{
                            backgroundColor: log?.actor?.colorScheme?.bg || "#64748B",
                          }}
                        >
                          {log?.actor?.initials || log?.userId?.charAt(0) || "U"}
                        </div>
                        <span className="font-inter text-[11px] sm:text-[13px] md:text-[16px] text-[#273054] hidden sm:inline">
                          {log?.actor?.name || log?.userId || "N/A"}
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
            <p className="font-inter text-[13px] sm:text-[14px] md:text-[16px] text-[#273054]">
              Showing{" "}
              <span className="font-medium">
                {(page - 1) * 6 + 1}-{Math.min(page * 6, logs?.pagination?.total || 0)}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {logs?.pagination?.total?.toLocaleString() || 0}
              </span>{" "}
              entries
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-[9px] border border-[#273054] font-inter text-[13px] sm:text-[14px] md:text-[16px] text-[#273054] opacity-50 hover:opacity-75 disabled:opacity-30"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPage(Math.min(logs?.pagination?.totalPages || 1, page + 1))
                }
                disabled={page === (logs?.pagination?.totalPages || 1)}
                className="px-4 py-2 rounded-[9px] border border-[#273054] font-inter text-[13px] sm:text-[14px] md:text-[16px] text-[#273054] hover:bg-[#273054]/5 disabled:opacity-30"
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
