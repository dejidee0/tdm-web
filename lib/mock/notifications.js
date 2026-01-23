// Mock data for notifications
export const mockNotifications = [
  // TODAY
  {
    id: 1,
    type: "order_update",
    category: "Orders (Bogat)",
    badge: "ORDER UPDATE",
    badgeColor: "cyan",
    icon: "🚚",
    iconBg: "#ECFEFF",
    iconColor: "#06B6D4",
    title: "Order #4092 Status Change - Shipped",
    message:
      "The shipment for order #4092 has been dispatched from the warehouse. Tracking ID: TRK-99283812.",
    timestamp: "2 mins ago",
    time: new Date(Date.now() - 2 * 60 * 1000),
    isRead: false,
    actions: ["View Order Details", "Track Shipment"],
    borderColor: "#06B6D4",
    section: "TODAY",
  },
  {
    id: 2,
    type: "system_alert",
    category: "System Alerts",
    badge: "SYSTEM ALERT",
    badgeColor: "amber",
    icon: "⚠️",
    iconBg: "#FEF3C7",
    iconColor: "#F59E0B",
    title: "Scheduled Maintenance Warning",
    message:
      "The Vendor Portal will undergo scheduled maintenance on Saturday, Oct 28th from 02:00 AM to 04:00 AM UTC. Please save your work.",
    timestamp: "1 hours ago",
    time: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isRead: false,
    actions: [],
    borderColor: "#F59E0B",
    section: "TODAY",
  },
  {
    id: 3,
    type: "enquiry",
    category: "Enquiries (TBM)",
    badge: "ENQUIRY (TBM)",
    badgeColor: "blue",
    icon: "📋",
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    title: "New message regarding Project Alpha specs",
    message:
      'John Doe (Procurement): "Can you clarify the material composition for item #332 in the latest batch?"',
    timestamp: "3 hours ago",
    time: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isRead: false,
    actions: ["Reply to Enquiry"],
    borderColor: "#3B82F6",
    section: "TODAY",
  },

  // YESTERDAY
  {
    id: 4,
    type: "payment",
    category: "Payments",
    badge: "PAYMENT RECEIVED",
    badgeColor: "green",
    icon: "💳",
    iconBg: "#D1FAE5",
    iconColor: "#10B981",
    title: "Invoice #INV-2023 Payment Confirmed",
    message:
      "Payment of $4,500.00 has been successfully processed and credited to your account.",
    timestamp: "Yesterday, 4:30 PM",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: true,
    actions: ["Download Receipt"],
    borderColor: "transparent",
    bgColor: "#475569",
    section: "YESTERDAY",
  },
  {
    id: 5,
    type: "order_update",
    category: "Orders (Bogat)",
    badge: "ORDER UPDATE",
    badgeColor: "cyan",
    icon: "📦",
    iconBg: "#ECFEFF",
    iconColor: "#06B6D4",
    title: "Order #4088 Delivered",
    message:
      "Customer has confirmed receipt of Order #4088. No issues reported.",
    timestamp: "Yesterday, 10:16 AM",
    time: new Date(Date.now() - 30 * 60 * 60 * 1000),
    isRead: true,
    actions: [],
    borderColor: "transparent",
    bgColor: "#475569",
    section: "YESTERDAY",
  },
];

// Simulated API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service for notifications
export const notificationsAPI = {
  // GET /api/notifications
  getNotifications: async ({ category = "all", search = "" }) => {
    await delay(600);

    let filtered = [...mockNotifications];

    // Filter by category
    if (category !== "all") {
      const categoryMap = {
        orders: "Orders (Bogat)",
        enquiries: "Enquiries (TBM)",
        payments: "Payments",
        system: "System Alerts",
      };
      filtered = filtered.filter(
        (notif) => notif.category === categoryMap[category],
      );
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (notif) =>
          notif.title.toLowerCase().includes(searchLower) ||
          notif.message.toLowerCase().includes(searchLower),
      );
    }

    // Group by section
    const grouped = {
      TODAY: filtered.filter((n) => n.section === "TODAY"),
      YESTERDAY: filtered.filter((n) => n.section === "YESTERDAY"),
    };

    return {
      notifications: grouped,
      unreadCount: filtered.filter((n) => !n.isRead).length,
      total: filtered.length,
    };
  },

  // PUT /api/notifications/mark-all-read
  markAllAsRead: async () => {
    await delay(300);
    mockNotifications.forEach((notif) => (notif.isRead = true));
    return { success: true };
  },

  // PUT /api/notifications/:id/read
  markAsRead: async (id) => {
    await delay(200);
    const notif = mockNotifications.find((n) => n.id === id);
    if (notif) notif.isRead = true;
    return { success: true };
  },
};

// Commented out real API calls for future use
/*
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const notificationsAPI = {
  getNotifications: async ({ category, search }) => {
    const response = await axios.get(`${API_BASE_URL}/notifications`, {
      params: { category, search }
    });
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axios.put(`${API_BASE_URL}/notifications/mark-all-read`);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await axios.put(`${API_BASE_URL}/notifications/${id}/read`);
    return response.data;
  },
};
*/
