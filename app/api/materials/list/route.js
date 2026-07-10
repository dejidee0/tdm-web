// app/api/materials/list/route.js
// GET /api/v1/materials/list — materials with individual filters, public.
// No ApiEnvelope, and the items are MaterialSummary, not Product.
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/env";
import { parseResponse } from "@/lib/api/contract";
import { materialListResponse } from "@/lib/api/schemas/catalog";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const forwarded = new URLSearchParams(searchParams).toString();

  let res;
  try {
    res = await fetch(`${API_URL}/materials/list${forwarded ? `?${forwarded}` : ""}`, {
      next: { revalidate: 60 },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  if (!res.ok)
    return NextResponse.json({ error: "Failed to fetch materials list" }, { status: res.status });

  const data = parseResponse(materialListResponse, await res.json(), "GET /materials/list");
  return NextResponse.json(data);
}
