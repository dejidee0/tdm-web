// app/api/products/featured/route.js
// GET /api/v1/products/featured — public
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/products/featured`, {
      next: { revalidate: 120 },
    });
    if (!res.ok)
      return NextResponse.json({ error: "Failed to fetch featured products" }, { status: res.status });
    return NextResponse.json(await res.json(), {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
