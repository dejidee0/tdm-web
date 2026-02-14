"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Calendar, TrendingUp, TrendingDown, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import Image from "next/image";
import RevenueChart from "@/components/shared/admin/dashboard/revenue-chart";
import {
  useFinancialStats,
  useMonthlyRevenue,
  useRevenueByService,
  useTransactions,
  useExportFinancialReport,
} from "@/hooks/use-financial";

export default function FinancialReportPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: stats, isLoading: statsLoading } = useFinancialStats();
  const { data: monthlyRevenue, isLoading: revenueLoading } = useMonthlyRevenue();
  const { data: revenueByService, isLoading: serviceLoading } = useRevenueByService();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions({
    page,
    limit: 5,
    search,
    filter,
  });
  const { mutate: exportReport, isPending: isExporting } = useExportFinancialReport();

  const isLoading = statsLoading || revenueLoading || serviceLoading || transactionsLoading;

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#E5E7EB] border-t-[#1E293B] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#64748B] font-manrope text-[14px]">Loading financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  const statsData = [
    { ...stats.totalRevenue, icon: TrendingUp, key: "totalRevenue" },
    { ...stats.avgTransaction, icon: TrendingUp, key: "avgTransaction" },
    { ...stats.netProfit, icon: TrendingUp, key: "netProfit" },
    { ...stats.pending, icon: TrendingDown, key: "pending", isNegative: true },
  ];

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div>
            <h1 className="font-manrope text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#1E293B] mb-2">
              Financial Reports
            </h1>
            <p className="font-manrope text-[13px] sm:text-[14px] text-[#64748B]">
              Overview of platform revenue and financial health
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="relative w-full sm:w-auto">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
              <select className="appearance-none w-full bg-white border border-[#E5E7EB] rounded-lg pl-10 pr-10 py-2.5 font-manrope text-[13px] font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                <option>Last 7 Days</option>
                <option selected>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>All Time</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => exportReport()}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E293B] text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors disabled:opacity-50 w-full sm:w-auto"
            >
              <Download size={16} />
              Export Report
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          const changeColor = stat.changeType === "increase" ? "text-[#10B981]" : "text-[#EF4444]";

          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-[#E5E7EB] relative overflow-hidden"
            >
              {/* Icon in top right */}
              <div className="absolute top-6 right-6">
                <Image
                  src={stat.isNegative ? "/assets/svgs/financial report/pending.svg" : "/assets/svgs/financial report/revenue.svg"}
                  alt={stat.label}
                  width={26}
                  height={26}
                />
              </div>

              <p className="font-manrope text-[13px] text-[#64748B] mb-2">{stat.label}</p>
              <h3 className="font-manrope text-[32px] font-bold text-[#1E293B] leading-none mb-2">{stat.value}</h3>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 ${changeColor}`}>
                  <Icon size={14} />
                  <span className="font-manrope text-[13px] font-bold">
                    {stat.change > 0 ? "+" : ""}{stat.change}%
                  </span>
                </div>
                <p className="font-manrope text-[12px] text-[#94A3B8]">{stat.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Revenue Trends */}
        <div className="lg:col-span-2">
          <RevenueChart
            data={{
              totalRevenue: 4250000,
              monthlyRecurring: 355000,
              chartData: monthlyRevenue,
            }}
          />
        </div>

        {/* Revenue by Service */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="font-manrope text-[18px] font-bold text-[#1E293B] mb-6">
            Revenue by Service
          </h2>
          <div className="flex flex-col items-center">
            {/* Donut chart placeholder */}
            <div className="relative w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 mb-6">
              <svg viewBox="0 0 100 100" className="-rotate-90">
                {revenueByService.services.map((service, i) => {
                  const prevPercentages = revenueByService.services
                    .slice(0, i)
                    .reduce((sum, s) => sum + s.percentage, 0);
                  const circumference = 2 * Math.PI * 40;
                  const offset = (prevPercentages / 100) * circumference;
                  const dashArray = `${(service.percentage / 100) * circumference} ${circumference}`;

                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={service.color}
                      strokeWidth="20"
                      strokeDasharray={dashArray}
                      strokeDashoffset={-offset}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-manrope text-[24px] font-bold text-[#1E293B]">$1.2M</p>
                <p className="font-manrope text-[12px] text-[#64748B]">Total</p>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-2">
              {revenueByService.services.map((service, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="font-manrope text-[13px] text-[#64748B]">
                      {service.name}
                    </span>
                  </div>
                  <span className="font-manrope text-[13px] font-bold text-[#1E293B]">
                    {service.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-xl border border-[#E5E7EB]">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="font-manrope text-[18px] font-bold text-[#1E293B]">
              Transaction Summaries
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-80">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[14px] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#64748B] hover:bg-[#F8FAFC]">
                <SlidersHorizontal size={16} />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-manrope text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#64748B] uppercase">
                  ID
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-manrope text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#64748B] uppercase">
                  Date
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-manrope text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#64748B] uppercase hidden sm:table-cell">
                  User
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-manrope text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#64748B] uppercase hidden md:table-cell">
                  Service
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-manrope text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#64748B] uppercase">
                  Amount
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-manrope text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#64748B] uppercase">
                  Status
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 hidden sm:table-cell"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {transactions?.transactions.map((txn, index) => (
                <tr key={txn.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-manrope text-[11px] sm:text-[13px] md:text-[14px] text-[#64748B]">
                    #{txn.id}
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4">
                    <p className="font-manrope text-[11px] sm:text-[13px] md:text-[14px] text-[#1E293B]">{txn.date}</p>
                    <p className="font-manrope text-[10px] sm:text-[11px] md:text-[12px] text-[#94A3B8]">{txn.time}</p>
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-manrope font-bold text-[10px] sm:text-[12px]"
                        style={{
                          backgroundColor: txn.user.colorScheme.bg,
                          color: txn.user.colorScheme.text,
                        }}
                      >
                        {txn.user.initials}
                      </div>
                      <div>
                        <p className="font-manrope text-[12px] sm:text-[14px] font-medium text-[#1E293B]">
                          {txn.user.name}
                        </p>
                        <p className="font-manrope text-[10px] sm:text-[12px] text-[#94A3B8]">
                          {txn.user.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-manrope text-[11px] sm:text-[13px] md:text-[14px] text-[#64748B] hidden md:table-cell">
                    {txn.serviceType}
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-manrope text-[12px] sm:text-[13px] md:text-[14px] font-bold text-[#1E293B]">
                    ${txn.amount.toLocaleString()}
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4">
                    <span
                      className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-md font-manrope text-[10px] sm:text-[11px] md:text-[12px] font-bold ${txn.statusColor.bg} ${txn.statusColor.text}`}
                    >
                      <span
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                        style={{
                          backgroundColor: txn.statusColor.text.match(/#[0-9A-Fa-f]{6}/)?.[0]
                        }}
                      ></span>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-[#64748B] hidden sm:table-cell">...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {transactions?.pagination && (
          <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <p className="font-manrope text-[13px] text-[#64748B]">
              Showing {(page - 1) * 5 + 1} to {Math.min(page * 5, transactions.pagination.total)} of{" "}
              {transactions.pagination.total} results
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, "...", 10].map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-3 py-2 font-manrope text-[13px] text-[#64748B]">
                    ...
                  </span>
                ) : (
                  <button
                    key={i}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded-lg font-manrope text-[13px] font-bold ${
                      page === p
                        ? "bg-[#1E293B] text-white"
                        : "text-[#1E293B] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
