// components/shared/dashboard/projects/project-header.jsx
"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function ProjectHeader({ project, isLoading }) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-white/06 rounded w-48" />
        <div className="h-9 bg-white/06 rounded w-80" />
        <div className="h-4 bg-white/06 rounded w-56" />
      </div>
    );
  }

  const progressPercent = project?.progress ?? 65;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
    >
      {/* Left: title block */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase" style={{ background: "rgba(212,175,55,0.12)", color: "#D4AF37" }}>
            In Progress
          </span>
          <span className="text-[12px] text-white/30">
            · Created on {project?.createdAt ?? "Sept 12, 2023"}
          </span>
        </div>

        <h1 className="text-[28px] md:text-[34px] font-extrabold text-white leading-tight">
          {project?.name ?? "Modern Penthouse Renovation"}
        </h1>

        <div className="flex items-center gap-1.5 mt-1.5">
          <MapPin className="w-3.5 h-3.5 text-white/30" />
          <span className="text-[13px] text-white/40">
            {project?.address ?? "128 Skyview Heights, North District"}
          </span>
        </div>
      </div>

      {/* Right: progress card */}
      <div className="rounded-2xl border border-white/08 px-5 py-4 min-w-55" style={{ background: "#0d0b08" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-medium text-white/40">Overall Progress</span>
          <span className="text-[22px] font-extrabold text-white">{progressPercent}%</span>
        </div>

        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #D4AF37, #b8962e)" }}
          />
        </div>

        <p className="text-[11px] text-white/30 mt-2">
          Est. Completion: {project?.estCompletion ?? "Dec 15, 2023"}
        </p>
      </div>
    </motion.div>
  );
}
