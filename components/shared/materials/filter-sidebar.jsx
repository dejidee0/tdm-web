"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import ActiveFilterTags from "./active-filter-tabs";

export default function FilterSidebar({
  categories = [],
  activeFilters,
  onFilterChange,
  onApplyFilters,
  handleRemoveFilter,
  handleClearAllFilters,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  totalCount = 0,
}) {
  const [filterTab, setFilterTab] = useState(true);
  const [filterDrop, setFilterDrop] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brandType: false,
    productType: false,
  });

  // ── Staged (local) filters — not committed until Apply is clicked ──────────
  const [stagedFilters, setStagedFilters] = useState(activeFilters);

  // Keep staged in sync if parent resets filters externally (e.g. Clear All)
  useEffect(() => {
    setStagedFilters(activeFilters);
  }, [activeFilters]);

  const hasPendingChanges =
    JSON.stringify(stagedFilters) !== JSON.stringify(activeFilters);

  const toggleSection = (section) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleCategoryChange = (categoryId) => {
    const current = stagedFilters.categoryIds || [];
    const next = current.includes(categoryId)
      ? current.filter((c) => c !== categoryId)
      : [...current, categoryId];
    setStagedFilters((prev) => ({ ...prev, categoryIds: next }));
  };

  const handleBrandTypeChange = (brandType) => {
    const current = stagedFilters.brandTypes || [];
    const next = current.includes(brandType)
      ? current.filter((b) => b !== brandType)
      : [...current, brandType];
    setStagedFilters((prev) => ({ ...prev, brandTypes: next }));
  };

  const handleProductTypeChange = (productType) => {
    const current = stagedFilters.productTypes || [];
    const next = current.includes(productType)
      ? current.filter((p) => p !== productType)
      : [...current, productType];
    setStagedFilters((prev) => ({ ...prev, productTypes: next }));
  };

  const handleApply = () => {
    onFilterChange(stagedFilters);
    onApplyFilters?.();
  };

  const handleClearAll = () => {
    const reset = {
      categoryIds: [],
      brandTypes: [],
      productTypes: [],
      searchTerm: "",
      isFeatured: null,
    };
    setStagedFilters(reset);
    handleClearAllFilters();
  };

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "featured", label: "Featured" },
  ];

  const ViewToggle = () => (
    <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
      <button
        onClick={() => setViewMode("grid")}
        className={`p-1.5 rounded ${viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"}`}
        aria-label="Grid view"
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
        className={`p-1.5 rounded ${viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}
        aria-label="List view"
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
  );

  const brandTypeLabels = { 1: "TBM", 2: "Bogat" };
  const productTypeLabels = { 1: "Physical Product", 2: "Service" };

  const FilterContent = () => (
    <>
      <div className="flex flex-col gap-2 py-2">
        <p className="text-gray-600">{totalCount} Results</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {activeFilters.categoryIds?.length > 0
            ? categories
                .filter((c) => activeFilters.categoryIds.includes(c.id))
                .map((c) => c.name)
                .join(", ")
            : "All Materials"}
        </h1>
        <ActiveFilterTags
          activeFilters={activeFilters}
          categories={categories}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
        />
      </div>

      {/* Category */}
      <div className="border-b border-gray-200 pb-4 mb-4 mt-3">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="font-medium text-gray-900">Category</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${expandedSections.category ? "rotate-180" : ""}`}
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
            {categories.length === 0 && (
              <p className="text-sm text-gray-400">Loading categories…</p>
            )}
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      stagedFilters.categoryIds?.includes(cat.id) || false
                    }
                    onChange={() => handleCategoryChange(cat.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {cat.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Type */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection("brandType")}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="font-medium text-gray-900">Brand</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${expandedSections.brandType ? "rotate-180" : ""}`}
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
        {expandedSections.brandType && (
          <div className="space-y-2">
            {[1, 2].map((bt) => (
              <label
                key={bt}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={stagedFilters.brandTypes?.includes(bt) || false}
                  onChange={() => handleBrandTypeChange(bt)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {brandTypeLabels[bt]}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Product Type */}
      <div className="pb-4 mb-4">
        <button
          onClick={() => toggleSection("productType")}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="font-medium text-gray-900">Product Type</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${expandedSections.productType ? "rotate-180" : ""}`}
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
        {expandedSections.productType && (
          <div className="space-y-2">
            {[1, 2].map((pt) => (
              <label
                key={pt}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={stagedFilters.productTypes?.includes(pt) || false}
                  onChange={() => handleProductTypeChange(pt)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {productTypeLabels[pt]}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Apply Button — pulses when there are pending changes */}
      <button
        onClick={handleApply}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
          hasPendingChanges
            ? "bg-primary text-white shadow-md"
            : "bg-primary text-white opacity-60 cursor-default"
        }`}
      >
        {hasPendingChanges ? "Apply Filters" : "Filters Applied"}
      </button>
    </>
  );

  return (
    <div className="w-full">
      {/* Mobile Controls */}
      <div className="flex items-center gap-2 justify-evenly mb-6 md:hidden">
        <div
          className="bg-primary rounded-lg px-4 py-1.5 flex-1 cursor-pointer"
          onClick={() => {
            setFilterDrop((p) => !p);
            setFilterTab(false);
          }}
        >
          <h3 className="text-lg font-semibold text-white">Filters</h3>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ViewToggle />
      </div>

      {/* Desktop Header */}
      <div className="items-center justify-between mb-6 hidden md:flex">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => {
            setFilterTab((p) => !p);
            setFilterDrop(false);
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

      {(filterTab || filterDrop) && <FilterContent />}

      {/* Sustainable Card */}
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
