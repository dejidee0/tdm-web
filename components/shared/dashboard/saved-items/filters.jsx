// components/shared/dashboard/saved-items/filters.jsx
"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

const categories = [
  { value: "all", label: "All Items" },
  { value: "materials", label: "Materials" },
  { value: "furniture", label: "Furniture" },
  { value: "inspiration", label: "Inspiration" },
];

const sortOptions = [
  { value: "date-added", label: "Date Added" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "alphabetical", label: "A-Z" },
];

export default function SavedItemsFilters({ filters, setFilters, totalItems }) {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-3"
    >
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
        <input
          type="text"
          placeholder="Search saved items…"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
        />
      </div>

      {/* Category Tabs + Sort */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleFilterChange("category", category.value)}
              className="px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all"
              style={
                filters.category === category.value
                  ? { background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)", color: "#000" }
                  : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.50)" }
              }
            >
              {category.label}
              {category.value === "all" && (
                <span className="ml-1.5 opacity-60">{totalItems}</span>
              )}
            </button>
          ))}
        </div>

        <div className="shrink-0">
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="pl-4 pr-10 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[14px] text-white/60 focus:outline-none cursor-pointer appearance-none transition-all"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23999999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
            }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#1a1a1a]">
                Sort by: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}
