import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountSettingsAPI } from "@/lib/mock/account";

// Query keys
export const ACCOUNT_QUERY_KEYS = {
  profile: ["account", "profile"],
  security: ["account", "security"],
  notifications: ["account", "notifications"],
  brandAccess: ["account", "brand-access"],
};

// Hook to fetch user profile
export function useProfile() {
  return useQuery({
    queryKey: ACCOUNT_QUERY_KEYS.profile,
    queryFn: accountSettingsAPI.getProfile,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Hook to update profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates) => accountSettingsAPI.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.profile });
    },
  });
}

// Hook to change password
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      accountSettingsAPI.changePassword(currentPassword, newPassword),
  });
}

// Hook to fetch security settings
export function useSecuritySettings() {
  return useQuery({
    queryKey: ACCOUNT_QUERY_KEYS.security,
    queryFn: accountSettingsAPI.getSecuritySettings,
    staleTime: 60 * 1000,
  });
}

// Hook to toggle 2FA
export function useToggle2FA() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enabled) => accountSettingsAPI.toggle2FA(enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEYS.security });
    },
  });
}

// Hook to fetch notification settings
export function useNotificationSettings() {
  return useQuery({
    queryKey: ACCOUNT_QUERY_KEYS.notifications,
    queryFn: accountSettingsAPI.getNotificationSettings,
    staleTime: 60 * 1000,
  });
}

// Hook to update notification settings
export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates) =>
      accountSettingsAPI.updateNotificationSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ACCOUNT_QUERY_KEYS.notifications,
      });
    },
  });
}

// Hook to fetch brand access
export function useBrandAccess() {
  return useQuery({
    queryKey: ACCOUNT_QUERY_KEYS.brandAccess,
    queryFn: accountSettingsAPI.getBrandAccess,
    staleTime: 60 * 1000,
  });
}

// Hook to deactivate account
export function useDeactivateAccount() {
  return useMutation({
    mutationFn: accountSettingsAPI.deactivateAccount,
  });
}
