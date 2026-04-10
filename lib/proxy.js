/**
 * Central proxy handler factory.
 *
 * Creates Next.js App Router route handlers that transparently forward
 * requests to a backend service.  The actual backend URL lives in a
 * server-side-only env var so it is never shipped to the browser.
 *
 * Security measures:
 *  - Only a safe allow-list of request headers is forwarded (no Host leak).
 *  - Only a safe allow-list of response headers is returned to the client.
 *  - X-Content-Type-Options is set on every response.
 *  - A 502 is returned when the upstream is unreachable rather than leaking
 *    connection details.
 */

const FORWARDED_REQUEST_HEADERS = [
  "authorization",
  "cookie",
  "content-type",
  "accept",
  "accept-language",
  "accept-encoding",
];

const FORWARDED_RESPONSE_HEADERS = [
  "content-type",
  "content-disposition",
  "set-cookie",
];

/**
 * @param {string} backendBase  Full base URL of the upstream service,
 *                              e.g. process.env.API_URL.
 *                              Must be a private (non-NEXT_PUBLIC) env var.
 */
import { cookies } from "next/headers";

export function makeProxyHandlers(backendBase) {
  async function handle(request, context) {
    const { path } = await context.params;
    const segments = Array.isArray(path) ? path.join("/") : path;

    // Preserve original query string
    const { search } = new URL(request.url);
    const targetUrl = `${backendBase}/${segments}${search}`;

    console.log("[proxy] backendBase:", backendBase);
    console.log("[proxy] segments:", segments);
    console.log("[proxy] target URL:", targetUrl);
    console.log("[proxy] method:", request.method);

    // Forward only the headers we trust
    const forwardHeaders = new Headers();
    for (const key of FORWARDED_REQUEST_HEADERS) {
      const value = request.headers.get(key);
      if (value) forwardHeaders.set(key, value);
    }

    // Inject Bearer token from httpOnly cookie if the client didn't send one already.
    // The backend requires Authorization: Bearer <token> — cookies alone are not accepted.
    if (!forwardHeaders.get("authorization")) {
      const cookieStore = await cookies();
      const token =
        cookieStore.get("authBearerToken")?.value ??
        cookieStore.get("authToken")?.value;
      if (token) forwardHeaders.set("authorization", `Bearer ${token}`);
    }

    console.log("[proxy] forwarded headers:", [...forwardHeaders.keys()]);

    const init = {
      method: request.method,
      headers: forwardHeaders,
    };

    // Attach body for non-idempotent methods
    if (!["GET", "HEAD"].includes(request.method)) {
      init.body = await request.arrayBuffer();
    }

    let upstream;
    try {
      upstream = await fetch(targetUrl, init);
      console.log("[proxy] upstream status:", upstream.status, upstream.statusText);
    } catch (err) {
      console.error("[proxy] upstream fetch failed:", targetUrl, err.message, err.stack);
      return new Response(
        JSON.stringify({ error: "Upstream service unavailable" }),
        { status: 502, headers: { "content-type": "application/json" } },
      );
    }

    // Build safe response headers
    const responseHeaders = new Headers();
    for (const key of FORWARDED_RESPONSE_HEADERS) {
      const value = upstream.headers.get(key);
      if (value) responseHeaders.set(key, value);
    }
    responseHeaders.set("X-Content-Type-Options", "nosniff");

    // Read body so we can log errors without consuming the stream
    const body = await upstream.text();
    if (!upstream.ok) {
      console.error("=== [proxy] UPSTREAM ERROR ===");
      console.error("URL:", targetUrl);
      console.error("Status:", upstream.status, upstream.statusText);
      console.error("Body:", body);
      console.error("==============================");
    }

    return new Response(body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  }

  return {
    GET: handle,
    POST: handle,
    PUT: handle,
    PATCH: handle,
    DELETE: handle,
  };
}
