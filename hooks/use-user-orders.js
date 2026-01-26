// hooks/useOrders.js

import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/mock/user-orders";

export function useOrders(filters) {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => ordersApi.getOrders(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
}

export function useOrderDetails(orderId) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersApi.getOrderDetails(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
  });
}
