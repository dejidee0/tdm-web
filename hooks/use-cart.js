// hooks/useCart.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });
}

export function useUpdateQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }) =>
      cartApi.updateQuantity(itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["cart"]);

      // Snapshot previous value
      const previousCart = queryClient.getQueryData(["cart"]);

      // Optimistically update
      queryClient.setQueryData(["cart"], (old) => {
        const newItems = old.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        );
        const newSubtotal = newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        return { ...old, items: newItems, subtotal: newSubtotal };
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["cart"], context.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
}

export function useRemoveItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
}

export function useApplyPromoCode() {
  return useMutation({
    mutationFn: cartApi.applyPromoCode,
  });
}

export function useRelatedProducts() {
  return useQuery({
    queryKey: ["related-products"],
    queryFn: cartApi.getRelatedProducts,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
}
