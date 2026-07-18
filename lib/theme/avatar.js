// Deterministic avatar colors, drawn from the chart-series tokens.
//
// This replaces `#${Math.floor(Math.random() * 16777215).toString(16)}`, which
// had three problems: it produced a new color on every refetch, ~6% of its
// output was not valid 6-digit hex (Math.random can yield values below 0x100000,
// so `toString(16)` returns 5 chars) and the caller appended "20" for alpha,
// and nothing bounded the contrast against the dark avatar background.

const AVATAR_TOKENS = [
  "--color-chart-1",
  "--color-chart-2",
  "--color-chart-3",
  "--color-chart-4",
  "--color-role-vendor",
  "--color-role-superadmin",
];

// FNV-1a — stable across processes, unlike String.hashCode-style sums.
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Same key always yields the same color. */
export function avatarToken(key) {
  return AVATAR_TOKENS[hash(String(key ?? "")) % AVATAR_TOKENS.length];
}

/** Inline style for a tinted avatar: token text on a 14% fill of itself. */
export function avatarStyle(key) {
  const token = avatarToken(key);
  return {
    backgroundColor: `color-mix(in oklab, var(${token}) 14%, transparent)`,
    color: `var(${token})`,
  };
}

/**
 * Up to two initials from a name, falling back to the email's first letter.
 *
 * Call sites used to read `user.initials`, a field no hook or API ever set — so
 * every avatar in the admin tables rendered a literal "?".
 */
export function initialsOf(user) {
  const name = user?.fullName || user?.name || "";
  const fromName = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  if (fromName) return fromName.toUpperCase();
  const email = user?.email || "";
  return email ? email[0].toUpperCase() : "?";
}
