"use client";

import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";

// ─── Fetchers ─────────────────────────────────────────────────────────────────
async function fetchProductById(id) {
  const res = await fetch(`/api/products/${id}`);
  if (res.status === 404)
    throw Object.assign(new Error("Product not found"), { status: 404 });
  if (!res.ok) throw new Error(`Product fetch failed: ${res.status}`);
  const json = await res.json();
  // Normalise: API wraps in { success, data }
  return json.data ?? json;
}

async function fetchSimilarProducts(categoryId, excludeId) {
  if (!categoryId) return [];
  const params = new URLSearchParams({
    categoryId,
    pageSize: "8",
    ActiveOnly: "true",
  });
  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) return [];
  const json = await res.json();
  const items = json.data?.items ?? [];
  return items.filter((p) => p.id !== excludeId);
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: (count, err) => err?.status !== 404 && count < 2,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}

export function useProductBySlug(slug) {
  return useQuery({
    queryKey: ["product", "slug", slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: (count, err) => err?.status !== 404 && count < 2,
    refetchOnWindowFocus: false,
    select: (res) => res?.data ?? res,
  });
}

export function useRelatedProducts(productId) {
  return useQuery({
    queryKey: ["products", "related", productId],
    queryFn: () => productsApi.getRelated(productId),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.items ?? res?.data ?? res?.items ?? [],
  });
}

export function useSimilarProducts(categoryId, excludeId) {
  return useQuery({
    queryKey: ["products", "similar", categoryId, excludeId],
    queryFn: () => fetchSimilarProducts(categoryId, excludeId),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!categoryId,
  });
}
