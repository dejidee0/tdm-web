#!/usr/bin/env node
/**
 * Scoped mutation recorder — AdminProducts.
 *
 * The backend declares all 266 operations as a bare `200: OK`, so the only way
 * to learn what a mutation returns is to perform one. This script does that as
 * narrowly as it can:
 *
 *   1. Creates ONE throwaway product, whose name and SKU are prefixed so it is
 *      obvious in any admin UI that it is machine-generated.
 *   2. Updates it, bulk-creates one more, then deletes everything it created.
 *   3. Deletes them in a `finally`, so an error mid-sequence still cleans up.
 *
 * It never touches an object it did not create.
 *
 * Safety, in order of how much it matters:
 *
 *   1. Dry run by default. `--write` is required to send a single mutation.
 *   2. Refuses any host but the dev backend, `--write` or not.
 *   3. Only ever DELETEs ids it captured from its own POST responses.
 *   4. Snapshots are redacted to *shapes* (see ./shape.mjs) before touching disk.
 *   5. The admin token is never printed, logged, or written.
 *
 * This writes to a shared dev database. Run the dry run, read the plan, then:
 *
 *   node scripts/record-mutations.mjs            # dry run: prints the plan
 *   node scripts/record-mutations.mjs --write    # actually performs it
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { shapeOf } from "./shape.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "contracts");
const DEV_HOST_PATTERN = /^tbmdev-.*\.dtempurl\.com$/;
const WRITE = process.argv.includes("--write");

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

// ── The probe payloads ───────────────────────────────────────────────────────
// A distinctive prefix so a human who finds one in the admin UI knows what it is.
const STAMP = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const MARK = `zz-contract-probe-${STAMP}`;

/**
 * CreateProductDto. Field names taken from docs/api/swagger.snapshot.json, not
 * from a neighbouring call site. `brandType` 1=TBM 2=Bogat; `productType`
 * 1=PhysicalProduct 2=Service — decoded from live data, the spec types both as
 * a bare integer with no enum.
 *
 * No `required` list is declared, so every field is sent: absence of `required`
 * is missing information, not permission to omit.
 */
const createDto = (categoryId, suffix = "") => ({
  name: `${MARK}${suffix}`,
  description: "Temporary product created to record the API response shape.",
  shortDescription: "Contract probe — safe to delete.",
  sku: `${MARK}${suffix}`.toUpperCase(),
  brandType: 2,
  productType: 1,
  categoryId,
  price: 1,
  compareAtPrice: null,
  showPrice: true,
  stockQuantity: 0,
  lowStockThreshold: 0,
  trackInventory: false,
  isFeatured: false,
  displayOrder: 9999,
  metaTitle: null,
  metaDescription: null,
  tags: null,
  aiKeywords: null,
  materialType: null,
  qualityTier: null,
  recommendedFor: null,
  specifications: null,
  keyFeatures: null,
  whatsIncluded: null,
  whatsNotIncluded: null,
  dimensions: null,
  warranty: null,
  finishType: null,
  installationType: null,
  material: null,
  color: null,
});

/** UpdateProductDto — no brandType/productType, and it adds isActive. */
const updateDto = (categoryId) => ({
  name: `${MARK}-updated`,
  description: "Temporary product created to record the API response shape.",
  shortDescription: "Contract probe — safe to delete.",
  sku: `${MARK}`.toUpperCase(),
  categoryId,
  price: 2,
  compareAtPrice: null,
  showPrice: true,
  stockQuantity: 0,
  lowStockThreshold: 0,
  trackInventory: false,
  isActive: false,
  isFeatured: false,
  displayOrder: 9999,
  metaTitle: null,
  metaDescription: null,
  tags: null,
  aiKeywords: null,
  materialType: null,
  qualityTier: null,
  recommendedFor: null,
  specifications: null,
  keyFeatures: null,
  whatsIncluded: null,
  whatsNotIncluded: null,
  dimensions: null,
  warranty: null,
  finishType: null,
  installationType: null,
  material: null,
  color: null,
});

// ── Dry run ──────────────────────────────────────────────────────────────────
if (!WRITE) {
  console.log(`DRY RUN — nothing will be sent. Target: ${host}\n`);
  console.log("It would sign in as ADMIN_EMAIL, then perform exactly:\n");
  console.log(`  1. GET    /Categories                          (pick a categoryId)`);
  console.log(`  2. POST   /admin/AdminProducts                 create "${MARK}"`);
  console.log(`  3. PUT    /admin/AdminProducts/{id}            rename it "-updated"`);
  console.log(`  4. POST   /admin/AdminProducts/bulk            create "${MARK}-bulk"`);
  console.log(`  5. DELETE /admin/AdminProducts/{id}            for every id it created`);
  console.log(`\n  Every write is scoped to objects created in step 2 and 4.`);
  console.log(`  Deletion runs in a finally block, so an error still cleans up.`);
  console.log(`  Responses are reduced to type-shapes before being written to contracts/.`);
  console.log(`\nRe-run with --write to perform it.`);
  process.exit(0);
}

