// lib/errors.js
// Centralized API error handling.
//
// - Devs see the full raw backend response in the browser/Node console.
// - Users see friendly, status-based messages — never raw server internals.

// Status codes where the backend message is user-actionable (validation, conflict)
// and can be shown directly. Everything else uses the preset below.
const USER_ACTIONABLE_STATUSES = new Set([409, 422]);

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
 * Logs the raw backend error to console for developers.
 * Uses console.group in dev for readable output; a single line in production.
 */
export function logApiError(label, status, rawData) {
  if (process.env.NODE_ENV === "production") {
    console.error(`[API] ${label} → ${status}`);
    return;
  }
  // eslint-disable-next-line no-console
  console.groupCollapsed(`%c[API Error] ${label} → ${status}`, "color:#ef4444;font-weight:bold");
  // eslint-disable-next-line no-console
  if (rawData !== undefined) console.error("Backend response:", rawData);
  // eslint-disable-next-line no-console
  console.groupEnd();
}

/**
 * Returns a user-friendly message for the given HTTP status code.
 *
 * For user-actionable statuses (409, 422) the backend message is returned
 * directly — it's usually something the user can act on (e.g. "Email already
 * taken", "Password must be at least 8 characters").
 *
 * For everything else — especially 5xx server errors — a generic preset is
 * used so internal implementation details are never exposed to users.
 */
export function getFriendlyMessage(status, backendMessage) {
  if (USER_ACTIONABLE_STATUSES.has(status)) {
    return backendMessage || "Something went wrong. Please try again.";
  }
  return FRIENDLY_MESSAGES[status] || "Something went wrong. Please try again.";
}
