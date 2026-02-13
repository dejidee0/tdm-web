// components/dashboard/designs/DesignsFilters.jsx
"use client";

import { motion } from "framer-motion";
import { Grid3x3, List } from "lucide-react";

const roomTypes = [
  { value: "all", label: "All Designs" },
  { value: "living-room", label: "Living Room" },
  { value: "kitchen", label: "Kitchen" },
  { value: "bedroom", label: "Bedroom" },
  { value: "bathroom", label: "Bathroom" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "alphabetical", label: "A-Z" },
  { value: "favorites", label: "Favorites First" },
];

export default function DesignsFilters({ filters, setFilters }) {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Single Row: Room Type Tabs + Sort + View Toggle */}
      <div className="flex items-center justify-between gap-4">
        {/* Room Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
          {roomTypes.map((room) => (
            <button
              key={room.value}
              onClick={() => handleFilterChange("roomType", room.value)}
              className={`
                px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all
                ${
                  filters.roomType === room.value
                    ? "bg-primary text-white"
                    : "bg-white text-[#666666] hover:bg-[#f5f5f5]"
                }
              `}
            >
              {room.label}
            </button>
          ))}
        </div>

        {/* Sort and View Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Sort Dropdown */}
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

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white rounded-lg border border-[#e5e5e5] p-1">
            <button
              onClick={() => handleFilterChange("view", "grid")}
              className={`
                p-1.5 rounded transition-all
                ${
                  filters.view === "grid"
                    ? "bg-[#f5f5f5]"
                    : "hover:bg-[#f5f5f5]/50"
                }
              `}
              aria-label="Grid view"
            >
              <Grid3x3
                className={`w-[18px] h-[18px] ${
                  filters.view === "grid" ? "text-primary" : "text-[#999999]"
                }`}
              />
            </button>
            <button
              onClick={() => handleFilterChange("view", "list")}
              className={`
                p-1.5 rounded transition-all
                ${
                  filters.view === "list"
                    ? "bg-[#f5f5f5]"
                    : "hover:bg-[#f5f5f5]/50"
                }
              `}
              aria-label="List view"
            >
              <List
                className={`w-[18px] h-[18px] ${
                  filters.view === "list" ? "text-primary" : "text-[#999999]"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
