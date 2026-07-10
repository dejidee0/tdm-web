// lib/env.js
//
// Server-only configuration. Import this from route handlers, server actions
// and server components — never from a client component.
//
// The backend base URL used to live in NEXT_PUBLIC_API_URL. Next.js inlines
// every NEXT_PUBLIC_* var into the client bundle at build time, so the
// "private" upstream was shipped to every visitor — which defeated the point of
// proxying through lib/proxy.js in the first place. It now lives in API_URL.
//
// There is deliberately no default value. The old `|| "https://api.yourbackend.com"`
// fallback meant a missing env var did not fail the build: it silently pointed
// the app — Authorization headers and all — at a domain nobody here controls.
// A missing variable should stop the build, loudly.

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. ` +
        `Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value.replace(/\/+$/, ""); // callers always supply their own leading slash
}

export const API_URL = required("API_URL");
export const ADMIN_API_URL = required("ADMIN_API_URL");
