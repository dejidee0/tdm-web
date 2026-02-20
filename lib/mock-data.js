// lib/mock-data.js
import { getProductById, getSimilarProducts } from "@/lib/data/products";

export const mockMaterialData = getProductById("1");

export const mockSimilarMaterials = getSimilarProducts(
  "marble-tiles",
  "1",
  8,
).map((p) => ({
  id: p.id,
  name: p.name,
  subtitle: p.materialType,
  price: p.pricePerSqFt,
  image: p.images[0],
  rating: p.rating,
  inStock: p.inStock,
}));
