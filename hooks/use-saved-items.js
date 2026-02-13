// hooks/useSavedItems.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { savedItemsApi } from "@/lib/api/saved-designs";

export function useSavedItems(filters) {
  return useQuery({
    queryKey: ["saved-items", filters],
    queryFn: () => savedItemsApi.getSavedItems(filters),
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useRemoveFromSaved() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savedItemsApi.removeFromSaved,
    onSuccess: () => {
      queryClient.invalidateQueries(["saved-items"]);
    },
  });
}

export function useAddToCart() {
  return useMutation({
    mutationFn: ({ itemId, quantity }) =>
      savedItemsApi.addToCart(itemId, quantity),
  });
}

export function useAddToMoodboard() {
  return useMutation({
    mutationFn: ({ itemId, boardId }) =>
      savedItemsApi.addToMoodboard(itemId, boardId),
  });
}

export function useCreateBoard() {
  return useMutation({
    mutationFn: ({ itemIds, boardName }) =>
      savedItemsApi.createBoard(itemIds, boardName),
  });
}

export function useBuyAll() {
  return useMutation({
    mutationFn: savedItemsApi.buyAll,
  });
}
