// Role chip styling for the admin surface.
// Each role maps to one hue token used twice: as text, and at 14% alpha as the
// fill. Both directions clear WCAG AA (4.5:1) on --color-surface and
// --color-surface-raised, so the chip stays legible if a row background shifts.

export const roleBadgeColors = {
  "Super Admin": { bg: "bg-role-superadmin/14", text: "text-role-superadmin" },
  Admin: { bg: "bg-role-admin/14", text: "text-role-admin" },
  Manager: { bg: "bg-role-manager/14", text: "text-role-manager" },
  Vendor: { bg: "bg-role-vendor/14", text: "text-role-vendor" },
  Auditor: { bg: "bg-role-auditor/14", text: "text-role-auditor" },
  Customer: { bg: "bg-role-customer/14", text: "text-role-customer" },
};

export const FALLBACK_ROLE_BADGE = {
  bg: "bg-muted/14",
  text: "text-muted",
};

export function roleBadge(role) {
  return roleBadgeColors[role] ?? FALLBACK_ROLE_BADGE;
}
