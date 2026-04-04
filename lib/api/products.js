// lib/api/products.js
// All product, material, flooring, and category API calls.
// Public endpoints go through local Next.js route handlers (no auth required).

async function apiFetch(path, options = {}) {
  const res = await fetch(path, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = `API error ${res.status}`;
    try { message = JSON.parse(text)?.message || message; } catch {}
    throw Object.assign(new Error(message), { status: res.status });
  }
  const text = await res.text();
  return text ? JSON.parse(text) : { success: true };
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  /**
   * GET /api/v1/products
   * @param {{ searchTerm?, categoryId?, minPrice?, maxPrice?, isFeatured?,
   *           productType?, brandType?, pageNumber?, pageSize?, activeOnly? }} params
   */
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.set("pageNumber", String(params.pageNumber));
    if (params.pageSize) query.set("pageSize", String(params.pageSize));
    if (params.brandType != null) query.set("brandType", String(params.brandType));
    if (params.productType != null) query.set("productType", String(params.productType));
    if (params.categoryId) query.set("categoryId", params.categoryId);
    if (params.searchTerm) query.set("searchTerm", params.searchTerm);
    if (params.isFeatured != null) query.set("isFeatured", String(params.isFeatured));
    if (params.minPrice != null) query.set("minPrice", String(params.minPrice));
    if (params.maxPrice != null) query.set("maxPrice", String(params.maxPrice));
    query.set("activeOnly", String(params.activeOnly ?? true));
    return apiFetch(`/api/products?${query.toString()}`);
  },

  /** GET /api/v1/products/featured */
  getFeatured: () => apiFetch("/api/products/featured"),

  /** GET /api/v1/products/{id} */
  getById: (id) => apiFetch(`/api/products/${id}`),

  /** GET /api/v1/products/slug/{slug} */
  getBySlug: (slug) => apiFetch(`/api/products/slug/${slug}`),

  /** GET /api/v1/products/{id}/related */
  getRelated: (id) => apiFetch(`/api/products/${id}/related`),
};

// ─── Materials ────────────────────────────────────────────────────────────────

export const materialsApi = {
  /** GET /api/v1/materials */
  getMaterials: (params = {}) => {
    const query = new URLSearchParams();
    if (params.pageNumber) query.set("pageNumber", String(params.pageNumber));
    if (params.pageSize) query.set("pageSize", String(params.pageSize));
    const q = query.toString();
    return apiFetch(`/api/materials${q ? `?${q}` : ""}`);
  },

  /** GET /api/v1/materials/list — with individual filters */
  getMaterialsList: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/materials/list${query ? `?${query}` : ""}`);
  },

  /** GET /api/v1/materials/{idOrSlug} */
  getMaterial: (idOrSlug) => apiFetch(`/api/materials/${idOrSlug}`),
};

// ─── Flooring ─────────────────────────────────────────────────────────────────

export const flooringApi = {
  /** GET /api/v1/flooring */
  getFlooring: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/flooring${query ? `?${query}` : ""}`);
  },
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
  /** GET /api/v1/categories */
  getCategories: () => apiFetch("/api/categories"),

  /** GET /api/v1/categories/{id} */
  getCategoryById: (id) => apiFetch(`/api/categories/${id}`),

  /** GET /api/v1/categories/slug/{slug} */
  getCategoryBySlug: (slug) => apiFetch(`/api/categories/slug/${slug}`),

  /** GET /api/v1/categories/brand/{type} — BrandType: TBM=1, Bogat=2 */
  getCategoriesByBrand: (type) => apiFetch(`/api/categories/brand/${type}`),
};
