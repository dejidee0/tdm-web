"use client";

import { motion } from "framer-motion";
import { Download, RefreshCw, Activity, TrendingUp, Zap } from "lucide-react";
import StatCard from "@/components/shared/vendor/dashboard/stat-card";
import RevenueChart from "@/components/shared/admin/dashboard/revenue-chart";
import ServerLoad from "@/components/shared/admin/dashboard/server-load";
import AdminAlertsTable from "@/components/shared/admin/dashboard/admin-alerts-table";
import AdminQuickActions from "@/components/shared/admin/dashboard/admin-quick-actions";
import {
  useAdminStats,
  useRevenueData,
  useServerLoad,
  useAdminAlerts,
  useAdminQuickActions,
  useRefreshAdminDashboard,
  useExportReport,
} from "@/hooks/use-admin";

const statIcons = {
  platformUptime: Activity,
  activeUsers: TrendingUp,
  avgApiLatency: Zap,
};

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData();
  const { data: serverLoad, isLoading: serverLoading } = useServerLoad();
  const { data: alerts, isLoading: alertsLoading } = useAdminAlerts();
  const { data: quickActions, isLoading: actionsLoading } =
    useAdminQuickActions();
  const { mutate: refreshDashboard, isPending: isRefreshing } =
    useRefreshAdminDashboard();
  const { mutate: exportReport, isPending: isExporting } = useExportReport();

  const isLoading =
    statsLoading ||
    revenueLoading ||
    serverLoading ||
    alertsLoading ||
    actionsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E5E7EB] border-t-[#1E293B] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#64748B] font-manrope text-[14px]">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="font-manrope text-[32px] font-bold text-[#1E293B] mb-2">
              Dashboard Overview
            </h1>
            <p className="font-manrope text-[14px] text-[#64748B]">
              System performance, financial metrics, and critical alerts
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => exportReport()}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
            >
              <Download size={16} />
              Export Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => refreshDashboard()}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1E293B] text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isRefreshing ? "animate-spin" : ""}
              />
              Refresh Data
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Grid - 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats &&
          Object.keys(stats).map((key, index) => (
            <StatCard
              key={key}
              data={stats[key]}
              icon={statIcons[key]}
              index={index}
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
          <AdminQuickActions actions={quickActions} />
          <ServerLoad data={serverLoad} />
        </div>
      </div>

      {/* Alerts Table - Full Width */}
      <AdminAlertsTable alerts={alerts} />
    </div>
  );
}
