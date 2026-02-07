import { settingsAPI } from "@/lib/mock/settings";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query keys
export const SETTINGS_QUERY_KEYS = {
  payment: ["admin", "settings", "payment"],
  ai: ["admin", "settings", "ai"],
  notifications: ["admin", "settings", "notifications"],
  general: ["admin", "settings", "general"],
};

// Hook to fetch payment settings
export function usePaymentSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.payment,
    queryFn: settingsAPI.getPaymentSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch AI configuration
export function useAIConfiguration() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.ai,
    queryFn: settingsAPI.getAIConfiguration,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch notification settings
export function useNotificationSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.notifications,
    queryFn: settingsAPI.getNotificationSettings,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch general settings
export function useGeneralSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.general,
    queryFn: settingsAPI.getGeneralSettings,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to save settings
export function useSaveSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsAPI.saveSettings,
    onSuccess: () => {
      // Invalidate all settings queries
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
  });
}

// Hook to toggle payment gateway
export function useTogglePaymentGateway() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gatewayId, enabled }) =>
      settingsAPI.togglePaymentGateway(gatewayId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.payment });
    },
  });
}

// Hook to toggle AI model
export function useToggleAIModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ modelId, enabled }) => settingsAPI.toggleAIModel(modelId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.ai });
    },
  });
}
