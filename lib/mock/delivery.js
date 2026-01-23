// Mock data for delivery assignments
export const mockDeliveryAssignments = [
  {
    id: 1,
    orderId: "ORD-9928",
    status: "Pending",
    statusColor: "warning",
    customer: {
      name: "Sarah Jenkins",
      address: "4231 Sunset Blvd, Los Angeles, CA",
    },
    expectedDate: "Oct 28, 2023",
    deliveryPartner: null,
    trackingNumber: "",
    isOverdue: false,
  },
  {
    id: 2,
    orderId: "ORD-9927",
    status: "Assigned",
    statusColor: "info",
    customer: {
      name: "Michael Chen",
      address: "882 Pine St, San Francisco, CA",
    },
    expectedDate: "Oct 25, 2023",
    deliveryPartner: "DHL Express",
    trackingNumber: "DHL-88392201",
    isOverdue: false,
  },
  {
    id: 3,
    orderId: "ORD-9925",
    status: "Picked Up",
    statusColor: "success",
    customer: {
      name: "Robert Fox",
      address: "2918 Washington Ave, Seattle, WA",
    },
    expectedDate: "Oct 24, 2023",
    deliveryPartner: "FedEx",
    trackingNumber: "FDX-2299102",
    isOverdue: false,
  },
  {
    id: 4,
    orderId: "ORD-9930",
    status: "Urgent",
    statusColor: "error",
    customer: {
      name: "Eleanor Peña",
      address: "1010 Easy St, New York, NY",
    },
    expectedDate: "Oct 23, 2023",
    deliveryPartner: null,
    trackingNumber: "",
    isOverdue: true,
  },
  {
    id: 5,
    orderId: "ORD-9920",
    status: "In Transit",
    statusColor: "purple",
    customer: {
      name: "Wade Warren",
      address: "3900 Deer Creek Rd, Palo Alto, CA",
    },
    expectedDate: "Oct 27, 2023",
    deliveryPartner: "UPS Ground",
    trackingNumber: "1Z90283019283",
    isOverdue: false,
  },
  {
    id: 6,
    orderId: "ORD-9918",
    status: "Pending",
    statusColor: "warning",
    customer: {
      name: "Esther Howard",
      address: "4517 Washington Ave, Manchest...",
    },
    expectedDate: "Oct 28, 2023",
    deliveryPartner: null,
    trackingNumber: "",
    isOverdue: false,
  },
];

// Generate more mock assignments
const generateMockAssignments = (count) => {
  const assignments = [...mockDeliveryAssignments];
  const names = [
    "John Smith",
    "Emma Wilson",
    "James Brown",
    "Olivia Taylor",
    "William Davis",
    "Sophia Martinez",
    "Benjamin Anderson",
    "Isabella Thomas",
  ];
  const cities = [
    "Los Angeles, CA",
    "San Francisco, CA",
    "Seattle, WA",
    "New York, NY",
    "Chicago, IL",
  ];
  const statuses = [
    { label: "Pending", color: "warning" },
    { label: "Assigned", color: "info" },
    { label: "Picked Up", color: "success" },
    { label: "In Transit", color: "purple" },
    { label: "Urgent", color: "error" },
  ];
  const carriers = [
    "DHL Express",
    "FedEx",
    "UPS Ground",
    "USPS Priority",
    null,
  ];

  for (let i = 7; i <= count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const carrier = carriers[Math.floor(Math.random() * carriers.length)];
    const hasTracking = carrier !== null && status.label !== "Pending";

    assignments.push({
      id: i,
      orderId: `ORD-${9900 + i}`,
      status: status.label,
      statusColor: status.color,
      customer: {
        name,
        address: `${Math.floor(Math.random() * 9000) + 1000} Street Name, ${city}`,
      },
      expectedDate: `Oct ${Math.floor(Math.random() * 7) + 22}, 2023`,
      deliveryPartner: carrier,
      trackingNumber: hasTracking
        ? `TRK-${Math.floor(Math.random() * 900000) + 100000}`
        : "",
      isOverdue: status.label === "Urgent",
    });
  }

  return assignments;
};

export const allMockDeliveryAssignments = generateMockAssignments(24);

// Simulated API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service for delivery
export const deliveryAPI = {
  // GET /api/delivery/assignments
  getDeliveryAssignments: async ({
    page = 1,
    limit = 10,
    search = "",
    status = "all",
    dateRange = null,
  }) => {
    await delay(600);

    let filtered = [...allMockDeliveryAssignments];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (assignment) =>
          assignment.orderId.toLowerCase().includes(searchLower) ||
          assignment.customer.name.toLowerCase().includes(searchLower),
      );
    }

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter(
        (assignment) =>
          assignment.status.toLowerCase() === status.toLowerCase(),
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAssignments = filtered.slice(startIndex, endIndex);

    return {
      assignments: paginatedAssignments,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    };
  },

  // PUT /api/delivery/assignments/:id
  updateDeliveryAssignment: async (id, updates) => {
    await delay(400);
    const assignment = allMockDeliveryAssignments.find((a) => a.id === id);
    if (assignment) {
      Object.assign(assignment, updates);
      if (updates.deliveryPartner && updates.trackingNumber) {
        assignment.status = "Assigned";
        assignment.statusColor = "info";
      }
    }
    return { success: true, assignment };
  },
};

// Commented out real API calls for future use
/*
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const deliveryAPI = {
  getDeliveryAssignments: async ({ page, limit, search, status, dateRange }) => {
    const response = await axios.get(`${API_BASE_URL}/delivery/assignments`, {
      params: { page, limit, search, status, dateRange }
    });
    return response.data;
  },

  updateDeliveryAssignment: async (id, updates) => {
    const response = await axios.put(`${API_BASE_URL}/delivery/assignments/${id}`, updates);
    return response.data;
  },
};
*/
