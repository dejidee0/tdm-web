/**
 * Seed the content fields the Bogat catalogue was NOT seeded with
 * (whatsIncluded, whatsNotIncluded, recommendedFor, materialType,
 * installationType, specifications, metaTitle, metaDescription).
 *
 * Why a script and not the bulk-import UI:
 *   - POST /admin/AdminProducts/bulk *creates* — pointed at the existing 120 it
 *     would make 120 duplicates.
 *   - There is no bulk *update* endpoint; only PUT /admin/AdminProducts/{id}.
 *   - That PUT takes the full UpdateProductDto and REPLACES the record. So this
 *     script reads each product's current fields and merges the new content on
 *     top, then PUTs the complete object — nothing existing is lost.
 *   - UpdateProductDto has no `variants` field, so the 600–1200 mm pricing is
 *     untouched by a product update.
 *
 * Values are verbatim from docs/bogat-seeding-guide.md. It sets ONLY the fields
 * the guide prescribes; per-design attributes it can't know (material, colour,
 * finish, dimensions, warranty) are preserved as-is (left blank).
 *
 * Safe by construction:
 *   - Refuses any host but the dev backend.
 *   - Dry run by default; --write to perform.
 *   - The admin token is never printed or logged.
 *   - Idempotent: re-running sets the same values.
 *
 *   node scripts/seed-bogat-content.mjs                 # dry run: the plan
 *   node scripts/seed-bogat-content.mjs --collection=EAT # dry run, one collection
 *   node scripts/seed-bogat-content.mjs --write          # perform the updates
 *   node scripts/seed-bogat-content.mjs --collection=EAT --write
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEV_HOST_PATTERN = /^tbmdev-.*\.dtempurl\.com$/;
const WRITE = process.argv.includes("--write");
const ONLY = (process.argv.find((a) => a.startsWith("--collection=")) ?? "")
  .split("=")[1]
  ?.toUpperCase();

// ── Env ──────────────────────────────────────────────────────────────────────
function env(key) {
  const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
  const line = raw.split("\n").find((l) => l.startsWith(`${key}=`));
  if (!line) throw new Error(`${key} not found in .env.local`);
  return line.slice(key.length + 1).trim();
}

const API_URL = env("API_URL").replace(/\/+$/, "");
const host = new URL(API_URL).host;
if (!DEV_HOST_PATTERN.test(host)) {
  console.error(`Refusing to run against ${host}. Dev backend only.`);
  process.exit(1);
}

// ── Content, keyed by SKU prefix (BGT-<PREFIX>-NNN) ────────────────────────────
const COLLECTIONS = {
  EAT: {
    name: "Eclat Atelier",
    whatsIncluded: [
      "Stone basin and vanity top",
      "Cabinet",
      "Illuminated mirror",
      "LED drivers",
      "Mounting structure",
    ],
    whatsNotIncluded: ["Tapware", "Accessories", "Installation", "Delivery"],
    recommendedFor:
      "Primary and en-suite bathrooms seeking a complete, room-defining focal point.",
    metaDescription:
      "A complete, room-defining vanity: integrated stone basin, furniture-grade storage, illuminated mirror and architectural lighting. Made to order by Bogat.",
  },
  JOA: {
    name: "Joaillerie Stone",
    whatsIncluded: [
      "Stone basin",
      "Concealed support frame",
      "Lighting system (where specified)",
    ],
    whatsNotIncluded: [
      "Mirror",
      "Tapware",
      "Lower shelf",
      "Installation",
      "Delivery",
    ],
    recommendedFor:
      "Refined bathrooms wanting a jewellery-like stone basin over practical floating storage.",
    metaDescription:
      "Refined stone-and-cabinet vanities: a distinctive natural-stone basin above floating storage, with calm proportions and premium detailing. Made to order.",
  },
  MON: {
    name: "Monolithe Prive",
    whatsIncluded: [
      "Stone basin",
      "Cabinet",
      "Concealed steel support",
      "Standard waste",
    ],
    whatsNotIncluded: [
      "Mirror",
      "Tapware",
      "Lighting",
      "Installation",
      "Delivery",
    ],
    recommendedFor:
      "Bathrooms wanting a dramatic yet welcoming illuminated-stone focal point.",
    metaDescription:
      "Illuminated stone vanities using warm backlighting, glowing stone and halo mirrors to create a dramatic but welcoming focal point. Made to order by Bogat.",
  },
  LEV: {
    name: "Levitation Royale",
    whatsIncluded: ["Stone basin", "Concealed steel brackets", "Standard waste"],
    whatsNotIncluded: [
      "Decorative trap",
      "Tapware",
      "Mirror",
      "Lighting",
      "Installation",
      "Delivery",
    ],
    recommendedFor: "Powder rooms, guest suites and design-led bathrooms.",
    metaDescription:
      "A minimal floating stone washbasin with an open underside, precision wall fixing and an exposed designer bottle trap. Made to order by Bogat.",
  },
  SYM: {
    name: "Symphonie Deux",
    whatsIncluded: [
      "Two basins",
      "Vanity counter",
      "Cabinet or shelf configuration",
      "Concealed support",
    ],
    whatsNotIncluded: ["Tapware", "Mirror", "Installation", "Delivery"],
    recommendedFor:
      "Shared and master bathrooms wanting a twin-basin statement centrepiece.",
    metaDescription:
      "A confident collection of statement stone basins, deep profiles and furniture-like floating bases, developed as individual bathroom centrepieces.",
  },
  MSC: {
    name: "Maison Sculptee",
    whatsIncluded: ["Stone vessel", "Counter", "Concealed mounting system"],
    whatsNotIncluded: [
      "Cabinet",
      "Shelf",
      "Mirror",
      "Tapware",
      "Lighting",
      "Installation",
      "Delivery",
    ],
    recommendedFor:
      "Generous bathrooms, including twin-basin and open-shelf arrangements.",
    metaDescription:
      "Vessel and wider vanity compositions for generous bathrooms, including twin-basin and open-shelf arrangements. Made to order by Bogat.",
  },
  TER: {
    name: "Terra Sculpte",
    whatsIncluded: ["Artisan stone basin", "Concealed support"],
    whatsNotIncluded: [
      "Cabinet",
      "Mirror",
      "Tapware",
      "Lighting",
      "Installation",
      "Delivery",
    ],
    recommendedFor: "Serene resort-style and nature-led interiors.",
    metaDescription:
      "An artisanal series of tactile basins with natural, chiseled or irregular edges, grounded by warm timber and understated detailing. Made to order.",
  },
};

// Applied to every product (see the guide's "Universal values").
const UNIVERSAL = {
  materialType: "Natural stone",
  installationType: "Wall-mounted (floating)",
  specifications: [
    { key: "Lead time", value: "8–12 weeks (made to order)" },
    { key: "Available widths", value: "600 / 800 / 1000 / 1200 mm" },
    { key: "Bespoke widths", value: "Up to 1400 mm, quoted individually" },
    { key: "Stone", value: "Natural, individually selected slab" },
    { key: "Mounting", value: "Concealed wall support" },
  ],
};

function metaTitle(p) {
  const full = `${p.name} — ${p.categoryName} | Bogat`;
  return full.length <= 70 ? full : `${p.name} | Bogat`;
}

/**
 * A full UpdateProductDto: every existing field preserved from the read, the
 * guide's content overlaid. `?? null` / `Boolean(...)` guarantees no key goes
 * out as `undefined` (which JSON.stringify would drop, nulling it server-side).
 *
 * CRITICAL: `UpdateProductDto` now carries `variants` and `images` (nullable).
 * This is a full-replace PUT, so omitting them risks clearing them. We resend
 * both, remapped from the read — verified to round-trip cleanly (4 variants
 * stay 4, no duplication). Missing this would wipe every product's size pricing
 * and any uploaded photography.
 */
