// Mock data for Financial Reports

// Financial stats
export const mockFinancialStats = {
  totalRevenue: {
    label: "Total Revenue",
    value: "$1,240,500",
    change: 12.5,
    changeType: "increase",
    subtitle: "vs last month",
  },
  avgTransaction: {
    label: "Avg Transaction",
    value: "$147.12",
    change: 2.4,
    changeType: "increase",
    subtitle: "vs last month",
  },
  netProfit: {
    label: "Net Profit",
    value: "$890,200",
    change: 18,
    changeType: "increase",
    subtitle: "vs last month",
  },
  pending: {
    label: "Pending",
    value: "45",
    change: -5,
    changeType: "decrease",
    subtitle: "vs last month",
  },
};

// Monthly revenue trends (12 months)
export const mockMonthlyRevenue = [
  { month: "Jan", revenue: 165000 },
  { month: "Feb", revenue: 185000 },
  { month: "Mar", revenue: 178000 },
  { month: "Apr", revenue: 192000 },
  { month: "May", revenue: 185420 },
  { month: "Jun", revenue: 198000 },
  { month: "Jul", revenue: 205000 },
  { month: "Aug", revenue: 215000 },
  { month: "Sep", revenue: 225000 },
  { month: "Oct", revenue: 240000 },
  { month: "Nov", revenue: 235000 },
  { month: "Dec", revenue: 245000 },
];

// Revenue by service
export const mockRevenueByService = {
  total: 1200000,
  services: [
    { name: "Subscriptions", percentage: 45, value: 540000, color: "#3B82F6" },
    { name: "One-time Fees", percentage: 25, value: 300000, color: "#10B981" },
    { name: "Consulting", percentage: 20, value: 240000, color: "#F59E0B" },
    { name: "Other", percentage: 10, value: 120000, color: "#8B5CF6" },
  ],
};

// Transaction data
const transactionNames = [
  "Jane Doe",
  "Alex King",
  "Robert Fox",
  "Sarah Miller",
  "Kevin Brown",
  "Emily Davis",
  "Michael Wilson",
  "Lisa Anderson",
];

const serviceTypes = [
  "Premium Subscription",
  "Consulting Fee",
  "API Usage Overages",
  "One-time Setup",
  "Enterprise License",
  "Professional Services",
  "Custom Integration",
  "Training Session",
];

const userTypes = ["Enterprise", "Standard", "Startup", "Enterprise", "Standard"];

const avatarColors = [
  { bg: "#EEF2FF", text: "#4F46E5" },
  { bg: "#D1FAE5", text: "#059669" },
  { bg: "#FEF2F2", text: "#DC2626" },
  { bg: "#F3E8FF", text: "#9333EA" },
  { bg: "#FEF3C7", text: "#D97706" },
];

export const mockTransactions = Array.from({ length: 432 }, (_, index) => {
  const name = transactionNames[index % transactionNames.length];
  const firstName = name.split(" ")[0];
  const lastName = name.split(" ")[1];
  const initials = `${firstName[0]}${lastName[0]}`;
  const serviceType = serviceTypes[index % serviceTypes.length];
  const userType = userTypes[index % userTypes.length];

  // Generate realistic amounts
  const baseAmount = Math.random() * 5000 + 50;
  const amount = Math.round(baseAmount * 100) / 100;

  // Status distribution: 70% paid, 20% pending, 10% failed
  const rand = Math.random();
  let status, statusColor;
  if (rand < 0.7) {
    status = "Paid";
    statusColor = { bg: "bg-[#D1FAE5]", text: "text-[#059669]" };
  } else if (rand < 0.9) {
    status = "Pending";
    statusColor = { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" };
  } else {
    status = "Failed";
    statusColor = { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" };
  }

  // Generate date (last 30 days)
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    id: `TRX-${9982 - index}`,
    date: dateStr,
    time: timeStr,
    user: {
      name,
      initials,
      type: userType,
      avatar: null,
      colorScheme: avatarColors[index % avatarColors.length],
    },
    serviceType,
    amount,
    status,
    statusColor,
  };
});

// Mock API service
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const financialAPI = {
  // Get financial stats
  getStats: async () => {
    await delay(600);
    return mockFinancialStats;
  },

  // Get monthly revenue trends
  getMonthlyRevenue: async () => {
    await delay(700);
    return mockMonthlyRevenue;
  },

  // Get revenue by service
  getRevenueByService: async () => {
    await delay(650);
    return mockRevenueByService;
  },

  // Get transactions with pagination and filters
  getTransactions: async ({ page = 1, limit = 5, search = "", filter = "all" }) => {
    await delay(600);

    let filteredTransactions = [...mockTransactions];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTransactions = filteredTransactions.filter(
        (txn) =>
          txn.id.toLowerCase().includes(searchLower) ||
          txn.user.name.toLowerCase().includes(searchLower) ||
          txn.serviceType.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filter !== "all") {
      filteredTransactions = filteredTransactions.filter(
        (txn) => txn.status.toLowerCase() === filter.toLowerCase()
      );
    }

    // Calculate pagination
    const total = filteredTransactions.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTransactions = filteredTransactions.slice(start, end);

    return {
      transactions: paginatedTransactions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  },

  // Export financial report
  exportReport: async () => {
    await delay(1500);
    return {
      success: true,
      filename: `financial-report-${new Date().toISOString().split("T")[0]}.pdf`,
    };
  },
};
