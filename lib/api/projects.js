// lib/api/projects.js
// All project endpoints — all Bearer auth, routed through /api/proxy/v1.

async function proxyFetch(path, options = {}) {
  const res = await fetch(`/api/proxy/v1${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = `API error ${res.status}`;
    try { message = JSON.parse(text)?.message || message; } catch {}
    throw Object.assign(new Error(message), { status: res.status });
  }
  const text = await res.text();
  return text ? JSON.parse(text) : { success: true };
}

export const projectsApi = {
  /** GET /api/v1/projects — list user's projects */
  getProjects: () => proxyFetch("/projects"),

  /** GET /api/v1/projects/{projectId} */
  getProject: (projectId) => proxyFetch(`/projects/${projectId}`),

  /** GET /api/v1/projects/{projectId}/timeline */
  getTimeline: (projectId) => proxyFetch(`/projects/${projectId}/timeline`),

  /** GET /api/v1/projects/{projectId}/documents */
  getDocuments: (projectId) => proxyFetch(`/projects/${projectId}/documents`),

  /**
   * POST /api/v1/projects/{projectId}/documents — upload document (multipart)
   * @param {string} projectId
   * @param {File} file
   */
  uploadDocument: async (projectId, file) => {
    const formData = new FormData();
    formData.append("document", file);
    const res = await fetch(`/api/proxy/v1/projects/${projectId}/documents`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (res.status === 401) throw new Error("UNAUTHORIZED");
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let message = `Upload error ${res.status}`;
      try { message = JSON.parse(text)?.message || message; } catch {}
      throw Object.assign(new Error(message), { status: res.status });
    }
    return res.json();
  },

  /** GET /api/v1/projects/{projectId}/gallery */
  getGallery: (projectId) => proxyFetch(`/projects/${projectId}/gallery`),

  /**
   * POST /api/v1/projects/{projectId}/gallery — upload gallery image (multipart)
   * @param {string} projectId
   * @param {File} file
   */
  uploadGalleryImage: async (projectId, file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`/api/proxy/v1/projects/${projectId}/gallery`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (res.status === 401) throw new Error("UNAUTHORIZED");
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let message = `Upload error ${res.status}`;
      try { message = JSON.parse(text)?.message || message; } catch {}
      throw Object.assign(new Error(message), { status: res.status });
    }
    return res.json();
  },

  /** GET /api/v1/public/projects — public project gallery (no auth required) */
  getPublicProjects: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`/api/proxy/v1/public/projects${query ? `?${query}` : ""}`)
      .then((r) => {
        if (!r.ok) throw new Error(`API error ${r.status}`);
        return r.json();
      });
  },
};
