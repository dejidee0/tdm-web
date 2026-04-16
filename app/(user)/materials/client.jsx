"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FilterSidebar from "@/components/shared/materials/filter-sidebar";
import ProductGrid from "@/components/shared/materials/product-grid";
import Pagination from "@/components/shared/materials/pagination";
import { productKeys } from "@/hooks/use-products";

// ─── Sort helper (client-side, price sorts now just UI order fallback) ────────
function sortItems(items = [], sortBy) {
  const arr = [...items];
  switch (sortBy) {
    case "price-low":
      return arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case "price-high":
      return arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case "featured":
      return arr.sort(
        (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0),
      );
    case "popular":
    default:
      return arr;
  }
}

// ─── API Fetcher ──────────────────────────────────────────────────────────────
async function fetchProducts(filters, page, pageSize = 12) {
  const params = new URLSearchParams();
  params.set("pageNumber", String(page));
  params.set("pageSize", String(pageSize));
  params.set("ActiveOnly", "true");

  if (filters.categoryIds?.length === 1)
    params.set("categoryId", filters.categoryIds[0]);
  if (filters.brandTypes?.length === 1)
    params.set("brandType", String(filters.brandTypes[0]));
  if (filters.productTypes?.length === 1)
    params.set("productType", String(filters.productTypes[0]));
  if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);

  // ── Server-side filters (previously client-side or missing) ──────────────
  if (filters.isFeatured != null)
    params.set("isFeatured", String(filters.isFeatured));
  if (filters.minPrice != null)
    params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null)
    params.set("maxPrice", String(filters.maxPrice));

  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);
  const json = await res.json();

  return {
    items: json.data?.items ?? [],
    totalCount: json.data?.totalCount ?? 0,
    pageNumber: json.data?.pageNumber ?? page,
    pageSize: json.data?.pageSize ?? pageSize,
    totalPages: json.data?.totalPages ?? 1,
    hasPreviousPage: json.data?.hasPreviousPage ?? false,
    hasNextPage: json.data?.hasNextPage ?? false,
  };
}

