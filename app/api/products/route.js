import { NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const params = new URLSearchParams();

  const pageNumber = searchParams.get("pageNumber") || "1";
  const pageSize = searchParams.get("pageSize") || "12";
  const brandType = searchParams.get("brandType");
  const productType = searchParams.get("productType");
  const categoryId = searchParams.get("categoryId");
  const searchTerm = searchParams.get("searchTerm");
  const isFeatured = searchParams.get("isFeatured");
  const activeOnly = searchParams.get("activeOnly") ?? "true";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  params.set("pageNumber", pageNumber);
  params.set("pageSize", pageSize);
  if (brandType) params.set("BrandType", brandType);
  if (productType) params.set("ProductType", productType);
  if (categoryId) params.set("CategoryId", categoryId);
  if (searchTerm) params.set("SearchTerm", searchTerm);
  if (isFeatured !== null && isFeatured !== undefined)
    params.set("isFeatured", isFeatured);
  if (activeOnly) params.set("ActiveOnly", activeOnly);
  if (minPrice !== null && minPrice !== undefined)
    params.set("MinPrice", minPrice);
  if (maxPrice !== null && maxPrice !== undefined)
    params.set("MaxPrice", maxPrice);

  try {
    const res = await fetch(`${BASE_URL}/products?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...(process.env.API_KEY
          ? { Authorization: `Bearer ${process.env.API_KEY}` }
          : {}),
      },
      next: { revalidate: 60 },
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
