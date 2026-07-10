#!/usr/bin/env node
/**
 * Contract coverage ledger.
 *
 * Diffs the 266 operations in docs/api/swagger.snapshot.json against the
 * endpoints we have actually observed (contracts/manifest.json), and answers the
 * question you should ask *before* building a feature:
 *
 *     "Do we know what this endpoint returns, or am I about to guess?"
 *
 * Without this, every feature rediscovers the same shapes and the knowledge
 * evaporates when the session ends. With it, each feature permanently raises
 * coverage and the next one starts from a higher floor.
 *
 *   npm run contract:coverage              # summary + write contracts/COVERAGE.md
 *   npm run contract:coverage -- Cart      # what does the Cart feature need?
 *   npm run contract:coverage -- --check   # ratchet: fail if coverage dropped
 *
 * The ratchet exists because coverage is easy to lose by accident — deleting a
 * schema, renaming an export — and a silent drop is indistinguishable from
 * never having had it.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FLOOR_FILE = join(ROOT, "contracts", ".coverage-floor");

const spec = JSON.parse(readFileSync(join(ROOT, "docs/api/swagger.snapshot.json"), "utf8"));
const manifest = JSON.parse(readFileSync(join(ROOT, "contracts/manifest.json"), "utf8"));

const METHODS = ["get", "post", "put", "patch", "delete"];

/** Every operation the backend exposes, keyed `METHOD /path`. */
const operations = [];
for (const [path, ops] of Object.entries(spec.paths)) {
  for (const [method, op] of Object.entries(ops)) {
    if (!METHODS.includes(method)) continue;
    operations.push({
      key: `${method.toUpperCase()} ${path}`,
      method: method.toUpperCase(),
      path,
      tag: (op.tags ?? ["Untagged"])[0],
      hasRequestBody: Boolean(op.requestBody),
    });
  }
}

/**
 * What we have observed. A recorded-but-unmodelled endpoint is *not* coverage.
 *
 * A manifest key that does not resolve against the spec is a hard error, not a
 * zero. The two disagree on casing (`/Products`, not `/products` — ASP.NET
 * routes case-insensitively, so the app works either way and a typo here would
 * otherwise be invisible), and a silently-unjoined key reads exactly like an
 * endpoint we never recorded.
 */
