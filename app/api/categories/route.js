// app/api/categories/route.js
// GET /api/v1/categories — public
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/env";
import { parseResponse } from "@/lib/api/contract";
import { categoryListResponse } from "@/lib/api/schemas/catalog";

export async function GET() {
  let res;
  try {
    res = await fetch(`${API_URL}/categories`, { next: { revalidate: 300 } });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  if (!res.ok)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: res.status });

  // Parsed outside the try: a contract mismatch must surface, not be swallowed
  // into a generic 500. Dev throws with the offending field; prod logs drift
  // and returns the body unchanged.
  const data = parseResponse(categoryListResponse, await res.json(), "GET /categories");

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" },
  });
}
