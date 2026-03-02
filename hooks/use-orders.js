import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersAPI } from "@/lib/mock/orders";
import { vendorOrdersAPI } from "@/lib/api/vendor/orders";

// Query keys
export const ORDERS_QUERY_KEYS = {
  all: ["orders"],
  list: (filters) => ["orders", "list", filters],
  detail: (id) => ["orders", "detail", id],
};

// Hook to fetch orders with filters
export function useOrders(filters = {}) {
  const {
    page = 1,
    limit = 10,
    status = "all",
    type = "all",
    dateRange = "last30days",
    search = "",
  } = filters;

  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.list({
      page,
      limit,
      status,
      type,
      dateRange,
      search,
    }),
    queryFn: () =>
      vendorOrdersAPI.getOrders({ page, limit, status, type, dateRange, search }),
    staleTime: 30 * 1000, // 30 seconds
    keepPreviousData: true, // Keep previous page data while fetching new page
  });
}

// Hook to fetch single order
export function useOrder(id) {
  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.detail(id),
    queryFn: () => ordersAPI.getOrderById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Hook to refresh orders
export function useRefreshOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.all });
    },
  });
}

// Hook to create order
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData) => vendorOrdersAPI.createOrder(orderData),
    onSuccess: () => {
      // Invalidate orders list to refetch with new order
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.all });
    },
  });
}

// Hook to export orders
export function useExportOrders() {
  return useMutation({
    mutationFn: (filters) => vendorOrdersAPI.exportOrders(filters),
    onSuccess: (data) => {
      console.log('✅ Orders exported:', data?.filename);
    },
    onError: (error) => {
      console.error('❌ Orders export failed:', error);
    },
  });
}

// Hook to import orders
export function useImportOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file) => vendorOrdersAPI.importOrders(file),
    onSuccess: () => {
      console.log('✅ Orders imported successfully');
      // Invalidate orders list to refetch with imported orders
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error('❌ Orders import failed:', error);
    },
  });
}
