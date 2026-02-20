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
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-[#E5E7EB]">
      {/* Results info */}
      <p className="font-manrope text-[13px] text-[#64748B]">
        Showing <span className="font-bold text-primary">1</span> to{" "}
        <span className="font-bold text-primary">5</span> of{" "}
        <span className="font-bold text-primary">128</span> results
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
            border border-[#E5E7EB]
            ${
              currentPage === 1
                ? "bg-[#F8FAFC] text-[#CBD5E1] cursor-not-allowed"
                : "bg-white text-[#64748B] hover:bg-[#F8FAFC]"
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
                className="w-9 h-9 flex items-center justify-center font-manrope text-[13px] text-[#64748B]"
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
                    ? "bg-primary text-white"
                    : "bg-white text-[#64748B] border border-[#E5E7EB] hover:bg-[#F8FAFC]"
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
            border border-[#E5E7EB]
            ${
              currentPage === totalPages
                ? "bg-[#F8FAFC] text-[#CBD5E1] cursor-not-allowed"
                : "bg-white text-[#64748B] hover:bg-[#F8FAFC]"
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
