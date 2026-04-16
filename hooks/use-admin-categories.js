// hooks/use-admin-categories.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCategoriesAPI } from "@/lib/api/admin";

// Re-use the same cache keys the read-side hooks use so mutations
// automatically invalidate the categories cache.
const CATEGORY_KEYS = {
  all: ["categories"],
  detail: (id) => ["category", id],
};

// ── Create ─────────────────────────────────────────────────────────────────────
export function useAdminCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => adminCategoriesAPI.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
  });
}

// ── Update ─────────────────────────────────────────────────────────────────────
export function useAdminUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => adminCategoriesAPI.updateCategory(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
  });
}

// ── Delete ─────────────────────────────────────────────────────────────────────
export function useAdminDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminCategoriesAPI.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
  });
}
