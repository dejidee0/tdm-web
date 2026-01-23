// Mock data for vendor dashboard
export const mockDashboardStats = {
  newOrders: {
    label: "New Orders",
    category: "BOGAT",
    value: 124,
    change: 5,
    changeType: "increase",
    subtitle: "Vs. last week",
  },
  pendingEnquiries: {
    label: "Pending Enquiries",
    category: "TBM",
    value: 8,
    change: 2,
    changeType: "increase",
    subtitle: "Require response within 24h",
  },
  activeProjects: {
    label: "Active Projects",
    category: "TBM",
    value: 12,
    change: 0,
    changeType: "neutral",
    subtitle: "2 projects nearing completion",
  },
  pendingDeliveries: {
    label: "Pending Deliveries",
    category: "LOGISTICS",
    value: 34,
    change: 1,
    changeType: "increase",
    subtitle: "Scheduled for today",
  },
};

export const mockOperationalAlerts = [
  {
    id: 1,
    type: "stock",
    severity: "high",
    title: "Low Stock Warning",
    description:
      "Item SKU-9826 (White Paint) is below threshold. 5 units left.",
    action: "Restock Now",
    time: "10m ago",
  },
  {
    id: 2,
    type: "message",
    severity: "medium",
    title: "Unread Customer Messages",
    description: "You have 3 unread messages regarding active project #TBM-90.",
    action: "View Messages",
    time: "1h ago",
  },
];

export const mockRecentActivity = [
  {
    id: 1,
    type: "Order",
    reference: "#BOG-8821",
    status: "Shipped",
    statusColor: "success",
    customer: "Sarah Jenkins",
    date: "Today, 10:23 AM",
    icon: "order",
  },
  {
    id: 2,
    type: "Project",
    reference: "#TBM-90",
    status: "In Progress",
    statusColor: "info",
    customer: "Michael Ross",
    date: "Yesterday, 4:00 PM",
    icon: "project",
  },
  {
    id: 3,
    type: "Enquiry",
    reference: "#ENQ-445",
    status: "Pending",
    statusColor: "warning",
    customer: "Villa Renovation Ltd.",
    date: "Oct 26, 2023",
    icon: "enquiry",
  },
  {
    id: 4,
    type: "Order",
    reference: "#BOG-8820",
    status: "Delivered",
    statusColor: "success",
    customer: "James Carter",
    date: "Oct 23, 2023",
    icon: "order",
  },
];

// Simulated API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service
export const vendorDashboardAPI = {
  // GET /api/vendor/dashboard/stats
  getStats: async () => {
    await delay(800);
    return mockDashboardStats;
  },

  // GET /api/vendor/dashboard/alerts
  getAlerts: async () => {
    await delay(600);
    return mockOperationalAlerts;
  },

  // GET /api/vendor/dashboard/activity
  getRecentActivity: async (filter = "all") => {
    await delay(700);
    if (filter === "all") {
      return mockRecentActivity;
    }
    return mockRecentActivity.filter(
      (item) => item.type.toLowerCase() === filter.toLowerCase(),
    );
  },
};

// Commented out real API calls for future use
/*
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const vendorDashboardAPI = {
  getStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/vendor/dashboard/stats`);
    return response.data;
  },

  getAlerts: async () => {
    const response = await axios.get(`${API_BASE_URL}/vendor/dashboard/alerts`);
    return response.data;
  },

  getRecentActivity: async (filter = 'all') => {
    const response = await axios.get(`${API_BASE_URL}/vendor/dashboard/activity`, {
      params: { filter }
    });
    return response.data;
  },
};
*/
