// components/dashboard/orders/OrdersFilters.jsx
"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const dateRangeOptions = [
  { value: "last7", label: "Last 7 days" },
  { value: "last30", label: "Last 30 days" },
  { value: "last90", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest amount" },
  { value: "lowest", label: "Lowest amount" },
];

const selectClass =
  "w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-[14px] text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all appearance-none cursor-pointer";

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23999999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 1rem center",
  paddingRight: "2.5rem",
};

export default function OrdersFilters({ filters, setFilters }) {
  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl p-4 md:p-6 border border-white/08"
      style={{ background: "#0d0b08" }}
    >
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            placeholder="Search by order ID or product name..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-[14px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
          />
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[12px] font-medium text-white/30 mb-1.5 uppercase tracking-widest">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className={selectClass}
            style={selectStyle}
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#1a1a1a]">{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-white/30 mb-1.5 uppercase tracking-widest">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            className={selectClass}
            style={selectStyle}
          >
            {dateRangeOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#1a1a1a]">{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-white/30 mb-1.5 uppercase tracking-widest">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className={selectClass}
            style={selectStyle}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#1a1a1a]">{o.label}</option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}
