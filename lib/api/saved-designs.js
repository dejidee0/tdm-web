// lib/api/saved-items.js

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockSavedItems = [
  {
    id: "item-001",
    name: "Matte Grey Ceramic Tile",
    price: 4.5,
    unit: "sqft",
    image: "/saved/matte-grey.png",
    category: "materials",
    subcategory: "Floor & Wall",
    stockStatus: "In Stock",
    stockCount: 145,
    isSale: false,
    originalPrice: null,
    tags: ["MATERIAL"],
    isFavorite: true,
  },
  {
    id: "item-002",
    name: "Modern Brass Faucet",
    price: 219.0,
    unit: "each",
    image: "/saved/modern-brass.png",
    category: "materials",
    subcategory: "Kitchen",
    stockStatus: "Low Lead",
    stockCount: 8,
    isSale: false,
    originalPrice: null,
    tags: ["FIXTURE"],
    isFavorite: true,
  },
  {
    id: "item-003",
    name: "Geo Pattern Wallpaper",
    price: 89.0,
    unit: "roll",
    image: "/saved/geo-pattern.png",
    category: "materials",
    subcategory: "Living Room",
    stockStatus: "Peel & Stick",
    stockCount: 32,
    isSale: false,
    originalPrice: null,
    tags: ["MATERIAL"],
    isFavorite: true,
  },
  {
    id: "item-004",
    name: "Minimal Pendant Light",
    price: 115.0,
    unit: null,
    image: "/saved/minimal.png",
    category: "materials",
    subcategory: "Lighting",
    stockStatus: "LED Compatible",
    stockCount: 23,
    isSale: true,
    originalPrice: 145.0,
    tags: ["SALE"],
    isFavorite: true,
  },
  {
    id: "item-005",
    name: "Oak Dining Chair",
    price: 299.0,
    unit: "each",
    image: "/saved/oak-dining.png",
    category: "furniture",
    subcategory: "Dining Room",
    stockStatus: "Set of 2",
    stockCount: 12,
    isSale: false,
    originalPrice: null,
    tags: ["FURNITURE"],
    isFavorite: true,
  },
  {
    id: "item-006",
    name: "Engineered Oak Plank",
    price: 6.99,
    unit: "sqft",
    image: "/saved/engineered.png",
    category: "materials",
    subcategory: "Flooring",
    stockStatus: "Sample Available",
    stockCount: 267,
    isSale: false,
    originalPrice: null,
    tags: ["MATERIAL"],
    isFavorite: true,
  },
  {
    id: "item-007",
    name: "Scandinavian Living Room",
    price: null,
    unit: null,
    image: "/saved/scanvian.png",
    category: "inspiration",
    subcategory: "Generated via AI Visualizer",
    stockStatus: null,
    stockCount: null,
    isSale: false,
    originalPrice: null,
    tags: ["INSPIRATION"],
    isFavorite: true,
    isInspirationBoard: true,
  },
  {
    id: "item-008",
    name: "Terracotta Warm Tile",
    price: 5.25,
    unit: "sqft",
    image: "/saved/terracotta.png",
    category: "materials",
    subcategory: "Floor & Wall",
    stockStatus: "In Stock",
    stockCount: 89,
    isSale: false,
    originalPrice: null,
    tags: ["MATERIAL"],
    isFavorite: true,
  },
  {
    id: "item-009",
    name: "Terracotta Warm Tile",
    price: 5.25,
    unit: "sqft",
    image: "/saved/geo-pattern.png",
    category: "materials",
    subcategory: "Floor & Wall",
    stockStatus: "In Stock",
    stockCount: 89,
    isSale: false,
    originalPrice: null,
    tags: ["MATERIAL"],
    isFavorite: true,
  },
  {
    id: "item-010",
    name: "Terracotta Warm Tile",
    price: 5.25,
    unit: "sqft",
    image: "/saved/oak-dining.png",
    category: "materials",
    subcategory: "Floor & Wall",
    stockStatus: "In Stock",
    stockCount: 89,
    isSale: false,
    originalPrice: null,
    tags: ["MATERIAL"],
    isFavorite: true,
  },
  {
    id: "item-011",
    name: "Terracotta Warm Tile",
    price: 5.25,
    unit: "sqft",
    image: "/saved/minimal.png",
    category: "materials",
    subcategory: "Floor & Wall",
    stockStatus: "In Stock",
    stockCount: 89,
    isSale: false,
    originalPrice: null,
    tags: ["MATERIAL"],
    isFavorite: true,
  },
];

export const savedItemsApi = {
  // Get all saved items with filters
  getSavedItems: async (filters) => {
    await delay(1000);

    let filteredItems = [...mockSavedItems];

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      filteredItems = filteredItems.filter(
        (item) => item.category === filters.category,
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.subcategory.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "date-added":
        // Keep default order (newest first)
        break;
      case "price-low":
        filteredItems.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filteredItems.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "alphabetical":
        filteredItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filteredItems;
  },

  // Remove from saved items
  removeFromSaved: async (itemId) => {
    await delay(500);
    const index = mockSavedItems.findIndex((item) => item.id === itemId);
    if (index > -1) {
      mockSavedItems.splice(index, 1);
    }
    return { success: true };
  },

  // Add to cart
  addToCart: async (itemId, quantity = 1) => {
    await delay(600);
    return {
      success: true,
      message: "Added to cart",
      itemId,
      quantity,
    };
  },

  // Add to moodboard
  addToMoodboard: async (itemId, boardId = null) => {
    await delay(600);
    return {
      success: true,
      message: "Added to moodboard",
      itemId,
      boardId,
    };
  },

  // Create board from selected items
  createBoard: async (itemIds, boardName) => {
    await delay(800);
    return {
      success: true,
      boardId: `board-${Date.now()}`,
      boardName,
      itemCount: itemIds.length,
    };
  },

  // Buy all items
  buyAll: async (itemIds) => {
    await delay(1000);
    const items = mockSavedItems.filter((item) => itemIds.includes(item.id));
    const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
    return {
      success: true,
      total,
      itemCount: items.length,
    };
  },
};
