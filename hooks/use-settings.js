import { settingsAPI } from "@/lib/mock/settings";
import { adminSettingsAPI } from "@/lib/api/admin";
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
    queryFn: adminSettingsAPI.getPaymentSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch AI configuration
export function useAIConfiguration() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.ai,
    queryFn: adminSettingsAPI.getAISettings,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch notification settings (still using mock - no API endpoint yet)
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
    queryFn: adminSettingsAPI.getGeneralSettings,
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
      return adminSettingsAPI.updatePaymentSettings(settings);
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
    mutationFn: async ({ gatewayId, enabled }) => {
      // Get current payment settings
      const currentSettings = queryClient.getQueryData(SETTINGS_QUERY_KEYS.payment);

      if (!currentSettings) {
        throw new Error("Payment settings not loaded");
      }

      // Update the specific gateway
      const updatedGateways = currentSettings.gateways.map((gateway) =>
        gateway.id === gatewayId ? { ...gateway, enabled } : gateway
      );

      // Send updated settings to API
      return adminSettingsAPI.updatePaymentSettings({
        basePlatformFee: currentSettings.basePlatformFee || 0,
        fixedFeePerTransaction: currentSettings.fixedFeePerTransaction || 0,
        defaultCurrency: currentSettings.defaultCurrency || "USD",
        gateways: updatedGateways,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.payment });
    },
  });
}

// Hook to toggle AI model
export function useToggleAIModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ modelId, enabled }) => {
      // Get current AI settings
      const currentSettings = queryClient.getQueryData(SETTINGS_QUERY_KEYS.ai);

      if (!currentSettings) {
        throw new Error("AI settings not loaded");
      }

      // Update the specific model
      const updatedModels = currentSettings.models.map((model) =>
        model.id === modelId ? { ...model, enabled } : model
      );

      // Send updated settings to API
      return adminSettingsAPI.updateAISettings({
        ...currentSettings,
        models: updatedModels,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.ai });
    },
  });
}
