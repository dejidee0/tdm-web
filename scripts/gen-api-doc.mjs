#!/usr/bin/env node
/**
 * Regenerates docs/api/tbm-backend-api.md from docs/api/swagger.snapshot.json.
 *
 * The markdown is a human-readable view of the request side of the spec: every
 * operation with its parameters and body, and every request schema with typed
 * fields. It drifts the moment the snapshot is refreshed, and until now there
 * was no generator — so it lagged behind by hand. This is that generator.
 *
 *   1. Refresh the snapshot:  curl <source> -o docs/api/swagger.snapshot.json
 *   2. Regenerate the doc:    node scripts/gen-api-doc.mjs
 *
 * The hand-written analysis at the top (what the spec does NOT tell you, calling
 * conventions, path casing) is embedded here so this file is the single source.
 * Only the counts inside it are interpolated, so the prose stays accurate.
 *
 * To validate a change to this generator: run it, then `git diff` the doc — the
 * only changes should be the ones you intend.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SPEC = join(ROOT, "docs/api/swagger.snapshot.json");
const OUT = join(ROOT, "docs/api/tbm-backend-api.md");

const spec = JSON.parse(readFileSync(SPEC, "utf8"));
const schemas = spec.components?.schemas ?? {};
const METHODS = ["get", "post", "put", "patch", "delete"];

const SOURCE_URL = "https://tbmdev-001-site1.dtempurl.com/swagger/v1/swagger.json";

// ── Naming ───────────────────────────────────────────────────────────────────
// Objects display their last TWO dot-segments (`Products.CreateProductDto`);
// enums display their last ONE (`OrderStatus` from `TBM.Core.Enums.OrderStatus`).
// A single-segment name is its own short name. The anchor lowercases the display
// name and swaps dots for dashes.
const isEnum = (s) => Array.isArray(s?.enum);
const refName = (ref) => ref.split("/").pop();
const displayName = (full) =>
  isEnum(schemas[full]) ? full.split(".").pop() : full.split(".").slice(-2).join(".");
const anchorOf = (full) => "s-" + displayName(full).toLowerCase().replace(/\./g, "-");
const tagAnchor = (tag) => "tag-" + tag.toLowerCase();

// ── Type rendering ───────────────────────────────────────────────────────────
function refLink(name) {
  return `[\`${displayName(name)}\`](#${anchorOf(name)})`;
}

/** Render a property's type cell. */
function typeCell(prop) {
  if (!prop) return "object";
  if (prop.$ref) return refLink(refName(prop.$ref));
  if (prop.type === "array") {
    const items = prop.items ?? {};
    if (items.$ref) return `${refLink(refName(items.$ref))}[]`;
    return `${items.type ?? "object"}[]`;
  }
  if (prop.type === "string" && prop.format) return `string(${prop.format})`;
  return prop.type ?? "object";
}

// ── Parameters & bodies ──────────────────────────────────────────────────────
function paramsCell(op) {
  const params = op.parameters ?? [];
  if (!params.length) return "—";
  return params
    .map((p) => {
      const sc = p.schema ?? {};
      // Enum-ref params render the enum's name (bare, not a link); string
      // formats keep their format (string(uuid)); numeric formats (int32,
      // double) are dropped, matching the property tables.
      let type;
      if (sc.$ref) type = displayName(refName(sc.$ref));
      else if (sc.type === "string" && sc.format) type = `string(${sc.format})`;
      else type = sc.type ?? "string";
      const opt = p.required ? "" : "?";
      return `\`${p.name}${opt}\` ${type} *(${p.in})*`;
    })
    .join("<br>");
}

