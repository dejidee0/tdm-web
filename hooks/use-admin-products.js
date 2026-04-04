// hooks/use-admin-products.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductsAPI } from "@/lib/api/admin";

// Re-use the same cache keys the read-side hooks use so mutations
// automatically invalidate the product list and detail caches.
const PRODUCT_KEYS = {
  all: ["products"],
  list: () => ["products", "list"],
  detail: (id) => ["product", id],
};

// ── Create ─────────────────────────────────────────────────────────────────────
export function useAdminCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => adminProductsAPI.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}

// ── Update ─────────────────────────────────────────────────────────────────────
export function useAdminUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => adminProductsAPI.updateProduct(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}

// ── Delete ─────────────────────────────────────────────────────────────────────
export function useAdminDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminProductsAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}

// ── Images ─────────────────────────────────────────────────────────────────────
export function useAdminAddProductImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }) => adminProductsAPI.addProductImages(id, files),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
    },
  });
}

export function useAdminDeleteProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ imageId, productId }) =>
      adminProductsAPI.deleteProductImage(imageId),
    onSuccess: (_data, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
}

export function useAdminSetPrimaryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, imgId }) => adminProductsAPI.setPrimaryImage(id, imgId),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
    },
  });
}
