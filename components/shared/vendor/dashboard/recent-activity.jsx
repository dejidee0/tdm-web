"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Briefcase,
  HelpCircle,
  MoreVertical,
  ArrowRight,
  Package,
  FileText,
  Circle,
} from "lucide-react";

const activityIcons = {
  order: ShoppingCart,
  Order: ShoppingCart,
  project: Briefcase,
  Project: Briefcase,
  enquiry: HelpCircle,
  Enquiry: HelpCircle,
  delivery: Package,
  Delivery: Package,
  invoice: FileText,
  Invoice: FileText,
  default: Circle,
};

const statusStyles = {
  success: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success-solid",
  },
  info: {
    bg: "bg-info/10",
    text: "text-info",
    dot: "bg-info",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
  },
  error: {
    bg: "bg-danger/10",
    text: "text-danger",
    dot: "bg-danger-solid",
  },
  pending: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
  },
  default: {
    bg: "bg-white/08",
    text: "text-muted",
    dot: "bg-muted",
  },
};

const tabs = ["All", "Orders", "Projects"];

export default function RecentActivityStream({ activities }) {
  const [activeTab, setActiveTab] = useState("All");

  const filteredActivities =
    activeTab === "All"
      ? activities
      : activities?.items?.filter((activity) => {
          if (activeTab === "Orders") return activity.type === "Order";
          if (activeTab === "Projects") return activity.type === "Project";
          return true;
        });

  console.log("filteredActivities", filteredActivities);

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-surface rounded-xl border border-white/08"
    >
      {/* Header with Tabs */}
      <div className="p-4 md:p-6 border-b border-white/08">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-manrope text-[18px] font-bold text-white">
            Recent Activity Stream
          </h2>
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                px-4 py-2 rounded-lg font-manrope text-[13px] font-medium whitespace-nowrap
                transition-colors shrink-0
                ${
                  activeTab === tab
                    ? "bg-accent-solid text-white"
                    : "bg-white/05 text-muted hover:bg-white/08"
                }
              `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Header - Desktop only */}
      <div className="hidden md:block px-6 py-4 bg-white/05 border-b border-white/08">
        <div className="grid grid-cols-[120px_180px_140px_180px_180px_60px] justify-between gap-4">
          <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
            TYPE
          </span>
          <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
            ID / REFERENCE
          </span>
          <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
            STATUS
          </span>
          <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
            CUSTOMER
          </span>
          <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
            DATE
          </span>
          <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
            ACTION
          </span>
        </div>
      </div>

      {/* Activity Rows */}
      <div className="divide-y divide-white/08">
        {filteredActivities?.items?.map((activity, index) => {
          const Icon =
            activityIcons[activity.icon] ||
            activityIcons[activity.type] ||
            activityIcons.default;
          const statusStyle =
            statusStyles[activity.statusColor] || statusStyles.default;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="px-4 md:px-6 py-4 hover:bg-white/05 transition-colors"
            >
              {/* Desktop View */}
              <div className="hidden md:grid md:grid-cols-[120px_180px_140px_180px_180px_60px] gap-4 items-center justify-between">
                {/* Type */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/08 rounded-lg flex items-center justify-center text-muted">
                    <Icon size={16} />
                  </div>
                  <span className="font-manrope text-[13px] font-medium text-white">
                    {activity.activityType}
                  </span>
                </div>

                {/* Reference */}
                <span className="font-manrope text-[13px] text-muted">
                  {activity.id}
                </span>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                  <span
                    className={`
                      px-3 py-1 rounded-full font-manrope text-[11px] font-bold
                      ${statusStyle.bg} ${statusStyle.text}
                    `}
                  >
                    {activity.status}
                  </span>
                </div>

                {/* Customer */}
                <span className="font-manrope text-[13px] text-white">
                  {activity.customer}
                </span>

                {/* Date */}
                <span className="font-manrope text-[13px] text-muted">
                  {formatDate(activity.createdAtUtc)}
                </span>

                {/* Action */}
                <button className="text-muted hover:text-white transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Mobile View - Card Layout */}
              <div className="md:hidden space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center text-muted">
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="font-manrope text-[13px] font-medium text-white block">
                        {activity.activityType}
                      </span>
                      <span className="font-manrope text-[11px] text-muted">
                        {activity.id}
                      </span>
                    </div>
                  </div>
                  <button className="text-muted hover:text-white transition-colors shrink-0">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${statusStyle.dot}`}
                    />
                    <span
                      className={`
                        px-3 py-1 rounded-full font-manrope text-[11px] font-bold
                        ${statusStyle.bg} ${statusStyle.text}
                      `}
                    >
                      {activity.status}
                    </span>
                  </div>
                  <span className="font-manrope text-[12px] text-muted">
                    {formatDate(activity.createdAtUtc)}
                  </span>
                </div>

                <div>
                  <span className="font-manrope text-[13px] text-white">
                    {activity.customer}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Footer */}
      <div className="p-4 md:p-6 border-t border-white/08 flex justify-center">
        <button className="flex items-center gap-2 text-white font-manrope text-[13px] font-bold hover:gap-3 transition-all group">
          View All Activity
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </motion.div>
  );
}
