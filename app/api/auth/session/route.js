// app/api/auth/session/route.js
//
// Single source of truth for "who is making this request?".
//
// Replaces the three separate probes (/api/auth/me, /api/auth/admin/me,
// /api/auth/vendor/me) that every page used to fire in parallel. Each of those
// only decodes a JWT from an httpOnly cookie, so answering all three at once
// costs one round trip instead of three.
//
// Always responds 200. An anonymous visitor is a valid answer, not an error —
// returning 401 here trained the client to treat a normal page view as a
// failure, and filled the logs with noise.
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth";
import { getCurrentAdminUser } from "@/lib/actions/admin-auth";
import { getCurrentVendorUser } from "@/lib/actions/vendor-auth";

const ANON = { role: null, user: null };

// We used to mirror each JWT into a second, browser-readable cookie so a client
// axios interceptor could set the Authorization header. That put a live token
// within reach of any XSS. The mirror is gone, but browsers that signed in
// before the change still hold one for up to 30 days — so expire them here.
// This route runs on every page load, so the fleet self-heals on first visit.
const LEGACY_TOKEN_COOKIES = [
  "authBearerToken",
  "adminBearerToken",
  "vendorBearerToken",
];

function respond(body) {
  const res = NextResponse.json(body);
  for (const name of LEGACY_TOKEN_COOKIES) res.cookies.delete(name);
  return res;
}

// Most-privileged role wins: an admin cookie beats a vendor cookie beats a user
// cookie. loginUser() sets both user and vendor cookies for vendor accounts.
export async function GET() {
  const [admin, vendor, user] = await Promise.all([
    getCurrentAdminUser().catch(() => null),
    getCurrentVendorUser().catch(() => null),
    getCurrentUser().catch(() => null),
  ]);

  if (admin) return respond({ role: "admin", user: admin });
  if (vendor) return respond({ role: "vendor", user: vendor });
  if (user) return respond({ role: "user", user });

  return respond(ANON);
}
