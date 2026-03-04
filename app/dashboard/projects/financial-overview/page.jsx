"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Plus,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Headphones,
} from "lucide-react";
import DashboardLayout from "@/components/shared/dashboard/layout";

const BUDGET_CARDS = [
  {
    label: "TOTAL BUDGET",
    value: "$50,000.00",
    barWidth: "100%",
    barColor: "bg-[#1a2340]",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "AMOUNT PAID",
    value: "$32,500.00",
    barWidth: "65%",
    barColor: "bg-[#1a2340]",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    label: "REMAINING BALANCE",
    value: "$17,500.00",
    barWidth: "35%",
    barColor: "bg-gray-300",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

const INVOICES = [
  {
    id: 1,
    date: "Oct 24, 2023",
    description: "Q4 Infrastructure Support",
    ref: "Ref: INV-004-2023",
    amount: "$4,500.00",
    status: "PAID",
    statusColor: "text-emerald-600 bg-emerald-50",
    dot: "bg-emerald-500",
  },
  {
    id: 2,
    date: "Oct 12, 2023",
    description: "Development Sprint #6",
    ref: "Ref: INV-003-2023",
    amount: "$12,000.00",
    status: "PAID",
    statusColor: "text-emerald-600 bg-emerald-50",
    dot: "bg-emerald-500",
  },
  {
    id: 3,
    date: "Nov 01, 2023",
    description: "Mobile UI Optimization",
    ref: "Ref: INV-005-2023",
    amount: "$8,000.00",
    status: "PENDING",
    statusColor: "text-orange-600 bg-orange-50",
    dot: "bg-orange-400",
  },
  {
    id: 4,
    date: "Sep 15, 2023",
    description: "API Integration Modules",
    ref: "Ref: INV-002-2023",
    amount: "$16,000.00",
    status: "PAID",
    statusColor: "text-emerald-600 bg-emerald-50",
    dot: "bg-emerald-500",
  },
];

export default function FinancialOverview() {
  const [page, setPage] = useState(1);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f4f5f7] p-6 md:p-8">
        <div className="max-w-[680px] mx-auto space-y-5">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <h1 className="text-[26px] font-bold text-[#1a2340] leading-tight">
                Financial Overview
              </h1>
              <p className="text-[13px] text-gray-500 mt-1">
                Track your project investment and transaction history.
              </p>
            </div>
            <button className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-[#1a2340] px-4 py-2 rounded-lg hover:bg-[#222d52] transition-colors shrink-0 mt-1">
              <Plus className="w-3.5 h-3.5" />
              New Payment
            </button>
          </motion.div>

          {/* Budget Cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
            {BUDGET_CARDS.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + index * 0.07 }}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    {card.label}
                  </p>
                  <span className="text-gray-400">{card.icon}</span>
                </div>
                <p className="text-[20px] font-bold text-[#1a2340] mb-3">
                  {card.value}
                </p>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: card.barWidth }}
                    transition={{
                      duration: 0.8,
                      delay: 0.4 + index * 0.1,
                      ease: "easeOut",
                    }}
                    className={`h-full rounded-full ${card.barColor}`}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Invoices */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            {/* Invoice header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-[15px] font-bold text-[#1a2340]">
                Recent Invoices
              </h2>
              <div className="flex items-center gap-2">
                <button className="text-[12.5px] font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  Filter
                </button>
                <button className="text-[12.5px] font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  Export All
                </button>
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr_auto] gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100">
              {["DATE", "DESCRIPTION", "AMOUNT", "STATUS", "ACTION"].map(
                (h) => (
                  <span
                    key={h}
                    className="text-[10px] font-bold tracking-wider text-gray-400 uppercase"
                  >
                    {h}
                  </span>
                ),
              )}
            </div>

            {/* Invoice rows */}
            <div className="divide-y divide-gray-100">
              {INVOICES.map((inv, index) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.3 + index * 0.06 }}
                  className="grid grid-cols-[1fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[12.5px] text-gray-600">
                    {inv.date}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1a2340]">
                      {inv.description}
                    </p>
                    <p className="text-[11px] text-gray-400">{inv.ref}</p>
                  </div>
                  <span className="text-[13px] font-semibold text-[#1a2340]">
                    {inv.amount}
                  </span>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md ${inv.statusColor}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${inv.dot}`} />
                      {inv.status}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 text-[11.5px] font-semibold text-gray-500 hover:text-[#1a2340] transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
              <span className="text-[12px] text-gray-400">
                Showing 4 of 12 invoices
              </span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-md border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-100">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-md text-[12px] font-semibold flex items-center justify-center transition-colors ${
                      page === p
                        ? "bg-[#1a2340] text-white"
                        : "border border-gray-200 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button className="w-7 h-7 rounded-md border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-100">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Support CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="bg-gray-100 rounded-2xl border border-gray-200 p-8 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a2340"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-[#1a2340] mb-1.5">
              Need financial assistance?
            </h3>
            <p className="text-[13px] text-gray-500 max-w-85 leading-relaxed mb-5">
              Our billing department is available 24/7 to answer your questions
              regarding invoices, payment schedules, or custom billing
              arrangements.
            </p>
            <button className="text-[13px] font-semibold text-white bg-[#1a2340] px-6 py-2.5 rounded-lg hover:bg-[#222d52] transition-colors">
              Contact Support
            </button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
