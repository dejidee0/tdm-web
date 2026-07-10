// app/api/saved/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/env";

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
    const targetUrl = `${API_URL}/saved${search}`;

    const res = await fetch(targetUrl, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    });

    const text = await res.text();

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
    const res = await fetch(`${API_URL}/saved`, {
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
