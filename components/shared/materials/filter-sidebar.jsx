"use client";

import { useState } from "react";
import ActiveFilterTags from "./active-filter-tabs";
import { SlidersHorizontal, X } from "lucide-react";

export default function FilterSidebar({
  filters,
  activeFilters,
  onFilterChange,
  onApplyFilters,
  handleRemoveFilter,
  handleClearAllFilters,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  data,
}) {
  const [priceRange, setPriceRange] = useState([5, 80]);
  const [filterTab, setFilterTab] = useState(true);
  const [filterDrop, setFilterDrop] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    materialType: false,
    priceRange: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category) => {
    const newCategories = activeFilters.categories?.includes(category)
      ? activeFilters.categories.filter((c) => c !== category)
      : [...(activeFilters.categories || []), category];

    onFilterChange({ ...activeFilters, categories: newCategories });
  };

  const handleMaterialTypeChange = (materialType) => {
    const newMaterialTypes = activeFilters.materialTypes?.includes(materialType)
      ? activeFilters.materialTypes.filter((m) => m !== materialType)
      : [...(activeFilters.materialTypes || []), materialType];

    onFilterChange({ ...activeFilters, materialTypes: newMaterialTypes });
  };

  const handlePriceRangeChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
    onFilterChange({
      ...activeFilters,
      minPrice: newRange[0],
      maxPrice: newRange[1],
    });
  };

  const clearAll = () => {
    onFilterChange({});
    setPriceRange([5, 80]);
  };

  return (
    <div className="w-full">
      <div className="flex items-center flex-1  gap-2 justify-evenly mb-6 md:hidden">
        <div
          className="bg-primary rounded-lg px-4 py-1.5 flex-1"
          onClick={() => {
            setFilterDrop((prev) => !prev);
            setFilterTab(false); // Close desktop
          }}
        >
          {" "}
          <h3 className="text-lg font-semibold text-white  ">Filters</h3>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
        <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded ${
              viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded ${
              viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Desktop Header */}
      <div className="items-center justify-between mb-6 hidden md:flex">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => {
            setFilterTab((prev) => !prev);
            setFilterDrop(false); // Close mobile
          }}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          {filterTab ? (
            <X className="w-4 h-4" />
          ) : (
            <SlidersHorizontal className="w-4 h-4" />
          )}
        </button>
      </div>
      {(filterTab || filterDrop) && (
        <>
          <div className="flex flex-col gap-2 py-2">
            <p className="text-gray-600">
              {data?.pagination?.total || 0} Results
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {activeFilters.categories?.length > 0
                ? activeFilters.categories.join(", ")
                : "All Materials"}
            </h1>
            <ActiveFilterTags
              activeFilters={activeFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          </div>
          {/* Category Filter */}
          <div className="border-b border-gray-200 pb-4 mb-4 mt-3">
            <button
              onClick={() => toggleSection("category")}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="font-medium text-gray-900">Category</span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  expandedSections.category ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedSections.category && (
              <div className="space-y-2">
                {filters.categories?.map((category) => (
                  <label
                    key={category}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          activeFilters.categories?.includes(category) || false
                        }
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {category}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">85</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Material Type Filter */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <button
              onClick={() => toggleSection("materialType")}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="font-medium text-gray-900">Material Type</span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  expandedSections.materialType ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedSections.materialType && (
              <div className="space-y-2">
                {filters.materialTypes?.map((materialType) => (
                  <label
                    key={materialType}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={
                        activeFilters.materialTypes?.includes(materialType) ||
                        false
                      }
                      onChange={() => handleMaterialTypeChange(materialType)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {materialType.split("_").join(" ")}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="pb-4 mb-4">
            <button
              onClick={() => toggleSection("priceRange")}
              className="flex items-center justify-between w-full mb-3"
            >
              <span className="font-medium text-gray-900">Price Range</span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  expandedSections.priceRange ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedSections.priceRange && (
              <div className="space-y-4">
                <div className="relative pt-2">
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, 0)}
                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-10"
                    style={{
                      background: "transparent",
                    }}
                  />
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, 1)}
                    className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none"
                  />
                  <div
                    className="absolute h-2 bg-primary rounded-lg pointer-events-none"
                    style={{
                      left: `${((priceRange[0] - 5) / 75) * 100}%`,
                      right: `${100 - ((priceRange[1] - 5) / 75) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">${priceRange[0]}</span>
                  <span className="text-gray-700">${priceRange[1]}</span>
                </div>
              </div>
            )}
          </div>

          {/* Apply Filters Button */}
          <button
            onClick={onApplyFilters}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-[#0f172a] transition-colors"
          >
            Apply Filters
          </button>
        </>
      )}

      {/* Sustainable Choice Card */}
      <div className="mt-6 bg-primary text-white p-6 rounded-lg hidden md:block">
        <h4 className="font-semibold mb-2">Sustainable Choice</h4>
        <p className="text-sm text-gray-300 mb-4">
          Browse our collection of Eco-Friendly materials
        </p>
        <button className="text-sm font-medium hover:underline flex items-center gap-1">
          View Collection →
        </button>
      </div>
    </div>
  );
}
