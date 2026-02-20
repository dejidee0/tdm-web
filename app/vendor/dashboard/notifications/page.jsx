"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Check, SlidersHorizontal, RefreshCw } from "lucide-react";
import { useNotifications, useMarkAllRead } from "@/hooks/use-notifications";
import NotificationCard from "@/components/shared/vendor/dashboard/notification/card";

export default function NotificationsPage() {
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
  });

  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data, isLoading, refetch } = useNotifications(filters);
  const markAllRead = useMarkAllRead();

  const handleSearch = (value) => {
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters((prev) => ({ ...prev, category: tab }));
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  const tabs = [
    { id: "all", label: "All Notifications", count: data?.total || 12 },
    { id: "orders", label: "Orders (Bogat)", count: 3, dotColor: "#06B6D4" },
    {
      id: "enquiries",
      label: "Enquiries (TBM)",
      count: 2,
      dotColor: "#3B82F6",
    },
    { id: "payments", label: "Payments", count: 1, dotColor: "#10B981" },
    { id: "system", label: "System Alerts", count: 1, dotColor: "#F59E0B" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="font-manrope text-[32px] font-bold text-primary mb-2">
              Notifications Center
            </h1>
            <p className="font-manrope text-[14px] text-[#64748B] max-w-2xl">
              Stay updated with real-time alerts from TBM and Bogat operations.
              Manage your order updates,
              <br />
              payments, and system messages in one place.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMarkAllRead}
              disabled={markAllRead.isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] font-medium text-primary hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
            >
              <Check size={16} />
              Mark all as read
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors"
            >
              <SlidersHorizontal size={16} />
              Configure Alerts
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-white rounded-xl border border-[#E5E7EB]"
      >
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-manrope text-[13px] font-medium
                whitespace-nowrap transition-colors flex-shrink-0
                ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]"
                }
              `}
            >
              {tab.dotColor && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tab.dotColor }}
                />
              )}
              {tab.label}
              <span
                className={`
                  px-2 py-0.5 rounded-full text-[11px] font-bold
                  ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-[#E2E8F0] text-[#64748B]"
                  }
                `}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-primary placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#64748B] font-manrope text-[14px]">
            Loading notifications...
          </p>
        </div>
      ) : (
        <>
          {/* TODAY Section */}
          {data?.notifications?.TODAY?.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 bg-[#E5E7EB]" />
                <span className="font-manrope text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">
                  TODAY
                </span>
                <div className="h-px flex-1 bg-[#E5E7EB]" />
              </div>
              <div className="space-y-6">
                {data.notifications.TODAY.map((notification, index) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {/* YESTERDAY Section */}
          {data?.notifications?.YESTERDAY?.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 bg-[#E5E7EB]" />
                <span className="font-manrope text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">
                  YESTERDAY
                </span>
                <div className="h-px flex-1 bg-[#E5E7EB]" />
              </div>
              <div className="space-y-4">
                {data.notifications.YESTERDAY.map((notification, index) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] font-medium text-primary hover:bg-[#F8FAFC] transition-colors"
            >
              <RefreshCw size={16} />
              Load older notifications
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}
