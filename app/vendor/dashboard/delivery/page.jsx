"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Download, RefreshCw, Package } from "lucide-react";
import { useDeliveryAssignments } from "@/hooks/use-delivery";
import DeliveryAssignmentsTable from "@/components/shared/vendor/dashboard/delivery/table";

export default function DeliveryPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 6,
    search: "",
    status: "all",
    dateRange: null,
  });

  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useDeliveryAssignments(filters);

  // DATA CHECKS
  // console.log("delivery assignments: ", data)

  const handleSearch = (value) => {
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="max-w-360 mx-auto bg-background">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-start justify-between mb-2">
          <div>
            <h1 className="font-manrope text-[32px] font-bold text-white mb-2">
              Delivery Assignment
            </h1>
            <p className="font-manrope text-[14px] text-muted">
              Manage vendor assignments and tracking for pending orders.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-2 md:px-4 py-0.5 md:py-2.5 bg-surface-raised border border-white/10 rounded-lg font-manrope text-[13px] font-medium text-white hover:bg-white/05 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-2 md:px-4 py-0.5 md:py-2.5 bg-surface-raised border border-white/10 rounded-lg font-manrope text-[13px] font-medium text-white hover:bg-white/05 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-2 md:px-4 py-0.5 md:py-2.5 bg-accent-solid text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-white/10 transition-colors"
            >
              <Package size={16} />
              Bulk Assign
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-surface rounded-xl border border-white/08"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <label className="block font-manrope text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
              SEARCH
            </label>
            <Search
              className="absolute left-3 bottom-3 text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Order ID or Customer Name..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-raised border border-white/10 rounded-lg font-manrope text-[13px] text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block font-manrope text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
              STATUS
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value,
                  page: 1,
                }))
              }
              className="w-full px-4 py-2.5 bg-surface-raised border border-white/10 rounded-lg font-manrope text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-accent/40 appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="picked up">Picked Up</option>
              <option value="in transit">In Transit</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block font-manrope text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
              DATE RANGE
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                size={18}
              />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-raised border border-white/10 rounded-lg font-manrope text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer"
                placeholder="mm/dd/yyyy"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Assignments Table */}
      <DeliveryAssignmentsTable
        assignments={data?.assignments}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {data?.pagination && data.assignments?.length > 0 && (
        <div className="mt-6 bg-surface rounded-xl border border-white/08">
          <div className="flex items-center justify-between px-6 py-4">
            <p className="font-manrope text-[13px] text-muted">
              Showing{" "}
              <span className="font-bold text-white">
                {(data.pagination.page - 1) * data.pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-white">
                {Math.min(
                  data.pagination.page * data.pagination.limit,
                  data.pagination.total,
                )}
              </span>{" "}
              of{" "}
              <span className="font-bold text-white">
                {data.pagination.total}
              </span>{" "}
              results
            </p>

            <div className="flex items-center gap-2">
              {/* Previous button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(data.pagination.page - 1)}
                disabled={data.pagination.page === 1}
                className={`
                  px-4 py-2 rounded-lg font-manrope text-[13px] font-medium
                  border border-white/08
                  ${
                    data.pagination.page === 1
                      ? "bg-white/05 text-accent cursor-not-allowed"
                      : "bg-surface-raised text-muted hover:bg-white/05"
                  }
                  transition-colors
                `}
              >
                ‹
              </motion.button>

              {/* Page numbers */}
              {[...Array(Math.min(data.pagination.totalPages, 5))].map(
                (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(pageNum)}
                      className={`
                      w-9 h-9 rounded-lg flex items-center justify-center
                      font-manrope text-[13px] font-medium
                      transition-colors
                      ${
                        data.pagination.page === pageNum
                          ? "bg-accent-solid text-white"
                          : "bg-surface-raised text-muted border border-white/08 hover:bg-white/05"
                      }
                    `}
                    >
                      {pageNum}
                    </motion.button>
                  );
                },
              )}

              {/* Next button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(data.pagination.page + 1)}
                disabled={data.pagination.page === data.pagination.totalPages}
                className={`
                  px-4 py-2 rounded-lg font-manrope text-[13px] font-medium
                  border border-white/08
                  ${
                    data.pagination.page === data.pagination.totalPages
                      ? "bg-white/05 text-accent cursor-not-allowed"
                      : "bg-surface-raised text-muted hover:bg-white/05"
                  }
                  transition-colors
                `}
              >
                ›
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
