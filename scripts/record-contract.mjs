#!/usr/bin/env node
/**
 * Contract recorder.
 *
 * The backend's OpenAPI document declares all 266 operations as a bare
 * `200: OK` with no response body type, so there is nothing to generate types
 * from. This script observes the truth instead: it replays safe requests
 * against the dev API and writes redacted snapshots to contracts/.
 *
 * Those snapshots are the evidence behind lib/api/schemas/*. When the backend
 * changes shape, re-running this diffs the change into view.
 *
 * Safety, in order of how much it matters:
 *
 *   1. GET only. Mutations are opt-in per-scenario and not implemented here —
 *      see the note at the bottom before adding one.
 *   2. Refuses to run unless the host matches the dev backend. It will not point
 *      at production even if API_URL says so.
 *   3. Every response is redacted through lib/log.js before it touches disk.
 *      A snapshot is a *shape*, not a payload — values are replaced with type
 *      names so a token or a customer address can never be committed.
 *
 * Usage:
 *   npm run contract:record            # unauthenticated public GETs
 *   CONTRACT_TOKEN=<jwt> npm run …     # also records authenticated GETs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "contracts");

// ── Guard: only ever the dev backend ─────────────────────────────────────────
const DEV_HOST_PATTERN = /^tbmdev-.*\.dtempurl\.com$/;

function readEnv() {
  const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
  const line = raw.split("\n").find((l) => l.startsWith("API_URL="));
  if (!line) throw new Error("API_URL not found in .env.local");
  return line.slice("API_URL=".length).trim();
}

const API_URL = readEnv();
const host = new URL(API_URL).host;
if (!DEV_HOST_PATTERN.test(host)) {
  console.error(
    `Refusing to record against ${host}.\n` +
      `This script only runs against the dev backend (${DEV_HOST_PATTERN}).`,
  );
  process.exit(1);
}

// ── Shape extraction: types, never values ────────────────────────────────────
/**
 * Reduce a response to its shape. `"Bathroom Fixtures"` becomes `"string"`,
 * `42` becomes `"number"`. Arrays collapse to their first element's shape plus
 * a length, so a 200-item response stays readable.
 *
 * This is what makes a snapshot safe to commit: it cannot carry a token, an
 * email address, or a customer's delivery address, because it carries no values.
 */
function shapeOf(value, depth = 0) {
  if (depth > 6) return "…";
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: "array", length: 0, of: "unknown" };
    // Union the shapes of up to 20 items so nullable fields are visible.
    const seen = new Map();
    for (const item of value.slice(0, 20)) {
      const s = JSON.stringify(shapeOf(item, depth + 1));
      seen.set(s, (seen.get(s) ?? 0) + 1);
    }
    return {
      type: "array",
      length: value.length,
      of:
        seen.size === 1
          ? JSON.parse([...seen.keys()][0])
          : [...seen.keys()].map((k) => JSON.parse(k)),
    };
  }
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, shapeOf(v, depth + 1)]),
    );
  }
  return typeof value;
}

/** Merge the shapes of many objects so `string` and `null` become `string|null`. */
function mergeNullability(items) {
  const fields = {};
  for (const item of items) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    for (const [k, v] of Object.entries(item)) {
      const t = v === null ? "null" : Array.isArray(v) ? "array" : typeof v;
      (fields[k] ??= new Set()).add(t);
    }
  }
  return Object.fromEntries(
    Object.entries(fields).map(([k, set]) => [k, [...set].sort().join("|")]),
  );
}

// ── The endpoints we record ──────────────────────────────────────────────────

/** Read a dotted path such as `data.items` off a response. */
function pluck(obj, dotted) {
  if (!dotted) return null;
  return dotted.split(".").reduce((acc, k) => acc?.[k], obj) ?? null;
}

/**
 * Endpoints come from contracts/manifest.json — the same file that drives
 * check-contract.mjs and coverage.mjs. Three hardcoded lists would drift; one
 * declarative list cannot.
 *
 * `op` is `METHOD /api/v1/Products`; the base URL already carries `/api/v1`, so
 * strip it. GET only: a mutation is not something this script may invoke.
 */
const manifest = JSON.parse(
  readFileSync(join(ROOT, "contracts/manifest.json"), "utf8"),
);
const token = process.env.CONTRACT_TOKEN;

const targets = manifest.endpoints
  .filter((e) => e.op.startsWith("GET "))
  .filter((e) => !e.auth || token)
  .map((e) => ({
    label: e.label,
    path: e.op.replace(/^GET \/api\/v1/, "") + (e.sample ?? ""),
    itemsAt: (j) => pluck(j, e.itemsAt),
  }));

const skipped = manifest.endpoints.filter((e) => e.auth && !token).length;

async function record({ label, path, itemsAt }) {
  const url = `${API_URL}${path}`;
  let res, json;
  try {
    res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    json = await res.json();
  } catch (err) {
    return { label, error: err.message };
  }

  if (!res.ok) return { label, status: res.status, note: "non-200; not recorded" };

  const items = itemsAt(json);
  const snapshot = {
    endpoint: path.split("?")[0],
    status: res.status,
    recordedFrom: host,
    // Shapes only — no values. See shapeOf().
    shape: shapeOf(json),
    ...(Array.isArray(items) && items.length
      ? { itemFieldTypes: mergeNullability(items), sampleSize: items.length }
      : {}),
  };

  await writeFile(
    join(OUT, `${label}.json`),
    JSON.stringify(snapshot, null, 2) + "\n",
  );
  return { label, status: res.status, sample: Array.isArray(items) ? items.length : "—" };
}

await mkdir(OUT, { recursive: true });
console.log(`Recording ${targets.length} GET endpoint(s) from ${host}`);
if (skipped) console.log(`  (${skipped} authenticated — set CONTRACT_TOKEN to include)`);
console.log();

for (const t of targets) {
  const r = await record(t);
  const status = r.error ? `ERROR ${r.error}` : `${r.status}`;
  console.log(`  ${t.label.padEnd(22)} ${String(status).padEnd(6)} ${r.sample ?? ""} ${r.note ?? ""}`);
}
console.log(
  `\nWrote to contracts/. Commit them — they are the evidence behind lib/api/schemas/.` +
    `\nThen: npm run contract:coverage  (to refresh the ledger)`,
);

/*
 * Recording a MUTATION, when you get there:
 *
 *   - Scope it to a resource the script itself created, and delete it in a
 *     `finally`. Never PUT or DELETE an object you did not create.
 *   - Require a second opt-in beyond CONTRACT_RECORD — a mutation against a
 *     shared dev database is visible to everyone using it.
 *   - Record the *error* responses too. The spec declares only `200` for all
 *     266 operations, so 400/401/404 bodies are entirely unknown, and those are
 *     the ones lib/errors.js has to parse.
 */
