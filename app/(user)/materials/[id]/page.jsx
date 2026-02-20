// app/materials/[id]/page.jsx
import { notFound } from "next/navigation";
import MaterialDetailClient from "./client";
import { getProductById, getSimilarProducts } from "@/lib/data/products";

async function getMaterial(id) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getProductById(id);
}

async function getSimilarMaterialsData(categoryId, excludeId) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return getSimilarProducts(categoryId, excludeId, 8).map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.materialType,
    price: p.pricePerSqFt,
    image: p.images[0],
    rating: p.rating,
    inStock: p.inStock,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const material = await getMaterial(resolvedParams.id);

  if (!material) {
    return {
      title: "Material Not Found",
    };
  }

  return {
    title: `${material.name} - ${material.size} | TBM Flooring`,
    description:
      material.description ||
      `${material.name} - Premium quality flooring material. $${material.pricePerSqFt} per sq ft. In stock and ready to ship.`,
    openGraph: {
      title: material.name,
      description: material.description,
      images: [
        {
          url: material.images?.[0] || "/placeholder-material.jpg",
          width: 1200,
          height: 630,
          alt: material.name,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  // Return IDs for static generation
  return ["1", "2", "3", "4", "5", "6"].map((id) => ({ id }));
}

export default async function MaterialDetailPage({ params }) {
  const resolvedParams = await params;
  const material = await getMaterial(resolvedParams.id);

  if (!material) {
    notFound();
  }

  const similarMaterials = await getSimilarMaterialsData(
    material.categoryId,
    resolvedParams.id,
  );

  return (
    <MaterialDetailClient
      material={material}
      similarMaterials={similarMaterials}
    />
  );
}
