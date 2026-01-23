"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import FilterSidebar from "@/components/shared/materials/filter-sidebar";
import ActiveFilterTags from "@/components/shared/materials/active-filter-tabs";
import ProductGrid from "@/components/shared/materials/product-grid";
import Pagination from "@/components/shared/materials/pagination";
import { ThumbsUp } from "lucide-react";

export default function FlooringPage() {
  const [activeFilters, setActiveFilters] = useState({
    categories: ["Flooring"],
    materialTypes: [],
    minPrice: 5,
    maxPrice: 80,
  });
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Fetch products using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", activeFilters, sortBy, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        sort: sortBy,
        page: currentPage.toString(),
        limit: "6",
      });

      if (activeFilters.categories?.length > 0) {
        params.append("category", activeFilters.categories.join(","));
      }
      if (activeFilters.materialTypes?.length > 0) {
        params.append("materialType", activeFilters.materialTypes.join(","));
      }
      if (activeFilters.minPrice) {
        params.append("minPrice", activeFilters.minPrice.toString());
      }
      if (activeFilters.maxPrice) {
        params.append("maxPrice", activeFilters.maxPrice.toString());
      }

      const response = await fetch(`/api/flooring?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleRemoveFilter = (filterType, value) => {
    if (filterType === "category") {
      setActiveFilters((prev) => ({
        ...prev,
        categories: prev.categories?.filter((c) => c !== value) || [],
      }));
    } else if (filterType === "materialType") {
      setActiveFilters((prev) => ({
        ...prev,
        materialTypes: prev.materialTypes?.filter((m) => m !== value) || [],
      }));
    }
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setActiveFilters({
      categories: [],
      materialTypes: [],
      minPrice: 5,
      maxPrice: 80,
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 font-manrope">
      {/* Breadcrumb */}
      <div className="bg-white border-y border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/">
              {" "}
              <p className="text-gray-500 hover:text-gray-700">Home</p>
            </Link>

            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <a href="/materials" className="text-gray-500 hover:text-gray-700">
              Materials
            </a>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-gray-900 font-medium">Flooring</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <FilterSidebar
              filters={data?.filters || { categories: [], materialTypes: [] }}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              handleClearAllFilters={handleClearAllFilters}
              handleRemoveFilter={handleRemoveFilter}
              onApplyFilters={() => setCurrentPage(1)}
              sortBy={sortBy}
              setSortBy={setSortBy}
              data={data}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Active Filters & Sort Controls */}
            <div className=" flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 hidden md:flex">
              <div className="flex items-center gap-3 ml-auto">
                <p className="text-gray-600">
                  {data?.pagination?.total || 124} Results
                </p>
                <label className="text-sm text-gray-700">Sort:</label>
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

                {/* View Toggle */}
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
            </div>

            {/* Recommendation Banner */}
            {!isLoading && data?.products?.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shrink-0">
                    <div className="w-6 h-6 bg-transparent border-2 border-primary rounded-full flex items-center justify-center shrink-0">
                      <ThumbsUp
                        className="text-primary "
                        size={12}
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-gray-900">
                      Recommended for You
                    </h3>
                    <p className="text-sm text-gray-600">
                      Based on your recent renovation style quiz
                    </p>
                    <button className="text-sm  text-start font-semibold text-primary hover:text-gray-800 whitespace-nowrap block md:hidden ">
                      View All Recommendations
                    </button>
                  </div>
                </div>
                <button className="text-sm font-medium text-gray-600 hover:text-gray-800 whitespace-nowrap hidden md:block ">
                  View All Recommendations
                </button>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">
                  Failed to load products. Please try again.
                </p>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid
              products={data?.products}
              isLoading={isLoading}
              viewMode={viewMode}
            />

            {/* Pagination */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
