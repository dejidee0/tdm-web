// hooks/use-user-orders.js

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/user-dashboard";
import { dashboardKeys } from "@/hooks/use-user-dashboard";

export function useOrders() {
  return useQuery({
    queryKey: dashboardKeys.orders(),
    queryFn: dashboardApi.getOrders,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (res) => {
      if (Array.isArray(res)) return res;
      return res?.data ?? res?.orders ?? res?.items ?? [];
    },
  });
}

export function useOrderDetails(orderId) {
  return useQuery({
    queryKey: dashboardKeys.order(orderId),
    queryFn: () => dashboardApi.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
  });
}
