// app/api/saved/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req) {
  try {
    // Forward supported query params to the backend (category, search, sortBy, page, limit)
    const { search } = new URL(req.url);
    const authHeader = await getAuthHeader();
    const targetUrl = `${BASE_URL}/saved${search}`;

    console.log("[/api/saved GET] BASE_URL:", BASE_URL);
    console.log("[/api/saved GET] target URL:", targetUrl);
    console.log("[/api/saved GET] auth header present:", !!authHeader.Authorization);

    const res = await fetch(targetUrl, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    });

    console.log("[/api/saved GET] upstream status:", res.status, res.statusText);

    const text = await res.text();
    console.log("[/api/saved GET] upstream body (first 300):", text.slice(0, 300));

    let json = null;
    try {
      json = JSON.parse(text);
    } catch (parseErr) {
      console.error("[/api/saved GET] JSON parse failed:", parseErr.message);
    }
    if (!res.ok) {
      console.error(`[/api/saved GET] backend ${res.status}:`, text.slice(0, 300));
    }
    return NextResponse.json(json ?? {}, { status: res.status });
  } catch (err) {
    console.error("[/api/saved GET] fetch error:", err.message, err.stack);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const res = await fetch(`${BASE_URL}/saved`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    return NextResponse.json(json ?? {}, { status: res.status });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
