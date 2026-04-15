// components/shared/dashboard/saved-items/grid.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import SavedItemCard from "./card";

const ITEMS_PER_PAGE = 8;

export default function SavedItemsGrid({ items, isLoading, isError, selectedItems, setSelectedItems }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-12 border border-white/08 text-center"
        style={{ background: "#0d0b08" }}
      >
        <p className="text-[14px] text-white/30">Failed to load saved items. Please try again.</p>
      </motion.div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-16 border border-white/08 text-center"
        style={{ background: "#0d0b08" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <Heart className="w-6 h-6 text-white/20" />
        </div>
        <p className="text-[16px] font-medium text-white mb-2">No saved items yet</p>
        <p className="text-[14px] text-white/40">Start saving materials and products for your projects</p>
      </motion.div>
    );
  }

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-8">
      {/* Select all row */}
      {items.length > 0 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedItems(selectedItems.length === items.length ? [] : items.map((i) => i.id))}
            className="text-[13px] text-white/40 hover:text-[#D4AF37] transition-colors"
          >
            {selectedItems.length === items.length ? "Deselect All" : `Select All (${items.length})`}
          </button>
          {selectedItems.length > 0 && (
            <span className="text-[13px] text-[#D4AF37] font-medium">{selectedItems.length} selected</span>
          )}
        </div>
      )}

      {/* Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {currentItems.map((item, index) => (
            <SavedItemCard
              key={item.id}
              item={item}
              index={index}
              isSelected={selectedItems.includes(item.id)}
              onToggleSelect={(id) =>
                setSelectedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
              }
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between px-6 py-4 rounded-xl border border-white/08"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`inline-flex items-center gap-2 text-[14px] font-medium transition-colors ${
              currentPage === 1 ? "text-white/20 cursor-not-allowed" : "text-white/50 hover:text-white"
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-2">
            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span key={`ellipsis-${i}`} className="text-white/30 px-2">…</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="w-10 h-10 rounded-lg text-[14px] font-medium transition-all text-black"
                  style={
                    currentPage === page
                      ? { background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }
                      : { background: "transparent", color: "rgba(255,255,255,0.40)" }
                  }
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center gap-2 text-[14px] font-medium transition-colors ${
              currentPage === totalPages ? "text-white/20 cursor-not-allowed" : "text-white/50 hover:text-white"
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-white/06 rounded-2xl mb-3" />
          <div className="h-4 bg-white/06 rounded w-3/4 mb-2" />
          <div className="h-3 bg-white/06 rounded w-1/2 mb-3" />
          <div className="h-10 bg-white/06 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
