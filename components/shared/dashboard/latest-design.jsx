// components/dashboard/LatestDesign.jsx
"use client";

import { motion } from "framer-motion";
import { Sparkles, Download } from "lucide-react";
import Image from "next/image";
import { useLatestDesign } from "@/hooks/use-user-dashboard";

export default function LatestDesign() {
  const { data: design, isLoading, isError } = useLatestDesign();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e5e5e5]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#666666]" />
            <h2 className="text-[16px] font-semibold text-[#1a1a1a]">
              Latest Design
            </h2>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="w-full aspect-16/10 bg-gray-200 rounded-xl mb-4" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (isError || !design) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e5e5e5]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#666666]" />
            <h2 className="text-[16px] font-semibold text-[#1a1a1a]">
              Latest Design
            </h2>
          </div>
        </div>
        <p className="text-[14px] text-[#999999] text-center py-8">
          No designs yet
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl p-6 border border-[#e5e5e5]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gray-400" />
          <h2 className="text-[16px] font-semibold text-[#1a1a1a]">
            Latest Design
          </h2>
        </div>
        <button className="text-[13px] text-[#3b82f6] font-medium hover:text-[#2563eb] transition-colors">
          View All
        </button>
      </div>

      {/* Design Preview */}
      <div className="relative w-full aspect-[16/10] bg-[#f5f5f5] rounded-xl overflow-hidden mb-4 group">
        <Image
          src={design.image}
          alt={design.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Generation Time Overlay */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-md">
          Generated {design.generatedAt}
        </div>

        {/* Download Button - Shows on hover on desktop, always visible on mobile */}
        {design.downloadable && (
          <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-white">
            <Download className="w-4 h-4 text-[#1a1a1a]" />
          </button>
        )}
      </div>

      {/* Design Info */}
      <div>
        <h3 className="text-[15px] font-semibold text-[#1a1a1a] mb-1">
          {design.title}
        </h3>
        <p className="text-[13px] text-[#666666]">Style: {design.style}</p>
      </div>
    </motion.div>
  );
}
