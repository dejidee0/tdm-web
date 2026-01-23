// Mock data for orders
export const mockOrders = [
  {
    id: "ORD-7829",
    customer: {
      name: "Sarah Jenkins",
      initials: "SJ",
      avatar: null,
      bgColor: "#EEF2FF",
      textColor: "#4F46E5",
    },
    date: "Oct 24, 2023",
    type: "Renovation",
    typeIcon: "renovation",
    total: 100.8,
    status: "Processing",
    statusColor: "info",
  },
  {
    id: "ORD-7828",
    customer: {
      name: "Mike Ross",
      initials: "MR",
      avatar: null,
      bgColor: "#F3E8FF",
      textColor: "#9333EA",
    },
    date: "Oct 23, 2023",
    type: "E-commerce",
    typeIcon: "ecommerce",
    total: 125.5,
    status: "Shipped",
    statusColor: "info",
  },
  {
    id: "ORD-7827",
    customer: {
      name: "Elena Fisher",
      initials: "EF",
      avatar: null,
      bgColor: "#FEF2F2",
      textColor: "#DC2626",
    },
    date: "Oct 22, 2023",
    type: "Renovation",
    typeIcon: "renovation",
    total: 850.0,
    status: "Pending Approval",
    statusColor: "warning",
  },
  {
    id: "ORD-7826",
    customer: {
      name: "David Chen",
      initials: "DC",
      avatar: null,
      bgColor: "#D1FAE5",
      textColor: "#059669",
    },
    date: "Oct 21, 2023",
    type: "E-commerce",
    typeIcon: "ecommerce",
    total: 45.0,
    status: "Delivered",
    statusColor: "success",
  },
  {
    id: "ORD-7825",
    customer: {
      name: "Amanda Low",
      initials: "AL",
      avatar: null,
      bgColor: "#F1F5F9",
      textColor: "#64748B",
    },
    date: "Oct 20, 2023",
    type: "E-commerce",
    typeIcon: "ecommerce",
    total: 210.0,
    status: "Cancelled",
    statusColor: "neutral",
  },
];

// Generate more mock orders for pagination
const generateMockOrders = (count) => {
  const orders = [...mockOrders];
  const names = [
    "John Smith",
    "Emma Wilson",
    "James Brown",
    "Olivia Taylor",
    "William Davis",
    "Sophia Martinez",
    "Benjamin Anderson",
    "Isabella Thomas",
    "Lucas Jackson",
    "Mia White",
  ];
  const types = ["Renovation", "E-commerce"];
  const statuses = [
    { label: "Processing", color: "info" },
    { label: "Shipped", color: "info" },
    { label: "Delivered", color: "success" },
    { label: "Pending Approval", color: "warning" },
    { label: "Cancelled", color: "neutral" },
  ];

  for (let i = 6; i <= count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const colors = [
      { bg: "#EEF2FF", text: "#4F46E5" },
      { bg: "#F3E8FF", text: "#9333EA" },
      { bg: "#FEF2F2", text: "#DC2626" },
      { bg: "#D1FAE5", text: "#059669" },
      { bg: "#FEF3C7", text: "#D97706" },
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    orders.push({
      id: `ORD-${7830 + i - 6}`,
      customer: {
        name,
        initials,
        avatar: null,
        bgColor: color.bg,
        textColor: color.text,
      },
      date: `Oct ${Math.floor(Math.random() * 20) + 1}, 2023`,
      type,
      typeIcon: type.toLowerCase().replace("-", ""),
      total: Math.floor(Math.random() * 5000) + 50,
      status: status.label,
      statusColor: status.color,
    });
  }

  return orders;
};

export const allMockOrders = generateMockOrders(128);

// Simulated API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service
export const ordersAPI = {
  // GET /api/orders
  getOrders: async ({
    page = 1,
    limit = 10,
    status = "all",
    type = "all",
    dateRange = "last30days",
    search = "",
  }) => {
    await delay(600);

    let filtered = [...allMockOrders];

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === status.toLowerCase(),
      );
    }

    // Filter by type
    if (type !== "all") {
      filtered = filtered.filter(
        (order) => order.type.toLowerCase() === type.toLowerCase(),
      );
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchLower) ||
          order.customer.name.toLowerCase().includes(searchLower),
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filtered.slice(startIndex, endIndex);

    return {
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    };
  },

  // GET /api/orders/:id
  getOrderById: async (id) => {
    await delay(400);
    return allMockOrders.find((order) => order.id === id) || null;
  },
};

// Commented out real API calls for future use
/*
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const ordersAPI = {
  getOrders: async ({ page = 1, limit = 10, status = 'all', type = 'all', dateRange = 'last30days', search = '' }) => {
    const response = await axios.get(`${API_BASE_URL}/orders`, {
      params: { page, limit, status, type, dateRange, search }
    });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/orders/${id}`);
    return response.data;
  },
};
*/
