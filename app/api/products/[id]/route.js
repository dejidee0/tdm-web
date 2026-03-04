import { NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const res = await fetch(`${BASE_URL}/v1/Products/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(process.env.API_KEY
          ? { Authorization: `Bearer ${process.env.API_KEY}` }
          : {}),
      },
      next: { revalidate: 120 },
    });

    if (res.status === 404) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!res.ok) {
      console.error("❌ Product API error:", res.status, res.statusText);
      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("❌ Product fetch failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
