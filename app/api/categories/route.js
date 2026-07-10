// app/api/categories/route.js
// GET /api/v1/categories — public
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/env";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: res.status });
    return NextResponse.json(await res.json(), {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
