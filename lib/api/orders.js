// lib/api/orders.js

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockOrderDetails = {
  id: "9821",
  orderNumber: "#9821",
  placedDate: "October 20, 2023",
  total: 1370.0,
  status: "on-the-way",
  estimatedDelivery: {
    date: "Friday, Oct 24th",
    timeWindow: "2:00 PM - 6:00 PM",
  },
  tracking: {
    carrier: "FedEx",
    trackingNumber: "7823910238",
  },
  shipping: {
    recipient: "Alex Johnson",
    address: {
      line1: "64, Awolowo Way, Ikeja",
      city: "Lagos",
      country: "Nigeria",
    },
  },
  timeline: [
    {
      id: "processing",
      label: "Processing",
      date: "Oct 20",
      status: "completed",
      icon: "check",
    },
    {
      id: "packaging",
      label: "Packaging",
      date: "Oct 21",
      status: "completed",
      icon: "check",
    },
    {
      id: "on-the-way",
      label: "On the way",
      date: "Today",
      status: "active",
      icon: "truck",
    },
    {
      id: "delivered",
      label: "Delivered",
      date: "Pending",
      status: "pending",
      icon: "home",
    },
  ],
  items: [
    {
      id: "item-001",
      name: "Italian Carrara Marble Tile (12x12)",
      description: "Material: Natural Stone • Finish: Honed",
      quantity: 5,
      quantityUnit: "boxes",
      price: 850.0,
      image: "/products/marble-tile.jpg",
    },
    {
      id: "item-002",
      name: "Modern Matte Black Kitchen Faucet",
      description: "Series: Minimalist • Type: Pull-down",
      quantity: 1,
      quantityUnit: null,
      price: 320.0,
      image: "/products/black-faucet.jpg",
    },
    {
      id: "item-003",
      name: "Brushed Gold Cabinet Handles (10pk)",
      description: "Size: 5 inch • Material: Brass",
      quantity: 2,
      quantityUnit: "packs",
      price: 200.0,
      image: "/products/cabinet-handles.jpg",
    },
  ],
};

export const ordersApi = {
  // Get order details
  getOrderDetails: async (orderId) => {
    await delay(1000);
    return mockOrderDetails;
  },

  // Download invoice
  downloadInvoice: async (orderId) => {
    await delay(500);
    return {
      success: true,
      url: `/invoices/order-${orderId}.pdf`,
    };
  },

  // Copy tracking number
  copyTrackingNumber: async (trackingNumber) => {
    await navigator.clipboard.writeText(trackingNumber);
    return { success: true };
  },
};
