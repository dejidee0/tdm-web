import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryAPI } from "@/lib/mock/inventory";

// Query keys
export const INVENTORY_QUERY_KEYS = {
  stats: ["inventory", "stats"],
  products: (filters) => ["inventory", "products", filters],
};

// Hook to fetch inventory stats
export function useInventoryStats() {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.stats,
    queryFn: inventoryAPI.getInventoryStats,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Hook to fetch inventory products
export function useInventoryProducts(filters = {}) {
  const {
    page = 1,
    limit = 10,
    search = "",
    stockStatus = "all",
    location = "all",
    archived = false,
  } = filters;

  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.products({
      page,
      limit,
      search,
      stockStatus,
      location,
      archived,
    }),
    queryFn: () =>
      inventoryAPI.getInventoryProducts({
        page,
        limit,
        search,
        stockStatus,
        location,
        archived,
      }),
    staleTime: 30 * 1000, // 30 seconds
    keepPreviousData: true,
  });
}

// Hook to update product quantity
export function useUpdateProductQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }) =>
      inventoryAPI.updateProductQuantity(id, quantity),
    onSuccess: () => {
      // Invalidate both stats and products queries
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
    },
  });
}

// Hook to delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => inventoryAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
    },
  });
}
