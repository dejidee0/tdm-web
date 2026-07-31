// lib/errors.js
// Centralized API error handling.
//
// - Devs see the full raw backend response in the browser/Node console.
// - Users see friendly, status-based messages — never raw server internals.

import { redact } from "@/lib/log";

// Status codes where the backend's own message is user-actionable and safe to
// show verbatim. These are the client-error statuses the backend uses to explain
// what the user did wrong — "SKU already exists", "Email already taken",
// "Password must be at least 8 characters".
//
// 400 is included: this .NET backend returns business-rule and validation
// failures as 400 with a user-facing `message` in its ApiResponse envelope
// (the same field that says "Operation successful" on success). Hiding those
// behind a generic "Invalid request" is the bug this set exists to prevent.
//
// 401/403/404/5xx are deliberately absent — their messages are either not
// actionable or may carry internals, so they always use the preset below.
const USER_ACTIONABLE_STATUSES = new Set([400, 409, 422]);

const FRIENDLY_MESSAGES = {
  400: "Invalid request. Please check your input and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to perform this action.",
  404: "The resource you requested could not be found.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again later.",
  502: "Service temporarily unavailable. Please try again shortly.",
  503: "Service temporarily unavailable. Please try again shortly.",
  504: "The request timed out. Please try again.",
};

/**
 * Pull the user-facing message out of an error response body, across the two
 * shapes this backend returns:
 *
 *   ApiResponse envelope     { success:false, message:"SKU already exists", errors:[] }
 *   ASP.NET ProblemDetails   { title:"One or more validation errors occurred.",
 *                              errors:{ sku:["already taken"] } }
 *
 * Preference order: the envelope's `message` (a written summary), then specific
 * field errors (more useful than the generic ProblemDetails title), then the
 * title. Returns null when the body carries no usable message — the caller then
 * falls back to a status preset rather than to a raw string like axios's
 * "Request failed with status code 400", which must never reach a user.
 *
 * @param {unknown} data  the parsed response body
 * @returns {string|null}
 */
export function extractBackendMessage(data) {
  if (!data || typeof data !== "object") return null;

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message.trim();
  }

  const { errors } = data;
  if (errors) {
    const list = Array.isArray(errors)
      ? errors
      : typeof errors === "object"
        ? Object.values(errors).flat()
        : [];
    const joined = list.filter((m) => typeof m === "string" && m.trim()).join(", ");
    if (joined) return joined;
  }

  if (typeof data.title === "string" && data.title.trim()) return data.title.trim();
  return null;
}

/**
 * Logs the raw backend error to console for developers.
 * Uses console.group in dev for readable output; a single line in production.
 */
export function logApiError(label, status, rawData) {
  if (process.env.NODE_ENV === "production") {
    console.error(`[API] ${label} → ${status}`);
    return;
  }
  // Stringify the redacted body rather than passing the object to console.error.
  // A live object renders as `{}` in the Next.js error overlay, and an error
  // body can carry a token — redact() blanks those before it is printed.
  const summary = rawData === undefined ? "" : JSON.stringify(redact(rawData));
  // eslint-disable-next-line no-console
  console.groupCollapsed(`%c[API Error] ${label} → ${status}`, "color:#ef4444;font-weight:bold");
  // eslint-disable-next-line no-console
  if (summary) console.error("Backend response:", summary);
  // eslint-disable-next-line no-console
  console.groupEnd();
}

/**
 * Returns a user-friendly message for the given HTTP status code.
 *
 * For user-actionable client errors (400, 409, 422) the backend's own message
 * is returned when present — it explains what the user can fix ("SKU already
 * exists", "Email already taken"). `backendMessage` must already be an
 * extracted, user-facing string (use extractBackendMessage); a null falls back
 * to the preset.
 *
 * For everything else — 401/403/404 and especially 5xx — a generic preset is
 * used so internal implementation details are never exposed.
 */
export function getFriendlyMessage(status, backendMessage) {
  // Show the backend's own message only for an actionable client error that
  // actually carried one. Otherwise fall through to the status preset — a 400
  // with no usable body is still "Invalid request.", not the generic catch-all.
  if (USER_ACTIONABLE_STATUSES.has(status) && backendMessage) {
    return backendMessage;
  }
  return FRIENDLY_MESSAGES[status] || "Something went wrong. Please try again.";
}
