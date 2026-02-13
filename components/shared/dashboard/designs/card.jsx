// components/dashboard/designs/card.jsx
"use client";

import { motion } from "framer-motion";
import {
  Heart,
  MoreVertical,
  Download,
  Share2,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  useToggleFavorite,
  useDeleteDesign,
  useDownloadDesign,
  useShareDesign,
} from "@/hooks/use-designs";

export default function DesignCard({ design, index, isList = false }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef(null);

  const toggleFavorite = useToggleFavorite();
  const deleteDesign = useDeleteDesign();
  const downloadDesign = useDownloadDesign();
  const shareDesign = useShareDesign();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMenu]);

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite.mutate(design.id);
  };

  const handleDownload = () => {
    downloadDesign.mutate({
      designId: design.id,
      quality: design.isHighRes ? "high" : "standard",
    });
    setShowMenu(false);
  };

  const handleShare = () => {
    shareDesign.mutate(design.id, {
      onSuccess: (data) => {
        navigator.clipboard.writeText(data.shareUrl);
        // Could add a toast notification here
      },
    });
    setShowMenu(false);
  };

  const handleDelete = () => {
    deleteDesign.mutate(design.id);
    setShowMenu(false);
    setShowDeleteConfirm(false);
  };

  if (isList) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white rounded-xl border border-[#e5e5e5] p-4 hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          {/* Image */}
          <div className="relative w-28 h-24 shrink-0 bg-[#f5f5f5] rounded-lg overflow-hidden">
            <Image
              src={design.image}
              alt={design.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="112px"
            />
            {design.isHighRes && (
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded">
                HIGH RES
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-[#1a1a1a] mb-1 truncate">
              {design.title}
            </h3>
            <div className="flex items-center gap-2 text-[13px] text-[#666666]">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <span>{design.room}</span>
            </div>
            <p className="text-[12px] text-[#999999] mt-1">
              {design.createdAt}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavorite}
              className="p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${design.isFavorite ? "fill-[#ef4444] text-[#ef4444]" : "text-[#999999]"}`}
              />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
            >
              <Download className="w-5 h-5 text-[#999999]" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5 text-[#999999]" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-[#f5f5f5] overflow-hidden">
        <Image
          src={design.image}
          alt={design.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        {/* High Res Badge */}
        {design.isHighRes && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
            HIGH RES
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${design.isFavorite ? "fill-[#ef4444] text-[#ef4444]" : "text-[#666666]"}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 relative">
        {/* Title and Menu */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-[15px] font-semibold text-[#1a1a1a] line-clamp-1 flex-1 pr-2">
            {design.title}
          </h3>

          {/* More Menu */}
          <div className="relative z-10" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-[#f5f5f5] rounded-md transition-colors flex-shrink-0"
            >
              <MoreVertical className="w-5 h-5 text-[#666666]" />
            </button>

            {/* Dropdown Menu - Fixed positioning to prevent cutoff */}
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-[#e5e5e5] py-1 z-50"
              >
                <button
                  onClick={() => {
                    // Edit functionality
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-[14px] text-[#1a1a1a] hover:bg-[#f5f5f5] flex items-center gap-3 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-2.5 text-left text-[14px] text-[#1a1a1a] hover:bg-[#f5f5f5] flex items-center gap-3 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-2.5 text-left text-[14px] text-[#1a1a1a] hover:bg-[#f5f5f5] flex items-center gap-3 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <div className="h-px bg-[#e5e5e5] my-1" />
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-[14px] text-[#ef4444] hover:bg-[#fef2f2] flex items-center gap-3 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Room Info */}
        <div className="flex items-center gap-2 text-[13px] text-[#666666] mb-3">
          <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
          <span>{design.room}</span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#e5e5e5]">
          <span className="text-[12px] text-[#999999]">{design.createdAt}</span>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="p-1.5 hover:bg-[#f5f5f5] rounded-md transition-colors"
              aria-label="Download"
            >
              <Download className="w-4 h-4 text-[#666666]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="p-1.5 hover:bg-[#f5f5f5] rounded-md transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4 text-[#666666]" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[18px] font-semibold text-[#1a1a1a] mb-2">
              Delete Design?
            </h3>
            <p className="text-[14px] text-[#666666] mb-6">
              This action cannot be undone. The design will be permanently
              removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-[#f5f5f5] text-[#1a1a1a] rounded-lg text-[14px] font-medium hover:bg-[#e5e5e5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-[#ef4444] text-white rounded-lg text-[14px] font-medium hover:bg-[#dc2626] transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
