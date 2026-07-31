"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        pages.push(2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        // In the middle
        pages.push(
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-surface border-t border-white/08">
      {/* Results info */}
      <p className="font-manrope text-[13px] text-muted">
        Showing <span className="font-bold text-white">1</span> to{" "}
        <span className="font-bold text-white">5</span> of{" "}
        <span className="font-bold text-white">128</span> results
      </p>

      {/* Page numbers */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            w-9 h-9 rounded-lg flex items-center justify-center
            border border-white/08
            ${
              currentPage === 1
                ? "bg-white/05 text-accent cursor-not-allowed"
                : "bg-surface-raised text-muted hover:bg-white/05"
            }
            transition-colors
          `}
        >
          <ChevronLeft size={18} />
        </motion.button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-9 h-9 flex items-center justify-center font-manrope text-[13px] text-muted"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page)}
              className={`
                w-9 h-9 rounded-lg flex items-center justify-center
                font-manrope text-[13px] font-medium
                transition-colors
                ${
                  isActive
                    ? "bg-accent-solid text-white"
                    : "bg-surface-raised text-muted border border-white/08 hover:bg-white/05"
                }
              `}
            >
              {page}
            </motion.button>
          );
        })}

        {/* Next button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            w-9 h-9 rounded-lg flex items-center justify-center
            border border-white/08
            ${
              currentPage === totalPages
                ? "bg-white/05 text-accent cursor-not-allowed"
                : "bg-surface-raised text-muted hover:bg-white/05"
            }
            transition-colors
          `}
        >
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}
