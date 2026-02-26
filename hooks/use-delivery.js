import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorDeliveriesAPI } from "@/lib/api/vendor/deliveries";

// Query keys
export const DELIVERY_QUERY_KEYS = {
  assignments: (filters) => ["delivery", "assignments", filters],
};

// Hook to fetch delivery assignments
export function useDeliveryAssignments(filters = {}) {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "all",
    dateRange = null,
  } = filters;

  return useQuery({
    queryKey: DELIVERY_QUERY_KEYS.assignments({
      page,
      limit,
      search,
      status,
      dateRange,
    }),
    queryFn: async () => {
      const response = await vendorDeliveriesAPI.getDeliveries({
        page,
        limit,
        search,
        status,
        dateRange,
      });

      // Transform backend response to match expected frontend structure
      return {
        assignments: response.items || [],
        pagination: {
          page,
          limit,
          total: response.totalCount || 0,
          totalPages: Math.ceil((response.totalCount || 0) / limit),
        },
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    keepPreviousData: true,
  });
}

// Hook to update delivery assignment
export function useUpdateDeliveryAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) =>
      deliveryAPI.updateDeliveryAssignment(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery", "assignments"] });
    },
  });
}
