// app/api/materials/list/route.js
// GET /api/v1/materials/list — materials with individual filters, public
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const forwarded = new URLSearchParams(searchParams).toString();

  try {
    const res = await fetch(`${BASE_URL}/materials/list${forwarded ? `?${forwarded}` : ""}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok)
      return NextResponse.json({ error: "Failed to fetch materials list" }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
