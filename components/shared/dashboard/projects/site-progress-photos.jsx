"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MOCK_PHOTOS = [
  {
    id: 1,
    title: "Main Living Area Framing",
    subtitle: "Updated 2 days ago · Site A",
    src: "/site-progress1.svg",
    placeholder: "#4a7c6a",
  },
  {
    id: 2,
    title: "Kitchen Material Selection",
    subtitle: "Updated Oct 24 · Site B",
    src: "/site-progress2.svg",
    placeholder: "#3d5a6e",
  },
];

export default function SiteProgressPhotos({ photos, isLoading, projectId }) {
  const [view, setView] = useState("grid");
  const router = useRouter();
  const items = photos ?? MOCK_PHOTOS;

  const handleViewAll = () => {
    if (projectId) {
      router.push(`/dashboard/projects/${projectId}/gallery`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-[15px]">⊕</span>
          <h2 className="text-[15px] font-bold text-text-black">
            Site Progress Photos
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-gray-100 text-text-black" : "text-gray-400 hover:text-gray-600"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-gray-100 text-text-black" : "text-gray-400 hover:text-gray-600"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Photos grid */}
      <div className="p-5">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="animate-pulse aspect-[4/3] bg-gray-200 rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div
            className={view === "grid" ? "grid grid-cols-2 gap-4" : "space-y-3"}
          >
            {items.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.25 + index * 0.08 }}
                className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                  view === "grid"
                    ? "aspect-[4/3]"
                    : "flex items-center gap-4 h-24"
                }`}
              >
                {/* Placeholder colored bg */}
                <div
                  className={`${view === "grid" ? "absolute inset-0" : "w-32 h-full shrink-0 rounded-xl overflow-hidden relative"}`}
                  style={{ backgroundColor: photo.placeholder }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Overlay + caption */}
                <div
                  className={`${
                    view === "grid"
                      ? "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3"
                      : "flex-1 min-w-0"
                  }`}
                >
                  <p
                    className={`text-[13px] font-semibold ${view === "grid" ? "text-white" : "text-text-black"}`}
                  >
                    {photo.title}
                  </p>
                  <p
                    className={`text-[11px] mt-0.5 ${view === "grid" ? "text-white/70" : "text-gray-400"}`}
                  >
                    {photo.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View all */}
        <button
          onClick={handleViewAll}
          className="w-full mt-4 py-3 text-[13px] font-semibold text-gray-500 hover:text-text-black border-t border-gray-100 transition-colors"
        >
          View All {photos?.length ?? 24} Site Photos
        </button>
      </div>
    </motion.div>
  );
}
