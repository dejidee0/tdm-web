/**
 * Response-shape extraction, shared by scripts/record-contract.mjs and
 * scripts/record-mutations.mjs.
 *
 * Reduces a response to its *types*. `"Bathroom Fixtures"` becomes `"string"`,
 * `42` becomes `"number"`. This is what makes a snapshot safe to commit: it
 * cannot carry a token, an email address, or a customer's delivery address,
 * because it carries no values.
 */

/** @param {unknown} value @param {number} depth */
export function shapeOf(value, depth = 0) {
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
export function mergeNullability(items) {
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
