// lib/api/schemas/common.ts
//
// SERVER-ONLY. Never value-import this from a client component — it would pull
// Zod into the browser bundle. Client code imports the *types* from
// lib/api/types.ts, which are `z.infer`red and erased at compile time.
// Lint enforces this (see eslint.guardrails.mjs).
//
// Why schemas at all: the backend's OpenAPI document declares all 266
// operations as a bare `200: OK` with no body type, so there is nothing to
// generate types from. A hand-written `interface` is a wish; a schema is a wish
// plus a smoke alarm. See lib/api/contract.ts for how mismatches are reported.

import { z } from "zod";

/**
 * Every response schema must be *loose*.
 *
 * `z.object()` strips unknown keys, so a field the backend adds tomorrow would
 * be silently deleted before any component saw it — the exact opposite of the
 * fail-open behaviour we want. `z.looseObject()` keeps them.
 */

/** `{ success, message, data, errors }` — the envelope on most of /api/v1. */
export const envelope = <T extends z.ZodTypeAny>(data: T) =>
  z.looseObject({
    success: z.boolean(),
    message: z.string(),
    data,
    // Observed only as null. Typed `unknown` rather than guessed, so a
    // populated error array never trips the drift alarm.
    errors: z.unknown(),
  });

/** Pagination used by /products and /materials, inside the envelope. */
export const paged = <T extends z.ZodTypeAny>(item: T) =>
  z.looseObject({
    items: z.array(item),
    pageNumber: z.number(),
    pageSize: z.number(),
    totalCount: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  });

/**
 * The un-enveloped list endpoints (/flooring, /materials/list) use their own
 * pagination field names. Do not confuse this with `paged`.
 */
export const listPaginationSchema = z.looseObject({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasMore: z.boolean(),
});

export const listFiltersSchema = z.looseObject({
  category: z.string().nullable(),
  materialType: z.string().nullable(),
  minPrice: z.number().nullable(),
  maxPrice: z.number().nullable(),
  isFeatured: z.boolean().nullable(),
  sort: z.string().nullable(),
});

export type ListPagination = z.infer<typeof listPaginationSchema>;
export type ListFilters = z.infer<typeof listFiltersSchema>;
