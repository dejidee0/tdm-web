// hooks/use-project.js
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/lib/api/projects";

// ── Query keys ─────────────────────────────────────────────────────────────────
export const projectKeys = {
  all: ["projects"],
  list: () => ["projects", "list"],
  detail: (id) => ["projects", id],
  timeline: (id) => ["projects", id, "timeline"],
  documents: (id) => ["projects", id, "documents"],
  gallery: (id) => ["projects", id, "gallery"],
  public: () => ["projects", "public"],
};

// ── Project list ────────────────────────────────────────────────────────────────
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: projectsApi.getProjects,
    staleTime: 5 * 60 * 1000,
    select: (res) => res?.data?.items ?? res?.data ?? res?.items ?? res,
  });
}

// ── Project detail ──────────────────────────────────────────────────────────────
export function useProject(id) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: (count, err) => err?.status !== 404 && count < 2,
    select: (res) => res?.data ?? res,
  });
}

// ── Timeline ────────────────────────────────────────────────────────────────────
export function useProjectTimeline(projectId) {
  return useQuery({
    queryKey: projectKeys.timeline(projectId),
    queryFn: () => projectsApi.getTimeline(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
    select: (res) => res?.data ?? res,
  });
}

// ── Documents ───────────────────────────────────────────────────────────────────
export function useProjectDocuments(projectId) {
  return useQuery({
    queryKey: projectKeys.documents(projectId),
    queryFn: () => projectsApi.getDocuments(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
    select: (res) => res?.data?.items ?? res?.data ?? res?.items ?? [],
  });
}

export function useUploadProjectDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, file }) =>
      projectsApi.uploadDocument(projectId, file),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.documents(projectId) });
    },
  });
}

// ── Gallery ─────────────────────────────────────────────────────────────────────
export function useProjectGallery(projectId) {
  return useQuery({
    queryKey: projectKeys.gallery(projectId),
    queryFn: () => projectsApi.getGallery(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
    select: (res) => res?.data?.items ?? res?.data ?? res?.items ?? [],
  });
}

export function useUploadGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, file }) =>
      projectsApi.uploadGalleryImage(projectId, file),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.gallery(projectId) });
    },
  });
}

// ── Public project gallery ──────────────────────────────────────────────────────
export function usePublicProjects(params = {}) {
  return useQuery({
    queryKey: projectKeys.public(),
    queryFn: () => projectsApi.getPublicProjects(params),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.items ?? res?.data ?? res?.items ?? [],
  });
}