function bodyCell(op) {
  const content = op.requestBody?.content;
  if (!content) return "—";

  const json = content["application/json"];
  if (json?.schema) {
    const s = json.schema;
    if (s.$ref) return refLink(refName(s.$ref));
    if (s.type === "array" && s.items?.$ref) {
      return `inline ${refLink(refName(s.items.$ref))}[]`;
    }
    // A scalar body (a bare string/integer/…), e.g. an order id or a reason.
    if (s.type && s.type !== "object") return `inline ${s.type}`;
    return "inline object";
  }

  const multipart = content["multipart/form-data"];
  if (multipart?.schema?.properties) {
    const fields = Object.keys(multipart.schema.properties)
      .map((f) => `\`${f}\``)
      .join("<br>");
    return `**multipart/form-data**<br>${fields}`;
  }

  return "*(body)*";
}

// ── Collect operations, tags, and body usage ─────────────────────────────────
const operations = [];
for (const [path, item] of Object.entries(spec.paths)) {
  for (const [method, op] of Object.entries(item)) {
    if (!METHODS.includes(method)) continue;
    operations.push({ path, method: method.toUpperCase(), op, tag: (op.tags ?? ["Untagged"])[0] });
  }
}

const byTag = new Map();
for (const o of operations) {
  if (!byTag.has(o.tag)) byTag.set(o.tag, []);
  byTag.get(o.tag).push(o);
}
const tags = [...byTag.keys()].sort();

// Which operations use each schema as their request body.
const bodyUsage = new Map(); // schema full name → ["METHOD path", …]
for (const o of operations) {
  const content = o.op.requestBody?.content?.["application/json"]?.schema;
  if (!content) continue;
  const name = content.$ref
    ? refName(content.$ref)
    : content.type === "array" && content.items?.$ref
      ? refName(content.items.$ref)
      : null;
  if (!name) continue;
  if (!bodyUsage.has(name)) bodyUsage.set(name, []);
  bodyUsage.get(name).push(`${o.method} ${o.path}`);
}

// ── Counts for the prose ─────────────────────────────────────────────────────
const enumNames = Object.keys(schemas).filter((n) => isEnum(schemas[n])).sort();
const objectNames = Object.keys(schemas)
  .filter((n) => !isEnum(schemas[n]))
  .sort((a, b) => displayName(a).localeCompare(displayName(b)));
const pathCount = Object.keys(spec.paths).length;
const opCount = operations.length;
const schemaCount = objectNames.length + enumNames.length;
const requiredCount = objectNames.filter((n) => Array.isArray(schemas[n].required)).length;
const pascalPaths = Object.keys(spec.paths).filter((p) =>
  p.split("/").some((seg) => /^[A-Z]/.test(seg) && !seg.startsWith("{")),
).length;
const today = new Date().toISOString().slice(0, 10);

// ── Assemble ─────────────────────────────────────────────────────────────────
const L = [];
const w = (s = "") => L.push(s);

