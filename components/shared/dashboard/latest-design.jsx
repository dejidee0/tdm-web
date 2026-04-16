// components/dashboard/LatestDesign.jsx
"use client";

import { motion } from "framer-motion";
import { Sparkles, Download } from "lucide-react";
import Image from "next/image";
import { useLatestDesign } from "@/hooks/use-user-dashboard";

const cardClass = "rounded-2xl p-6 border border-white/08";
const cardStyle = { background: "#0d0b08" };

export default function LatestDesign() {
  const { data: design, isLoading, isError } = useLatestDesign();

  if (isLoading) {
    return (
      <div className={cardClass} style={cardStyle}>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-white/30" />
          <h2 className="text-[16px] font-semibold text-white">Latest Design</h2>
        </div>
        <div className="animate-pulse">
          <div className="w-full aspect-16/10 bg-white/06 rounded-xl mb-4" />
          <div className="h-4 bg-white/06 rounded w-2/3 mb-2" />
          <div className="h-3 bg-white/06 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (isError || !design) {
    return (
      <div className={cardClass} style={cardStyle}>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-white/30" />
          <h2 className="text-[16px] font-semibold text-white">Latest Design</h2>
        </div>
        <p className="text-[14px] text-white/30 text-center py-8">
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
      className={cardClass}
      style={cardStyle}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white/30" />
          <h2 className="text-[16px] font-semibold text-white">Latest Design</h2>
        </div>
        <button className="text-[13px] text-[#D4AF37] font-medium hover:text-[#D4AF37]/80 transition-colors">
          View All
        </button>
      </div>

      {/* Design Preview */}
      <div className="relative w-full aspect-[16/10] bg-[#1a1a1a] rounded-xl overflow-hidden mb-4 group">
        {design.image ? (
          <Image
            src={design.image}
            alt={design.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 9.75h18M3 19.5h18" />
            </svg>
          </div>
        )}

        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-md border border-white/10">
          Generated {design.generatedAt}
        </div>

        {design.downloadable && (
          <button className="absolute top-3 right-3 w-9 h-9 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-black/80 border border-white/10">
            <Download className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Design Info */}
      <div>
        <h3 className="text-[15px] font-semibold text-white mb-1">{design.title}</h3>
        <p className="text-[13px] text-white/40">Style: {design.style}</p>
      </div>
    </motion.div>
  );
}
