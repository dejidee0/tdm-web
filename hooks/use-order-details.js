// hooks/useOrderDetails.js

import { useQuery, useMutation } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";

export function useOrderDetails(orderId) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersApi.getOrderDetails(orderId),
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useDownloadInvoice() {
  return useMutation({
    mutationFn: ordersApi.downloadInvoice,
  });
}

export function useCopyTracking() {
  return useMutation({
    mutationFn: ordersApi.copyTrackingNumber,
  });
}
