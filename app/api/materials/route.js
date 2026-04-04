// app/api/materials/route.js
// GET /api/v1/materials — public
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams();
  const pageNumber = searchParams.get("pageNumber");
  const pageSize = searchParams.get("pageSize");
  if (pageNumber) params.set("pageNumber", pageNumber);
  if (pageSize) params.set("pageSize", pageSize);

  try {
    const query = params.toString();
    const res = await fetch(`${BASE_URL}/materials${query ? `?${query}` : ""}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok)
      return NextResponse.json({ error: "Failed to fetch materials" }, { status: res.status });
    return NextResponse.json(await res.json(), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
