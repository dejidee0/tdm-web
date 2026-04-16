// app/api/products/[id]/related/route.js
// GET /api/v1/products/{id}/related — public
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

export async function GET(_request, { params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BASE_URL}/products/${id}/related`, {
      next: { revalidate: 60 },
    });
    if (!res.ok)
      return NextResponse.json({ error: "Failed to fetch related products" }, { status: res.status });
    return NextResponse.json(await res.json(), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
