// app/components/shared/trending-section.jsx
// Server Component — data fetched at build/request time, no client waterfall

import TrendingClient from "./trending-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop";

async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${BASE_URL}/products?isFeatured=true&pageSize=4&ActiveOnly=true`,
      {
        next: { revalidate: 300 }, // revalidate every 5 min
        headers: { "Content-Type": "application/json" },
      },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.items ?? [];
  } catch {
    return [];
  }
}

export default async function TrendingSection() {
  const products = await getFeaturedProducts();

  // Normalise shape
  const normalised = products.map((p) => ({
    id: p.id,
    name: p.name,
    priceDisplay: p.priceDisplay,
    showPrice: p.showPrice,
    image: p.primaryImageUrl || p.images?.[0] || PLACEHOLDER,
    slug: p.slug || p.id,
    categoryName: p.categoryName,
    brandName: p.brandName,
    inStock: p.inStock,
  }));

  return <TrendingClient products={normalised} />;
}
