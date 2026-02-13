// components/dashboard/saved/SavedItemsGrid.jsx (or grid.jsx based on your structure)
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import SavedItemCard from "./card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SavedItemsGrid({
  items,
  isLoading,
  isError,
  selectedItems,
  setSelectedItems,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

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
        className="bg-white rounded-2xl p-12 border border-[#e5e5e5] text-center"
      >
        <p className="text-[16px] font-medium text-[#1a1a1a] mb-2">
          No saved items yet
        </p>
        <p className="text-[14px] text-[#666666]">
          Start saving materials, products, and inspiration for your projects
        </p>
      </motion.div>
    );
  }

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      {/* Items Grid */}
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

      {/* Pagination - Matches Figma Design */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-[#f8f8f8] px-6 py-4 rounded-lg">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {/* First Page */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`
                w-10 h-10 rounded-lg text-[14px] font-medium transition-all
                ${
                  currentPage === 1
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-white text-[#666666] hover:bg-[#f0f0f0]"
                }
              `}
            >
              1
            </button>

            {/* Second Page */}
            {totalPages >= 2 && (
              <button
                onClick={() => setCurrentPage(2)}
                className={`
                  w-10 h-10 rounded-lg text-[14px] font-medium transition-all
                  ${
                    currentPage === 2
                      ? "bg-[#1a1a1a] text-white"
                      : "bg-white text-[#666666] hover:bg-[#f0f0f0]"
                  }
                `}
              >
                2
              </button>
            )}

            {/* Third Page */}
            {totalPages >= 3 && (
              <button
                onClick={() => setCurrentPage(3)}
                className={`
                  w-10 h-10 rounded-lg text-[14px] font-medium transition-all
                  ${
                    currentPage === 3
                      ? "bg-[#1a1a1a] text-white"
                      : "bg-white text-[#666666] hover:bg-[#f0f0f0]"
                  }
                `}
              >
                3
              </button>
            )}

            {/* Ellipsis if more than 5 pages */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="text-[#666666] px-2">...</span>
            )}

            {/* Last Page (if more than 3 pages) */}
            {totalPages > 3 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`
                  w-10 h-10 rounded-lg text-[14px] font-medium transition-all
                  ${
                    currentPage === totalPages
                      ? "bg-[#1a1a1a] text-white"
                      : "bg-white text-[#666666] hover:bg-[#f0f0f0]"
                  }
                `}
              >
                {totalPages}
              </button>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
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
          <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
