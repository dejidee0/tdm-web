import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrdersAPI } from "@/lib/api/admin";

// Query keys
export const ADMIN_ORDERS_QUERY_KEYS = {
  all: ["admin", "orders"],
  list: (filters) => [...ADMIN_ORDERS_QUERY_KEYS.all, "list", filters],
  detail: (id) => [...ADMIN_ORDERS_QUERY_KEYS.all, "detail", id],
};

/**
 * Hook to fetch admin orders with filters
 */
export function useAdminOrders(filters = {}) {
  const { page = 1, pageSize = 10, status = "", search = "" } = filters;

  return useQuery({
    queryKey: ADMIN_ORDERS_QUERY_KEYS.list({ page, pageSize, status, search }),
    queryFn: () => adminOrdersAPI.getOrders({ page, pageSize, status, search }),
    staleTime: 30 * 1000, // 30 seconds
    keepPreviousData: true, // Keep previous page data while fetching new page
  });
}

/**
 * Hook to update order status
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) =>
      adminOrdersAPI.updateStatus(orderId, status),
    onSuccess: (data, variables) => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEYS.all });

      // Optionally update detail cache
      queryClient.setQueryData(
        ADMIN_ORDERS_QUERY_KEYS.detail(variables.orderId),
        data.order
      );
    },
  });
}

/**
 * Hook to cancel order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }) =>
      adminOrdersAPI.cancel(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook to refund order
 */
export function useRefundOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }) =>
      adminOrdersAPI.refund(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEYS.all });
    },
  });
}

/**
 * Hook to update tracking number
 */
export function useUpdateTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, trackingNumber }) =>
      adminOrdersAPI.updateTracking(orderId, trackingNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEYS.all });
    },
  });
}
