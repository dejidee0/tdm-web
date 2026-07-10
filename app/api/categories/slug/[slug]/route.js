// app/api/categories/slug/[slug]/route.js
// GET /api/v1/categories/slug/{slug} — public
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/env";

export async function GET(_request, { params }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_URL}/categories/slug/${slug}`, {
      next: { revalidate: 300 },
    });
    if (res.status === 404)
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    if (!res.ok)
      return NextResponse.json({ error: "Failed to fetch category" }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
