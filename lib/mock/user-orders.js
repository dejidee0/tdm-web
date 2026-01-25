// lib/api/orders.js

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockOrders = [
  {
    id: "#4092-11",
    date: "Oct 26, 2023",
    items: [
      {
        name: "Oak Wood Flooring",
        image: "/products/oak-flooring.jpg",
        details: "+ 2 other items",
      },
    ],
    total: 1250.0,
    status: "processing",
  },
  {
    id: "#4090-08",
    date: "Oct 12, 2023",
    items: [
      {
        name: "Brass Kitchen Faucet",
        image: "/products/brass-faucet.jpg",
        details: "1 item",
      },
    ],
    total: 219.0,
    status: "shipped",
  },
  {
    id: "#4088-23",
    date: "Sep 28, 2023",
    items: [
      {
        name: "Geometric Wallpaper",
        image: "/products/geo-wallpaper.jpg",
        details: "3 rolls",
      },
    ],
    total: 267.0,
    status: "delivered",
  },
  {
    id: "#4085-55",
    date: "Sep 15, 2023",
    items: [
      {
        name: "Matte Grey Floor Tile",
        image: "/products/matte-grey-tile.jpg",
        details: "50 sqft box (x10)",
      },
    ],
    total: 2250.0,
    status: "delivered",
  },
  {
    id: "#4080-12",
    date: "Aug 10, 2023",
    items: [
      {
        name: "Pendant Light Fixture",
        image: "/products/pendant-light.jpg",
        details: "1 item",
      },
    ],
    total: 145.0,
    status: "cancelled",
  },
  {
    id: "#4075-33",
    date: "Jul 22, 2023",
    items: [
      {
        name: "Modern Dining Table",
        image: "/products/dining-table.jpg",
        details: "+ 4 other items",
      },
    ],
    total: 3450.0,
    status: "delivered",
  },
  {
    id: "#4070-19",
    date: "Jul 08, 2023",
    items: [
      {
        name: "Ceramic Bathroom Sink",
        image: "/products/bathroom-sink.jpg",
        details: "2 items",
      },
    ],
    total: 580.0,
    status: "delivered",
  },
];

export const ordersApi = {
  getOrders: async (filters) => {
    await delay(1000);

    let filteredOrders = [...mockOrders];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchLower) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchLower),
          ),
      );
    }

    // Apply status filter
    if (filters.status !== "all") {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === filters.status,
      );
    }

    // Apply date range filter (simplified)
    if (filters.dateRange !== "all") {
      // In production, implement actual date filtering
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        // Already sorted by date descending
        break;
      case "oldest":
        filteredOrders.reverse();
        break;
      case "highest":
        filteredOrders.sort((a, b) => b.total - a.total);
        break;
      case "lowest":
        filteredOrders.sort((a, b) => a.total - b.total);
        break;
    }

    return filteredOrders;
  },

  getOrderDetails: async (orderId) => {
    await delay(800);
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    return order;
  },
};
