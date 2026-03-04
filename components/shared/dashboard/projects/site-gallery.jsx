"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Download,
  Upload,
  ExternalLink,
  ChevronDown,
  User,
} from "lucide-react";

const FILTERS = [
  "All Photos",
  "Recent",
  "Kitchen",
  "Living Room",
  "Master Bedroom",
  "Exterior",
];

const PHOTOS = [
  {
    id: 1,
    tag: "KITCHEN",
    title: "Island Countertop",
    date: "Oct 24, 2023",
    description:
      "View of the newly installed marble island countertop and plumbing rough-ins.",
    uploader: "Mike R.",
    bg: "linear-gradient(135deg, #c8cdd4 0%, #a8b5be 100%)",
    category: "Kitchen",
  },
  {
    id: 2,
    tag: "LIVING ROOM",
    title: "Flooring Layout",
    date: "Oct 23, 2023",
    description:
      "Wide-plank oak flooring being acclimated and laid out for the main living area.",
    uploader: "Sarah J.",
    bg: "linear-gradient(135deg, #d4c9b8 0%, #bfb09c 100%)",
    category: "Living Room",
  },
  {
    id: 3,
    tag: "KITCHEN",
    title: "Cabinet Mounting",
    date: "Oct 22, 2023",
    description:
      "Upper wall units mounted. Custom molding for the ceiling transition started.",
    uploader: "Mike R.",
    bg: "linear-gradient(135deg, #e8dcc8 0%, #d4c4a8 100%)",
    category: "Kitchen",
  },
  {
    id: 4,
    tag: "EXTERIOR",
    title: "Patio Grading",
    date: "Oct 21, 2023",
    description:
      "Final grading for the patio extension and pool deck foundation is complete.",
    uploader: "Contractor Lee",
    bg: "linear-gradient(135deg, #5a7a5a 0%, #3a5a3a 100%)",
    category: "Exterior",
  },
  {
    id: 5,
    tag: "MASTER SUITE",
    title: "Primary Bedroom Paint",
    date: "Oct 20, 2023",
    description:
      "Second coat of 'Calm Gray' applied. Large bay windows cleaned after exterior sealing.",
    uploader: "Sarah J.",
    bg: "linear-gradient(135deg, #d8d4cf 0%, #c4bfba 100%)",
    category: "Master Bedroom",
  },
  {
    id: 6,
    tag: "ENTRYWAY",
    title: "Main Entrance Door",
    date: "Oct 19, 2023",
    description:
      "Solid mahogany pivot door installed and weather-sealed. Hardware installation pending.",
    uploader: "Mike R.",
    bg: "linear-gradient(135deg, #d4c4a0 0%, #c8b48a 100%)",
    category: "Exterior",
  },
];

function PhotoCard({ photo, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 group"
    >
      {/* Image area */}
      <div
        className="relative h-[180px] overflow-hidden"
        style={{ background: photo.bg }}
      >
        {/* Tag */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="text-[10px] font-bold tracking-wider text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
            {photo.tag}
          </span>
        </div>
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[13.5px] font-bold text-[#1a2340]">
            {photo.title}
          </h3>
          <span className="text-[11.5px] text-gray-400">{photo.date}</span>
        </div>
        <p className="text-[11.5px] text-gray-500 leading-relaxed mb-3">
          {photo.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <User className="w-3 h-3" />
            <span>Uploaded by {photo.uploader}</span>
          </div>
          <button className="flex items-center gap-1 text-[11.5px] font-semibold text-[#1a2340] hover:text-blue-700 transition-colors">
            View Full Screen
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function SiteGallery() {
  const [activeFilter, setActiveFilter] = useState("All Photos");

  const filtered =
    activeFilter === "All Photos"
      ? PHOTOS
      : PHOTOS.filter((p) => {
          if (activeFilter === "Kitchen") return p.category === "Kitchen";
          if (activeFilter === "Living Room")
            return p.category === "Living Room";
          if (activeFilter === "Master Bedroom")
            return p.category === "Master Bedroom";
          if (activeFilter === "Exterior") return p.category === "Exterior";
          return true;
        });

  return (
    <div className="min-h-screen bg-[#f4f5f7] p-6 md:p-8">
      <div className="max-w-[720px] mx-auto space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <h1 className="text-[26px] font-bold text-[#1a2340] leading-tight">
              Site Gallery
            </h1>
            <p className="text-[13px] text-gray-500 mt-1 max-w-[280px] leading-relaxed">
              Track real-time construction progress and interior finishes
              through high-quality visual documentation.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 mt-1">
            <button className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1a2340] border border-gray-300 bg-white px-3.5 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export All
            </button>
            <button className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-[#1a2340] px-3.5 py-2 rounded-lg hover:bg-[#222d52] transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Upload Photos
            </button>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex items-center gap-2 flex-wrap"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-[12.5px] font-semibold px-3.5 py-1.5 rounded-full transition-all ${
                activeFilter === filter
                  ? "bg-[#1a2340] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Photo Grid */}
        <div className="grid grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((photo, index) => (
              <PhotoCard key={photo.id} photo={photo} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.4 }}
          className="flex justify-center"
        >
          <button className="flex items-center gap-2 text-[13px] font-semibold text-[#1a2340] bg-white border border-gray-200 px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            Load More Photos
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
