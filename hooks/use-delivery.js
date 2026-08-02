import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorDeliveriesAPI } from "@/lib/api/vendor/deliveries";
import { showToast } from "@/components/shared/toast";

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
    // No backend endpoint accepts a deliveryPartner/trackingNumber update on a
    // delivery assignment — see BACKLOG.md #13. This used to call the
    // undefined `deliveryAPI` global and throw an uncaught ReferenceError on
    // every Save; rejecting here instead lets the button's onError show the
    // vendor a real message rather than crashing silently.
    mutationFn: () => {
      throw new Error(
        "Delivery assignment updates aren't available yet. This has been flagged for the backend team.",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery", "assignments"] });
    },
    onError: (error) => {
      showToast.error(error.message);
    },
  });
}
