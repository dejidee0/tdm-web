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
  "ORD-7828": {
    id: "ORD-7828",
    orderNumber: "ORD-2023-8491",
    status: "Shipped",
    placedAt: "Oct 23, 2023 at 2:30 PM",
    items: [
      {
        id: 1,
        name: "Hardwood Flooring - Oak",
        sku: "SKU: HF-24B-OAK",
        image: "/products/hardwood-flooring.jpg",
        price: 95.0,
        quantity: 1,
        total: 95.0,
      },
      {
        id: 2,
        name: "Floor Polish Premium",
        sku: "SKU: FP-310-PRO",
        image: "/products/floor-polish.jpg",
        price: 18.5,
        quantity: 1,
        total: 18.5,
      },
    ],
    subtotal: 113.5,
    shipping: 12.0,
    shippingType: "Express",
    tax: 10.04,
    taxRate: 10,
    total: 125.5,
    customer: {
      name: "Mike Ross",
      avatar: null,
      email: "mike.ross@example.com",
      phone: "+1 (555) 234-5678",
      memberType: "Standard Member",
    },
    delivery: {
      address: "456 Oak Street",
      suite: "Apartment 2A",
      city: "Chicago, IL 60601",
      carrier: "UPS Express",
      carrierStatus: "Assigned",
      trackingNumber: "1Z999AA10123456784",
      mapUrl: "https://maps.google.com/?q=456+Oak+Street+Chicago+IL",
    },
    activity: [
      {
        id: 1,
        status: "Order Confirmed",
        timestamp: "Oct 23, 2023 - 2:30 PM",
        description: "Payment verified successfully",
        completed: true,
      },
      {
        id: 2,
        status: "Processing Started",
        timestamp: "Oct 23, 2023 - 3:15 PM",
        description: "Vendor accepted the order",
        completed: true,
      },
      {
        id: 3,
        status: "Shipped",
        timestamp: "Oct 24, 2023 - 9:00 AM",
        description: "Package shipped via UPS Express",
        completed: true,
      },
      {
        id: 4,
        status: "Out for Delivery",
        timestamp: "Pending",
        description: "",
        completed: false,
      },
    ],
    payment: {
      status: "Paid",
      method: "Mastercard ending in 5678",
      expiry: "Exp 08/26",
      transactionId: "TX_983482193",
      paymentDate: "Oct 23, 2023",
    },
    notes: "",
  },
  "ORD-7827": {
    id: "ORD-7827",
    orderNumber: "ORD-2023-8490",
    status: "Pending Approval",
    placedAt: "Oct 22, 2023 at 11:20 AM",
    items: [
      {
        id: 1,
        name: "Kitchen Cabinet Set - Premium",
        sku: "SKU: KC-55A-PREM",
        image: "/products/kitchen-cabinet.jpg",
        price: 750.0,
        quantity: 1,
        total: 750.0,
      },
      {
        id: 2,
        name: "Cabinet Hardware Kit",
        sku: "SKU: CH-120-KIT",
        image: "/products/cabinet-hardware.jpg",
        price: 85.0,
        quantity: 1,
        total: 85.0,
      },
    ],
    subtotal: 835.0,
    shipping: 25.0,
    shippingType: "Freight",
    tax: 86.0,
    taxRate: 10,
    total: 850.0,
    customer: {
      name: "Elena Fisher",
      avatar: null,
      email: "elena.fisher@example.com",
      phone: "+1 (555) 876-5432",
      memberType: "Premium Member",
    },
    delivery: {
      address: "789 Pine Boulevard",
      suite: "Suite 10",
      city: "Denver, CO 80202",
      carrier: "Freight Carrier",
      carrierStatus: "Pending",
      trackingNumber: "Pending",
      mapUrl: "https://maps.google.com/?q=789+Pine+Boulevard+Denver+CO",
    },
    activity: [
      {
        id: 1,
        status: "Order Confirmed",
        timestamp: "Oct 22, 2023 - 11:20 AM",
        description: "Payment verified successfully",
        completed: true,
      },
      {
        id: 2,
        status: "Pending Approval",
        timestamp: "Oct 22, 2023 - 11:45 AM",
        description: "Awaiting vendor approval for large order",
        completed: false,
      },
      {
        id: 3,
        status: "Processing",
        timestamp: "Pending",
        description: "",
        completed: false,
      },
    ],
    payment: {
      status: "Paid",
      method: "Visa ending in 8765",
      expiry: "Exp 03/27",
      transactionId: "TX_983482194",
      paymentDate: "Oct 22, 2023",
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
