// Mock data for order details
export const mockOrderDetails = {
  "ORD-7829": {
    id: "ORD-7829",
    orderNumber: "ORD-2023-8492",
    status: "Processing",
    placedAt: "Oct 24, 2023 at 10:45 AM",
    items: [
      {
        id: 1,
        name: "Ceramic Tile - Matte",
        sku: "SKU: TL-18A-MAT",
        image: "/products/ceramic-tile.jpg",
        price: 65.0,
        quantity: 1,
        total: 65.0,
      },
      {
        id: 2,
        name: "Grout Sealer Premium",
        sku: "SKU: GS-206-PR2",
        image: "/products/grout-sealer.jpg",
        price: 12.5,
        quantity: 2,
        total: 25.0,
      },
      {
        id: 3,
        name: "Tiling Spacers (500px)",
        sku: "SKU: TS-05-SPR",
        image: "/products/tiling-spacers.jpg",
        price: 8.0,
        quantity: 1,
        total: 8.0,
      },
    ],
    subtotal: 98.0,
    shipping: 15.0,
    shippingType: "Standard",
    tax: 7.8,
    taxRate: 10,
    total: 100.8,
    customer: {
      name: "Sarah Jenkins",
      avatar: null,
      email: "sarah.j@example.com",
      phone: "+1 (555) 019-2836",
      memberType: "Premium Member",
    },
    delivery: {
      address: "123 Maple Avenue",
      suite: "Suite 4B (Buzcode 1234)",
      city: "Springfield, IL 62704",
      carrier: "FedEx Ground",
      carrierStatus: "Assigned",
      trackingNumber: "Pending",
      mapUrl: "https://maps.google.com/?q=123+Maple+Avenue+Springfield+IL",
    },
    activity: [
      {
        id: 1,
        status: "Order Confirmed",
        timestamp: "Oct 24, 2023 - 10:45 AM",
        description: "Payment verified successfully",
        completed: true,
      },
      {
        id: 2,
        status: "Processing Started",
        timestamp: "Oct 24, 2023 - 11:30 AM",
        description: "Vendor accepted the order",
        completed: true,
      },
      {
        id: 3,
        status: "Ready for Pickup",
        timestamp: "Pending",
        description: "",
        completed: false,
      },
    ],
    payment: {
      status: "Paid",
      method: "Visa ending in 4242",
      expiry: "Exp 12/25",
      transactionId: "TX_983482192",
      paymentDate: "Oct 24, 2023",
    },
    notes: "",
  },
};

// Simulated API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service for order details
export const orderDetailsAPI = {
  // GET /api/orders/:id
  getOrderDetails: async (id) => {
    await delay(600);
    return mockOrderDetails[id] || null;
  },

  // PUT /api/orders/:id/status
  updateOrderStatus: async (id, status) => {
    await delay(400);
    return { success: true, status };
  },

  // POST /api/orders/:id/notes
  saveOrderNotes: async (id, notes) => {
    await delay(300);
    return { success: true, notes };
  },

  // POST /api/orders/:id/assign-delivery
  assignDelivery: async (id, carrier, trackingNumber) => {
    await delay(500);
    return { success: true, carrier, trackingNumber };
  },
};

// Commented out real API calls for future use
/*
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const orderDetailsAPI = {
  getOrderDetails: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await axios.put(`${API_BASE_URL}/orders/${id}/status`, { status });
    return response.data;
  },

  saveOrderNotes: async (id, notes) => {
    const response = await axios.post(`${API_BASE_URL}/orders/${id}/notes`, { notes });
    return response.data;
  },

  assignDelivery: async (id, carrier, trackingNumber) => {
    const response = await axios.post(`${API_BASE_URL}/orders/${id}/assign-delivery`, {
      carrier,
      trackingNumber,
    });
    return response.data;
  },
};
*/
