/**
 * Bulk-upload product photography to the Bogat catalogue by filename.
 *
 * Drop your images in a folder (default ./product-images). Two naming schemes,
 * mix freely:
 *
 *   1. By SKU:
 *        BGT-EAT-001.jpg        BGT-EAT-001-2.jpg        BGT-JOA-014.webp
 *
 *   2. By name (collection + design):
 *        eclat jade.jpg          "Eclat Atelier Jade"    (spaces, - or _ all fine)
 *        terra-sculpte-amber.png "Terra Sculpte Amber"
 *        maison sol 2.webp       2nd gallery image of "Maison Sculptee Sol"
 *
 * Rules:
 *   - Extra gallery images: append a number — "-2"/" 2"/"_2", etc. The base
 *     name (or "-1") is the primary/cover.
 *   - Name matching needs enough words to identify ONE product. "eclat jade" is
 *     fine; a bare "jade" matches three collections and is reported as
 *     ambiguous and skipped — never guessed.
 *   - Accepted: .jpg .jpeg .png .webp   (case-insensitive).
 *
 * Uses the dedicated multipart endpoint (POST .../images/upload) — the safe one
 * that does NOT touch other product fields.
 *
 * Safe by construction:
 *   - Refuses any host but the dev backend.
 *   - Dry run by default; --write to upload.
 *   - By default SKIPS products that already have images; --replace deletes
 *     their existing images first (so re-runs don't duplicate).
 *   - The admin token is never printed or logged.
 *
 *   node scripts/upload-bogat-images.mjs                      # dry run: the plan
 *   node scripts/upload-bogat-images.mjs --dir=./my-photos    # custom folder
 *   node scripts/upload-bogat-images.mjs --collection=EAT      # one collection
 *   node scripts/upload-bogat-images.mjs --write               # perform the upload
 *   node scripts/upload-bogat-images.mjs --replace --write     # re-shoot: replace existing
 */

