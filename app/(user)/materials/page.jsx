import { Suspense } from "react";
import MaterialsClient from "./client";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata = {
  title: "All Materials | TDM – Building & Construction Marketplace",
  description:
    "Browse our complete range of building and construction materials — bathroom fixtures, flooring, ceiling panels, doors, lighting and more. Shop or request pricing today.",
  keywords:
    "building materials, bathroom fixtures, construction supplies, flooring Nigeria",
  openGraph: {
    title: "All Materials | TDM",
    description:
      "Browse premium building & construction materials. Competitive pricing, fast delivery across Nigeria.",
    type: "website",
    images: [
      {
        url: "/og-materials.jpg",
        width: 1200,
        height: 630,
        alt: "TDM Materials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Materials | TDM",
    description: "Premium building & construction materials marketplace.",
  },
  alternates: {
    canonical: "/materials",
  },
};

// ─── Server-side Prefetch for initial page load ───────────────────────────────
async function getInitialProducts() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";
    const res = await fetch(
      `${baseUrl}/products?pageNumber=1&pageSize=12&ActiveOnly=true`,
      {
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return null;
    const json = await res.json();

    return json.data || null;
  } catch {
    return null;
  }
}

export default async function MaterialsPage() {
  const initialData = await getInitialProducts();

  return (
    <Suspense fallback={null}>
      <MaterialsClient initialData={initialData} />
    </Suspense>
  );
}
