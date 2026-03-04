"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Query Key Factory ───────────────────────────────────────────────────────
export const productKeys = {
  all: ["products"],
  list: (filters) => ["products", "list", filters],
  detail: (id) => ["products", "detail", id],
  categories: () => ["products", "categories"],
};

// ─── Fetcher ─────────────────────────────────────────────────────────────────
async function fetchProducts(filters) {
  const params = new URLSearchParams();

  params.set("pageNumber", String(filters.pageNumber || 1));
  params.set("pageSize", String(filters.pageSize || 12));
  params.set("ActiveOnly", "true");

  if (filters.brandType != null)
    params.set("brandType", String(filters.brandType));
  if (filters.productType != null)
    params.set("productType", String(filters.productType));
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
  if (filters.isFeatured != null)
    params.set("isFeatured", String(filters.isFeatured));

  const res = await fetch(`/api/products?${params.toString()}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Products fetch failed: ${res.status} – ${err}`);
  }

  const json = await res.json();
  // Normalise response shape
  return {
    items: json.data?.items ?? [],
    totalCount: json.data?.totalCount ?? 0,
    pageNumber: json.data?.pageNumber ?? 1,
    pageSize: json.data?.pageSize ?? 12,
    totalPages: json.data?.totalPages ?? 1,
    hasPreviousPage: json.data?.hasPreviousPage ?? false,
    hasNextPage: json.data?.hasNextPage ?? false,
  };
}

// ─── Main Hook ────────────────────────────────────────────────────────────────
export function useProducts(filters = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 min — fresh
    gcTime: 15 * 60 * 1000, // 15 min — keep in cache
    placeholderData: (prev) => prev, // keep previous data while fetching next page
    refetchOnWindowFocus: false,
  });

  // ── Prefetch next page ────────────────────────────────────────────────────
  const prefetchNextPage = () => {
    if (query.data?.hasNextPage) {
      const nextFilters = {
        ...filters,
        pageNumber: (filters.pageNumber || 1) + 1,
      };
      queryClient.prefetchQuery({
        queryKey: productKeys.list(nextFilters),
        queryFn: () => fetchProducts(nextFilters),
        staleTime: 5 * 60 * 1000,
      });
    }
  };

  return { ...query, prefetchNextPage };
}

// ─── Categories / Filters Hook (derived from product data) ────────────────────
export function useProductCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: async () => {
      // Fetch a small page to get category info
      const res = await fetch("/api/products?pageSize=100&ActiveOnly=true");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const json = await res.json();
      const items = json.data?.items ?? [];

      // Derive unique categories and brand types from items
      const categoriesMap = new Map();
      const brandTypes = new Set();
      const productTypes = new Set();

      items.forEach((item) => {
        if (item.categoryId && item.categoryName) {
          categoriesMap.set(item.categoryId, item.categoryName);
        }
        if (item.brandType != null) brandTypes.add(item.brandType);
        if (item.productType != null) productTypes.add(item.productType);
      });

      return {
        categories: Array.from(categoriesMap.entries()).map(([id, name]) => ({
          id,
          name,
        })),
        brandTypes: Array.from(brandTypes),
        productTypes: Array.from(productTypes),
      };
    },
    staleTime: 15 * 60 * 1000, // Categories change rarely
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