w(`# TBM Backend API — endpoint & payload reference`);
w();
w(`- **Source:** [\`${SOURCE_URL}\`](${SOURCE_URL}) (Swagger UI: \`/index.html\`)`);
w(`- **Spec:** OpenAPI ${spec.openapi} · \`${spec.info?.title}\` · version \`${spec.info?.version}\``);
w(`- **Snapshot taken:** ${today}`);
w(`- **Size:** ${pathCount} paths · ${opCount} operations · ${objectNames.length} object schemas · ${enumNames.length} enums`);
w();
w(`Regenerate with \`node scripts/gen-api-doc.mjs\` after re-downloading the spec`);
w(`above; this file is a snapshot, not a live view.`);
w();
w(`## Read this first — what the spec does *not* tell you`);
w();
w(`This document is only as good as the spec, and the spec has real gaps. Every one`);
w(`of them is a place where you must read the backend or observe a live response`);
w(`rather than trust this file.`);
w();
w(`- **There are no response schemas.** All ${opCount} operations declare exactly one`);
w(`  response, a bare \`200: OK\`, with no body type. The spec describes *requests`);
w(`  only*. This is the documented reason response shapes are guessed at call sites`);
w(`  in this repo (\`json.data ?? json\`) — Swagger cannot resolve it for you.`);
w(`- **No error responses are declared.** No 400, 401, 404, 409, 500. Their bodies`);
w(`  are undocumented.`);
w(`- **No summaries or descriptions.** Not one operation carries prose. Endpoint`);
w(`  intent has to be inferred from its path, tag, and request payload.`);
w(`- **Enums are bare integers.** The spec gives the numeric values but not their`);
w(`  names, so \`OrderStatus: 3\` is undecodable from here. See [Enums](#enums).`);
w(`- **Almost nothing is marked required.** Exactly ${requiredCount} of the ${schemaCount} schemas declares a`);
w(`  \`required\` list, and nearly every property is \`nullable: true\`. Treat`);
w(`  "optional" in this doc as "unknown", not as "safe to omit".`);
w(`- **This is the dev instance, fetched unauthenticated.** Endpoints hidden from`);
w(`  the public document are not here.`);
w();
w(`## Calling these endpoints from this app`);
w();
w(`The browser never learns the backend URL and never holds a token. See \`CLAUDE.md\`.`);
w();
w(`\`API_URL\` already ends in \`/api/v1\`, and \`next.config.mjs\` rewrites \`/api/v1/:path*\``);
w(`to the proxy — so **spec paths map 1:1 onto client fetch paths**:`);
w();
w("```js");
w(`// spec: GET /api/v1/cart`);
w(`fetch("/api/v1/cart")   // → /api/proxy/v1/cart → API_URL + /cart`);
w("```");
w();
w(`Admin endpoints live at \`/api/v1/admin/**\` in the spec. Reaching them with the`);
w(`**admin** cookie (\`adminAuthToken\`) means going through the admin mount, which is`);
w(`*not* covered by the rewrite:`);
w();
w("```js");
w(`// spec: GET /api/v1/admin/AdminUsers`);
w(`fetch("/api/proxy/admin/admin/AdminUsers")   // → ADMIN_API_URL + /admin/AdminUsers`);
w("```");
w();
w(`The doubled \`admin/\` is not a typo: the mount name is one, the backend path`);
w(`segment is the other. Do not add a bespoke route handler in \`app/api/\` unless you`);
w(`must transform the request or response.`);
w();
w(`**Two routes fall outside \`/api/v1\` and therefore outside the rewrite:**`);
w(`\`GET /auth/google\` and \`GET /auth/apple\`. Both take no parameters and no body,`);
w(`which is the shape of an OAuth redirect entry point rather than a JSON endpoint —`);
w(`but the spec does not say so, and neither is reachable through the relative-path`);
w(`proxy. Confirm intended usage against the backend before wiring either one up.`);
w();
w(`## Authentication`);
w();
w(`A single global security scheme applies to **every** operation in the spec:`);
w();
w(`| Scheme | Type | In | Header |`);
w(`| --- | --- | --- | --- |`);
w(`| \`Bearer\` | apiKey | header | \`Authorization: Bearer <token>\` |`);
w();
w(`No operation opts out, so **the spec cannot tell you which endpoints are public**.`);
w(`Some plainly are: \`GET /api/v1/Products\` and \`GET /api/v1/Cart\` both return \`200\``);
w(`to an unauthenticated caller, despite being marked secured. Assume nothing from`);
w(`the security block; test the endpoint.`);
w();
w(`\`lib/proxy.js\` attaches the header server-side from the httpOnly cookie. You never`);
w(`set it yourself, and the client's own \`Authorization\` header is not forwarded.`);
w();
w(`### Path casing`);
w();
w(`The spec mixes conventions: ${pascalPaths} of ${pathCount} paths carry a PascalCase segment`);
w(`(\`/api/v1/Cart\`, \`/api/v1/Products\`, \`/api/v1/admin/AdminUsers\`) while the rest are`);
w(`lowercase (\`/api/v1/account/profile\`, \`/api/v1/orders\`).`);
w();
w(`ASP.NET routing is case-insensitive, and the live API confirms it — \`/api/v1/Cart\`,`);
w(`\`/api/v1/cart\`, and \`/api/v1/CART\` all answer \`200\`, while an unknown path 404s. So`);
w(`existing lowercase call sites are not bugs. Paths below are reproduced exactly as`);
w(`the spec declares them.`);
w();