const specKeys = new Set(operations.map((o) => o.key));
const modelled = new Map();
const recorded = new Set();
const unresolved = [];
for (const e of manifest.endpoints) {
  if (!specKeys.has(e.op)) {
    unresolved.push(e.op);
    continue;
  }
  recorded.add(e.op);
  if (e.schema) modelled.set(e.op, e.schema);
}
if (unresolved.length) {
  console.error(
    `contracts/manifest.json names ${unresolved.length} operation(s) that do not ` +
      `exist in docs/api/swagger.snapshot.json:\n` +
      unresolved.map((u) => `  ${u}`).join("\n") +
      `\n\nCheck the casing against the spec, or re-download it if the backend changed.`,
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const checkMode = args.includes("--check");
const tagFilter = args.find((a) => !a.startsWith("--"));

// ── Tag-scoped query: "what does this feature need?" ─────────────────────────
if (tagFilter) {
  const matching = operations.filter(
    (o) => o.tag.toLowerCase() === tagFilter.toLowerCase(),
  );
  if (!matching.length) {
    const tags = [...new Set(operations.map((o) => o.tag))].sort();
    console.error(`No tag "${tagFilter}". Known tags:\n  ${tags.join(", ")}`);
    process.exit(1);
  }
  console.log(`\n${tagFilter} — ${matching.length} operation(s)\n`);
  for (const o of matching) {
    const state = modelled.has(o.key)
      ? "✓ modelled"
      : recorded.has(o.key)
        ? "· recorded, not modelled"
        : "✗ UNKNOWN";
    const body = o.hasRequestBody ? " [has request body]" : "";
    console.log(`  ${state.padEnd(26)} ${o.method.padEnd(6)} ${o.path}${body}`);
  }
  const unknown = matching.filter((o) => !modelled.has(o.key));
  if (unknown.length) {
    console.log(
      `\n  ${unknown.length} of ${matching.length} unknown. Before consuming one:` +
        `\n    1. add it to contracts/manifest.json (schema: null)` +
        `\n    2. npm run contract:record  — observe the real shape` +
        `\n    3. model it in lib/api/schemas/, set schema, re-run` +
        `\n\n  Mutations cannot be recorded safely; see the note in scripts/record-contract.mjs.`,
    );
  }
  process.exit(0);
}

// ── Summary ──────────────────────────────────────────────────────────────────
const total = operations.length;
const covered = operations.filter((o) => modelled.has(o.key)).length;
const pct = (covered / total) * 100;

// ── Ratchet ──────────────────────────────────────────────────────────────────
if (checkMode) {
  let floor = 0;
  try {
    floor = Number(readFileSync(FLOOR_FILE, "utf8").trim());
  } catch {
    /* no floor yet */
  }
  console.log(`coverage: ${covered}/${total} operations (floor: ${floor})`);
  if (covered < floor) {
    console.error(
      `\nCoverage dropped from ${floor} to ${covered}.\n` +
        `A schema was deleted, renamed, or unlinked from contracts/manifest.json.\n` +
        `Restore it, or lower contracts/.coverage-floor deliberately in the same commit.`,
    );
    process.exit(1);
  }
  if (covered > floor) {
    writeFileSync(FLOOR_FILE, `${covered}\n`);
    console.log(`Floor raised to ${covered}. Commit contracts/.coverage-floor.`);
  }
  process.exit(0);
}

// ── Human summary + committed ledger ─────────────────────────────────────────
const byTag = new Map();
for (const o of operations) {
  const t = byTag.get(o.tag) ?? { total: 0, covered: 0 };
  t.total++;
  if (modelled.has(o.key)) t.covered++;
  byTag.set(o.tag, t);
}

console.log(`\nResponse contract coverage: ${covered}/${total} (${pct.toFixed(1)}%)\n`);
const withAny = [...byTag.entries()].filter(([, v]) => v.covered > 0);
for (const [tag, v] of withAny.sort()) {
  console.log(`  ${tag.padEnd(22)} ${v.covered}/${v.total}`);
}
console.log(`\n  ${byTag.size - withAny.length} of ${byTag.size} tags have no coverage at all.`);
console.log(`  Ask about one:  npm run contract:coverage -- Cart\n`);

const lines = [
  "# Response contract coverage",
  "",
  "<!-- Generated by scripts/coverage.mjs. Do not edit by hand. -->",
  "",
  `The backend's OpenAPI document declares all ${total} operations as a bare \`200: OK\``,
  "with no response body type. This table records what we have actually observed.",
  "",
  `**${covered} of ${total} operations (${pct.toFixed(1)}%) have a validated schema.**`,
  "",
  "`npm run contract:coverage -- <Tag>` lists a tag's operations and their state.",
  "",
  "| Tag | Modelled | Total |",
  "| --- | --- | --- |",
];
for (const [tag, v] of [...byTag.entries()].sort()) {
  lines.push(`| ${tag} | ${v.covered} | ${v.total} |`);
}
lines.push("", "## Modelled operations", "");
for (const [op, schema] of [...modelled.entries()].sort()) {
  lines.push(`- \`${op}\` → \`${schema}\``);
}
const unmodelled = manifest.endpoints.filter((e) => !e.schema);
if (unmodelled.length) {
  lines.push("", "## Recorded but not modelled", "");
  for (const e of unmodelled) {
    lines.push(`- \`${e.op}\`${e.$why ? ` — ${e.$why}` : ""}`);
  }
}
lines.push("");
writeFileSync(join(ROOT, "contracts/COVERAGE.md"), lines.join("\n"));
console.log("Wrote contracts/COVERAGE.md");
