// components/dashboard/saved/SavedItemsFilters.jsx
"use client";

import { motion } from "framer-motion";

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
    >
      {/* Single Row: Category Tabs + Sort */}
      <div className="flex items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
          {categories.map((category) => {
            const count = category.value === "all" ? totalItems : null;

            return (
              <button
                key={category.value}
                onClick={() => handleFilterChange("category", category.value)}
                className={`
                  px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all
                  ${
                    filters.category === category.value
                      ? "bg-primary text-white"
                      : "bg-white text-[#666666] hover:bg-[#f5f5f5]"
                  }
                `}
              >
                {category.label}
                {count !== null && (
                  <span className="ml-1.5 opacity-70">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex-shrink-0">
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="pl-4 pr-10 py-2 bg-white border-none text-[14px] text-[#666666] focus:outline-none cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
              }}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort by: {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
