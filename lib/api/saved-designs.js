// lib/api/saved-designs.js  (formerly saved-items.js — kept filename for import compatibility)
// All requests route through the local Next.js /api/saved/* handlers,
// which in turn call the backend with the server-side httpOnly authToken.

async function apiFetch(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const text = await res.text().catch(() => "");
  let json = null;
  try { json = JSON.parse(text); } catch {}
  if (!res.ok) {
    throw new Error(json?.message || json?.title || `API error ${res.status}`);
  }
  return json ?? { success: true };
}

export const savedItemsApi = {
  /**
   * GET /api/v1/saved
   * Query params: category, search, sortBy (newest|oldest|price_asc|price_desc), page, limit
   */
  getSavedItems: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== "all") params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.page) params.set("page", filters.page);
    if (filters.limit) params.set("limit", filters.limit);
    const query = params.toString();
    return apiFetch(`/saved${query ? `?${query}` : ""}`);
  },

  /**
   * DELETE /api/v1/saved/{id}
   */
  removeFromSaved: (itemId) => apiFetch(`/saved/${itemId}`, { method: "DELETE" }),

  /**
   * POST /api/v1/saved/{id}/add-to-cart
   */
  addToCart: (itemId) =>
    apiFetch(`/saved/${itemId}/add-to-cart`, { method: "POST" }),

  /**
   * POST /api/v1/saved/{id}/add-to-moodboard
   */
  addToMoodboard: (itemId, boardId = null) =>
    apiFetch(`/saved/${itemId}/add-to-moodboard`, {
      method: "POST",
      body: JSON.stringify(boardId ? { boardId } : {}),
    }),

  /**
   * POST /api/v1/saved/create-board
   */
  createBoard: (itemIds, boardName) =>
    apiFetch("/saved/create-board", {
      method: "POST",
      body: JSON.stringify({ itemIds, boardName }),
    }),

  /**
   * POST /api/v1/saved/buy-all
   */
  buyAll: (itemIds) =>
    apiFetch("/saved/buy-all", {
      method: "POST",
      body: JSON.stringify({ itemIds }),
    }),
};
