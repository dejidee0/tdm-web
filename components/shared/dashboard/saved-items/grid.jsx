// components/shared/dashboard/saved-items/grid.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import SavedItemCard from "./card";

const ITEMS_PER_PAGE = 8;

export default function SavedItemsGrid({
  items,
  isLoading,
  isError,
  selectedItems,
  setSelectedItems,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-12 border border-[#e5e5e5] text-center"
      >
        <p className="text-[14px] text-[#999999]">
          Failed to load saved items. Please try again.
        </p>
      </motion.div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-16 border border-[#e5e5e5] text-center"
      >
        <div className="w-14 h-14 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-6 h-6 text-[#cccccc]" />
        </div>
        <p className="text-[16px] font-medium text-[#1a1a1a] mb-2">
          No saved items yet
        </p>
        <p className="text-[14px] text-[#666666]">
          Start saving materials and products for your projects
        </p>
      </motion.div>
    );
  }

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
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
            onClick={() => {
              if (selectedItems.length === items.length) {
                setSelectedItems([]);
              } else {
                setSelectedItems(items.map((i) => i.id));
              }
            }}
            className="text-[13px] text-[#666666] hover:text-primary transition-colors"
          >
            {selectedItems.length === items.length
              ? "Deselect All"
              : `Select All (${items.length})`}
          </button>
          {selectedItems.length > 0 && (
            <span className="text-[13px] text-primary font-medium">
              {selectedItems.length} selected
            </span>
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
              onToggleSelect={(id) => {
                setSelectedItems((prev) =>
                  prev.includes(id)
                    ? prev.filter((itemId) => itemId !== id)
                    : [...prev, id],
                );
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-[#f8f8f8] px-6 py-4 rounded-lg">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`inline-flex items-center gap-2 text-[14px] font-medium transition-colors ${
              currentPage === 1
                ? "text-[#999999] cursor-not-allowed"
                : "text-[#1a1a1a] hover:text-[#666666]"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span key={`ellipsis-${i}`} className="text-[#666666] px-2">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-[14px] font-medium transition-all ${
                    currentPage === page
                      ? "bg-[#1a1a1a] text-white"
                      : "bg-white text-[#666666] hover:bg-[#f0f0f0]"
                  }`}
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
              currentPage === totalPages
                ? "text-[#999999] cursor-not-allowed"
                : "text-[#1a1a1a] hover:text-[#666666]"
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
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
          <div className="aspect-square bg-gray-200 rounded-2xl mb-3" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
          <div className="h-10 bg-gray-200 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
