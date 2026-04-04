// hooks/use-profile.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/lib/api/profile";

// ─── Keys ─────────────────────────────────────────────────────────────────────
export const profileKeys = {
  me: ["profile", "me"], // full { profile, addresses, notifications, security }
  addresses: ["profile", "addresses"],
  notifications: ["profile", "notifications"],
  security: ["profile", "security"],
};

// ─── /account/me (full response) ─────────────────────────────────────────────
function useMe() {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: profileApi.getMe,
    staleTime: 5 * 60 * 1000,
    retry: (count, err) => err?.status !== 401 && count < 2,
  });
}

// ── Public hook: exposes data.profile fields directly ────────────────────────
export function useProfile() {
  const query = useMe();
  return {
    ...query,
    // Flatten: callers get profile fields directly (firstName, email, etc.)
    data: query.data?.profile ?? null,
    raw: query.data, // full data object when needed
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => profileApi.updateMe(data),
    onSuccess: (updated) => {
      // Merge updated profile fields into cached me data
      queryClient.setQueryData(profileKeys.me, (old) => ({
        ...old,
        profile: { ...old?.profile, ...(updated?.data?.profile ?? updated) },
      }));
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
    },
  });
}

// ─── Addresses ────────────────────────────────────────────────────────────────
export function useAddresses() {
  const query = useMe();
  return {
    ...query,
    data: query.data?.addresses ?? [],
  };
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => profileApi.createAddress(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.me }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, data }) =>
      profileApi.updateAddress(addressId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.me }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId) => profileApi.deleteAddress(addressId),
    onMutate: async (addressId) => {
      await queryClient.cancelQueries({ queryKey: profileKeys.me });
      const prev = queryClient.getQueryData(profileKeys.me);
      queryClient.setQueryData(profileKeys.me, (old) => ({
        ...old,
        addresses: (old?.addresses ?? []).filter((a) => a.id !== addressId),
      }));
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      queryClient.setQueryData(profileKeys.me, ctx?.prev);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.me }),
  });
}

// ─── Password (3-step OTP flow) ───────────────────────────────────────────────
export function useRequestPasswordOtp() {
  return useMutation({
    mutationFn: (currentPassword) =>
      profileApi.requestPasswordOtp(currentPassword),
  });
}

export function useVerifyPasswordOtp() {
  return useMutation({
    mutationFn: (otpCode) => profileApi.verifyPasswordOtp(otpCode),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data) => profileApi.changePassword(data),
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────
export function useNotifications() {
  const query = useMe();
  return {
    ...query,
    data: query.data?.notifications ?? null,
  };
}

export function useUpdateNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prefs) => profileApi.updateNotifications(prefs),
    onMutate: async (prefs) => {
      await queryClient.cancelQueries({ queryKey: profileKeys.me });
      const prev = queryClient.getQueryData(profileKeys.me);
      queryClient.setQueryData(profileKeys.me, (old) => ({
        ...old,
        notifications: { ...old?.notifications, ...prefs },
      }));
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      queryClient.setQueryData(profileKeys.me, ctx?.prev);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.me }),
  });
}

// ─── Security ─────────────────────────────────────────────────────────────────
export function useSecurity() {
  const query = useMe();
  return {
    ...query,
    data: query.data?.security ?? null,
  };
}

export function useUpdate2fa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enabled) => profileApi.update2fa(enabled),
    onMutate: async (enabled) => {
      await queryClient.cancelQueries({ queryKey: profileKeys.me });
      const prev = queryClient.getQueryData(profileKeys.me);
      queryClient.setQueryData(profileKeys.me, (old) => ({
        ...old,
        security: { ...old?.security, twoFactorEnabled: enabled },
      }));
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      queryClient.setQueryData(profileKeys.me, ctx?.prev);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.me }),
  });
}

// ─── Full profile update (PUT /account/profile) ──────────────────────────────
export function useUpdateFullProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => profileApi.updateProfile(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.me }),
  });
}

// ─── Change email ─────────────────────────────────────────────────────────────
export function useUpdateEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => profileApi.updateEmail(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.me }),
  });
}

// ─── Change phone ─────────────────────────────────────────────────────────────
export function useUpdatePhone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => profileApi.updatePhone(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.me }),
  });
}

// ─── Direct password change (no OTP) ─────────────────────────────────────────
export function useChangePasswordDirect() {
  return useMutation({
    mutationFn: (data) => profileApi.changePasswordDirect(data),
  });
}

// ─── OTP-based password change (POST /account/password/change) ───────────────
export function useChangePasswordOtp() {
  return useMutation({
    mutationFn: (data) => profileApi.changePasswordOtp(data),
  });
}

// ─── Set default address ──────────────────────────────────────────────────────
export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId) => profileApi.setDefaultAddress(addressId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.me }),
  });
}

// ─── Upload avatar ────────────────────────────────────────────────────────────
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => profileApi.uploadAvatar(file),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.me }),
  });
}

// ─── Permanent account deletion ───────────────────────────────────────────────
export function useDeleteAccount() {
  return useMutation({
    mutationFn: profileApi.deleteAccount,
  });
}

// ─── Deactivate ───────────────────────────────────────────────────────────────
export function useDeactivateAccount() {
  return useMutation({
    mutationFn: profileApi.deactivateAccount,
  });
}