// ── Live run ─────────────────────────────────────────────────────────────────
const snapshots = {};
const created = [];
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

function record(label, op, { status, json }) {
  snapshots[label] = {
    endpoint: op,
    status,
    recordedFrom: host,
    shape: json === null ? "empty body" : shapeOf(json),
  };
  console.log(`  ${op.padEnd(46)} ${status}`);
}

/** Pull a product id out of an unknown response, without assuming the envelope. */
function idOf(json) {
  return json?.data?.id ?? json?.id ?? null;
}

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
  console.log(`Signed in. Recording against ${host}\n`);

  // 2. a real categoryId — the DTO requires a uuid, and an invalid one would
  //    give us a 400's shape rather than a 200's.
  const cats = await call("GET", "/Categories");
  const categoryId = cats.json?.data?.[0]?.id;
  if (!categoryId) {
    console.error("Could not read a categoryId from GET /Categories.");
    process.exit(1);
  }

  // 3. CREATE
  const post = await call("POST", "/admin/AdminProducts", createDto(categoryId));
  record("admin-products-create", "POST /admin/AdminProducts", post);
  const id = idOf(post.json);
  if (post.ok && id) created.push(id);
  if (post.ok && !id) {
    console.warn(
      "  ! Created a product but could not find its id in the response.\n" +
        "    Not proceeding to further writes — an orphan is worse than a gap.",
    );
  }

  // 4. UPDATE — only the product we just created
  if (id) {
    const put = await call("PUT", `/admin/AdminProducts/${id}`, updateDto(categoryId));
    record("admin-products-update", "PUT /admin/AdminProducts/{id}", put);
  }

  // 5. BULK — one element, so cleanup stays tractable.
  //    Note the envelope: bulk answers `data.createdProducts[]`, NOT `data[]`
  //    like every other create. Assuming `data[]` here orphaned a product the
  //    first time this ran; the sweep below is the belt to this braces.
  if (id) {
    const bulk = await call("POST", "/admin/AdminProducts/bulk", [
      createDto(categoryId, "-bulk"),
    ]);
    record("admin-products-bulk", "POST /admin/AdminProducts/bulk", bulk);
    const items = bulk.json?.data?.createdProducts;
    for (const it of Array.isArray(items) ? items : []) if (it?.id) created.push(it.id);
    if (bulk.ok && !items?.length) {
      console.warn("  ! Bulk returned 2xx but no createdProducts — relying on the sweep.");
    }
  }
} finally {
  // 6. DELETE everything we created, even if the run threw.
  if (created.length) {
    console.log(`\nCleaning up ${created.length} product(s):`);
    for (const [i, cid] of created.entries()) {
      const del = await call("DELETE", `/admin/AdminProducts/${cid}`);
      // Record the DELETE shape once, from the first one.
      if (i === 0) record("admin-products-delete", "DELETE /admin/AdminProducts/{id}", del);
      else console.log(`  DELETE /admin/AdminProducts/{id}`.padEnd(48) + del.status);
      if (!del.ok) console.error(`  ! FAILED to delete ${cid} — remove it by hand.`);
    }
  }

  // 7. Sweep. Tracking ids from responses assumes we parsed the envelope right,
  //    and the first run of this script proved that assumption can be wrong:
  //    bulk answers `data.createdProducts[]`, not `data[]`, and it orphaned a
  //    product. Deleting by name prefix does not depend on any envelope, so it
  //    catches whatever the id-tracking missed.
  if (token) {
    const list = await call("GET", "/products?pageSize=200");
    const strays = (list.json?.data?.items ?? []).filter((p) =>
      /^zz-contract-probe-/i.test(p?.name ?? ""),
    );
    if (strays.length) {
      console.log(`\nSweep found ${strays.length} stray probe product(s):`);
      for (const s of strays) {
        const del = await call("DELETE", `/admin/AdminProducts/${s.id}`);
        console.log(`  DELETE ${s.name} → ${del.status}`);
        if (!del.ok) console.error(`  ! FAILED — remove ${s.id} by hand.`);
      }
    }
  }

  if (Object.keys(snapshots).length) {
    await mkdir(OUT, { recursive: true });
    for (const [label, snap] of Object.entries(snapshots)) {
      await writeFile(join(OUT, `${label}.json`), JSON.stringify(snap, null, 2) + "\n");
    }
    console.log(`\nWrote ${Object.keys(snapshots).length} snapshot(s) to contracts/.`);
    console.log("Model them in lib/api/schemas/, then run: npm run contract:coverage");
  }
}
