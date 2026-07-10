// lib/api/types.ts
//
// Shapes of the .NET backend's responses, as observed against the live API —
// not invented. Where a field was null in every sampled response, it is typed
// `unknown` rather than guessed at; narrow it at the call site, or widen this
// type once you have seen real data.
//
// This is the boundary. Everything upstream of it is `any`, everything
// downstream of it should be typed.

/**
 * Every endpoint under /api/v1 wraps its payload in this envelope.
 *
 * The one exception is GET /flooring, which returns FlooringResponse bare —
 * see the note there.
 */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

/** Standard pagination wrapper, used by /products and /materials. */
export interface Paged<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** BrandType is an integer on the wire. */
export const BrandType = {
  TBM: 1,
  Bogat: 2,
} as const;
export type BrandType = (typeof BrandType)[keyof typeof BrandType];

/**
 * Pricing is a discriminated union, and this is the single most useful thing in
 * this file.
 *
 * The backend returns `price: null` for quote-only products, and signals it with
 * `showPrice: false` + `priceDisplay: "Request Price"`. Verified across every
 * sampled product: `price === null` if and only if `showPrice === false`.
 *
 * So you cannot reach `.price` without first narrowing on `showPrice`, and the
 * always-safe field to render is `priceDisplay`.
 */
export type ProductPricing =
  | {
      showPrice: true;
      price: number;
      priceDisplay: string;
      compareAtPrice: number | null;
    }
  | {
      showPrice: false;
      price: null;
      priceDisplay: string;
      compareAtPrice: number | null;
    };

interface ProductFields {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  slug: string;
  sku: string;

  brandType: BrandType;
  brandName: string;
  /** Integer discriminator; `productTypeName` is the readable form (e.g. "PhysicalProduct"). */
  productType: number;
  productTypeName: string;

  categoryId: string;
  categoryName: string;

  stockQuantity: number;
  inStock: boolean;
  trackInventory: boolean;
  isActive: boolean;
  isFeatured: boolean;

  /** Rendered directly as an <Image src>, so: absolute or root-relative URLs. */
  images: string[];
  primaryImageUrl: string | null;
  similarProducts: Product[];

  /** ISO 8601. */
  createdAt: string;
  updatedAt: string;

  // ── Never observed non-null ────────────────────────────────────────────────
  // Typed `unknown` on purpose. Every sampled response returned null for these,
  // so their element type is unknown — guessing `string[]` here would be a lie
  // the compiler then enforces. Narrow at the call site, and replace `unknown`
  // with the real type the first time you see one populated.
  tags: unknown;
  aiKeywords: unknown;
  materialType: unknown;
  qualityTier: unknown;
  recommendedFor: unknown;
  specifications: unknown;
  keyFeatures: unknown;
  whatsIncluded: unknown;
  whatsNotIncluded: unknown;
  dimensions: unknown;
  warranty: unknown;
  finishType: unknown;
  installationType: unknown;
  material: unknown;
  color: unknown;
}

/** Identical shape from /products, /products/{id}, /products/{id}/related, /materials. */
export type Product = ProductFields & ProductPricing;

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  brandType: BrandType;
  brandName: string;
  parentCategoryId: string | null;
  parentCategoryName: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  subCategories: Category[];
  productCount: number;
}

// ── The list endpoints: a second envelope, and a second product shape ────────
//
// GET /flooring and GET /materials/list do not use ApiEnvelope. They return
// `{ pagination, filters, <collection> }` with their own pagination field names
// (`page`/`limit`/`total`/`hasMore`, not `pageNumber`/`pageSize`/`totalCount`/
// `hasNextPage`). Do not reach for `Paged` here.
//
// They also disagree with each other: /flooring returns full Products, while
// /materials/list returns a flattened summary with different field names and no
// `showPrice` discriminator.

export interface ListPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ListFilters {
  category: string | null;
  materialType: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  isFeatured: boolean | null;
  sort: string | null;
}

/** GET /flooring — full Products, bare (no ApiEnvelope). */
export interface FlooringResponse {
  products: Product[];
  pagination: ListPagination;
  filters: ListFilters;
}

/**
 * GET /materials/list — a flattened projection, NOT a Product.
 *
 * Note `price` is nullable here with no `showPrice` flag to discriminate on,
 * so unlike Product there is no way to know whether null means "quote only" or
 * "missing". Check for null before formatting.
 */
export interface MaterialSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  /** Never observed non-null; a URL when present. */
  image: string | null;
  /** Category name, not an id. */
  category: string;
  inStock: boolean;
  similarProducts: unknown[];
}

export interface MaterialListResponse {
  materials: MaterialSummary[];
  pagination: ListPagination;
  filters: ListFilters;
}

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
