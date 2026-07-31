// app/api/products/featured/route.js
// GET /api/v1/products/featured — public. Returns a bare array, not a Paged.
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/env";
import { parseResponse } from "@/lib/api/contract";
import { productArrayResponse } from "@/lib/api/schemas/catalog";

export async function GET() {
  let res;
  try {
    res = await fetch(`${API_URL}/products/featured`, { next: { revalidate: 120 } });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  if (!res.ok)
    return NextResponse.json({ error: "Failed to fetch featured products" }, { status: res.status });

  const data = parseResponse(productArrayResponse, await res.json(), "GET /products/featured");

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" },
  });
}
