"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, X, AlertCircle } from "lucide-react";
import AdminStatCard from "@/components/shared/admin/dashboard/stat-card";
import RevenueChart from "@/components/shared/admin/dashboard/revenue-chart";
import ServerLoad from "@/components/shared/admin/dashboard/server-load";
import AdminAlertsTable from "@/components/shared/admin/dashboard/admin-alerts-table";
import AdminQuickActions from "@/components/shared/admin/dashboard/admin-quick-actions";
import {
  useAnalyticsOverview,
  useMonthlyRevenue,
  useDashboardStats,
  useDashboardRevenue,
  useServerLoad,
  useAdminAlerts,
  useRefreshAdminDashboard,
  useExportReport,
} from "@/hooks/use-admin";
import refreshData from "@/public/assets/svgs/adminDashboardOverview/refreshData.svg";
import Image from "next/image";

export default function AdminDashboardPage() {
  const [showError, setShowError] = useState(true);

  // Real API endpoints
  const {
    data: analyticsOverview,
    isLoading: overviewLoading,
    error: overviewError,
  } = useAnalyticsOverview();
  const {
    data: monthlyRevenue,
    isLoading: monthlyRevenueLoading,
    error: revenueError,
  } = useMonthlyRevenue();
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  console.log("[dashboard] dashboardStats:", dashboardStats);
  console.log("[dashboard] statsLoading:", statsLoading);
  console.log("[dashboard] statsError:", statsError);
  console.log("[dashboard] analyticsOverview:", analyticsOverview);
  console.log("[dashboard] overviewError:", overviewError);

  const {
    data: dashboardRevenue,
    isLoading: dashboardRevenueLoading,
    error: dashboardRevenueError,
  } = useDashboardRevenue("30d");
  const {
    data: serverLoad,
    isLoading: serverLoading,
    error: serverLoadError,
  } = useServerLoad();
  const {
    data: alerts,
    isLoading: alertsLoading,
    error: alertsError,
  } = useAdminAlerts();
  const { mutate: refreshDashboard, isPending: isRefreshing } =
    useRefreshAdminDashboard();
  const { mutate: exportReport, isPending: isExporting } = useExportReport();

  console.log("[dashboard] dashboardRevenue:", dashboardRevenue);
  console.log("[dashboard] dashboardRevenueError:", dashboardRevenueError);
  console.log("[dashboard] serverLoad:", serverLoad);
  console.log("[dashboard] serverLoadError:", serverLoadError);
  console.log("[dashboard] alerts:", alerts);
  console.log("[dashboard] alertsError:", alertsError);

  // Build stats from dashboardStats API response
  const stats = dashboardStats
    ? {
        platformUptime: {
          label: "Platform Uptime",
          value: dashboardStats.platformUptime || "N/A",
          change: 0,
          changeType: "steadyIncrease",
          subtitle: "System availability",
        },
        activeUsers: {
          label: "Active Users",
          value: dashboardStats.activeUsers?.toLocaleString() || "N/A",
          change: 0,
          changeType: "increase",
          subtitle: "Currently online",
        },
        avgApiLatency: {
          label: "Avg API Latency",
          value:
            dashboardStats.avgApiLatency != null
              ? `${dashboardStats.avgApiLatency}ms`
              : "N/A",
          change: 0,
          changeType: "steadyIncrease",
          subtitle: "Response time",
        },
      }
    : {
        platformUptime: {
          label: "Platform Uptime",
          value: "Loading...",
          change: 0,
          changeType: "steadyIncrease",
          subtitle: "",
        },
        activeUsers: {
          label: "Active Users",
          value: "Loading...",
          change: 0,
          changeType: "increase",
          subtitle: "",
        },
        avgApiLatency: {
          label: "Avg API Latency",
          value: "Loading...",
          change: 0,
          changeType: "steadyIncrease",
          subtitle: "",
        },
      };

  // Build analytics overview stats with correct field names
  const analyticsStats = analyticsOverview
    ? {
        totalRevenue: {
          label: "Total Revenue",
          value: `$${(analyticsOverview.totalRevenue ?? 0).toLocaleString()}`,
          change: Math.abs(
            analyticsOverview.revenueGrowthPercentage ?? 0,
          ).toFixed(1),
          changeType:
            (analyticsOverview.revenueGrowthPercentage ?? 0) >= 0
              ? "increase"
              : "decrease",
          subtitle: "vs last period",
        },
        totalOrders: {
          label: "Total Orders",
          value: (analyticsOverview.totalOrders ?? 0).toLocaleString(),
          change: Math.abs(
            analyticsOverview.ordersGrowthPercentage ?? 0,
          ).toFixed(1),
          changeType:
            (analyticsOverview.ordersGrowthPercentage ?? 0) >= 0
              ? "increase"
              : "decrease",
          subtitle: "vs last period",
        },
        totalUsers: {
          label: "Total Users",
          value: (analyticsOverview.totalUsers ?? 0).toLocaleString(),
          change: Math.abs(
            analyticsOverview.usersGrowthPercentage ?? 0,
          ).toFixed(1),
          changeType:
            (analyticsOverview.usersGrowthPercentage ?? 0) >= 0
              ? "increase"
              : "decrease",
          subtitle: "vs last period",
        },
      }
    : null;

  // Use dashboard revenue if available, fallback to monthly revenue from analytics
  const revenueData = dashboardRevenue || monthlyRevenue || null;

  const realServerLoad = serverLoad || null;

  const isLoading =
    overviewLoading ||
    monthlyRevenueLoading ||
    statsLoading ||
    dashboardRevenueLoading ||
    serverLoading ||
    alertsLoading;

  const hasError =
    overviewError ||
    revenueError ||
    statsError ||
    dashboardRevenueError ||
    serverLoadError ||
    alertsError;
  const errorMessage =
    overviewError?.message ||
    revenueError?.message ||
    statsError?.message ||
    dashboardRevenueError?.message ||
    serverLoadError?.message ||
    alertsError?.message ||
    "";
  const isCorsError =
    errorMessage.includes("CORS") || errorMessage.includes("fetch");

  if (isLoading) {
    return (
      <div className="max-w-360 mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div>
            <div className="h-8 w-56 bg-[#E5E7EB] rounded-lg mb-3" />
            <div className="h-4 w-80 bg-[#E5E7EB] rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-36 bg-[#E5E7EB] rounded-lg" />
            <div className="h-10 w-36 bg-[#E5E7EB] rounded-lg" />
          </div>
        </div>

        {/* Stat cards skeleton — 6 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-28 bg-[#E5E7EB] rounded" />
                <div className="h-9 w-9 bg-[#E5E7EB] rounded-lg" />
              </div>
              <div className="h-8 w-24 bg-[#E5E7EB] rounded mb-3" />
              <div className="h-3 w-32 bg-[#E5E7EB] rounded" />
            </div>
          ))}
        </div>

        {/* Revenue chart + right column skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-[#E5E7EB]">
            <div className="h-5 w-40 bg-[#E5E7EB] rounded mb-6" />
            <div className="h-52 bg-[#E5E7EB] rounded-lg" />
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
              <div className="h-5 w-32 bg-[#E5E7EB] rounded mb-4" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-9 bg-[#E5E7EB] rounded-lg mb-3 last:mb-0" />
              ))}
            </div>
            <div className="bg-linear-to-br from-primary to-[#0F172A] rounded-xl p-5">
              <div className="h-5 w-28 bg-white/10 rounded mb-4" />
              <div className="h-8 w-20 bg-white/10 rounded mb-3" />
              <div className="h-2 w-full bg-white/10 rounded-full" />
            </div>
          </div>
        </div>

        {/* Alerts table skeleton */}
        <div className="bg-white rounded-xl p-5 border border-[#E5E7EB]">
          <div className="h-5 w-32 bg-[#E5E7EB] rounded mb-6" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 mb-4 last:mb-0">
              <div className="h-4 w-4 bg-[#E5E7EB] rounded-full mt-0.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-[#E5E7EB] rounded" />
                <div className="h-3 w-1/2 bg-[#E5E7EB] rounded" />
              </div>
              <div className="h-6 w-16 bg-[#E5E7EB] rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-360 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div>
            <h1 className="font-inter text-[24px] sm:text-[28px] md:text-[32px] font-bold text-primary mb-2">
              Dashboard Overview
            </h1>
            <p className="font-manrope text-[13px] sm:text-[14px] text-[#64748B]">
              System performance, financial metrics, and critical alerts
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => exportReport()}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] font-medium text-primary hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 w-full sm:w-auto"
            >
              <Download size={16} />
              Export Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => refreshDashboard()}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors disabled:opacity-50 w-full sm:w-auto"
            >
              <Image src={refreshData} alt="Refresh Data" />
              Refresh Data
            </motion.button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {hasError && showError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="text-red-600 shrink-0 mt-0.5"
              size={20}
            />
            <div className="flex-1">
              <h3 className="font-manrope text-[14px] font-semibold text-red-800 mb-1">
                {isCorsError ? "API Connection Issue" : "Error Loading Data"}
              </h3>
              <p className="font-manrope text-[13px] text-red-700">
                {isCorsError
                  ? "Unable to connect to the backend API due to CORS configuration. Contact your backend developer to update CORS settings."
                  : errorMessage}
              </p>
            </div>
            <button
              onClick={() => setShowError(false)}
              className="text-red-600 hover:text-red-800 transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats Grid - 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats &&
          Object.keys(stats).map((key, index) => (
            <AdminStatCard
              key={key}
              data={stats[key]}
              statKey={key}
              index={index}
            />
          ))}
        {analyticsStats &&
          Object.keys(analyticsStats).map((key, index) => (
            <AdminStatCard
              key={key}
              data={analyticsStats[key]}
              statKey={key}
              index={index + 3}
            />
          ))}
      </div>

      {/* Revenue Summary + Right Column (Quick Actions + Server Load) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart - 2/3 width */}
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <AdminQuickActions
            onClearCache={() => refreshDashboard()}
            onGenerateAudit={() => exportReport()}
            isClearingCache={isRefreshing}
            isGeneratingAudit={isExporting}
          />
          <ServerLoad data={realServerLoad} />
        </div>
      </div>

      {/* Alerts Table - Full Width */}
      <AdminAlertsTable alerts={alerts} />
    </div>
  );
}
