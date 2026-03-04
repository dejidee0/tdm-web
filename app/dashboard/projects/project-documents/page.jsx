"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Upload, Download, Cloud, Bell } from "lucide-react";
import DashboardLayout from "@/components/shared/dashboard/layout";

const TABS = [
  "All Files",
  "Contracts",
  "Floor Plans",
  "Material Specs",
  "Permits",
];

const FILES = [
  {
    id: 1,
    name: "Master Contract - 2024 Revised",
    type: "PDF Document",
    category: "Legal",
    categoryColor: "text-orange-600 bg-orange-50",
    date: "Oct 12, 2023",
    size: "2.4 MB",
    iconBg: "bg-orange-100",
    iconColor: "#e67e22",
    icon: "pdf",
  },
  {
    id: 2,
    name: "Main Floor Layout V2",
    type: "DWG File",
    category: "Blueprint",
    categoryColor: "text-blue-600 bg-blue-50",
    date: "Nov 04, 2023",
    size: "18.7 MB",
    iconBg: "bg-blue-100",
    iconColor: "#3b5bdb",
    icon: "dwg",
  },
  {
    id: 3,
    name: "Interior Finishes & Material Specs",
    type: "Excel Sheet",
    category: "Specifications",
    categoryColor: "text-green-700 bg-green-50",
    date: "Dec 01, 2023",
    size: "842 KB",
    iconBg: "bg-green-100",
    iconColor: "#27ae60",
    icon: "xlsx",
  },
  {
    id: 4,
    name: "City Building Permit #4592-A",
    type: "PDF Document",
    category: "Permits",
    categoryColor: "text-purple-600 bg-purple-50",
    date: "Jan 15, 2024",
    size: "1.2 MB",
    iconBg: "bg-purple-100",
    iconColor: "#9b59b6",
    icon: "pdf",
  },
  {
    id: 5,
    name: "Site Survey Photos - Archive",
    type: "ZIP Archive",
    category: "Media",
    categoryColor: "text-yellow-700 bg-yellow-50",
    date: "Jan 22, 2024",
    size: "145 MB",
    iconBg: "bg-yellow-100",
    iconColor: "#e67e22",
    icon: "zip",
  },
];

function FileIcon({ type, iconBg, iconColor }) {
  const colors = { iconBg, iconColor };

  const icons = {
    pdf: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    dwg: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    xlsx: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
        <line x1="8" y1="9" x2="10" y2="9" />
      </svg>
    ),
    zip: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  };

  return (
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
    >
      {icons[type] || icons.pdf}
    </div>
  );
}

export default function ProjectDocuments() {
  const [activeTab, setActiveTab] = useState("All Files");
  const [search, setSearch] = useState("");

  const filtered = FILES.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f4f5f7] p-6 md:p-8">
        <div className="max-w-[700px] mx-auto space-y-5">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <h1 className="text-[26px] font-bold text-[#1a2340] leading-tight">
                Project Documents
              </h1>
              <p className="text-[13px] text-gray-500 mt-1">
                Manage and access all essential architectural and legal files.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 mt-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search documents..."
                  className="text-[12.5px] pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#1a2340] transition-colors w-44"
                />
              </div>
              <button className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-[#1a2340] px-3.5 py-2 rounded-lg hover:bg-[#222d52] transition-colors">
                <Upload className="w-3.5 h-3.5" />
                Upload New File
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex items-center gap-0 border-b border-gray-200"
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[13px] font-semibold px-4 py-2.5 border-b-2 transition-all ${
                  activeTab === tab
                    ? "border-[#1a2340] text-[#1a2340]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
              {["FILE NAME", "CATEGORY", "UPLOAD DATE", "SIZE", "ACTION"].map(
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

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {filtered.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.2 + index * 0.05 }}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors group"
                >
                  {/* File name + icon */}
                  <div className="flex items-center gap-3 min-w-0">
                    <FileIcon
                      type={file.icon}
                      iconBg={file.iconBg}
                      iconColor={file.iconColor}
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#1a2340] truncate">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-gray-400">{file.type}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${file.categoryColor}`}
                    >
                      {file.category}
                    </span>
                  </div>

                  {/* Date */}
                  <span className="text-[12.5px] text-gray-600">
                    {file.date}
                  </span>

                  {/* Size */}
                  <span className="text-[12.5px] text-gray-600">
                    {file.size}
                  </span>

                  {/* Action */}
                  <button className="p-1.5 text-gray-400 hover:text-[#1a2340] transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
              <span className="text-[12px] text-gray-400">
                Showing 5 of 12 files
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] text-gray-500">Previous</span>
                <button className="w-7 h-7 rounded-md bg-[#1a2340] text-white text-[12px] font-semibold flex items-center justify-center">
                  1
                </button>
                <button className="w-7 h-7 rounded-md border border-gray-200 text-gray-500 text-[12px] hover:bg-gray-100 flex items-center justify-center">
                  2
                </button>
                <span className="text-[12.5px] text-gray-500">Next</span>
              </div>
            </div>
          </motion.div>

          {/* Bottom cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* New version notification */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#1a2340]">
                  New Version Available
                </p>
                <p className="text-[11.5px] text-gray-500 mt-0.5 leading-relaxed">
                  The 'Floor Plans' folder has 2 new files uploaded by the
                  architect today.
                </p>
              </div>
              <button className="text-[12px] font-bold text-[#1a2340] hover:text-blue-700 shrink-0">
                VIEW
              </button>
            </div>

            {/* Storage status */}
            <div className="bg-[#1a2340] rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Cloud className="w-4 h-4 text-white/80" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-white">
                  Storage Status
                </p>
                <p className="text-[11.5px] text-white/60 mt-0.5 leading-relaxed">
                  8.4 GB of 25 GB used (33%). High speed bandwidth enabled.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