function buildUpdate(p, coll) {
  return {
    name: p.name,
    description: p.description,
    shortDescription: p.shortDescription ?? null,
    sku: p.sku ?? null,
    categoryId: p.categoryId,
    price: p.price ?? null,
    compareAtPrice: p.compareAtPrice ?? null,
    showPrice: Boolean(p.showPrice),
    stockQuantity: p.stockQuantity ?? null,
    lowStockThreshold: p.lowStockThreshold ?? null,
    trackInventory: Boolean(p.trackInventory),
    isActive: Boolean(p.isActive),
    isFeatured: Boolean(p.isFeatured),
    displayOrder: p.displayOrder ?? 0,
    size: p.size ?? null,
    // Not returned on read (write-only) — set fresh from the guide.
    metaTitle: metaTitle(p),
    metaDescription: coll.metaDescription,
    tags: p.tags ?? null,
    aiKeywords: p.aiKeywords ?? null,
    qualityTier: p.qualityTier ?? "Luxury",
    keyFeatures: p.keyFeatures ?? null,
    // Preserved per-design attributes the catalogue does not specify.
    dimensions: p.dimensions ?? null,
    warranty: p.warranty ?? null,
    finishType: p.finishType ?? null,
    material: p.material ?? null,
    color: p.color ?? null,
    // Preserved so the full-replace PUT never drops them.
    variants: (p.variants ?? []).map((v) => ({
      size: v.size,
      price: v.price,
      stockQuantity: v.stockQuantity,
      isActive: v.isActive,
      displayOrder: v.displayOrder,
    })),
    images: (p.images ?? []).map((im) => ({
      imageUrl: im.imageUrl,
      altText: im.altText,
      viewType: im.viewType,
      displayOrder: im.displayOrder,
      isPrimary: im.isPrimary,
    })),
    // ── The content being seeded ──
    materialType: UNIVERSAL.materialType,
    installationType: UNIVERSAL.installationType,
    recommendedFor: coll.recommendedFor,
    specifications: UNIVERSAL.specifications,
    whatsIncluded: coll.whatsIncluded,
    whatsNotIncluded: coll.whatsNotIncluded,
  };
}

