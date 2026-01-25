// lib/api/dashboard.js

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Simulate network delay for realistic testing
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Dashboard API calls
export const dashboardApi = {
  // Get recent order
  getRecentOrder: async () => {
    await delay(800);
    return {
      id: "#032-11",
      title: "Oak Wood Flooring Samples",
      status: "Shipped",
      estimatedArrival: "Est. Arrival Mon",
      image: "/oak.png",
      trackingAvailable: true,
    };
  },

  // Get latest design
  getLatestDesign: async () => {
    await delay(900);
    return {
      id: "design-001",
      title: "Living Room V3",
      style: "Scandinavian Modern",
      image: "/product-2.jpg",
      generatedAt: "2h ago",
      downloadable: true,
    };
  },

  // Get consultations
  getConsultations: async () => {
    await delay(700);
    return {
      upcoming: {
        consultant: {
          name: "Sarah",
          avatar: "/avatars/sarah.png",
        },
        date: "Tomorrow, 10:00 AM",
        topic:
          "Reviewing kitchen material choices and final budget adjustments.",
      },
      canBook: true,
    };
  },

  // Get saved items
  getSavedItems: async () => {
    await delay(1000);
    return [
      {
        id: "item-1",
        name: "Matte Grey Tile",
        price: 4.5,
        unit: "sqft",
        image: "/matte.png",
        category: "Tiles",
      },
      {
        id: "item-2",
        name: "Brass Faucet",
        price: 219.0,
        unit: null,
        image: "/brass.png",
        category: "Fixtures",
      },
      {
        id: "item-3",
        name: "Geo Wallpaper",
        price: 89.0,
        unit: "roll",
        image: "/geo.png",
        category: "Wallpaper",
      },
      {
        id: "item-4",
        name: "Pendant Light",
        price: 145.0,
        unit: null,
        image: "/pendant.png",
        category: "Lighting",
      },
      {
        id: "item-5",
        name: "Oak Dining Chair",
        price: 299.0,
        unit: null,
        image: "/oak.png",
        category: "Furniture",
      },
    ];
  },

  // Track package
  trackPackage: async (orderId) => {
    await delay(500);
    return {
      success: true,
      trackingUrl: `https://tracking.example.com/${orderId}`,
    };
  },
};
