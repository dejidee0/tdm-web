import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSettingsAPI } from "@/lib/api/admin";

// Query keys
export const ADMIN_SETTINGS_QUERY_KEYS = {
  all: ["admin", "settings"],
  payment: () => [...ADMIN_SETTINGS_QUERY_KEYS.all, "payment"],
  ai: () => [...ADMIN_SETTINGS_QUERY_KEYS.all, "ai"],
  general: () => [...ADMIN_SETTINGS_QUERY_KEYS.all, "general"],
  notifications: () => [...ADMIN_SETTINGS_QUERY_KEYS.all, "notifications"],
};

/**
 * Hook to fetch payment settings
 */
export function usePaymentSettings() {
  return useQuery({
    queryKey: ADMIN_SETTINGS_QUERY_KEYS.payment(),
    queryFn: adminSettingsAPI.getPaymentSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to update payment settings
 */
export function useUpdatePaymentSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings) => adminSettingsAPI.updatePaymentSettings(settings),
    onSuccess: (data) => {
      // Update cache with new settings
      queryClient.setQueryData(ADMIN_SETTINGS_QUERY_KEYS.payment(), data);
      // Invalidate to trigger refetch
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_QUERY_KEYS.payment() });
    },
  });
}

/**
 * Hook to fetch AI settings
 */
export function useAISettings() {
  return useQuery({
    queryKey: ADMIN_SETTINGS_QUERY_KEYS.ai(),
    queryFn: adminSettingsAPI.getAISettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to update AI settings
 */
export function useUpdateAISettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings) => adminSettingsAPI.updateAISettings(settings),
    onSuccess: (data) => {
      queryClient.setQueryData(ADMIN_SETTINGS_QUERY_KEYS.ai(), data);
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_QUERY_KEYS.ai() });
    },
  });
}

/**
 * Hook to fetch general settings
 */
export function useGeneralSettings() {
  return useQuery({
    queryKey: ADMIN_SETTINGS_QUERY_KEYS.general(),
    queryFn: adminSettingsAPI.getGeneralSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to update general settings
 */
export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings) => adminSettingsAPI.updateGeneralSettings(settings),
    onSuccess: (data) => {
      queryClient.setQueryData(ADMIN_SETTINGS_QUERY_KEYS.general(), data);
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_QUERY_KEYS.general() });
    },
  });
}

/**
 * Hook to fetch notification settings
 */
export function useNotificationSettings() {
  return useQuery({
    queryKey: ADMIN_SETTINGS_QUERY_KEYS.notifications(),
    queryFn: adminSettingsAPI.getNotificationSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to update notification settings
 */
export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings) => adminSettingsAPI.updateNotificationSettings(settings),
    onSuccess: (data) => {
      queryClient.setQueryData(ADMIN_SETTINGS_QUERY_KEYS.notifications(), data);
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_QUERY_KEYS.notifications() });
    },
  });
}

/**
 * Hook to toggle payment gateway
 */
export function useTogglePaymentGateway() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gatewayId, enabled }) =>
      adminSettingsAPI.togglePaymentGateway(gatewayId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_QUERY_KEYS.payment() });
    },
  });
}

/**
 * Hook to toggle AI model
 */
export function useToggleAIModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ modelId, enabled }) =>
      adminSettingsAPI.toggleAIModel(modelId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_QUERY_KEYS.ai() });
    },
  });
}

/**
 * Hook to update settings (general PUT /admin/settings)
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings) => adminSettingsAPI.updateSettings(settings),
    onSuccess: () => {
      // Invalidate all settings queries
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_QUERY_KEYS.all });
    },
  });
}
