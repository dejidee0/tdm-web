// lib/data/products.js
// SINGLE SOURCE OF TRUTH FOR ALL PRODUCTS

export const PRODUCTS = [
  {
    id: "1",
    name: "Carrara White Marble Tile - 12x24",
    category: "Carrara Marble",
    categoryId: "marble-tiles",
    materialType: "Natural Marble",
    size: "12x24 inches",
    pricePerSqFt: 8.5,
    boxSize: 10, // sq ft per box
    boxSizeImperial: "900 BF / box",
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
    stockQuantity: 500,
    ratingDistribution: {
      5: 78,
      4: 15,
      3: 5,
      2: 2,
      1: 0,
    },
    images: ["/mock/1.svg", "/mock/2.svg", "/mock/3.svg", "/mock/4.svg"],
    description:
      "Elevate your space with the timeless elegance of Carrara White Marble. Sourced directly from Italy, each 12x24 tile features a pristine white background with subtle grey veining. Perfect for bathroom floors, kitchen backsplashes, or statement walls.",
    finish: "Polished",
    thickness: "10mm",
    edgeType: "Rectified",
    application: "Floor & Wall",
    origin: "Italy",
    sku: "IM-CAW-1012",
    badges: ["Best Seller", "Eco-Friendly"],
    features: [
      "Genuine Italian Carrara Marble",
      "Polished finish for a high-gloss reflection",
      "Rectified edges for minimal grout lines",
      "Suitable for residential and commercial traffic",
    ],
  },
  {
    id: "2",
    name: "Calacatta Gold 12x24",
    category: "Calacatta Marble",
    categoryId: "marble-tiles",
    materialType: "Italian Marble",
    size: "12x24 inches",
    pricePerSqFt: 12.5,
    boxSize: 10,
    boxSizeImperial: "900 BF / box",
    rating: 4.9,
    reviewCount: 38,
    inStock: true,
    stockQuantity: 320,
    ratingDistribution: {
      5: 85,
      4: 10,
      3: 3,
      2: 1,
      1: 1,
    },
    images: ["/mock/1.svg", "/mock/2.svg", "/mock/3.svg", "/mock/4.svg"],
    description:
      "Luxurious Calacatta Gold marble with distinctive gold veining throughout pristine white marble. Premium Italian marble perfect for high-end residential and commercial projects.",
    finish: "Polished",
    thickness: "10mm",
    edgeType: "Rectified",
    application: "Floor & Wall",
    origin: "Italy",
    sku: "IM-CG-1012",
    badges: ["Designer Pick", "New Arrival"],
    features: [
      "Premium Italian Calacatta marble",
      "Distinctive gold veining",
      "Polished high-gloss finish",
      "Perfect for luxury installations",
    ],
  },
  {
    id: "3",
    name: "Statuary White 12x24",
    category: "Porcelain Tiles",
    categoryId: "porcelain-tiles",
    materialType: "Premium Porcelain",
    size: "12x24 inches",
    pricePerSqFt: 6.99,
    boxSize: 10,
    boxSizeImperial: "900 BF / box",
    rating: 4.7,
    reviewCount: 56,
    inStock: true,
    stockQuantity: 850,
    ratingDistribution: {
      5: 70,
      4: 20,
      3: 7,
      2: 2,
      1: 1,
    },
    images: ["/mock/2.svg", "/mock/1.svg", "/mock/3.svg", "/mock/4.svg"],
    description:
      "Premium porcelain tile with the look of natural Statuary marble. Durable and low-maintenance alternative to natural stone with excellent water resistance.",
    finish: "Polished",
    thickness: "10mm",
    edgeType: "Rectified",
    application: "Floor & Wall",
    origin: "Spain",
    sku: "PT-SW-1012",
    badges: ["Best Seller"],
    features: [
      "Porcelain tile with marble look",
      "Extremely durable",
      "Water resistant",
      "Low maintenance",
    ],
  },
  {
    id: "4",
    name: "Emperador Dark 12x24",
    category: "Emperador Marble",
    categoryId: "marble-tiles",
    materialType: "Spanish Marble",
    size: "12x24 inches",
    pricePerSqFt: 9.25,
    boxSize: 10,
    boxSizeImperial: "900 BF / box",
    rating: 4.6,
    reviewCount: 29,
    inStock: true,
    stockQuantity: 420,
    ratingDistribution: {
      5: 65,
      4: 25,
      3: 7,
      2: 2,
      1: 1,
    },
    images: ["/mock/3.svg", "/mock/2.svg", "/mock/1.svg", "/mock/4.svg"],
    description:
      "Rich dark brown Spanish marble with dramatic white veining. Creates a bold, sophisticated look perfect for accent walls and luxury bathrooms.",
    finish: "Polished",
    thickness: "10mm",
    edgeType: "Rectified",
    application: "Floor & Wall",
    origin: "Spain",
    sku: "SM-ED-1012",
    badges: ["Designer Pick"],
    features: [
      "Rich Spanish Emperador marble",
      "Dramatic dark brown tones",
      "Bold white veining",
      "Premium quality",
    ],
  },
  {
    id: "5",
    name: "Travertine Beige 12x24",
    category: "Travertine",
    categoryId: "natural-stone",
    materialType: "Natural Stone",
    size: "12x24 inches",
    pricePerSqFt: 5.5,
    boxSize: 10,
    boxSizeImperial: "900 BF / box",
    rating: 4.5,
    reviewCount: 47,
    inStock: true,
    stockQuantity: 670,
    ratingDistribution: {
      5: 60,
      4: 25,
      3: 10,
      2: 3,
      1: 2,
    },
    images: ["/mock/1.svg", "/mock/3.svg", "/mock/2.svg", "/mock/4.svg"],
    description:
      "Classic beige travertine with natural pitting and texture. Timeless natural stone perfect for Mediterranean and rustic style homes.",
    finish: "Honed",
    thickness: "12mm",
    edgeType: "Chiseled",
    application: "Floor & Wall",
    origin: "Turkey",
    sku: "NS-TB-1012",
    badges: ["Eco-Friendly"],
    features: [
      "Natural travertine stone",
      "Warm beige tones",
      "Classic textured finish",
      "Ideal for rustic designs",
    ],
  },
  {
    id: "6",
    name: "Nero Marquina 12x24",
    category: "Nero Marquina",
    categoryId: "marble-tiles",
    materialType: "Spanish Marble",
    size: "12x24 inches",
    pricePerSqFt: 11.75,
    boxSize: 10,
    boxSizeImperial: "900 BF / box",
    rating: 4.8,
    reviewCount: 33,
    inStock: false,
    stockQuantity: 0,
    ratingDistribution: {
      5: 75,
      4: 20,
      3: 3,
      2: 1,
      1: 1,
    },
    images: ["/mock/2.svg", "/mock/4.svg", "/mock/1.svg", "/mock/3.svg"],
    description:
      "Striking black Spanish marble with distinctive white veining. Makes a dramatic statement in modern and contemporary interiors.",
    finish: "Polished",
    thickness: "10mm",
    edgeType: "Rectified",
    application: "Floor & Wall",
    origin: "Spain",
    sku: "SM-NM-1012",
    badges: ["Designer Pick", "New Arrival"],
    features: [
      "Premium black marble",
      "Dramatic white veining",
      "High-gloss polish",
      "Modern luxury aesthetic",
    ],
  },
];

// Helper functions to work with products
export const getProductById = (id) => {
  return PRODUCTS.find((p) => p.id === id);
};

export const getProductsByCategory = (categoryId) => {
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
};

export const getSimilarProducts = (categoryId, excludeId, limit = 8) => {
  return PRODUCTS.filter(
    (p) => p.categoryId === categoryId && p.id !== excludeId,
  ).slice(0, limit);
};

export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery),
  );
};

export const filterProducts = (filters) => {
  let filtered = [...PRODUCTS];

  if (filters.categories?.length > 0) {
    filtered = filtered.filter((p) =>
      filters.categories.some((cat) => p.category.includes(cat)),
    );
  }

  if (filters.materialTypes?.length > 0) {
    filtered = filtered.filter((p) =>
      filters.materialTypes.includes(p.materialType),
    );
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.pricePerSqFt >= filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.pricePerSqFt <= filters.maxPrice);
  }

  if (filters.inStockOnly) {
    filtered = filtered.filter((p) => p.inStock);
  }

  return filtered;
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => a.pricePerSqFt - b.pricePerSqFt);
    case "price-high":
      return sorted.sort((a, b) => b.pricePerSqFt - a.pricePerSqFt);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "popular":
    default:
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  }
};
