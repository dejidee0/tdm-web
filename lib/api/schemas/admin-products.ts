// lib/api/schemas/admin-products.ts
//
// SERVER-ONLY. See the header of ./common.ts.
//
// Response shapes for the AdminProducts surface, recorded from the dev backend
// by `node scripts/record-mutations.mjs --write` — the spec declares all four as
// a bare `200: OK`. Snapshots are in contracts/admin-products-*.json.
//
// The create, update and bulk responses each return a Product with exactly the
// same 41 fields that `GET /Products` returns, so `productSchema` is reused
// rather than duplicated. That was verified by diffing the recorded shapes, not
// assumed.

import { z } from "zod";
import { envelope } from "./common";
import { productSchema, productImageSchema } from "./catalog";

/** POST /admin/AdminProducts → the created Product. */
export const adminProductCreateResponse = envelope(productSchema);

/** PUT /admin/AdminProducts/{id} → the updated Product. */
export const adminProductUpdateResponse = envelope(productSchema);

/** DELETE /admin/AdminProducts/{id} → `data` is a bare boolean, not a Product. */
export const adminProductDeleteResponse = envelope(z.boolean());

/**
 * POST /admin/AdminProducts/bulk → a per-row report.
 *
 * Note the envelope: created rows arrive under `data.createdProducts`, **not**
 * `data[]` like every other create on this surface. Assuming `data[]` here
 * orphaned a probe product the first time the recorder ran.
 *
 * `failures` was empty in the only observed response, so its element type is
 * genuinely unknown — `z.unknown()`, not a guess.
 */
export const adminProductBulkResponse = envelope(
  z.looseObject({
    totalSubmitted: z.number(),
    created: z.number(),
    failed: z.number(),
    failures: z.array(z.unknown()),
    createdProducts: z.array(productSchema),
  }),
);

/**
 * POST /admin/adminproducts/{productId}/images/upload → ApiEnvelope<ProductImageDto>
 *
 * Multipart, field `file`; the rest (`isPrimary`, `displayOrder`, `altText`) are
 * query params. This endpoint post-dates the OpenAPI snapshot, so its shape was
 * recorded, not read. See contracts/admin-product-image.json.
 */
export const adminProductImageUploadResponse = envelope(productImageSchema);
