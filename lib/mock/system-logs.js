// Mock data for System Logs & Monitoring

// System stats
export const mockSystemStats = {
  criticalErrors: {
    label: "Critical Errors (24H)",
    value: "12",
    change: 2,
    changeType: "increase",
    subtitle: "+2%",
  },
  activeWarnings: {
    label: "Active Warnings",
    value: "45",
    change: 0,
    changeType: "neutral",
    subtitle: "Stable",
  },
  avgResponseTime: {
    label: "Avg Response Time",
    value: "120ms",
    change: 5,
    changeType: "increase",
    subtitle: "+5%",
  },
  logsIngested: {
    label: "Logs Ingested",
    value: "1.2M",
    change: 10,
    changeType: "increase",
    subtitle: "+10%",
  },
};

// Service sources with icons
const serviceSources = [
  { name: "AI_JOB_ENGINE", icon: "cpu", displayName: "AI Job Engine" },
  { name: "PAYMENT_GW", icon: "credit-card", displayName: "Payment Gateway" },
  { name: "USER_AUTH", icon: "shield", displayName: "User Auth" },
  { name: "DB_SHARD_04", icon: "database", displayName: "DB Shard 04" },
  { name: "DATA_SYNC", icon: "refresh-cw", displayName: "Data Sync" },
  { name: "PUBLIC_API", icon: "globe", displayName: "Public API" },
  { name: "WEBHOOK_SRV", icon: "zap", displayName: "Webhook Service" },
  { name: "CACHE_LAYER", icon: "layers", displayName: "Cache Layer" },
];

// Users/Actors
const actors = [
  { name: "System", initials: "S", type: "system", colorScheme: { bg: "#F1F5F9", text: "#64748B" } },
  { name: "j.doe@tbm.co", initials: "JD", type: "user", colorScheme: { bg: "#DBEAFE", text: "#1E40AF" } },
  { name: "Unknown", initials: "U", type: "unknown", colorScheme: { bg: "#FEE2E2", text: "#991B1B" } },
  { name: "auto_bot", initials: "AB", type: "bot", colorScheme: { bg: "#F3E8FF", text: "#9333EA" } },
  { name: "m.k@client.com", initials: "MK", type: "user", colorScheme: { bg: "#D1FAE5", text: "#059669" } },
];

// Generate system logs
const logMessages = [
  {
    severity: "CRITICAL",
    service: "AI_JOB_ENGINE",
    template: "Model inference timeout on Batch #{{batch}} - Latency > {{latency}}ms",
    batch: () => Math.floor(Math.random() * 10000),
    latency: () => 5000 + Math.floor(Math.random() * 5000),
  },
  {
    severity: "INFO",
    service: "PAYMENT_GW",
    template: "Transaction TX-{{txId}} processed successfully. Amount: ${{amount}}",
    txId: () => 9921 + Math.floor(Math.random() * 100),
    amount: () => (Math.random() * 1000).toFixed(2),
  },
  {
    severity: "WARNING",
    service: "USER_AUTH",
    template: "Multiple failed login attempts detected for IP {{ip}}",
    ip: () => `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  },
  {
    severity: "ERROR",
    service: "DB_SHARD_04",
    template: "Connection pool exhaustion. Retrying in {{retry}}ms...",
    retry: () => 500 + Math.floor(Math.random() * 1000),
  },
  {
    severity: "INFO",
    service: "DATA_SYNC",
    template: "Hourly backup completed. Size: {{size}}GB",
    size: () => (Math.random() * 10).toFixed(1),
  },
  {
    severity: "INFO",
    service: "PUBLIC_API",
    template: "User request: GET /api/v1/profiles/{{profileId}}",
    profileId: () => 200 + Math.floor(Math.random() * 50),
  },
];

export const mockSystemLogs = Array.from({ length: 1245 }, (_, index) => {
  const logTemplate = logMessages[index % logMessages.length];
  const service = serviceSources.find((s) => s.name === logTemplate.service);
  const actor = actors[index % actors.length];

  // Generate message with dynamic values
  let message = logTemplate.template;
  Object.keys(logTemplate).forEach((key) => {
    if (key !== "severity" && key !== "service" && key !== "template") {
      const value = logTemplate[key]();
      message = message.replace(`{{${key}}}`, value);
    }
  });

  // Generate timestamp (last 24 hours)
  const minutesAgo = Math.floor(Math.random() * 1440);
  const timestamp = new Date();
  timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);
  const timestampStr = timestamp.toISOString().replace("T", " ").substring(0, 19);

  return {
    id: `LOG-${10000 - index}`,
    timestamp: timestampStr,
    severity: logTemplate.severity,
    service: {
      name: service.name,
      icon: service.icon,
      displayName: service.displayName,
    },
    message,
    actor: {
      name: actor.name,
      initials: actor.initials,
      type: actor.type,
      colorScheme: actor.colorScheme,
    },
  };
});

// Severity colors
export const severityColors = {
  CRITICAL: { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]", badge: "bg-[#EF4444] text-white" },
  ERROR: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", badge: "bg-[#F59E0B] text-white" },
  WARNING: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", badge: "bg-[#F59E0B] text-white" },
  INFO: { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]", badge: "bg-[#3B82F6] text-white" },
};

// Mock API service
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const systemLogsAPI = {
  // Get system stats
  getStats: async () => {
    await delay(600);
    return mockSystemStats;
  },

  // Get logs with pagination and filters
  getLogs: async ({ page = 1, limit = 6, search = "", severity = "all", dateRange = null }) => {
    await delay(700);

    let filteredLogs = [...mockSystemLogs];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLogs = filteredLogs.filter(
        (log) =>
          log.id.toLowerCase().includes(searchLower) ||
          log.message.toLowerCase().includes(searchLower) ||
          log.service.name.toLowerCase().includes(searchLower) ||
          log.actor.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply severity filter
    if (severity !== "all") {
      filteredLogs = filteredLogs.filter(
        (log) => log.severity.toLowerCase() === severity.toLowerCase()
      );
    }

    // Calculate pagination
    const total = filteredLogs.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedLogs = filteredLogs.slice(start, end);

    return {
      logs: paginatedLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  },

  // Export logs
  exportLogs: async () => {
    await delay(1500);
    return {
      success: true,
      filename: `system-logs-${new Date().toISOString().split("T")[0]}.csv`,
    };
  },
};
