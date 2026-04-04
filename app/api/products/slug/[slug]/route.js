// app/api/products/slug/[slug]/route.js
// GET /api/v1/products/slug/{slug} — public
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

export async function GET(_request, { params }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${BASE_URL}/products/slug/${slug}`, {
      next: { revalidate: 120 },
    });
    if (res.status === 404)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    if (!res.ok)
      return NextResponse.json({ error: "Failed to fetch product" }, { status: res.status });
    return NextResponse.json(await res.json(), {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
