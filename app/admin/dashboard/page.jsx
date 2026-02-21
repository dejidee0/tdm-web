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
  useServerLoad,
  useAdminAlerts,
  useAdminQuickActions,
  useRefreshAdminDashboard,
  useExportReport,
} from "@/hooks/use-admin";
import refreshData from "@/public/assets/svgs/adminDashboardOverview/refreshData.svg";
import Image from "next/image";

export default function AdminDashboardPage() {
  const [showError, setShowError] = useState(true);

  // Real API endpoints
  const { data: analyticsOverview, isLoading: overviewLoading, error: overviewError } = useAnalyticsOverview();
  const { data: monthlyRevenue, isLoading: monthlyRevenueLoading, error: revenueError } = useMonthlyRevenue();

  // Mock endpoints (until backend provides equivalents)
  const { data: serverLoad, isLoading: serverLoading } = useServerLoad();
  const { data: alerts, isLoading: alertsLoading } = useAdminAlerts();
  const { data: quickActions, isLoading: actionsLoading } = useAdminQuickActions();
  const { mutate: refreshDashboard, isPending: isRefreshing } = useRefreshAdminDashboard();
  const { mutate: exportReport, isPending: isExporting } = useExportReport();

  // Transform real API data to component format, with fallback to placeholder data
  const stats = analyticsOverview ? {
    totalRevenue: {
      label: "Total Revenue",
      value: `$${analyticsOverview.totalRevenue?.toLocaleString() || 0}`,
      change: analyticsOverview.revenueGrowth || 0,
      trend: (analyticsOverview.revenueGrowth || 0) >= 0 ? "up" : "down",
    },
    activeOrders: {
      label: "Total Orders",
      value: analyticsOverview.totalOrders?.toLocaleString() || 0,
      change: analyticsOverview.ordersGrowth || 0,
      trend: (analyticsOverview.ordersGrowth || 0) >= 0 ? "up" : "down",
    },
    activeUsers: {
      label: "Active Users",
      value: analyticsOverview.activeUsers?.toLocaleString() || 0,
      change: 12.3,
      trend: "up",
    },
  } : {
    totalRevenue: {
      label: "Total Revenue",
      value: "Loading...",
      change: 0,
      trend: "up",
    },
    activeOrders: {
      label: "Total Orders",
      value: "Loading...",
      change: 0,
      trend: "up",
    },
    activeUsers: {
      label: "Active Users",
      value: "Loading...",
      change: 0,
      trend: "up",
    },
  };

  const revenueData = monthlyRevenue || null;

  const isLoading =
    overviewLoading ||
    monthlyRevenueLoading ||
    serverLoading ||
    alertsLoading ||
    actionsLoading;

  const hasError = overviewError || revenueError;
  const errorMessage = overviewError?.message || revenueError?.message || '';
  const isCorsError = errorMessage.includes('CORS') || errorMessage.includes('fetch');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E5E7EB] border-t-primary rounded-full animate-spin mx-auto mb-4" />
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
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div>
            <h1 className="font-manrope text-[24px] sm:text-[28px] md:text-[32px] font-bold text-primary mb-2">
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
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-manrope text-[14px] font-semibold text-red-800 mb-1">
                {isCorsError ? 'API Connection Issue' : 'Error Loading Data'}
              </h3>
              <p className="font-manrope text-[13px] text-red-700">
                {isCorsError
                  ? 'Unable to connect to the backend API due to CORS configuration. Contact your backend developer to update CORS settings.'
                  : errorMessage
                }
              </p>
            </div>
            <button
              onClick={() => setShowError(false)}
              className="text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
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