// Enums
w(`## Enums`);
w();
w(`Serialized as **integers**. Swashbuckle emitted the values without their names, so`);
w(`the meanings below are unknown from the spec alone — confirm against the backend`);
w(`\`TBM.Core.Enums\` source before relying on any mapping.`);
w();
w(`| Enum | Values |`);
w(`| --- | --- |`);
for (const name of enumNames) {
  const vals = schemas[name].enum.map((v) => `\`${v}\``).join(", ");
  w(`| <a id="${anchorOf(name)}"></a>\`${displayName(name)}\` | ${vals} |`);
}
w();

// Endpoints index
w(`## Endpoints`);
w();
w(`${opCount} operations across ${tags.length} tags. \`Body\` links to the payload schema.`);
w();
const half = Math.ceil(tags.length / 2);
w(`| Tag | Ops |  | Tag | Ops |`);
w(`| --- | --- | --- | --- | --- |`);
for (let i = 0; i < half; i++) {
  const l = tags[i];
  const r = tags[i + half];
  const cell = (t) => (t ? `[${t}](#${tagAnchor(t)}) | ${byTag.get(t).length}` : ` | `);
  w(`| ${cell(l)} |  | ${cell(r)} |`);
}
w();

// Per-tag operation tables
for (const tag of tags) {
  w(`### <a id="${tagAnchor(tag)}"></a>${tag}`);
  w();
  w(`| Method | Path | Parameters | Body |`);
  w(`| --- | --- | --- | --- |`);
  const ops = byTag
    .get(tag)
    .slice()
    .sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
  for (const o of ops) {
    w(`| \`${o.method}\` | \`${o.path}\` | ${paramsCell(o.op)} | ${bodyCell(o.op)} |`);
  }
  w();
}

// Schemas
w(`## Schemas`);
w();
w(`Request payloads. \`?\` marks \`nullable: true\` — which, given only ${requiredCount === 1 ? "one schema" : `${requiredCount} schemas`} in the`);
w(`whole spec declares \`required\`, means "the spec doesn't say" more often than it`);
w(`means "genuinely optional".`);
w();
for (const name of objectNames) {
  const sc = schemas[name];
  w(`### <a id="${anchorOf(name)}"></a>${displayName(name)}`);
  w();
  w(`<sub>\`${name}\`</sub>`);
  w();
  const usedBy = bodyUsage.get(name);
  if (usedBy) {
    w(`Body of: ${usedBy.map((u) => `\`${u}\``).join(", ")}`);
    w();
  }
  const props = sc.properties ?? {};
  if (Object.keys(props).length) {
    w(`| Property | Type | |`);
    w(`| --- | --- | --- |`);
    const required = new Set(sc.required ?? []);
    for (const [pname, prop] of Object.entries(props)) {
      const opt = prop.nullable && !required.has(pname) ? "?" : "";
      const note = prop.nullable ? "nullable" : "";
      w(`| \`${pname}${opt}\` | ${typeCell(prop)} | ${note} |`);
    }
    w();
  }
  if (sc.additionalProperties === false) {
    w(`<sub>\`additionalProperties: false\` — unknown keys are rejected.</sub>`);
    w();
  }
}

writeFileSync(OUT, L.join("\n").replace(/\n+$/, "\n"));
console.log(
  `Wrote ${OUT}\n  ${opCount} operations · ${tags.length} tags · ` +
    `${objectNames.length} object schemas · ${enumNames.length} enums`,
);
