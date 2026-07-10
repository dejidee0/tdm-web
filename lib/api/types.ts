// lib/api/types.ts
//
// Types for the .NET backend's responses. Every one is inferred from the Zod
// schema that validates it, so the runtime check and the compile-time type
// cannot drift apart — there is one definition, in lib/api/schemas/.
//
// This module is safe to import from client code **with `import type`**. The
// schema imports below are type-only, so Zod is erased at compile time and
// never reaches the browser bundle. Value-importing lib/api/schemas/* from a
// client component is a lint error.
//
// The shapes were derived by calling the live API, not invented: the backend's
// OpenAPI document declares all 266 operations as a bare `200: OK` with no body
// type. Fields that were null in every observed response are `unknown` on
// purpose. See CLAUDE.md, "Backend response shapes".

import type { z } from "zod";
import type {
  brandTypeSchema,
  categoryListResponse,
  categoryResponse,
  categorySchema,
  flooringResponse,
  materialListResponse,
  materialSummarySchema,
  productArrayResponse,
  productListResponse,
  productResponse,
  productSchema,
} from "./schemas/catalog";
import type {
  listFiltersSchema,
  listPaginationSchema,
} from "./schemas/common";

// ── Envelopes ────────────────────────────────────────────────────────────────

/** `{ success, message, data, errors }` — the wrapper on most of /api/v1. */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
}

/** Pagination inside the envelope, used by /products and /materials. */
export interface Paged<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ── Domain ───────────────────────────────────────────────────────────────────

/** TBM = 1, Bogat = 2. */
export type BrandType = z.infer<typeof brandTypeSchema>;

/**
 * `price` is `null` exactly when `showPrice` is `false` (quote-only products,
 * `priceDisplay: "Request Price"`). Narrow on `showPrice` before touching
 * `price`; render `priceDisplay` when in doubt — it is always a string.
 */
export type Product = z.infer<typeof productSchema>;
export type Category = z.infer<typeof categorySchema>;

/** /materials/list returns this, not a Product. `price` is nullable with no discriminant. */
export type MaterialSummary = z.infer<typeof materialSummarySchema>;

export type ListPagination = z.infer<typeof listPaginationSchema>;
export type ListFilters = z.infer<typeof listFiltersSchema>;

// ── Whole-response types ─────────────────────────────────────────────────────

export type ProductListResponse = z.infer<typeof productListResponse>;
export type ProductResponse = z.infer<typeof productResponse>;
export type ProductArrayResponse = z.infer<typeof productArrayResponse>;
export type CategoryListResponse = z.infer<typeof categoryListResponse>;
export type CategoryResponse = z.infer<typeof categoryResponse>;

/** /flooring — no envelope. */
export type FlooringResponse = z.infer<typeof flooringResponse>;
/** /materials/list — no envelope, and not Product[]. */
export type MaterialListResponse = z.infer<typeof materialListResponse>;

// ── Request params ───────────────────────────────────────────────────────────

export interface ProductListParams {
  pageNumber?: number;
  pageSize?: number;
  brandType?: BrandType;
  productType?: number;
  categoryId?: string;
  searchTerm?: string;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  /** Defaults to true when omitted. */
  activeOnly?: boolean;
}

export interface MaterialListParams {
  pageNumber?: number;
  pageSize?: number;
}

/** Error thrown by the api* helpers. `message` is already user-safe. */
export interface ApiError extends Error {
  status: number;
  backendMessage: string;
}
