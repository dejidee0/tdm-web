// lib/api/schemas/ai.ts
//
// SERVER-ONLY. See the header of ./common.ts.
//
// Response shapes for the AI generation surface. Recorded from the live backend
// — the OpenAPI document declares every operation as a bare `200: OK`.

import { z } from "zod";

/**
 * One selectable design style. `id` is a slug ("modern", "wabi-sabi"); it is
 * the value the `style` field on GenerateImageDto / GenerateVideoDto expects.
 * `name` is the display label.
 */
export const aiStyleSchema = z.looseObject({
  id: z.string(),
  name: z.string(),
});

/** GET /ai/styles → a bare array, no envelope. */
export const aiStylesResponse = z.array(aiStyleSchema);
