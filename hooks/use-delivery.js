import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryAPI } from "@/lib/mock/delivery";

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
    queryFn: () =>
      deliveryAPI.getDeliveryAssignments({
        page,
        limit,
        search,
        status,
        dateRange,
      }),
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