// ─── Derive categories from items ────────────────────────────────────────────
function extractCategories(items = []) {
  const map = new Map();
  items.forEach((item) => {
    if (item.categoryId && item.categoryName && !map.has(item.categoryId)) {
      map.set(item.categoryId, {
        id: item.categoryId,
        name: item.categoryName,
      });
    }
  });
  return Array.from(map.values());
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MaterialsClient({ initialData }) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [activeFilters, setActiveFilters] = useState({
    categoryIds: [],
    brandTypes: [],
    productTypes: [],
    searchTerm: searchParams.get("search") || "",
    isFeatured: null,
    minPrice: null,
    maxPrice: null,
  });
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const PAGE_SIZE = 12;

  // ── Seed cache with SSR data ─────────────────────────────────────────────
  useEffect(() => {
    if (initialData) {
      queryClient.setQueryData(
        productKeys.list({ filters: activeFilters, page: 1 }),
        {
          items: initialData.items ?? [],
          totalCount: initialData.totalCount ?? 0,
          pageNumber: initialData.pageNumber ?? 1,
          pageSize: initialData.pageSize ?? PAGE_SIZE,
          totalPages: initialData.totalPages ?? 1,
          hasPreviousPage: initialData.hasPreviousPage ?? false,
          hasNextPage: initialData.hasNextPage ?? false,
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Main Query ────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: productKeys.list({ filters: activeFilters, page: currentPage }),
    queryFn: () => fetchProducts(activeFilters, currentPage, PAGE_SIZE),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });

  // ── Apply client-side sort to fetched items ───────────────────────────────
  const sortedItems = useMemo(
    () => sortItems(data?.items, sortBy),
    [data?.items, sortBy],
  );

  // ── Prefetch next page ────────────────────────────────────────────────────
  useEffect(() => {
    if (data?.hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: productKeys.list({
          filters: activeFilters,
          page: currentPage + 1,
        }),
        queryFn: () => fetchProducts(activeFilters, currentPage + 1, PAGE_SIZE),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [data, activeFilters, currentPage, queryClient]);

  // ── Categories derived from a wide fetch ─────────────────────────────────
  const { data: allItemsData } = useQuery({
    queryKey: ["products", "all-for-categories"],
    queryFn: () => fetchProducts({}, 1, 100),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const categories = extractCategories(allItemsData?.items);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFilterChange = useCallback((newFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleRemoveFilter = useCallback((filterType, value) => {
    setActiveFilters((prev) => {
      if (filterType === "categoryId")
        return {
          ...prev,
          categoryIds: prev.categoryIds.filter((c) => c !== value),
        };
      if (filterType === "brandType")
        return {
          ...prev,
          brandTypes: prev.brandTypes.filter((b) => b !== value),
        };
      if (filterType === "productType")
        return {
          ...prev,
          productTypes: prev.productTypes.filter((p) => p !== value),
        };
      if (filterType === "minPrice") return { ...prev, minPrice: null };
      if (filterType === "maxPrice") return { ...prev, maxPrice: null };
      if (filterType === "isFeatured") return { ...prev, isFeatured: null };
      return prev;
    });
    setCurrentPage(1);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setActiveFilters({
      categoryIds: [],
      brandTypes: [],
      productTypes: [],
      searchTerm: "",
      isFeatured: null,
      minPrice: null,
      maxPrice: null,
    });
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSortChange = useCallback((value) => {
    setSortBy(value);
    setCurrentPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-black pt-20 font-manrope">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-white/08" style={{ background: "#0d0b08" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center gap-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" className="text-white/40 hover:text-white/70 transition-colors" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <li><span className="text-white/70 font-medium">All Materials</span></li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <FilterSidebar
              categories={categories}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              handleClearAllFilters={handleClearAllFilters}
              handleRemoveFilter={handleRemoveFilter}
              onApplyFilters={() => setCurrentPage(1)}
              sortBy={sortBy}
              setSortBy={handleSortChange}
              viewMode={viewMode}
              setViewMode={setViewMode}
              totalCount={data?.totalCount || 0}
            />
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* Desktop Sort/View Controls */}
            <div className="hidden md:flex flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 ml-auto">
                <AnimatePresence>
                  {isFetching && !isLoading && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-white/35 flex items-center gap-1"
                    >
                      <svg
                        className="animate-spin w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Updating…
                    </motion.span>
                  )}
                </AnimatePresence>
                <p className="text-white/40">{data?.totalCount ?? 0} Results</p>
                <label className="text-sm text-white/50">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 border border-white/10 bg-[#1a1a1a] text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="featured">Featured</option>
                </select>
                <div className="flex items-center gap-px border border-white/10 p-1">
                  <button onClick={() => setViewMode("grid")} className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-white/10" : "hover:bg-white/05"}`}>
                    <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-white/10" : "hover:bg-white/05"}`}>
                    <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Recommendation Banner */}
            {!isLoading && (sortedItems?.length ?? 0) > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg p-4 mb-6 flex items-center justify-between"
                style={{ background: "rgba(212,175,55,0.06)", boxShadow: "0 0 0 1px rgba(212,175,55,0.15)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(212,175,55,0.12)" }}>
                    <ThumbsUp className="text-[#D4AF37]" size={14} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-white text-sm">Recommended for You</h3>
                    <p className="text-xs text-white/40">Based on your recent renovation style quiz</p>
                    <button className="text-xs text-start font-semibold text-[#D4AF37] hover:text-[#D4AF37]/80 whitespace-nowrap block md:hidden">
                      View All Recommendations
                    </button>
                  </div>
                </div>
                <button className="text-sm font-medium text-[#D4AF37]/70 hover:text-[#D4AF37] whitespace-nowrap hidden md:block transition-colors">
                  View All Recommendations
                </button>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-400">Failed to load products. Please try again.</p>
              </div>
            )}

            {/* Grid */}
            <ProductGrid
              products={sortedItems}
              isLoading={isLoading}
              viewMode={viewMode}
            />

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
