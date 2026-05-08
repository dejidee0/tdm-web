import BogatClient from "./client";

export const metadata = {
  title: "Bogat Premium Materials | TBM — Luxury Finishes for Nigerian Homes",
  description:
    "Explore Bogat's curated collection of premium tiles, bathroom fittings, sanitary ware, marble, doors, and accessories. Sourced for quality, supplied by TBM across Nigeria.",
  keywords:
    "Bogat materials Nigeria, premium tiles Abuja, bathroom fittings Lagos, luxury marble Nigeria, sanitary ware Nigeria, Bogat by TBM",
  openGraph: {
    title: "Bogat Premium Materials | TBM Building Services",
    description:
      "Luxury finishes and premium building materials for homes and commercial spaces across Nigeria.",
    type: "website",
    images: [
      {
        url: "/og-materials.jpg",
        width: 1200,
        height: 630,
        alt: "Bogat Premium Materials by TBM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bogat Premium Materials | TBM",
    description: "Premium luxury building materials curated for Nigerian homes.",
  },
  alternates: {
    canonical: "/bogat",
  },
};

export default function BogatPage() {
  return <BogatClient />;
}
