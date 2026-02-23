import { settingsAPI } from "@/lib/mock/settings";
import { adminSettingsAPI } from "@/lib/api/admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Use mock API until backend implements settings endpoints
const USE_MOCK_API = true;

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
    queryFn: USE_MOCK_API ? settingsAPI.getPaymentSettings : adminSettingsAPI.getPaymentSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch AI configuration
export function useAIConfiguration() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.ai,
    queryFn: USE_MOCK_API ? settingsAPI.getAIConfiguration : adminSettingsAPI.getAISettings,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch notification settings
export function useNotificationSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.notifications,
    queryFn: USE_MOCK_API ? settingsAPI.getNotificationSettings : adminSettingsAPI.getNotificationSettings,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch general settings
export function useGeneralSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.general,
    queryFn: USE_MOCK_API ? settingsAPI.getGeneralSettings : adminSettingsAPI.getGeneralSettings,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to save payment settings
export function useSaveSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      // Transform form data to API format
      const settings = {
        basePlatformFee: data.baseFee || 0,
        fixedFeePerTransaction: data.fixedFee || 0,
        defaultCurrency: data.currency || "USD",
        gateways: data.gateways || [],
      };
      return USE_MOCK_API
        ? settingsAPI.updatePaymentSettings(settings)
        : adminSettingsAPI.updatePaymentSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.payment });
    },
  });
}

// Hook to toggle payment gateway
export function useTogglePaymentGateway() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gatewayId, enabled }) =>
      USE_MOCK_API
        ? settingsAPI.togglePaymentGateway(gatewayId, enabled)
        : adminSettingsAPI.togglePaymentGateway(gatewayId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.payment });
    },
  });
}

// Hook to toggle AI model
export function useToggleAIModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ modelId, enabled }) =>
      USE_MOCK_API
        ? settingsAPI.toggleAIModel(modelId, enabled)
        : adminSettingsAPI.toggleAIModel(modelId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.ai });
    },
  });
}

// Hook to update notification settings
export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings) =>
      USE_MOCK_API
        ? settingsAPI.updateNotificationSettings(settings)
        : adminSettingsAPI.updateNotificationSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.notifications });
    },
  });
}

// Hook to update general settings (PUT /admin/settings)
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings) =>
      USE_MOCK_API
        ? settingsAPI.updateSettings(settings)
        : adminSettingsAPI.updateSettings(settings),
    onSuccess: () => {
      // Invalidate all settings queries since this is a general update
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
  });
}
