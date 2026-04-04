// app/api/categories/brand/[type]/route.js
// GET /api/v1/categories/brand/{type} — BrandType: TBM=1, Bogat=2 — public
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

export async function GET(_request, { params }) {
  const { type } = await params;
  try {
    const res = await fetch(`${BASE_URL}/categories/brand/${type}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok)
      return NextResponse.json({ error: "Failed to fetch categories by brand" }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
