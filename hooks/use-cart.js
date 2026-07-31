// hooks/use-cart.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { useSession } from "@/hooks/use-session";

const cartQueryOptions = {
  queryKey: ["cart"],
  queryFn: cartApi.getCart,
  staleTime: 30 * 1000, // 30s — re-fetch if stale (backend may change)
  gcTime: Infinity,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
};

// The backend mints a guest cart (and a tbm_guest_id cookie) on the first
// GET /cart. Once that cookie exists the visitor has a cart worth reading.
const GUEST_CART_COOKIE = "tbm_guest_id";

function hasExistingCart() {
  if (typeof document === "undefined") return false;
  // tbm_guest_id is an opaque guest-cart id, not an auth token, and we only
  // test for its presence — never read a value out of it.
  // eslint-disable-next-line no-restricted-syntax
  return document.cookie.includes(`${GUEST_CART_COOKIE}=`);
}

// ─── Read cart ────────────────────────────────────────────────────────────────
// Unconditional: the caller is a page that exists to show the cart, so creating
// a guest cart on demand is exactly what we want.
export function useCart() {
  return useQuery(cartQueryOptions);
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
/**
 * Cart badge count for the navbar, which renders on every public page.
 *
 * Deliberately does NOT fetch for a passive anonymous visitor: doing so made
 * the backend mint a guest cart row (and a tracking cookie) for every bot and
 * every bounce. We only read the cart once the visitor actually has one —
 * they're logged in, or they've already touched the cart.
 *
 * Shares the ["cart"] key with useCart(), so the cart page still populates
 * this badge the moment it loads.
 */
export function useCartCount() {
  const { isAuthenticated } = useSession();
  const { data } = useQuery({
    ...cartQueryOptions,
    enabled: isAuthenticated || hasExistingCart(),
  });
  return data?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
}
