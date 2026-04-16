// components/shared/dashboard/projects/project-documents.jsx
"use client";

import { motion } from "framer-motion";
import { Download, FileText, FileImage, FileSpreadsheet, Folder } from "lucide-react";

const MOCK_DOCUMENTS = [
  { id: 1, name: "Master_Contract_V2.pdf", meta: "Signed Sep 15, 2023 · 2.4MB", type: "pdf" },
  { id: 2, name: "Blueprints_Approved.dwg", meta: "Updated Oct 31, 2023 · 18MB", type: "dwg" },
  { id: 3, name: "Budget_Report_Q4.xlsx", meta: "Updated Oct 28, 2023 · 1MB", type: "xlsx" },
];

const typeIcon = { pdf: FileText, dwg: FileImage, xlsx: FileSpreadsheet };
const typeColor = { pdf: "#3b82f6", dwg: "#f97316", xlsx: "#22c55e" };
const typeBgStyle = {
  pdf: { background: "rgba(59,130,246,0.12)" },
  dwg: { background: "rgba(249,115,22,0.12)" },
  xlsx: { background: "rgba(34,197,94,0.12)" },
};

export default function ProjectDocuments({ documents, isLoading }) {
  const items = documents ?? MOCK_DOCUMENTS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
      className="rounded-2xl border border-white/08 overflow-hidden"
      style={{ background: "#0d0b08" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/08">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-white/30" />
          <h2 className="text-[15px] font-bold text-white">Project Documents</h2>
        </div>
        <button className="text-[13px] font-semibold text-[#D4AF37] hover:text-[#D4AF37]/70 transition-colors">
          View
        </button>
      </div>

      {/* Document rows */}
      <div className="divide-y divide-white/06">
        {isLoading
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 px-5 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-white/06 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-white/06 rounded w-2/3" />
                  <div className="h-2.5 bg-white/06 rounded w-1/2" />
                </div>
                <div className="w-6 h-6 bg-white/06 rounded" />
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
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/02 transition-colors group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={typeBgStyle[doc.type] ?? { background: "rgba(255,255,255,0.06)" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: typeColor[doc.type] ?? "rgba(255,255,255,0.40)" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-white truncate">{doc.name}</p>
                    <p className="text-[11px] text-white/35 mt-0.5">{doc.meta}</p>
                  </div>

                  <button className="p-1.5 text-white/20 hover:text-[#D4AF37] transition-colors opacity-0 group-hover:opacity-100">
                    <Download className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
      </div>
    </motion.div>
  );
}
