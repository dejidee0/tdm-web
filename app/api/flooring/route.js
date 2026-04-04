// app/api/flooring/route.js
// GET /api/v1/flooring — public
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const forwarded = new URLSearchParams(searchParams).toString();

  try {
    const res = await fetch(`${BASE_URL}/flooring${forwarded ? `?${forwarded}` : ""}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok)
      return NextResponse.json({ error: "Failed to fetch flooring products" }, { status: res.status });
    return NextResponse.json(await res.json(), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
