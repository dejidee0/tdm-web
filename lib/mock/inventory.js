// Mock data for inventory products
export const mockInventoryStats = {
  totalProducts: {
    label: "Total Products",
    value: 1245,
    change: 12,
    changeType: "increase",
  },
  lowStockAlerts: {
    label: "Low Stock Alerts",
    value: 18,
    badge: "Action Needed",
    badgeColor: "error",
  },
  inventoryValue: {
    label: "Inventory Value",
    value: 845200,
    formatted: "$845,200",
  },
};

export const mockInventoryProducts = [
  {
    id: 1,
    name: "TBM Hydraulic Pump",
    category: "Industrial Grade",
    image: null,
    imageColor: "#EF4444",
    sku: "TB-9921",
    location: "Warehouse A-22",
    stockStatus: "In Stock",
    stockStatusColor: "success",
    quantity: 142,
    reorderPoint: 50,
  },
  {
    id: 2,
    name: "Logic Controller X2",
    category: "Electronics",
    image: null,
    imageColor: "#10B981",
    sku: "LC-2044",
    location: "Warehouse B-05",
    stockStatus: "Low Stock",
    stockStatusColor: "warning",
    quantity: 4,
    reorderPoint: 20,
  },
  {
    id: 3,
    name: "Steel Packaging V2",
    category: "Logistics",
    image: null,
    imageColor: "#06B6D4",
    sku: "PK-1002",
    location: "Warehouse C-12",
    stockStatus: "In Stock",
    stockStatusColor: "success",
    quantity: 850,
    reorderPoint: 200,
  },
  {
    id: 4,
    name: "Pro Toolkit Set",
    category: "Hardware",
    image: null,
    imageColor: "#F59E0B",
    sku: "HW-3301",
    location: "Warehouse A-01",
    stockStatus: "Out of Stock",
    stockStatusColor: "error",
    quantity: 0,
    reorderPoint: 15,
  },
];

// Generate more mock products
const generateMockProducts = (count) => {
  const products = [...mockInventoryProducts];
  const names = [
    "Hydraulic Valve",
    "Digital Sensor",
    "Steel Frame",
    "Power Supply Unit",
    "Control Panel",
    "Motor Assembly",
    "Cable Set",
    "Mounting Bracket",
    "Safety Switch",
    "Junction Box",
    "Pressure Gauge",
    "Filter Cartridge",
  ];
  const categories = [
    "Industrial Grade",
    "Electronics",
    "Logistics",
    "Hardware",
  ];
  const warehouses = ["A", "B", "C", "D"];
  const statuses = [
    { label: "In Stock", color: "success" },
    { label: "Low Stock", color: "warning" },
    { label: "Out of Stock", color: "error" },
  ];
  const colors = [
    "#EF4444",
    "#10B981",
    "#06B6D4",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
  ];

  for (let i = 5; i <= count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const quantity =
      status.label === "Out of Stock"
        ? 0
        : status.label === "Low Stock"
          ? Math.floor(Math.random() * 10) + 1
          : Math.floor(Math.random() * 500) + 50;

    const reorderPoint = Math.floor(Math.random() * 50) + 10;

    products.push({
      id: i,
      name: `${name} Pro`,
      category,
      image: null,
      imageColor: color,
      sku: `${category.substring(0, 2).toUpperCase()}-${1000 + i}`,
      location: `Warehouse ${warehouse}-${String(Math.floor(Math.random() * 30) + 1).padStart(2, "0")}`,
      stockStatus: status.label,
      stockStatusColor: status.color,
      quantity,
      reorderPoint,
    });
  }

  return products;
};

export const allMockInventoryProducts = generateMockProducts(142);

// Simulated API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service for inventory
export const inventoryAPI = {
  // GET /api/inventory/stats
  getInventoryStats: async () => {
    await delay(500);
    return mockInventoryStats;
  },

  // GET /api/inventory/products
  getInventoryProducts: async ({
    page = 1,
    limit = 10,
    search = "",
    stockStatus = "all",
    location = "all",
    archived = false,
  }) => {
    await delay(600);

    let filtered = [...allMockInventoryProducts];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower),
      );
    }

    // Filter by stock status
    if (stockStatus !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.stockStatus.toLowerCase().replace(" ", "") ===
          stockStatus.toLowerCase(),
      );
    }

    // Filter by location
    if (location !== "all") {
      filtered = filtered.filter((product) =>
        product.location.toLowerCase().includes(location.toLowerCase()),
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
      stats: {
        all: allMockInventoryProducts.length,
        lowStock: allMockInventoryProducts.filter(
          (p) => p.stockStatus === "Low Stock",
        ).length,
        outOfStock: allMockInventoryProducts.filter(
          (p) => p.stockStatus === "Out of Stock",
        ).length,
        archived: 0,
      },
    };
  },

  // PUT /api/inventory/products/:id/quantity
  updateProductQuantity: async (id, newQuantity) => {
    await delay(300);
    const product = allMockInventoryProducts.find((p) => p.id === id);
    if (product) {
      product.quantity = newQuantity;
      // Update stock status based on new quantity
      if (newQuantity === 0) {
        product.stockStatus = "Out of Stock";
        product.stockStatusColor = "error";
      } else if (newQuantity < product.reorderPoint) {
        product.stockStatus = "Low Stock";
        product.stockStatusColor = "warning";
      } else {
        product.stockStatus = "In Stock";
        product.stockStatusColor = "success";
      }
    }
    return { success: true, quantity: newQuantity };
  },

  // DELETE /api/inventory/products/:id
  deleteProduct: async (id) => {
    await delay(400);
    return { success: true };
  },
};

// Commented out real API calls for future use
/*
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const inventoryAPI = {
  getInventoryStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/inventory/stats`);
    return response.data;
  },

  getInventoryProducts: async ({ page, limit, search, stockStatus, location, archived }) => {
    const response = await axios.get(`${API_BASE_URL}/inventory/products`, {
      params: { page, limit, search, stockStatus, location, archived }
    });
    return response.data;
  },

  updateProductQuantity: async (id, newQuantity) => {
    const response = await axios.put(`${API_BASE_URL}/inventory/products/${id}/quantity`, {
      quantity: newQuantity
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/inventory/products/${id}`);
    return response.data;
  },
};
*/
