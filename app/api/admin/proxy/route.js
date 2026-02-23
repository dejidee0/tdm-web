import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Proxy endpoint for admin API requests
 * This proxies requests to avoid CORS issues during development
 *
 * Usage: POST to /admin/proxy with { endpoint, method, body }
 */
export async function POST(request) {
  try {
    const { endpoint, method = "GET", body } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    // Get cookies from incoming request to forward to backend
    const cookies = request.headers.get("cookie");

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(cookies && { Cookie: cookies }),
      },
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, options);
    const data = await response.json();

    // Forward response status and data
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: error.message || "Proxy request failed" },
      { status: 500 }
    );
  }
}
