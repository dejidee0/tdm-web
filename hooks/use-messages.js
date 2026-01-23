import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesAPI } from "@/lib/mock/messages";

// Query keys
export const MESSAGES_QUERY_KEYS = {
  conversations: (filters) => ["messages", "conversations", filters],
  messages: (conversationId) => ["messages", "conversation", conversationId],
};

// Hook to fetch conversations
export function useConversations(filters = {}) {
  const { filter = "active", search = "" } = filters;

  return useQuery({
    queryKey: MESSAGES_QUERY_KEYS.conversations({ filter, search }),
    queryFn: () => messagesAPI.getConversations({ filter, search }),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Hook to fetch messages for a conversation
export function useMessages(conversationId) {
  return useQuery({
    queryKey: MESSAGES_QUERY_KEYS.messages(conversationId),
    queryFn: () => messagesAPI.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
  });
}

// Hook to send a message
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, message }) =>
      messagesAPI.sendMessage(conversationId, message),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: MESSAGES_QUERY_KEYS.messages(variables.conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations"],
      });
    },
  });
}
