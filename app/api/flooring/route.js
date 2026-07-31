// app/api/flooring/route.js
// GET /api/v1/flooring — public. No ApiEnvelope; full Products.
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/env";
import { parseResponse } from "@/lib/api/contract";
import { flooringResponse } from "@/lib/api/schemas/catalog";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const forwarded = new URLSearchParams(searchParams).toString();

  let res;
  try {
    res = await fetch(`${API_URL}/flooring${forwarded ? `?${forwarded}` : ""}`, {
      next: { revalidate: 60 },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  if (!res.ok)
    return NextResponse.json({ error: "Failed to fetch flooring products" }, { status: res.status });

  // Parsed outside the try so a contract mismatch surfaces rather than being
  // swallowed into a generic 500.
  const data = parseResponse(flooringResponse, await res.json(), "GET /flooring");

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
