// lib/log.js
// Server-side logging helpers.
//
// API response bodies routinely carry access tokens, refresh tokens, OTPs and
// PII. Logging one verbatim writes live credentials into whatever reads the
// process output — host log drains, error reporters, a teammate's terminal.
//
// Rules enforced here:
//   - Success bodies are never logged outside development.
//   - Any body that is logged has sensitive keys replaced first.
//   - URLs have sensitive query-param values replaced.

export const isDev = process.env.NODE_ENV !== "production";

const SENSITIVE_KEY =
  /token|password|secret|authorization|otp|code|refresh|apikey|api_key/i;

/** Recursively replace values of sensitive-looking keys. */
export function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) =>
        SENSITIVE_KEY.test(k) ? [k, "[redacted]"] : [k, redact(v)],
      ),
    );
  }
  return value;
}

/** Redact a raw response body. Non-JSON bodies are dropped, not echoed. */
export function safeBody(text) {
  if (!text) return "";
  try {
    return JSON.stringify(redact(JSON.parse(text)));
  } catch {
    return "[non-JSON body omitted]";
  }
}

/** Redact sensitive query-param values, keeping the path readable. */
export function safeUrl(url) {
  try {
    const parsed = new URL(url);
    for (const key of [...parsed.searchParams.keys()]) {
      if (SENSITIVE_KEY.test(key)) parsed.searchParams.set(key, "[redacted]");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
