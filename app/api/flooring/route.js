import { NextResponse } from "next/server";

const products = [
  {
    id: 1,
    name: "Natural Oak Plank",
    category: "Flooring",
    materialType: "SOLID HARDWOOD",
    price: 7.99,
    unit: "sq ft",
    rating: 4.8,
    reviews: 1420,
    description:
      "Premium grade solid oak with a natural matte finish, perfect for high traffic areas",
    image: "/product-1.jpg",
    badges: ["Best Seller", "Eco-Friendly"],
    stock: {
      available: true,
      quantity: "In Stock & Ready to Ship",
      estimatedDelivery: "2-5 business days",
    },
  },
  {
    id: 2,
    name: "Rich Walnut Finish",
    category: "Flooring",
    materialType: "ENGINEERED WOOD",
    price: 6.49,
    unit: "sq ft",
    rating: 4.5,
    reviews: 856,
    description:
      "Deep, rich walnut tones with enhanced durability. Easy click-lock installation.",
    image: "/product-1.jpg",
    badges: ["New Arrival"],
    stock: {
      available: true,
      quantity: "Low Stock (Only 400 sq ft left)",
      estimatedDelivery: "3-7 business days",
    },
  },
  {
    id: 3,
    name: "Light Maple Wide",
    category: "Flooring",
    materialType: "SOLID MAPLE",
    price: 8.25,
    unit: "sq ft",
    rating: 5.0,
    reviews: 1248,
    description:
      "Brighten up any room with these wide plank solid maple boards. Smooth finish.",
    image: "/product-1.jpg",
    badges: [],
    stock: {
      available: true,
      quantity: "In Stock & Ready to Ship",
      estimatedDelivery: "2-5 business days",
    },
  },
  {
    id: 4,
    name: "Classic Herringbone",
    category: "Flooring",
    materialType: "ENGINEERED OAK",
    price: 10.5,
    unit: "sq ft",
    rating: 4.9,
    reviews: 2043,
    description:
      "Timeless herringbone pattern with a modern matte finish. Adds elegance to any space.",
    image: "/product-1.jpg",
    badges: ["Designer Pick"],
    stock: {
      available: true,
      quantity: "In Stock & Ready to Ship",
      estimatedDelivery: "2-5 business days",
    },
  },
  {
    id: 5,
    name: "Rustic Barn Wood",
    category: "Flooring",
    materialType: "RECLAIMED PINE",
    price: 12.0,
    unit: "sq ft",
    rating: 4.7,
    reviews: 1567,
    description:
      "Authentic reclaimed pine from 100-year-old barns. Unique character marks in every plank.",
    image: "/product-1.jpg",
    badges: ["Eco-Friendly"],
    stock: {
      available: true,
      quantity: "In Stock & Ready to Ship",
      estimatedDelivery: "5-10 business days",
    },
  },
  {
    id: 6,
    name: "Coastal Gray Wash",
    category: "Flooring",
    materialType: "LAMINATE",
    price: 4.5,
    unit: "sq ft",
    rating: 4.2,
    reviews: 1398,
    description:
      "Modern gray wash look and ultra-fade laminate. Water-resistant and easy to install.",
    image: "/product-1.jpg",
    badges: [],
    stock: {
      available: true,
      quantity: "In Stock & Ready to Ship",
      estimatedDelivery: "2-5 business days",
      bundleOffer:
        "Bundle & Save: Pair with matching skirting boards for 10% off",
    },
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const materialType = searchParams.get("materialType");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") || "popular";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  let filteredProducts = [...products];

  // Apply filters
  if (category) {
    const categories = category.split(",");
    filteredProducts = filteredProducts.filter((p) =>
      categories.includes(p.category)
    );
  }

  if (materialType) {
    const materialTypes = materialType.split(",");
    filteredProducts = filteredProducts.filter((p) =>
      materialTypes.includes(p.materialType)
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= parseFloat(minPrice)
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= parseFloat(maxPrice)
    );
  }

  // Apply sorting
  switch (sort) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case "popular":
    default:
      filteredProducts.sort((a, b) => b.reviews - a.reviews);
      break;
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    products: paginatedProducts,
    pagination: {
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit),
    },
    filters: {
      categories: ["Flooring", "Tiles", "Paint"],
      materialTypes: [
        "SOLID HARDWOOD",
        "ENGINEERED WOOD",
        "SOLID MAPLE",
        "ENGINEERED OAK",
        "RECLAIMED PINE",
        "LAMINATE",
      ],
    },
  });
}
