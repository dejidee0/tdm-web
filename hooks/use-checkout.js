// hooks/use-checkout.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutApi } from "@/lib/api/checkout";

export function useCheckoutData() {
  return useQuery({
    queryKey: ["checkout"],
    queryFn: () => checkoutApi.getCheckoutData(),
    staleTime: 30 * 1000, // 30 seconds
    retry: 1, // Only retry once if cart is empty
  });
}

export function useSubmitPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkoutApi.submitPayment,
    onSuccess: () => {
      // v5 takes a filters object, not a bare key array — the old calls here
      // matched every query (filters.queryKey was undefined) rather than
      // scoping to cart/checkout.
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["checkout"] });
    },
  });
}

export function useValidatePromoCode() {
  return useMutation({
    mutationFn: checkoutApi.validatePromoCode,
  });
}
