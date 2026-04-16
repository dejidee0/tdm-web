// hooks/use-saved.js
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { showToast } from "@/components/shared/toast";

// ── API helpers ────────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  if (!res.ok) {
    throw new Error(json?.message || json?.title || `Error ${res.status}`);
  }
  return json;
}

function extractArray(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.data)) return raw.data;
  if (raw.data && Array.isArray(raw.data.items)) return raw.data.items;
  if (raw.data && Array.isArray(raw.data.results)) return raw.data.results;
  if (Array.isArray(raw.items)) return raw.items;
  if (Array.isArray(raw.results)) return raw.results;
  if (Array.isArray(raw.value)) return raw.value;
  if (raw.data && typeof raw.data === "object") return [raw.data];
  return [];
}

// ── Raw API calls ──────────────────────────────────────────────────────────

async function fetchSavedItems() {
  const raw = await apiFetch("/saved");
  return extractArray(raw);
}

async function saveItem(productId) {
  return apiFetch("/saved", {
    method: "POST",
    body: JSON.stringify({ itemId: productId }),
  });
}

async function removeSavedItem(savedId) {
  return apiFetch(`/saved/${savedId}`, { method: "DELETE" });
}

async function addSavedToCartApi(savedId) {
  return apiFetch(`/saved/${savedId}/add-to-cart`, { method: "POST" });
}

async function buyAllApi(itemIds) {
  return apiFetch("/saved/buy-all", {
    method: "POST",
    body: JSON.stringify({ itemIds }),
  });
}

// ── Query key ──────────────────────────────────────────────────────────────
export const SAVED_KEY = ["saved-items"];

// ── Base query — auth-gated, shared across all hooks ──────────────────────
function useSavedQuery() {
  const { isAuthenticated } = useIsAuthenticated();
  return useQuery({
    queryKey: SAVED_KEY,
    queryFn: fetchSavedItems,
    enabled: !!isAuthenticated, // don't fetch at all when logged out
    staleTime: 2 * 60 * 1000,
    retry: false,
    select: (data) => (Array.isArray(data) ? data : []),
  });
}

// ── Public hooks ──────────────────────────────────────────────────────────

/** Full saved items list, optionally filtered/sorted client-side */
export function useSavedItems(filters) {
  const { isAuthenticated } = useIsAuthenticated();
  return useQuery({
    queryKey: SAVED_KEY,
    queryFn: fetchSavedItems,
    enabled: !!isAuthenticated,
    staleTime: 2 * 60 * 1000,
    retry: false,
    select: (data) => {
      let list = Array.isArray(data) ? data : [];

      if (filters) {
        if (filters.search) {
          const q = filters.search.toLowerCase();
          list = list.filter(
            (item) =>
              item.name?.toLowerCase().includes(q) ||
              item.productName?.toLowerCase().includes(q) ||
              item.categoryName?.toLowerCase().includes(q),
          );
        }
        if (filters.category && filters.category !== "all") {
          list = list.filter(
            (item) =>
              item.categoryName?.toLowerCase() === filters.category ||
              item.productTypeName?.toLowerCase() === filters.category,
          );
        }
        if (filters.sortBy) {
          list = [...list].sort((a, b) => {
            switch (filters.sortBy) {
              case "price-low":
                return (a.price ?? 0) - (b.price ?? 0);
              case "price-high":
                return (b.price ?? 0) - (a.price ?? 0);
              case "alphabetical":
                return (a.name || a.productName || "").localeCompare(
                  b.name || b.productName || "",
                );
              default:
                return (
                  new Date(b.savedAt || b.createdAt || 0) -
                  new Date(a.savedAt || a.createdAt || 0)
                );
            }
          });
        }
      }

      return list;
    },
  });
}

/**
 * Returns { isSaved, savedId, isLoading } for a given product id.
 * isLoading is true while the saved-items list is being fetched on mount —
 * callers should show a neutral (unfilled) heart and disable interaction until done.
 */
export function useIsSaved(productId) {
  const { data, isLoading, isFetching } = useSavedQuery();
  const savedItems = Array.isArray(data) ? data : [];
  const savedEntry = savedItems.find(
    (s) => s.productId === productId || s.itemId === productId,
  );
  return {
    isSaved: !!savedEntry,
    savedId: savedEntry?.id ?? null,
    // True on the very first fetch — before we know saved state
    isLoading: isLoading || isFetching,
  };
}

/** Toggle save / unsave */
export function useToggleSave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, savedId, isSaved }) => {
      if (isSaved && savedId) return removeSavedItem(savedId);
      return saveItem(productId);
    },
    onMutate: async ({ productId, savedId, isSaved }) => {
      await queryClient.cancelQueries({ queryKey: SAVED_KEY });
      const previous = queryClient.getQueryData(SAVED_KEY);
      queryClient.setQueryData(SAVED_KEY, (old) => {
        const list = Array.isArray(old) ? old : [];
        if (isSaved) return list.filter((s) => s.id !== savedId);
        return [
          ...list,
          { id: `temp-${productId}`, productId, itemId: productId },
        ];
      });
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous !== undefined)
        queryClient.setQueryData(SAVED_KEY, ctx.previous);
      showToast.error({ title: "Error", message: err.message });
    },
    onSuccess: (_data, { isSaved }) => {
      queryClient.invalidateQueries({ queryKey: SAVED_KEY });
      if (isSaved) {
        showToast.info({
          title: "Removed",
          message: "Removed from saved items.",
        });
      } else {
        showToast.success({
          title: "Saved",
          message: "Added to your saved items.",
        });
      }
    },
  });
}

/** Remove a saved item by its saved record id (dashboard) */
export function useRemoveSaved() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ savedId }) => removeSavedItem(savedId),
    onMutate: async ({ savedId }) => {
      await queryClient.cancelQueries({ queryKey: SAVED_KEY });
      const previous = queryClient.getQueryData(SAVED_KEY);
      queryClient.setQueryData(SAVED_KEY, (old) =>
        Array.isArray(old) ? old.filter((s) => s.id !== savedId) : [],
      );
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous !== undefined)
        queryClient.setQueryData(SAVED_KEY, ctx.previous);
      showToast.error({ title: "Error", message: err.message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_KEY });
      showToast.info({
        title: "Removed",
        message: "Removed from saved items.",
      });
    },
  });
}

/** Add a saved item to cart */
export function useAddSavedToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ savedId }) => addSavedToCartApi(savedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      showToast.success({
        title: "Added to Cart",
        message: "Item added to your cart.",
      });
    },
    onError: (err) => {
      showToast.error({ title: "Couldn't Add", message: err.message });
    },
  });
}

/** POST /saved/buy-all */
export function useBuyAll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemIds) => buyAllApi(itemIds),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      showToast.success({
        title: "Added to Cart",
        message: data?.message || "All items added to your cart.",
      });
    },
    onError: (err) => {
      showToast.error({ title: "Couldn't Add All", message: err.message });
    },
  });
}

export function useCreateBoard() {
  return useMutation({
    mutationFn: ({ itemIds, boardName }) =>
      apiFetch("/saved/create-board", {
        method: "POST",
        body: JSON.stringify({ itemIds, boardName }),
      }),
    onSuccess: (data) => {
      showToast.success({
        title: "Board Created",
        message: `Board "${data?.boardName || "New Board"}" created.`,
      });
    },
    onError: (err) => {
      showToast.error({ title: "Error", message: err.message });
    },
  });
}
