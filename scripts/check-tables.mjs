#!/usr/bin/env node
//
// Enforces the "table on desktop, cards on mobile" rule from CLAUDE.md.
//
// A component that renders a <table> (or a fixed multi-column grid) must also
// render a mobile view, switched at a breakpoint. Surviving on mobile by
// scrolling sideways is not a mobile view: it hides the columns that carry the
// row's meaning, and the action buttons are usually the ones pushed off-screen.
//
//   node scripts/check-tables.mjs           # fail only on NEW violations
//   node scripts/check-tables.mjs --strict  # fail on every violation
//   node scripts/check-tables.mjs --update  # rewrite the baseline
//
// The baseline exists so this can be wired into CI today without turning it red
// on debt that predates the rule. Shrink it; never grow it.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { readdir } from "fs/promises";
import { join, relative } from "path";

const ROOT = process.cwd();
const BASELINE = "scripts/table-mobile-baseline.json";
const ROOTS = ["app", "components"];

/** A desktop-only table: a real <table>, or a grid with 3+ explicit columns. */
const RENDERS_TABLE =
  /<table[\s>]|grid-cols-\[[^\]]*_[^\]]*_[^\]]*\]/;

/** Both halves of the split must be present, at the same breakpoint. */
const BREAKPOINTS = ["sm", "md", "lg"];

function hasMobileView(src) {
  return BREAKPOINTS.some((bp) => {
    const desktop = new RegExp(`hidden\\s+${bp}:(block|grid|table|flex)`);
    const mobile = new RegExp(`${bp}:hidden`);
    return desktop.test(src) && mobile.test(src);
  });
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      yield* walk(p);
    } else if (/\.(jsx|tsx)$/.test(e.name)) {
      yield p;
    }
  }
}

const violations = [];
for (const root of ROOTS) {
  if (!existsSync(join(ROOT, root))) continue;
  for await (const file of walk(join(ROOT, root))) {
    const src = readFileSync(file, "utf8");
    if (!RENDERS_TABLE.test(src)) continue;
    if (hasMobileView(src)) continue;
    violations.push(relative(ROOT, file));
  }
}
violations.sort();

const strict = process.argv.includes("--strict");
const update = process.argv.includes("--update");

if (update) {
  writeFileSync(BASELINE, JSON.stringify(violations, null, 2) + "\n");
  console.log(`baseline written: ${violations.length} known violations`);
  process.exit(0);
}

const known = existsSync(BASELINE)
  ? JSON.parse(readFileSync(BASELINE, "utf8"))
  : [];
const fresh = violations.filter((v) => !known.includes(v));
const fixed = known.filter((k) => !violations.includes(k));

if (fixed.length) {
  console.log(`fixed since baseline (${fixed.length}):`);
  for (const f of fixed) console.log(`  ✓ ${f}`);
  console.log(`  → run with --update to shrink the baseline\n`);
}

const failing = strict ? violations : fresh;

if (!failing.length) {
  const note = known.length ? ` (${known.length} known, baselined)` : "";
  console.log(`no new table-without-mobile-view violations${note}`);
  process.exit(0);
}

console.error(
  `${failing.length} table${failing.length > 1 ? "s" : ""} with no mobile card view:\n`,
);
for (const v of failing) console.error(`  ✗ ${v}`);
console.error(
  `\nRender a card view for < md. See "Tables" in CLAUDE.md;` +
    `\ncomponents/shared/admin/dashboard/admin-alerts-table.jsx is the reference.`,
);
process.exit(1);
