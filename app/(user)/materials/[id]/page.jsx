// app/materials/[id]/page.jsx
import { notFound } from "next/navigation";
import MaterialDetailClient from "./client";
import { mockMaterialData, mockSimilarMaterials } from "@/lib/mock-data";

// API function - currently using mock data
async function getMaterial(id) {
  // TODO: Uncomment when API is ready
  // try {
  //   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`, {
  //     next: { revalidate: 3600 } // Revalidate every hour
  //   });
  //
  //   if (!res.ok) {
  //     return null;
  //   }
  //
  //   return res.json();
  // } catch (error) {
  //   console.error('Error fetching material:', error);
  //   return null;
  // }

  // Using mock data for development
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMaterialData);
    }, 300); // Simulate network delay
  });
}

// Function for similar products - currently using mock data
async function getSimilarMaterials(categoryId, excludeId) {
  // TODO: Uncomment when API is ready
  // try {
  //   const res = await fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}/materials?category=${categoryId}&exclude=${excludeId}&limit=8`,
  //     { next: { revalidate: 3600 } }
  //   );
  //
  //   if (!res.ok) {
  //     return [];
  //   }
  //
  //   return res.json();
  // } catch (error) {
  //   console.error('Error fetching similar materials:', error);
  //   return [];
  // }

  // Using mock data for development
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSimilarMaterials);
    }, 300); // Simulate network delay
  });
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  // Await params for Next.js 15+
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
      `${material.name} - Premium quality flooring material. ${material.price} per sq ft. In stock and ready to ship.`,
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
    twitter: {
      card: "summary_large_image",
      title: material.name,
      description: material.description,
      images: [material.images?.[0] || "/placeholder-material.jpg"],
    },
  };
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  // TODO: Uncomment when API is ready
  // Fetch list of material IDs for static generation
  // This is optional and depends on your needs
  // try {
  //   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials?fields=id`);
  //   const materials = await res.json();
  //
  //   return materials.map((material) => ({
  //     id: material.id.toString(),
  //   }));
  // } catch (error) {
  //   return [];
  // }

  // Using mock data - return sample IDs
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function MaterialDetailPage({ params }) {
  // Await params for Next.js 15+
  const resolvedParams = await params;
  const material = await getMaterial(resolvedParams.id);

  if (!material) {
    notFound();
  }

  const similarMaterials = await getSimilarMaterials(
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
