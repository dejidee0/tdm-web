// components/shared/dashboard/projects/project-header.jsx
"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function ProjectHeader({ project, isLoading }) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-48" />
        <div className="h-9 bg-gray-200 rounded w-80" />
        <div className="h-4 bg-gray-200 rounded w-56" />
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
        {/* Status + date row */}
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            In Progress
          </span>
          <span className="text-[12px] text-gray-400">
            · Created on {project?.createdAt ?? "Sept 12, 2023"}
          </span>
        </div>

        <h1 className="text-[28px] md:text-[34px] font-extrabold text-text-black leading-tight">
          {project?.name ?? "Modern Penthouse Renovation"}
        </h1>

        <div className="flex items-center gap-1.5 mt-1.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[13px] text-gray-400">
            {project?.address ?? "128 Skyview Heights, North District"}
          </span>
        </div>
      </div>

      {/* Right: progress card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 min-w-[220px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-medium text-gray-500">
            Overall Progress
          </span>
          <span className="text-[22px] font-extrabold text-text-black">
            {progressPercent}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="h-full rounded-full bg-primary"
          />
        </div>

        <p className="text-[11px] text-gray-400 mt-2">
          Est. Completion: {project?.estCompletion ?? "Dec 15, 2023"}
        </p>
      </div>
    </motion.div>
  );
}