// ── HTTP ───────────────────────────────────────────────────────────────────────
let token;
/** Never logs the body — it can carry the token or PII. */
async function call(method, path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON */
  }
  return { status: res.status, ok: res.ok, json };
}

const prefixOf = (sku) => (sku ?? "").match(/^BGT-([A-Z]+)-/)?.[1] ?? null;

try {
  // 1. sign in
  const login = await call("POST", "/admin/auth/login", {
    email: env("ADMIN_EMAIL"),
    password: env("ADMIN_PASSWORD"),
  });
  if (!login.ok) {
    console.error(`Admin login failed: ${login.status}`);
    process.exit(1);
  }
  token = login.json?.data?.accessToken;
  if (!token) {
    console.error("Login succeeded but no accessToken in the response.");
    process.exit(1);
  }

  // 2. read the catalogue
  const list = await call(
    "GET",
    "/Products?pageSize=500&ActiveOnly=false",
  );
  const items = list.json?.data?.items ?? [];
  let targets = items.filter((p) => {
    const pre = prefixOf(p.sku);
    return pre && COLLECTIONS[pre] && (!ONLY || pre === ONLY);
  });

  console.log(
    `\n${WRITE ? "WRITING" : "DRY RUN"} against ${host}${ONLY ? `  ·  collection ${ONLY}` : ""}`,
  );
  console.log(`${targets.length} product(s) to update.\n`);

  // Per-collection tally
  const tally = {};
  for (const p of targets) {
    const pre = prefixOf(p.sku);
    tally[pre] = (tally[pre] ?? 0) + 1;
  }
  for (const [pre, n] of Object.entries(tally)) {
    console.log(`  ${pre}  ${COLLECTIONS[pre].name.padEnd(20)} ${n}`);
  }

  if (!WRITE) {
    // Show exactly what one product would receive.
    const sample = targets[0];
    if (sample) {
      const pre = prefixOf(sample.sku);
      console.log(
        `\nSample payload for ${sample.sku} (${sample.name}):\n`,
        JSON.stringify(
          {
            metaTitle: metaTitle(sample),
            metaDescription: COLLECTIONS[pre].metaDescription,
            recommendedFor: COLLECTIONS[pre].recommendedFor,
            materialType: UNIVERSAL.materialType,
            installationType: UNIVERSAL.installationType,
            whatsIncluded: COLLECTIONS[pre].whatsIncluded,
            whatsNotIncluded: COLLECTIONS[pre].whatsNotIncluded,
            specifications: UNIVERSAL.specifications,
          },
          null,
          2,
        ),
      );
    }
    console.log(
      `\nNothing was written. Re-run with --write to apply.\n` +
        `(All other fields — name, price, variants, etc. — are preserved.)`,
    );
    process.exit(0);
  }

  // 3. update each product. Re-fetch each one immediately before its PUT so
  //    variants — and any image uploaded since the initial list — are the
  //    freshest possible, not a stale snapshot we'd overwrite.
  let ok = 0;
  const failed = [];
  for (const t of targets) {
    const coll = COLLECTIONS[prefixOf(t.sku)];
    const fresh = await call("GET", `/Products/slug/${t.slug}`);
    const p = fresh.json?.data ?? fresh.json ?? t;
    const res = await call(
      "PUT",
      `/admin/AdminProducts/${p.id}`,
      buildUpdate(p, coll),
    );
    if (res.ok) {
      ok += 1;
      process.stdout.write(".");
    } else {
      failed.push(`${t.sku} (${res.status})`);
      process.stdout.write("x");
    }
  }

  console.log(`\n\nUpdated ${ok}/${targets.length}.`);
  if (failed.length) {
    console.log(`Failed (${failed.length}):`);
    failed.forEach((f) => console.log(`  ${f}`));
    process.exit(1);
  }
} catch (err) {
  console.error("\nUnexpected error:", err.message);
  process.exit(1);
}
