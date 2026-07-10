// The one severity ramp for the admin surface.
//
// Ordered: critical > high/error > medium/warning > low > info. Because it is a
// ranked scale rather than a categorical set, adjacent hues sit closer together
// than the 30deg we demand of role chips (high -> medium is 16deg). Lightness
// climbs monotonically across the ramp and every badge carries a text label, so
// the tiers stay distinguishable.
//
// Two copies of this used to exist: one inline in admin-alerts-table, and one in
// lib/mock/system-logs.js whose `bg`/`text` fields were light-theme pairs
// (bg-[#FEE2E2] / text-[#991B1B]) rendering on a black page.

const TIERS = {
  critical: { dot: "bg-danger", text: "text-danger", tint: "bg-danger/10", ring: "border-danger/20" },
  high: {
    dot: "bg-severity-high",
    text: "text-severity-high",
    tint: "bg-severity-high/10",
    ring: "border-severity-high/20",
  },
  medium: { dot: "bg-warning", text: "text-warning", tint: "bg-warning/10", ring: "border-warning/20" },
  low: { dot: "bg-success-solid", text: "text-success", tint: "bg-success/10", ring: "border-success/20" },
  info: { dot: "bg-info", text: "text-info", tint: "bg-info/10", ring: "border-info/20" },
};

// The API sends several spellings for the same tier.
const ALIASES = {
  critical: "critical",
  fatal: "critical",
  high: "high",
  error: "high",
  medium: "medium",
  warning: "medium",
  warn: "medium",
  low: "low",
  info: "info",
  debug: "info",
  trace: "info",
};

export function severity(level) {
  const key = ALIASES[String(level ?? "").toLowerCase()] ?? "info";
  return TIERS[key];
}

/** Pill used by the system-log table: tinted fill + hairline ring + token text. */
export function severityBadge(level) {
  const s = severity(level);
  return `${s.tint} border ${s.ring} ${s.text}`;
}
