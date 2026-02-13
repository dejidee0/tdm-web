// hooks/useDesigns.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { designsApi } from "@/lib/api/designs";

export function useDesigns(filters) {
  return useQuery({
    queryKey: ["designs", filters],
    queryFn: () => designsApi.getDesigns(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: false,
  });
}

export function useDesignDetails(designId) {
  return useQuery({
    queryKey: ["design", designId],
    queryFn: () => designsApi.getDesignDetails(designId),
    enabled: !!designId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: designsApi.toggleFavorite,
    onSuccess: (data, designId) => {
      // Update cache for designs list
      queryClient.setQueriesData(["designs"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((design) =>
          design.id === designId
            ? { ...design, isFavorite: data.isFavorite }
            : design,
        );
      });

      // Update cache for single design
      queryClient.setQueryData(["design", designId], (oldData) => {
        if (!oldData) return oldData;
        return { ...oldData, isFavorite: data.isFavorite };
      });
    },
  });
}

export function useDeleteDesign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: designsApi.deleteDesign,
    onSuccess: () => {
      // Invalidate designs list to refetch
      queryClient.invalidateQueries(["designs"]);
    },
  });
}

export function useDownloadDesign() {
  return useMutation({
    mutationFn: ({ designId, quality }) =>
      designsApi.downloadDesign(designId, quality),
  });
}

export function useShareDesign() {
  return useMutation({
    mutationFn: designsApi.shareDesign,
  });
}