import { readFileSync } from "node:fs";
import { readdir, readFile, rename, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEV_HOST_PATTERN = /^tbmdev-.*\.dtempurl\.com$/;
const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const REPLACE = args.includes("--replace");
const DIR = (args.find((a) => a.startsWith("--dir=")) ?? "").split("=")[1] || "./product-images";
const MOVE_TO = (args.find((a) => a.startsWith("--move-to=")) ?? "").split("=")[1];
const ONLY = (args.find((a) => a.startsWith("--collection=")) ?? "")
  .split("=")[1]
  ?.toUpperCase();

const MIME = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
const EXT_RE = /\.(jpe?g|png|webp)$/i;

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

const dirPath = join(ROOT, DIR.replace(/^\.\//, ""));
const tokensOf = (s) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

/**
 * Parse a filename into { kind, ..., order, ext }.
 *   sku:  { kind:"sku", sku, order, ext }
 *   name: { kind:"name", tokens, order, ext }
 * A trailing number is the gallery index; otherwise order = 1.
 */
function parseFilename(file) {
  const em = file.match(EXT_RE);
  if (!em) return null;
  const ext = em[1].toLowerCase();
  const base = file.slice(0, em.index);

  const sku = base.match(/^(BGT-[A-Z]+-\d+)(?:[-_](\d+))?$/i);
  if (sku) {
    return { kind: "sku", sku: sku[1].toUpperCase(), order: sku[2] ? +sku[2] : 1, ext };
  }

  const tokens = tokensOf(base);
  if (tokens.length === 0) return null;
  let order = 1;
  if (tokens.length > 1 && /^\d+$/.test(tokens[tokens.length - 1])) {
    order = parseInt(tokens.pop(), 10);
  }
  return { kind: "name", tokens, order, ext };
}

// ── HTTP ───────────────────────────────────────────────────────────────────────
let token;
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

async function uploadOne(productId, img, altText) {
  const buf = await readFile(join(dirPath, img.file));
  const fd = new FormData();
  fd.append("file", new Blob([buf], { type: MIME[img.ext] }), img.file);
  const params = new URLSearchParams({
    isPrimary: String(img.primary),
    displayOrder: String(img.order),
    altText,
  });
  const res = await fetch(
    `${API_URL}/admin/adminproducts/${productId}/images/upload?${params}`,
    { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd },
  );
  return { ok: res.ok, status: res.status };
}

const inCollection = (p) => !ONLY || (p.sku ?? "").toUpperCase().startsWith(`BGT-${ONLY}-`);

try {
  // sign in
  const login = await call("POST", "/admin/auth/login", {
    email: env("ADMIN_EMAIL"),
    password: env("ADMIN_PASSWORD"),
  });
  token = login.json?.data?.accessToken;
  if (!token) {
    console.error(`Admin login failed: ${login.status}`);
    process.exit(1);
  }

  // catalogue, with name tokens precomputed for matching
  const catalogue = (
    await call("GET", "/Products?pageSize=500&ActiveOnly=false")
  ).json?.data?.items ?? [];
  const bgt = catalogue.filter((p) => (p.sku ?? "").toUpperCase().startsWith("BGT-"));
  bgt.forEach((p) => (p._name = new Set(tokensOf(p.name))));
  const bySku = new Map(bgt.map((p) => [p.sku.toUpperCase(), p]));

  // Every name token must appear in the product name. Enough words → one match.
  const matchByName = (toks) =>
    bgt.filter((p) => toks.every((t) => p._name.has(t)));

  // ── Resolve every file to a product ──
  let entries;
  try {
    entries = await readdir(dirPath);
  } catch {
    console.error(`Folder not found: ${dirPath}`);
    console.error(`Create it and drop your images in, or pass --dir=<path>.`);
    process.exit(1);
  }

  const resolved = new Map(); // productId -> { product, imgs: [] }
  const unmatched = [];
  const ambiguous = [];
  const skuNotFound = [];

  for (const file of entries) {
    if (file.startsWith(".")) continue;
    const parsed = parseFilename(file);
    if (!parsed) {
      unmatched.push(file);
      continue;
    }

    let product;
    if (parsed.kind === "sku") {
      if (ONLY && !parsed.sku.startsWith(`BGT-${ONLY}-`)) continue;
      product = bySku.get(parsed.sku);
      if (!product) {
        skuNotFound.push(`${file}  →  ${parsed.sku}`);
        continue;
      }
    } else {
      const matches = matchByName(parsed.tokens).filter(inCollection);
      if (matches.length === 0) {
        unmatched.push(`${file}  (no product matches "${parsed.tokens.join(" ")}")`);
        continue;
      }
      if (matches.length > 1) {
        ambiguous.push(`${file}  →  ${matches.map((p) => p.sku).join(", ")}`);
        continue;
      }
      product = matches[0];
    }

    const rec = resolved.get(product.id) ?? { product, imgs: [] };
    rec.imgs.push({ file, order: parsed.order, ext: parsed.ext });
    resolved.set(product.id, rec);
  }

  for (const rec of resolved.values()) {
    rec.imgs.sort((a, b) => a.order - b.order);
    rec.imgs.forEach((im, i) => (im.primary = i === 0));
  }

  const plan = [...resolved.values()].sort((a, b) =>
    a.product.sku.localeCompare(b.product.sku),
  );
  const totalImgs = plan.reduce((n, p) => n + p.imgs.length, 0);

  console.log(
    `\n${WRITE ? "UPLOADING" : "DRY RUN"} against ${host}` +
      `${ONLY ? `  ·  collection ${ONLY}` : ""}${REPLACE ? "  ·  REPLACE mode" : ""}`,
  );
  console.log(`Folder: ${dirPath}`);
  console.log(`${plan.length} product(s), ${totalImgs} image file(s) matched.\n`);

  for (const { product, imgs } of plan) {
    const skip = (product.images ?? []).length > 0 && !REPLACE ? "  (has images — SKIP)" : "";
    console.log(
      `  ${product.sku}  ${product.name}` +
        `  [${imgs.map((i) => (i.primary ? `${i.file}*` : i.file)).join(", ")}]${skip}`,
    );
  }
  if (skuNotFound.length) {
    console.log(`\n⚠ ${skuNotFound.length} file(s) with an unknown SKU:`);
    skuNotFound.forEach((s) => console.log(`   ${s}`));
  }
  if (ambiguous.length) {
    console.log(`\n⚠ ${ambiguous.length} file(s) AMBIGUOUS — add the collection or design name:`);
    ambiguous.forEach((s) => console.log(`   ${s}`));
  }
  if (unmatched.length) {
    console.log(`\n⚠ ${unmatched.length} file(s) ignored (no match / bad name):`);
    unmatched.slice(0, 25).forEach((f) => console.log(`   ${f}`));
  }
  const covered = new Set(plan.map((p) => p.product.id));
  const missing = bgt.filter((p) => inCollection(p) && !covered.has(p.id));
  console.log(
    `\n${missing.length} product(s) still have NO image file in the folder.` +
      (missing.length ? " (e.g. " + missing.slice(0, 5).map((p) => p.sku).join(", ") + "…)" : ""),
  );

  if (!WRITE) {
    console.log(`\nNothing uploaded. Re-run with --write to upload. '*' = primary/cover.`);
    process.exit(0);
  }

  // ── Upload ──
  // Only files that upload OK are archived to --move-to; skipped/failed stay
  // put so the folder always shows what still needs attention.
  const moveDir = MOVE_TO ? join(ROOT, MOVE_TO.replace(/^\.\//, "")) : null;
  if (moveDir) await mkdir(moveDir, { recursive: true });

  let uploaded = 0;
  let skipped = 0;
  let moved = 0;
  const failed = [];
  for (const { product, imgs } of plan) {
    const existing = product.images ?? [];
    if (existing.length > 0) {
      if (!REPLACE) {
        skipped += 1;
        continue;
      }
      for (const img of existing) {
        await call("DELETE", `/admin/AdminProducts/images/${img.id}`);
      }
    }
    for (const img of imgs) {
      const res = await uploadOne(product.id, img, product.name);
      if (res.ok) {
        uploaded += 1;
        process.stdout.write(".");
        if (moveDir) {
          await rename(join(dirPath, img.file), join(moveDir, img.file));
          moved += 1;
        }
      } else {
        failed.push(`${img.file} (${res.status})`);
        process.stdout.write("x");
      }
    }
  }

  console.log(
    `\n\nUploaded ${uploaded} image(s). Skipped ${skipped} product(s) that already had images.` +
      (moveDir ? `\nArchived ${moved} file(s) → ${moveDir}` : ""),
  );
  if (failed.length) {
    console.log(`Failed (${failed.length}):`);
    failed.forEach((f) => console.log(`  ${f}`));
    process.exit(1);
  }
} catch (err) {
  console.error("\nUnexpected error:", err.message);
  process.exit(1);
}
