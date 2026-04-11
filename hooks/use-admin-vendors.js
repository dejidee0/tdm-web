import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminVendorsAPI } from "@/lib/api/admin";

export const VENDOR_QUERY_KEYS = {
  all: ["admin", "vendors"],
  list: (params) => ["admin", "vendors", "list", params],
  detail: (id) => ["admin", "vendors", id],
  ownership: (vendorId) => ["admin", "vendors", vendorId, "ownership"],
};

export function useAdminVendors(params = {}) {
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.list(params),
    queryFn: () => adminVendorsAPI.getVendors(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminVendor(vendorId) {
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.detail(vendorId),
    queryFn: () => adminVendorsAPI.getVendor(vendorId),
    enabled: !!vendorId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateVendorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vendorId, data }) => adminVendorsAPI.updateVendorProfile(vendorId, data),
    onSuccess: (_data, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.detail(vendorId) });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.all });
    },
  });
}

export function useVendorOwnership(vendorId) {
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.ownership(vendorId),
    queryFn: () => adminVendorsAPI.getVendorOwnership(vendorId),
    enabled: !!vendorId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAssignProductOwnership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, vendorId }) =>
      adminVendorsAPI.assignProductOwnership(productId, vendorId),
    onSuccess: (_data, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.ownership(vendorId) });
    },
  });
}

export function useRemoveProductOwnership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId }) => adminVendorsAPI.removeProductOwnership(productId),
    onSuccess: (_data, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.ownership(vendorId) });
    },
  });
}

export function useAssignOrderToVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, vendorId }) => adminVendorsAPI.assignOrder(orderId, vendorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

export function useRemoveOrderAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => adminVendorsAPI.removeOrderAssignment(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}
