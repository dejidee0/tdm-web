// app/api/flooring/route.js
import { NextResponse } from "next/server";
import { PRODUCTS, filterProducts, sortProducts } from "@/lib/data/products";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const categories = searchParams.get("category")?.split(",") || [];
  const materialTypes = searchParams.get("materialType")?.split(",") || [];
  const minPrice = searchParams.get("minPrice")
    ? parseFloat(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? parseFloat(searchParams.get("maxPrice"))
    : undefined;
  const sortBy = searchParams.get("sort") || "popular";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "6");

  // Apply filters
  let filtered = filterProducts({
    categories,
    materialTypes,
    minPrice,
    maxPrice,
  });

  // Apply sorting
  filtered = sortProducts(filtered, sortBy);

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filtered.slice(startIndex, endIndex);

  // Get unique categories and material types for filters
  const uniqueCategories = [...new Set(PRODUCTS.map((p) => p.category))];
  const uniqueMaterialTypes = [...new Set(PRODUCTS.map((p) => p.materialType))];

  // Transform products for listing view
  const transformedProducts = paginatedProducts.map((p) => ({
    id: p.id,
    name: p.name,
    materialType: p.materialType,
    description: p.description,
    price: p.pricePerSqFt,
    unit: "sq ft",
    rating: p.rating,
    reviews: p.reviewCount,
    image: p.images[0],
    badges: p.badges,
    stock: {
      quantity: p.inStock
        ? `${p.stockQuantity} sq ft in stock`
        : "Out of Stock",
      bundleOffer: p.inStock
        ? "Buy 5+ boxes and save more than normal, save 10%"
        : null,
    },
  }));

  return NextResponse.json({
    products: transformedProducts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filtered.length / limit),
      total: filtered.length,
      limit,
    },
    filters: {
      categories: uniqueCategories,
      materialTypes: uniqueMaterialTypes,
    },
  });
}
