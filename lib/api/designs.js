// lib/api/designs.js
// All requests go through the Next.js proxy (/api/proxy/v1).

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

// ─── Saved Designs ────────────────────────────────────────────────────────────

export const designsApi = {
  /**
   * GET /api/v1/designs
   * Only pass pagination params — roomType/sortBy/view are not in the API spec
   * and cause a backend 500. UI filtering is done client-side in the hook.
   */
  getDesigns: ({ page, pageSize } = {}) => {
    const params = new URLSearchParams();
    if (page) params.set("page", page);
    if (pageSize) params.set("pageSize", pageSize);
    const query = params.toString();
    return proxyFetch(`/designs${query ? `?${query}` : ""}`);
  },

  /**
   * GET /api/v1/designs/{id}
   */
  getDesignDetails: (designId) => proxyFetch(`/designs/${designId}`),

  /**
   * POST /api/v1/designs/{id}/favorite
   * Toggles the favourite state.
   */
  toggleFavorite: (designId) =>
    proxyFetch(`/designs/${designId}/favorite`, { method: "POST" }),

  /**
   * PATCH /api/v1/designs/{id}/visibility
   * @param {string} designId
   * @param {"public"|"private"} visibility
   */
  setVisibility: (designId, visibility) =>
    proxyFetch(`/designs/${designId}/visibility`, {
      method: "PATCH",
      body: JSON.stringify({ visibility }),
    }),

  /**
   * GET /api/v1/designs/{id}/download
   * Returns a download URL for the design image.
   */
  downloadDesign: (designId) => proxyFetch(`/designs/${designId}/download`),

  /**
   * POST /api/v1/designs/{id}/share
   */
  shareDesign: (designId) =>
    proxyFetch(`/designs/${designId}/share`, { method: "POST" }),

  /**
   * DELETE /api/v1/designs/{id}
   */
  deleteDesign: (designId) =>
    proxyFetch(`/designs/${designId}`, { method: "DELETE" }),
};

// ─── Design Sessions ──────────────────────────────────────────────────────────

export const designSessionsApi = {
  /**
   * POST /api/v1/designs/sessions
   * @param {{ projectName, roomType, visionText?, tier, roomDimensions? }} data
   *   tier: Luxury=1 | Economic=2
   */
  createSession: (data) =>
    proxyFetch("/designs/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /**
   * GET /api/v1/designs/sessions
   */
  getSessions: () => proxyFetch("/designs/sessions"),

  /**
   * GET /api/v1/designs/sessions/{sessionId}
   */
  getSession: (sessionId) => proxyFetch(`/designs/sessions/${sessionId}`),

  /**
   * GET /api/v1/designs/sessions/{sessionId}/status
   * Poll until status is "Generated" or "Failed".
   */
  pollStatus: (sessionId) =>
    proxyFetch(`/designs/sessions/${sessionId}/status`),

  /**
   * POST /api/v1/designs/sessions/{sessionId}/upload
   * Multipart/form-data — field name: "image" — max 10 MB — JPEG/PNG/WEBP
   * @param {string} sessionId
   * @param {File} file
   */
  uploadPhoto: async (sessionId, file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `/api/proxy/v1/designs/sessions/${sessionId}/upload`,
      {
        method: "POST",
        credentials: "include",
        body: formData, // Browser sets correct multipart Content-Type with boundary
      },
    );
    if (res.status === 401) throw new Error("UNAUTHORIZED");
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let message = `Upload error ${res.status}`;
      try { message = JSON.parse(text)?.message || message; } catch {}
      throw Object.assign(new Error(message), { status: res.status });
    }
    return res.json();
  },

  /**
   * POST /api/v1/designs/sessions/{sessionId}/generate
   * Triggers AI image generation. Poll pollStatus() to track progress.
   */
  generate: (sessionId) =>
    proxyFetch(`/designs/sessions/${sessionId}/generate`, { method: "POST" }),

  /**
   * POST /api/v1/designs/sessions/{sessionId}/add-to-cart
   * Adds the Bill-of-Materials items from the generated design to the cart.
   */
  addBomToCart: (sessionId) =>
    proxyFetch(`/designs/sessions/${sessionId}/add-to-cart`, {
      method: "POST",
    }),
};
