// lib/api/ai-services.js
// AI Services — all Bearer auth, routed through /api/proxy/v1.
// Distinct from the AI Assistant (chat) which has its own dedicated routes.

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

// ─── AI Projects ──────────────────────────────────────────────────────────────

export const aiProjectsApi = {
  /**
   * POST /api/v1/ai/upload-room — upload a source image
   * @param {File} file
   * @returns {{ success: true, imageUrl: string }}
   */
  uploadRoom: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch("/api/proxy/v1/ai/upload-room", {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then(async (res) => {
      if (res.status === 401) throw new Error("UNAUTHORIZED");
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let message = `Upload error ${res.status}`;
        try { message = JSON.parse(text)?.message || message; } catch {}
        throw Object.assign(new Error(message), { status: res.status });
      }
      return res.json();
    });
  },

  /**
   * POST /api/v1/ai/projects — create an AI project
   * @param {{ sourceImageUrl: string, outputType: number, prompt: string, contextLabel?: string }} data
   */
  createProject: (data) =>
    proxyFetch("/ai/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** GET /api/v1/ai/projects — list AI projects */
  getProjects: () => proxyFetch("/ai/projects"),
};

// ─── AI Generation ────────────────────────────────────────────────────────────

export const aiGenerationApi = {
  /**
   * POST /api/v1/ai/generate/image
   * @param {{ prompt, projectId, customizationLevel? }} data
   */
  generateImage: (data) =>
    proxyFetch("/ai/generate/image", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /**
   * POST /api/v1/ai/transform/image — transform an existing image
   * @param {{ imageUrl, prompt, projectId? }} data
   */
  transformImage: (data) =>
    proxyFetch("/ai/transform/image", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /**
   * POST /api/v1/ai/generate/video — generate fly-through video
   * @param {{ projectId, settings? }} data
   */
  generateVideo: (data) =>
    proxyFetch("/ai/generate/video", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── AI Usage & Credits ───────────────────────────────────────────────────────

export const aiUsageApi = {
  /** GET /api/v1/ai/usage/summary — AI usage summary for the authenticated user */
  getUsageSummary: () => proxyFetch("/ai/usage/summary"),

  /** GET /api/v1/ai/credits/balance — user AI credit balance */
  getCreditBalance: () => proxyFetch("/ai/credits/balance"),
};

// ─── AI Assistant Tool Actions ────────────────────────────────────────────────

export const aiAssistantApi = {
  /**
   * GET /api/v1/ai/assistant/tool-actions/{actionId}
   * Fetch details for a specific tool action.
   */
  getToolAction: (actionId) =>
    fetch(`/api/assistant/tool-actions/${actionId}`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) throw new Error("UNAUTHORIZED");
        if (!r.ok) throw new Error(`API error ${r.status}`);
        return r.json();
      }),
};
