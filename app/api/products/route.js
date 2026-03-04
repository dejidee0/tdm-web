import { NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const params = new URLSearchParams();

  // Map frontend query params to API params
  const pageNumber = searchParams.get("pageNumber") || "1";
  const pageSize = searchParams.get("pageSize") || "12";
  const brandType = searchParams.get("brandType");
  const productType = searchParams.get("productType");
  const categoryId = searchParams.get("categoryId");
  const searchTerm = searchParams.get("searchTerm");
  const isFeatured = searchParams.get("isFeatured");
  const activeOnly = searchParams.get("activeOnly") ?? "true";

  params.set("pageNumber", pageNumber);
  params.set("pageSize", pageSize);
  if (brandType) params.set("BrandType", brandType);
  if (productType) params.set("ProductType", productType);
  if (categoryId) params.set("CategoryId", categoryId);
  if (searchTerm) params.set("SearchTerm", searchTerm);
  if (isFeatured !== null && isFeatured !== undefined)
    params.set("isFeatured", isFeatured);
  if (activeOnly) params.set("ActiveOnly", activeOnly);

  try {
    const res = await fetch(`${BASE_URL}/v1/products?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...(process.env.API_KEY
          ? { Authorization: `Bearer ${process.env.API_KEY}` }
          : {}),
      },
      next: { revalidate: 60 }, // ISR: revalidate every 60s
    });

    if (!res.ok) {
      console.error("❌ Products API error:", res.status, res.statusText);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("❌ Products fetch failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
