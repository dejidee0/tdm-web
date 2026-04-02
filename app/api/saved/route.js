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
    const res = await fetch(`${BASE_URL}/saved${search}`, {
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      },
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    if (!res.ok) {
      console.error(`[/api/saved GET] backend ${res.status}:`, text.slice(0, 300));
    }
    return NextResponse.json(json ?? {}, { status: res.status });
  } catch (err) {
    console.error("[/api/saved GET] fetch error:", err.message);
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
