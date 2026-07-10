// lib/api/products.ts
// All product, material, flooring, and category API calls.
// Public endpoints go through local Next.js route handlers (no auth required).
//
// Return types describe the raw response, envelope and all. Callers unwrap it
// (React Query hooks do this in `select:`). Do not unwrap here — the envelope's
// `success`/`message` are load-bearing at some call sites.

import { logApiError, getFriendlyMessage } from "@/lib/errors";
import type {
  ApiEnvelope,
  ApiError,
  BrandType,
  Category,
  FlooringResponse,
  MaterialListParams,
  MaterialListResponse,
  Paged,
  Product,
  ProductListParams,
} from "./types";

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let json: { message?: string; title?: string } | null = null;
    try {
      json = JSON.parse(text);
    } catch {}
    const backendMessage = json?.message || json?.title || `API error ${res.status}`;
    logApiError(path, res.status, json ?? text);
    const error = new Error(
      getFriendlyMessage(res.status, backendMessage),
    ) as ApiError;
    error.status = res.status;
    error.backendMessage = backendMessage;
    throw error;
  }
  const text = await res.text();
  // A 2xx with an empty body means "it worked" — /saved DELETE does this.
  return (text ? JSON.parse(text) : { success: true }) as T;
}

/** URLSearchParams stringifies `undefined` to "undefined"; drop empties instead. */
function toQuery(params: Record<string, string | number | boolean | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }
  return query.toString();
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  /** GET /api/v1/products */
  getProducts: (params: ProductListParams = {}) => {
    const query = toQuery({
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      brandType: params.brandType,
      productType: params.productType,
      categoryId: params.categoryId,
      searchTerm: params.searchTerm,
      isFeatured: params.isFeatured,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      activeOnly: params.activeOnly ?? true,
    });
    return apiFetch<ApiEnvelope<Paged<Product>>>(`/api/products?${query}`);
  },

  /** GET /api/v1/products/featured — a bare array, not a Paged. */
  getFeatured: () => apiFetch<ApiEnvelope<Product[]>>("/api/products/featured"),

  /** GET /api/v1/products/{id} */
  getById: (id: string) => apiFetch<ApiEnvelope<Product>>(`/api/products/${id}`),

  /** GET /api/v1/products/slug/{slug} */
  getBySlug: (slug: string) =>
    apiFetch<ApiEnvelope<Product>>(`/api/products/slug/${slug}`),

  /** GET /api/v1/products/{id}/related */
  getRelated: (id: string) =>
    apiFetch<ApiEnvelope<Product[]>>(`/api/products/${id}/related`),
};

// ─── Materials ────────────────────────────────────────────────────────────────

export const materialsApi = {
  /** GET /api/v1/materials — Paged<Product>, same shape as /products. */
  getMaterials: (params: MaterialListParams = {}) => {
    const query = toQuery({
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    });
    return apiFetch<ApiEnvelope<Paged<Product>>>(
      `/api/materials${query ? `?${query}` : ""}`,
    );
  },

  /**
   * GET /api/v1/materials/list — NOT an ApiEnvelope, and NOT Product[].
   * Returns `{ materials: MaterialSummary[], pagination, filters }`.
   */
  getMaterialsList: (
    params: Record<string, string | number | boolean | undefined> = {},
  ) => {
    const query = toQuery(params);
    return apiFetch<MaterialListResponse>(
      `/api/materials/list${query ? `?${query}` : ""}`,
    );
  },

  /** GET /api/v1/materials/{idOrSlug} — a full Product. */
  getMaterial: (idOrSlug: string) =>
    apiFetch<ApiEnvelope<Product>>(`/api/materials/${idOrSlug}`),
};

// ─── Flooring ─────────────────────────────────────────────────────────────────

export const flooringApi = {
  /** GET /api/v1/flooring — NOT an ApiEnvelope. Returns full Products. */
  getFlooring: (
    params: Record<string, string | number | boolean | undefined> = {},
  ) => {
    const query = toQuery(params);
    return apiFetch<FlooringResponse>(
      `/api/flooring${query ? `?${query}` : ""}`,
    );
  },
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
  /** GET /api/v1/categories */
  getCategories: () => apiFetch<ApiEnvelope<Category[]>>("/api/categories"),

  /** GET /api/v1/categories/{id} */
  getCategoryById: (id: string) =>
    apiFetch<ApiEnvelope<Category>>(`/api/categories/${id}`),

  /** GET /api/v1/categories/slug/{slug} */
  getCategoryBySlug: (slug: string) =>
    apiFetch<ApiEnvelope<Category>>(`/api/categories/slug/${slug}`),

  /** GET /api/v1/categories/brand/{type} */
  getCategoriesByBrand: (type: BrandType) =>
    apiFetch<ApiEnvelope<Category[]>>(`/api/categories/brand/${type}`),
};
