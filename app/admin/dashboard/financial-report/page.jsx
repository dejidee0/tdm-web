"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import RevenueChart from "@/components/shared/admin/dashboard/revenue-chart";
import {
  useFinancialStats,
  useMonthlyRevenue,
  useRevenueByService,
  useTransactions,
  useExportFinancialReport,
} from "@/hooks/use-financial";
import netProfitIcon from "@/public/assets/svgs/financialReport/netProfit.svg";
import pendingIcon from "@/public/assets/svgs/financialReport/pending.svg";
import calendarIcon from "@/public/assets/svgs/financialReport/calendarIcon.svg";
import filterIcon from "@/public/assets/svgs/financialReport/filter.svg";
import searchIcon from "@/public/assets/svgs/financialReport/searchIcon.svg";

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
            <div className="w-16 h-16 border-4 border-[#D1D5DB] border-t-[#1E293B] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#64748B] font-inter text-[14px]">Loading financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  const statsData = [
    { ...stats.totalRevenue, key: "totalRevenue" },
    { ...stats.avgTransaction, key: "avgTransaction" },
    { ...stats.netProfit, key: "netProfit" },
    { ...stats.pending, key: "pending", isNegative: true },
  ];

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
          <div>
            <h1 className="font-inter text-[28px] sm:text-[34px] md:text-[39px] font-black text-[#273054] mb-2 leading-[1.1] tracking-[-1.3px]">
              Financial Reports
            </h1>
            <p className="font-inter text-[14px] sm:text-[16px] md:text-[18px] text-[#273054]">
              Overview of platform revenue and financial health
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="relative w-full sm:w-auto">
              <Image src={calendarIcon} alt="Calendar" width={16} height={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select className="appearance-none w-full bg-white border border-[#D1D5DB] rounded-lg pl-10 pr-10 py-2.5 font-inter text-[14px] font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
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
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E293B] text-white rounded-lg font-inter text-[14px] font-bold hover:bg-[#334155] transition-colors disabled:opacity-50 w-full sm:w-auto"
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
          const changeColor = stat.changeType === "increase" ? "text-[#16A34A]" : "text-[#EF4444]";

          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-[0_0.98px_1.96px_0_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
              {/* Icon in top right */}
              <div className="absolute top-6 right-6">
                <Image
                  src={stat.isNegative ? pendingIcon : netProfitIcon}
                  alt={stat.label}
                  width={26}
                  height={26}
                />
              </div>

              <p className="font-inter text-[14px] font-medium text-[#6B7280] mb-2">{stat.label}</p>
              <h3 className="font-inter text-[32px] font-bold text-[#1E293B] leading-none mb-2">{stat.value}</h3>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 ${changeColor}`}>
                  <span className="font-inter text-[12px] font-medium">
                    {stat.change > 0 ? "+" : ""}{stat.change}%
                  </span>
                </div>
                <p className="font-inter text-[12px] text-[#9CA3AF]">{stat.subtitle}</p>
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
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_0.98px_1.96px_0_rgba(0,0,0,0.05)] p-6">
          <h2 className="font-inter text-[18px] font-bold text-[#111827] mb-6">
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
                <p className="font-inter text-[12px] font-medium text-[#9CA3AF]">Total</p>
                <p className="font-inter text-[20px] font-bold text-[#111827]">$1.2M</p>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full grid grid-cols-2 gap-3">
              {revenueByService.services.map((service, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: service.color }}
                  />
                  <div>
                    <p className="font-inter text-[12px] font-medium text-[#6B7280]">
                      {service.name}
                    </p>
                    <p className="font-inter text-[14px] font-bold text-[#111827]">
                      {service.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_0.98px_1.96px_0_rgba(0,0,0,0.05)]">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="font-inter text-[18px] font-bold text-[#1E293B]">
              Transaction Summaries
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-80">
                <Image src={searchIcon} alt="Search" width={18} height={18} className="absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#D1D5DB] rounded-lg font-inter text-[14px] placeholder:text-[#6B7280] placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D1D5DB] rounded-lg font-inter text-[14px] font-medium text-[#374151] hover:bg-[#F8FAFC]">
                <Image src={filterIcon} alt="Filter" width={16} height={16} />
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
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-inter text-[9px] sm:text-[10px] md:text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.59px]">
                  Transaction ID
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-inter text-[9px] sm:text-[10px] md:text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.59px]">
                  Date
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-inter text-[9px] sm:text-[10px] md:text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.59px] hidden sm:table-cell">
                  User
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-inter text-[9px] sm:text-[10px] md:text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.59px] hidden md:table-cell">
                  Service Type
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-inter text-[9px] sm:text-[10px] md:text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.59px]">
                  Amount
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-inter text-[9px] sm:text-[10px] md:text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.59px]">
                  Status
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 hidden sm:table-cell"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {transactions?.transactions.map((txn, index) => (
                <tr key={txn.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-inter text-[11px] sm:text-[13px] md:text-[14px] font-medium text-[#273054]">
                    #{txn.id}
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4">
                    <p className="font-inter text-[11px] sm:text-[13px] md:text-[14px] text-[#64748B]">{txn.date}</p>
                    <p className="font-inter text-[10px] sm:text-[11px] md:text-[12px] text-[#9CA3AF]">{txn.time}</p>
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-inter font-bold text-[10px] sm:text-[12px]"
                        style={{
                          backgroundColor: txn.user.colorScheme.bg,
                          color: txn.user.colorScheme.text,
                        }}
                      >
                        {txn.user.initials}
                      </div>
                      <div>
                        <p className="font-inter text-[12px] sm:text-[14px] font-medium text-[#111827]">
                          {txn.user.name}
                        </p>
                        <p className="font-inter text-[10px] sm:text-[12px] text-[#6B7280]">
                          {txn.user.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-inter text-[11px] sm:text-[13px] md:text-[14px] text-[#374151] hidden md:table-cell">
                    {txn.serviceType}
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 font-inter text-[12px] sm:text-[13px] md:text-[14px] font-semibold text-[#111827]">
                    ${txn.amount.toLocaleString()}
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4">
                    <span
                      className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full border border-[#FAFAFA] font-inter text-[10px] sm:text-[11px] md:text-[12px] font-medium ${txn.statusColor.bg} ${txn.statusColor.text}`}
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
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-[3px]">
                      <span className="w-[3.26px] h-[3.26px] rounded-full bg-[#9CA3AF]"></span>
                      <span className="w-[3.26px] h-[3.26px] rounded-full bg-[#9CA3AF]"></span>
                      <span className="w-[3.26px] h-[3.26px] rounded-full bg-[#9CA3AF]"></span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {transactions?.pagination && (
          <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <p className="font-inter text-[13.7px] font-normal text-[#374151]">
              Showing <span className="font-medium">{(page - 1) * 5 + 1}</span> to <span className="font-medium">{Math.min(page * 5, transactions.pagination.total)}</span> of{" "}
              <span className="font-medium">{transactions.pagination.total}</span> results
            </p>
            <div className="flex items-center">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                className="w-[35px] h-[35px] flex items-center justify-center rounded-l-[6px] bg-white shadow-[inset_0_0_0_0.98px_#D1D5DB] hover:bg-[#F8FAFC]"
              >
                <ChevronLeft size={16} className="text-[#9CA3AF]" />
              </button>
              {[1, 2, 3, "...", 10].map((p, i) =>
                p === "..." ? (
                  <span key={i} className="w-[44px] h-[35px] flex items-center justify-center bg-white shadow-[inset_0_0_0_0.98px_#D1D5DB] font-inter text-[14px] font-semibold text-[#374151]">
                    ...
                  </span>
                ) : (
                  <button
                    key={i}
                    onClick={() => setPage(p)}
                    className={`${p >= 10 ? "w-[44px]" : "w-[40px]"} h-[35px] flex items-center justify-center font-inter text-[14px] font-semibold ${
                      page === p
                        ? "bg-[#273054] text-white shadow-[inset_0_0_0_0.98px_#273054]"
                        : "bg-white shadow-[inset_0_0_0_0.98px_#D1D5DB] text-[#111827] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setPage(Math.min(10, page + 1))}
                className="w-[35px] h-[35px] flex items-center justify-center rounded-r-[6px] bg-white shadow-[inset_0_0_0_0.98px_#D1D5DB] hover:bg-[#F8FAFC]"
              >
                <ChevronRight size={16} className="text-[#9CA3AF]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
