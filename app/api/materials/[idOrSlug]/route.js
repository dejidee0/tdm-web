// app/api/materials/[idOrSlug]/route.js
// GET /api/v1/materials/{idOrSlug} — public
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

export async function GET(_request, { params }) {
  const { idOrSlug } = await params;
  try {
    const res = await fetch(`${BASE_URL}/materials/${idOrSlug}`, {
      next: { revalidate: 120 },
    });
    if (res.status === 404)
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    if (!res.ok)
      return NextResponse.json({ error: "Failed to fetch material" }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
