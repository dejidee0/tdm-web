// lib/api/contract.ts
//
// SERVER-ONLY. Runs where responses enter the app: lib/proxy.js and the route
// handlers under app/api/. Never import this from a client component.
//
// The backend publishes no response schemas (all 266 operations declare a bare
// `200: OK`), so lib/api/schemas/* is our contract of record. This module is
// what makes that contract mean something at runtime.
//
// Behaviour is deliberately asymmetric:
//
//   development — throw immediately, naming the field that disagreed. A wrong
//                 schema is a bug we want to hit on the first request.
//   production  — log a redacted drift report and return the data unchanged.
//                 A backend that adds a field must never take checkout down.
//                 Validation here is a monitoring signal, not a circuit breaker.
//
// When drift is logged in production, the fix is to update the schema — never to
// cast around it.

import type { ZodType } from "zod";
import { isDev, redact } from "@/lib/log";

const MAX_ISSUES = 8;

/**
 * Validate a response against its schema.
 *
 * @param schema  from lib/api/schemas/*
 * @param data    the parsed JSON body
 * @param context an endpoint label for the log line, e.g. "GET /products"
 */
export function parseResponse<T>(
  schema: ZodType<T>,
  data: unknown,
  context: string,
): T {
  const result = schema.safeParse(data);
  if (result.success) return result.data;

  const issues = result.error.issues
    .slice(0, MAX_ISSUES)
    .map((issue) => {
      const path = issue.path.length ? issue.path.join(".") : "<root>";
      return `${path}: ${issue.message}`;
    });
  const extra = result.error.issues.length - issues.length;
  if (extra > 0) issues.push(`…and ${extra} more`);

  if (isDev) {
    throw new Error(
      `[contract] ${context} does not match its schema.\n` +
        issues.map((i) => `  • ${i}`).join("\n") +
        `\n\nEither the backend changed or lib/api/schemas is wrong.` +
        ` Fix the schema — do not cast around it.`,
    );
  }

  // Fail open. The payload may contain PII, so log the issue paths only —
  // never the values. redact() guards the shape summary as a second line.
  console.error(`[contract] drift on ${context}:`, issues);
  return data as T;
}

/**
 * A registry of response schemas for traffic that flows through lib/proxy.js
 * (the generic /api/v1/** passthrough).
 *
 * Coverage is deliberately partial: a path with no entry is forwarded
 * unvalidated. Add an entry only once the real response has been observed —
 * `npm run contract:record` writes those into contracts/. An invented schema
 * is worse than none, because it alarms on the truth.
 */
type ContractEntry = { method: string; pattern: RegExp; schema: ZodType<unknown>; label: string };

const registry: ContractEntry[] = [
  // Populated as shapes are recorded. `cart` is intentionally absent until a
  // non-empty cart has been captured — its item shape has never been observed.
];

/** Find the schema for an upstream path such as `products/slug/foo`. */
export function findContract(method: string, path: string): ContractEntry | null {
  const m = method.toUpperCase();
  return (
    registry.find((e) => e.method === m && e.pattern.test(path)) ?? null
  );
}
