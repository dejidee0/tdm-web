// hooks/use-cart.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";

// ─── Read cart ────────────────────────────────────────────────────────────────
export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
    staleTime: 30 * 1000, // 30s — re-fetch if stale (backend may change)
    gcTime: Infinity,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

// ─── Merge guest cart after login ─────────────────────────────────────────────
// Call this once immediately after successful login.
// It POSTs local guest items to /api/v1/Cart/merge, clears localStorage,
// then invalidates the cart query so the page re-fetches fresh from the backend.
//
// Usage:
//   const mergeCart = useMergeGuestCart();
//   // inside login onSuccess:
//   await mergeCart.mutateAsync();
export function useMergeGuestCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.mergeGuestCart,
    onSuccess: (result) => {
      // Log any merge warnings from the backend (stock caps, duplicates, etc.)
      if (result.warnings?.length) {
        console.info("[cart] merge warnings:", result.warnings);
      }
      // Force a fresh fetch from the backend
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      // Non-fatal — cart will re-fetch from backend anyway
      console.warn("[cart] merge error:", err.message);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// ─── Add to cart ──────────────────────────────────────────────────────────────
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ product, quantity = 1 }) =>
      cartApi.addToCart(product, quantity),

    onMutate: async ({ product, quantity = 1 }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => {
        if (!old) return old;
        const existing = old.items.find((i) => i.productId === product.id);
        let newItems;

        if (existing) {
          newItems = old.items.map((i) =>
            i.productId === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        } else {
          newItems = [
            ...old.items,
            {
              id: `cart-${product.id}`,
              productId: product.id,
              name: product.name,
              price: product.price ?? 0,
              priceDisplay: product.priceDisplay,
              quantity,
              image: product.primaryImageUrl || product.images?.[0] || null,
              inStock: product.inStock,
              categoryName: product.categoryName,
              brandName: product.brandName,
            },
          ];
        }

        const subtotal = newItems.reduce(
          (s, i) => s + (i.price ?? 0) * i.quantity,
          0,
        );
        return {
          ...old,
          items: newItems,
          subtotal,
          tax: subtotal * (old.taxRate ?? 0.0875),
          total: subtotal + subtotal * (old.taxRate ?? 0.0875),
        };
      });

      return { previousCart };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// ─── Update quantity ──────────────────────────────────────────────────────────
export function useUpdateQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }) =>
      cartApi.updateQuantity(itemId, quantity),

    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => {
        if (!old) return old;
        const newItems = old.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item,
        );
        const subtotal = newItems.reduce(
          (s, i) => s + (i.price ?? 0) * i.quantity,
          0,
        );
        return {
          ...old,
          items: newItems,
          subtotal,
          tax: subtotal * (old.taxRate ?? 0.0875),
          total: subtotal + subtotal * (old.taxRate ?? 0.0875),
        };
      });

      return { previousCart };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// ─── Remove item ──────────────────────────────────────────────────────────────
export function useRemoveItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => cartApi.removeItem(itemId),

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => {
        if (!old) return old;
        const newItems = old.items.filter((i) => i.id !== itemId);
        const subtotal = newItems.reduce(
          (s, i) => s + (i.price ?? 0) * i.quantity,
          0,
        );
        return {
          ...old,
          items: newItems,
          subtotal,
          tax: subtotal * (old.taxRate ?? 0.0875),
          total: subtotal + subtotal * (old.taxRate ?? 0.0875),
        };
      });

      return { previousCart };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// ─── Clear cart ───────────────────────────────────────────────────────────────
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.setQueryData(["cart"], {
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        shipping: 0,
        taxRate: 0.0875,
      });
    },
  });
}

// ─── Promo code ───────────────────────────────────────────────────────────────
export function useApplyPromoCode() {
  return useMutation({
    mutationFn: (code) => cartApi.applyPromoCode(code),
  });
}

// ─── Related products for cart ────────────────────────────────────────────────
export function useCartRelated() {
  return useQuery({
    queryKey: ["cart", "related"],
    queryFn: cartApi.getCartRelated,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => (Array.isArray(data) ? data : []),
  });
}

// ─── Cart item count (for navbar badge) ──────────────────────────────────────
export function useCartCount() {
  const { data } = useCart();
  return data?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
}
