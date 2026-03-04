// components/shared/dashboard/projects/project-documents.jsx
"use client";

import { motion } from "framer-motion";
import {
  Download,
  FileText,
  FileImage,
  FileSpreadsheet,
  Folder,
} from "lucide-react";

const MOCK_DOCUMENTS = [
  {
    id: 1,
    name: "Master_Contract_V2.pdf",
    meta: "Signed Sep 15, 2023 · 2.4MB",
    type: "pdf",
    color: "#3b5bdb",
  },
  {
    id: 2,
    name: "Blueprints_Approved.dwg",
    meta: "Updated Oct 31, 2023 · 18MB",
    type: "dwg",
    color: "#e67e22",
  },
  {
    id: 3,
    name: "Budget_Report_Q4.xlsx",
    meta: "Updated Oct 28, 2023 · 1MB",
    type: "xlsx",
    color: "#27ae60",
  },
];

const typeIcon = {
  pdf: FileText,
  dwg: FileImage,
  xlsx: FileSpreadsheet,
};

const typeBg = {
  pdf: "bg-blue-50",
  dwg: "bg-orange-50",
  xlsx: "bg-green-50",
};

export default function ProjectDocuments({ documents, isLoading }) {
  const items = documents ?? MOCK_DOCUMENTS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-gray-500" />
          <h2 className="text-[15px] font-bold text-text-black">
            Project Documents
          </h2>
        </div>
        <button className="text-[13px] font-semibold text-primary hover:underline">
          View
        </button>
      </div>

      {/* Document rows */}
      <div className="divide-y divide-gray-100">
        {isLoading
          ? [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex items-center gap-3 px-5 py-3.5"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded" />
              </div>
            ))
          : items.map((doc, index) => {
              const Icon = typeIcon[doc.type] ?? FileText;
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, delay: 0.2 + index * 0.07 }}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                >
                  {/* File icon */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeBg[doc.type] ?? "bg-gray-100"}`}
                  >
                    <Icon className="w-4 h-4" style={{ color: doc.color }} />
                  </div>

                  {/* Name + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-text-black truncate">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {doc.meta}
                    </p>
                  </div>

                  {/* Download */}
                  <button className="p-1.5 text-gray-300 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                    <Download className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
      </div>
    </motion.div>
  );
}
