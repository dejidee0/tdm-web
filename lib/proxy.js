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
export function makeProxyHandlers(backendBase) {
  async function handle(request, context) {
    const { path } = await context.params;
    const segments = Array.isArray(path) ? path.join("/") : path;

    // Preserve original query string
    const { search } = new URL(request.url);
    const targetUrl = `${backendBase}/${segments}${search}`;

    // Forward only the headers we trust
    const forwardHeaders = new Headers();
    for (const key of FORWARDED_REQUEST_HEADERS) {
      const value = request.headers.get(key);
      if (value) forwardHeaders.set(key, value);
    }

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
    } catch (err) {
      console.error("[proxy] upstream fetch failed:", targetUrl, err.message);
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

    return new Response(upstream.body, {
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
