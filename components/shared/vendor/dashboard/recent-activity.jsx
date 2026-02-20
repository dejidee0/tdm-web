"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Briefcase,
  HelpCircle,
  MoreVertical,
  ArrowRight,
} from "lucide-react";

const activityIcons = {
  order: ShoppingCart,
  project: Briefcase,
  enquiry: HelpCircle,
};

const statusStyles = {
  success: {
    bg: "bg-[#D1FAE5]",
    text: "text-[#065F46]",
    dot: "bg-[#10B981]",
  },
  info: {
    bg: "bg-[#DBEAFE]",
    text: "text-[#1E40AF]",
    dot: "bg-[#3B82F6]",
  },
  warning: {
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    dot: "bg-[#F59E0B]",
  },
};

const tabs = ["All", "Orders", "Projects"];

export default function RecentActivityStream({ activities }) {
  const [activeTab, setActiveTab] = useState("All");

  const filteredActivities =
    activeTab === "All"
      ? activities
      : activities.filter((activity) => {
          if (activeTab === "Orders") return activity.type === "Order";
          if (activeTab === "Projects") return activity.type === "Project";
          return true;
        });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-xl border border-[#E5E7EB]"
    >
      {/* Header with Tabs */}
      <div className="p-4 md:p-6 border-b border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-manrope text-[18px] font-bold text-primary">
            Recent Activity Stream
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 rounded-lg font-manrope text-[13px] font-medium whitespace-nowrap
                transition-colors flex-shrink-0
                ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Header - Desktop only */}
      <div className="hidden md:block px-6 py-4 bg-[#F8FAFC] border-b border-[#E5E7EB]">
        <div className="grid grid-cols-[120px_180px_140px_180px_180px_60px] justify-between gap-4">
          <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            TYPE
          </span>
          <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            ID / REFERENCE
          </span>
          <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            STATUS
          </span>
          <span className="font-manrope text-[#11px] font-bold text-[#64748B] uppercase tracking-wider">
            CUSTOMER
          </span>
          <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            DATE
          </span>
          <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            ACTION
          </span>
        </div>
      </div>

      {/* Activity Rows */}
      <div className="divide-y divide-[#E5E7EB]">
        {filteredActivities.map((activity, index) => {
          const Icon = activityIcons[activity.icon];
          const statusStyle = statusStyles[activity.statusColor];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="px-4 md:px-6 py-4 hover:bg-[#F8FAFC] transition-colors"
            >
              {/* Desktop View */}
              <div className="hidden md:grid md:grid-cols-[120px_180px_140px_180px_180px_60px] gap-4 items-center justify-between">
                {/* Type */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-[#64748B]">
                    <Icon size={16} />
                  </div>
                  <span className="font-manrope text-[13px] font-medium text-primary">
                    {activity.type}
                  </span>
                </div>

                {/* Reference */}
                <span className="font-manrope text-[13px] text-[#64748B] font-mono">
                  {activity.reference}
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
                <span className="font-manrope text-[13px] text-primary">
                  {activity.customer}
                </span>

                {/* Date */}
                <span className="font-manrope text-[13px] text-[#64748B]">
                  {activity.date}
                </span>

                {/* Action */}
                <button className="text-[#64748B] hover:text-primary transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Mobile View - Card Layout */}
              <div className="md:hidden space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-[#64748B]">
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="font-manrope text-[13px] font-medium text-primary block">
                        {activity.type}
                      </span>
                      <span className="font-manrope text-[11px] text-[#64748B] font-mono">
                        {activity.reference}
                      </span>
                    </div>
                  </div>
                  <button className="text-[#64748B] hover:text-primary transition-colors flex-shrink-0">
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
                  <span className="font-manrope text-[12px] text-[#64748B]">
                    {activity.date}
                  </span>
                </div>

                <div>
                  <span className="font-manrope text-[13px] text-primary">
                    {activity.customer}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Footer */}
      <div className="p-4 md:p-6 border-t border-[#E5E7EB] flex justify-center">
        <button className="flex items-center gap-2 text-primary font-manrope text-[13px] font-bold hover:gap-3 transition-all group">
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
