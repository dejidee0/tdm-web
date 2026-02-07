// Mock data for Admin Dashboard

// Platform Performance Stats
export const mockAdminStats = {
  platformUptime: {
    label: "Platform Uptime",
    category: "SYSTEM",
    value: "99.98%",
    change: 0.01,
    changeType: "increase",
    subtitle: "vs last 30 days",
  },
  activeUsers: {
    label: "Active Users",
    category: "ENGAGEMENT",
    value: "14,205",
    change: 12,
    changeType: "increase",
    subtitle: "vs last week",
  },
  avgApiLatency: {
    label: "Avg API Latency",
    category: "PERFORMANCE",
    value: "45ms",
    change: 5,
    changeType: "increase", // Decrease in latency is good (shown as improvement)
    subtitle: "improved vs yesterday",
  },
};

// Revenue Data
export const mockRevenueData = {
  totalRevenue: 4250000,
  monthlyRecurring: 355000,
  chartData: [
    { month: "Jan", revenue: 680000 },
    { month: "Feb", revenue: 720000 },
    { month: "Mar", revenue: 695000 },
    { month: "Apr", revenue: 740000 },
    { month: "May", revenue: 710000 },
    { month: "Jun", revenue: 705000 },
  ],
  timeRange: "Last 6 Months",
};

// Server Load Data
export const mockServerLoad = {
  cluster: "US-East-1 Cluster",
  capacity: 42,
  status: "healthy", // healthy, warning, critical
  cpuUsage: 38,
  memoryUsage: 45,
  diskUsage: 52,
};

// Critical Alerts
export const mockAdminAlerts = [
  {
    id: 1,
    severity: "critical",
    issue: "Database Connection Timeout",
    description: "Node US-East-1 • Connection pool exhausted",
    timestamp: "2 mins ago",
    action: "Resolve",
    actionType: "resolve",
  },
  {
    id: 2,
    severity: "high",
    issue: "Payment Gateway API Failure",
    description: "Stripe Webhook 500 Error • Retrying...",
    timestamp: "15 mins ago",
    action: "Investigate",
    actionType: "investigate",
  },
  {
    id: 3,
    severity: "medium",
    issue: "High Memory Usage",
    description: "Worker 4 exceeded 85% RAM utilization",
    timestamp: "1 hour ago",
    action: "Dismiss",
    actionType: "dismiss",
  },
];

// Quick Actions
export const mockAdminQuickActions = [
  {
    id: 1,
    label: "Reset User Password",
    icon: "KeyRound",
  },
  {
    id: 2,
    label: "Clear System Cache",
    icon: "Trash2",
  },
  {
    id: 3,
    label: "Generate Audit Log",
    icon: "FileText",
  },
];

// Mock API service with simulated delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminDashboardAPI = {
  getStats: async () => {
    await delay(800);
    return mockAdminStats;
  },

  getRevenueData: async (timeRange = "Last 6 Months") => {
    await delay(700);
    return { ...mockRevenueData, timeRange };
  },

  getServerLoad: async () => {
    await delay(600);
    return mockServerLoad;
  },

  getAlerts: async () => {
    await delay(650);
    return mockAdminAlerts;
  },

  getQuickActions: async () => {
    await delay(400);
    return mockAdminQuickActions;
  },

  // Refresh all dashboard data
  refreshDashboard: async () => {
    await delay(1000);
    return { success: true, message: "Dashboard data refreshed" };
  },

  // Export report functionality (mock)
  exportReport: async () => {
    await delay(1500);
    return {
      success: true,
      filename: `admin-report-${new Date().toISOString().split("T")[0]}.pdf`,
    };
  },
};
