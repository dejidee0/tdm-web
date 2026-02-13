// hooks/useProfile.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/lib/api/profile";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.getProfile,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdatePersonalInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updatePersonalInfo,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });
}

export function useUpdateEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateEmail,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });
}

export function useUpdatePhone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updatePhone,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ addressId, data }) =>
      profileApi.updateAddress(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      profileApi.changePassword(currentPassword, newPassword),
  });
}

export function useUpdateNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: profileApi.deleteAccount,
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.uploadAvatar,
    onMutate: async (file) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["profile"]);

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData(["profile"]);

      // Optimistically update with preview
      const previewUrl = URL.createObjectURL(file);
      queryClient.setQueryData(["profile"], (old) => ({
        ...old,
        avatar: previewUrl,
      }));

      return { previousProfile };
    },
    onError: (err, newFile, context) => {
      // Rollback on error
      queryClient.setQueryData(["profile"], context.previousProfile);
    },
    onSuccess: (data) => {
      // Update with actual uploaded URL
      queryClient.setQueryData(["profile"], (old) => ({
        ...old,
        avatar: data.avatarUrl,
      }));
    },
    onSettled: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });
}
