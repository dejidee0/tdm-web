// Mock data for messages
export const mockConversations = [
  {
    id: 1,
    contactName: "John Doe",
    contactRole: "Admin",
    contactAvatar: null,
    contactInitials: "JD",
    contactColor: "#10B981",
    lastMessage: "Is my order #12345 ready for pickup?",
    timestamp: "2m",
    unread: true,
    orderId: "#12345",
    status: "Active",
  },
  {
    id: 2,
    contactName: "Sarah Smith",
    contactRole: null,
    contactAvatar: null,
    contactInitials: "SS",
    contactColor: "#F59E0B",
    lastMessage: "Thanks for the update!",
    timestamp: "15m",
    unread: false,
    orderId: null,
    status: "Active",
  },
  {
    id: 3,
    contactName: "+1 (555) 012-3456",
    contactRole: null,
    contactAvatar: null,
    contactInitials: "📞",
    contactColor: "#64748B",
    lastMessage: "⚠️ Missed Call",
    timestamp: "1h",
    unread: false,
    orderId: null,
    status: "Missed Call",
  },
  {
    id: 4,
    contactName: "Michael Brown",
    contactRole: null,
    contactAvatar: null,
    contactInitials: "MB",
    contactColor: "#8B5CF6",
    lastMessage: "Ticket #9002 closed successfully",
    timestamp: "1d",
    unread: false,
    orderId: null,
    status: "Closed",
  },
];

export const mockMessages = {
  1: [
    {
      id: 1,
      sender: "customer",
      senderName: "John Doe",
      message:
        "Hi there, I placed an order yesterday for the new mechanical parts.",
      timestamp: "10:22 AM",
      avatar: null,
      initials: "JD",
      color: "#10B981",
    },
    {
      id: 2,
      sender: "vendor",
      senderName: "You",
      message: "Great, thanks. I just want to know if it is ready for pickup.",
      timestamp: "10:25 AM",
      avatar: null,
      initials: "Y",
      color: "#3B82F6",
    },
    {
      id: 3,
      sender: "customer",
      senderName: "John Doe",
      message:
        "Hello John! Thanks for reaching out. Let me check the status of that for you right now.",
      timestamp: "10:24 AM",
      avatar: null,
      initials: "JD",
      color: "#10B981",
    },
  ],
};

export const mockQuickReplies = [
  "Checking status...",
  "Ready for pickup!",
  "Delayed shipment",
  "Request callback",
];

// Simulated API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service for messages
export const messagesAPI = {
  // GET /api/messages/conversations
  getConversations: async ({ filter = "active", search = "" }) => {
    await delay(500);

    let filtered = [...mockConversations];

    // Filter by status
    if (filter === "pending") {
      filtered = filtered.filter((c) => c.status === "Pending");
    } else if (filter === "closed") {
      filtered = filtered.filter((c) => c.status === "Closed");
    } else if (filter === "active") {
      filtered = filtered.filter((c) => c.status === "Active");
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.contactName.toLowerCase().includes(searchLower) ||
          c.lastMessage.toLowerCase().includes(searchLower),
      );
    }

    return {
      conversations: filtered,
      counts: {
        active: mockConversations.filter((c) => c.status === "Active").length,
        pending: mockConversations.filter((c) => c.status === "Pending").length,
        closed: mockConversations.filter((c) => c.status === "Closed").length,
      },
    };
  },

  // GET /api/messages/:conversationId
  getMessages: async (conversationId) => {
    await delay(400);
    return mockMessages[conversationId] || [];
  },

  // POST /api/messages/:conversationId
  sendMessage: async (conversationId, message) => {
    await delay(500);
    const newMessage = {
      id: Date.now(),
      sender: "vendor",
      senderName: "You",
      message,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: null,
      initials: "Y",
      color: "#3B82F6",
    };

    if (!mockMessages[conversationId]) {
      mockMessages[conversationId] = [];
    }
    mockMessages[conversationId].push(newMessage);

    return newMessage;
  },
};

// Commented out real API calls for future use
/*
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const messagesAPI = {
  getConversations: async ({ filter, search }) => {
    const response = await axios.get(`${API_BASE_URL}/messages/conversations`, {
      params: { filter, search }
    });
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await axios.get(`${API_BASE_URL}/messages/${conversationId}`);
    return response.data;
  },

  sendMessage: async (conversationId, message) => {
    const response = await axios.post(`${API_BASE_URL}/messages/${conversationId}`, {
      message
    });
    return response.data;
  },
};
*/
