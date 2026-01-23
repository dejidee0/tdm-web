"use client";

import OperationalAlerts from "@/components/shared/vendor/dashboard/operational-alerts";
import QuickActions from "@/components/shared/vendor/dashboard/quick-actions";
import RecentActivityStream from "@/components/shared/vendor/dashboard/recent-activity";
import StatCard from "@/components/shared/vendor/dashboard/stat-card";
import {
  useVendorActivity,
  useVendorAlerts,
  useVendorStats,
} from "@/hooks/use-vendor";
import { ShoppingCart, FileText, Briefcase, Truck } from "lucide-react";

const statIcons = {
  newOrders: ShoppingCart,
  pendingEnquiries: FileText,
  activeProjects: Briefcase,
  pendingDeliveries: Truck,
};

export default function VendorDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useVendorStats();
  const { data: alerts, isLoading: alertsLoading } = useVendorAlerts();
  const { data: activities, isLoading: activitiesLoading } =
    useVendorActivity();

  if (statsLoading || alertsLoading || activitiesLoading) {
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
        <h1 className="font-manrope text-[32px] font-bold text-[#1E293B] mb-2">
          Vendor Dashboard
        </h1>
        <p className="font-manrope text-[14px] text-[#64748B]">
          Manage your orders and projects efficiently.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Alerts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <OperationalAlerts alerts={alerts || []} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivityStream activities={activities || []} />
    </div>
  );
}
