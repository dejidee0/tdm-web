// hooks/use-checkout.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutApi } from "@/lib/api/checkout";

export function useCheckoutData() {
  return useQuery({
    queryKey: ["checkout"],
    queryFn: checkoutApi.getCheckoutData,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1, // Only retry once if cart is empty
  });
}

export function useSubmitPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkoutApi.submitPayment,
    onSuccess: () => {
      // Invalidate cart and checkout data after successful payment
      queryClient.invalidateQueries(["cart"]);
      queryClient.invalidateQueries(["checkout"]);
    },
  });
}

export function useValidatePromoCode() {
  return useMutation({
    mutationFn: checkoutApi.validatePromoCode,
  });
}
