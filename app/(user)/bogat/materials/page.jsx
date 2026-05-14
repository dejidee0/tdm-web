import { Suspense } from "react";
import BogatMaterialsClient from "./client";
import { getMockProductList } from "@/lib/mock/bogat-products";

export const metadata = {
  title: "Shop Bogat Materials | TBM — Premium Building Materials Nigeria",
  description:
    "Browse the full Bogat collection — bathroom fixtures, WCs, basins, faucets, tiles, marble, doors, and more. Fixed pricing and request-quote options. Delivered across Nigeria.",
  keywords:
    "Bogat materials Nigeria, bathroom fixtures Abuja, building materials Lagos, WC fittings Nigeria, tiles Nigeria, luxury materials",
  openGraph: {
    title: "Shop Bogat Materials | TBM Building Services",
    description:
      "Browse premium Bogat building & construction materials. Competitive pricing, fast delivery across Nigeria.",
    type: "website",
    images: [
      {
        url: "/og-materials.jpg",
        width: 1200,
        height: 630,
        alt: "Bogat Materials by TBM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bogat Materials | TBM",
    description: "Premium building & construction materials marketplace.",
  },
  alternates: {
    canonical: "/bogat/materials",
  },
};

// ─── Toggle ───────────────────────────────────────────────────────────────────
// Set to false to re-enable live API fetching.
const USE_MOCK_DATA = true;
// ─────────────────────────────────────────────────────────────────────────────

async function getInitialProducts() {
  if (USE_MOCK_DATA) {
    return getMockProductList({ page: 1, pageSize: 12 });
  }

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";
    const res = await fetch(
      `${baseUrl}/products?pageNumber=1&pageSize=12&ActiveOnly=true`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export default async function BogatMaterialsPage() {
  const initialData = await getInitialProducts();

  return (
    <Suspense fallback={null}>
      <BogatMaterialsClient initialData={initialData} useMockData={USE_MOCK_DATA} />
    </Suspense>
  );
}
