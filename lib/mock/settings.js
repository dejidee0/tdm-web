// Mock data for Platform Settings

// Payment Gateway Settings
export const mockPaymentGateways = [
  {
    id: "stripe",
    name: "Stripe Payments",
    description: "Credit Cards, Apple Pay, Google Pay",
    icon: "credit-card",
    enabled: true,
  },
  {
    id: "paypal",
    name: "PayPal Integration",
    description: "International payments & Wallets",
    icon: "wallet",
    enabled: true,
  },
  {
    id: "crypto",
    name: "Crypto Payments",
    description: "BTC, ETH, USDC",
    icon: "bitcoin",
    enabled: false,
  },
];

// Transaction Fee Settings
export const mockTransactionFees = {
  basePlatformFee: 2.5, // percentage
  fixedFeePerTransaction: 0.30, // dollars
  defaultCurrency: "USD",
};

// AI Configuration Settings
export const mockAIConfiguration = {
  models: [
    {
      id: "gpt-4",
      name: "GPT-4 Turbo",
      provider: "OpenAI",
      purpose: "Advanced text generation",
      enabled: true,
      costPerRequest: 0.03,
    },
    {
      id: "claude-3",
      name: "Claude 3 Opus",
      provider: "Anthropic",
      purpose: "Long-form content",
      enabled: true,
      costPerRequest: 0.015,
    },
    {
      id: "dall-e",
      name: "DALL-E 3",
      provider: "OpenAI",
      purpose: "Image generation",
      enabled: false,
      costPerRequest: 0.04,
    },
  ],
  maxTokensPerRequest: 4096,
  rateLimit: 100, // requests per minute
  timeout: 30, // seconds
};

// Notification Settings
export const mockNotificationSettings = {
  email: {
    transactional: true,
    marketing: false,
    systemAlerts: true,
    weeklyReports: true,
  },
  sms: {
    criticalAlerts: true,
    orderUpdates: false,
    securityAlerts: true,
  },
  push: {
    realTimeUpdates: true,
    promotions: false,
    newsAndAnnouncements: false,
  },
};

// General Settings
export const mockGeneralSettings = {
  platformName: "TBM & Bogat",
  supportEmail: "support@tbm-bogat.com",
  timezone: "America/New_York",
  dateFormat: "MM/DD/YYYY",
  maintenanceMode: false,
  apiRateLimit: 1000, // requests per hour
  sessionTimeout: 30, // minutes
};

// Currency options
export const currencyOptions = [
  { value: "USD", label: "USD - United States Dollar", symbol: "$" },
  { value: "EUR", label: "EUR - Euro", symbol: "€" },
  { value: "GBP", label: "GBP - British Pound", symbol: "£" },
  { value: "CAD", label: "CAD - Canadian Dollar", symbol: "C$" },
  { value: "AUD", label: "AUD - Australian Dollar", symbol: "A$" },
];

// Timezone options
export const timezoneOptions = [
  { value: "America/New_York", label: "EST - Eastern Standard Time" },
  { value: "America/Chicago", label: "CST - Central Standard Time" },
  { value: "America/Denver", label: "MST - Mountain Standard Time" },
  { value: "America/Los_Angeles", label: "PST - Pacific Standard Time" },
  { value: "Europe/London", label: "GMT - Greenwich Mean Time" },
];

// Mock API service
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const settingsAPI = {
  // Get payment settings (matches backend structure)
  getPaymentSettings: async () => {
    await delay(600);
    return {
      basePlatformFee: mockTransactionFees.basePlatformFee,
      fixedFeePerTransaction: mockTransactionFees.fixedFeePerTransaction,
      defaultCurrency: mockTransactionFees.defaultCurrency,
      gateways: mockPaymentGateways,
    };
  },

  // Update payment settings
  updatePaymentSettings: async (settings) => {
    await delay(800);
    console.log("Updating payment settings:", settings);
    return {
      basePlatformFee: settings.basePlatformFee,
      fixedFeePerTransaction: settings.fixedFeePerTransaction,
      defaultCurrency: settings.defaultCurrency,
      gateways: settings.gateways || mockPaymentGateways,
    };
  },

  // Toggle payment gateway
  togglePaymentGateway: async (gatewayId, enabled) => {
    await delay(500);
    const gateway = mockPaymentGateways.find((g) => g.id === gatewayId);
    if (gateway) {
      gateway.enabled = enabled;
      return { success: true, gateway };
    }
    return { success: false };
  },

  // Get AI configuration
  getAIConfiguration: async () => {
    await delay(600);
    return mockAIConfiguration;
  },

  // Update AI settings
  updateAISettings: async (settings) => {
    await delay(800);
    console.log("Updating AI settings:", settings);
    return settings;
  },

  // Toggle AI model
  toggleAIModel: async (modelId, enabled) => {
    await delay(500);
    const model = mockAIConfiguration.models.find((m) => m.id === modelId);
    if (model) {
      model.enabled = enabled;
      return { success: true, model };
    }
    return { success: false };
  },

  // Get notification settings
  getNotificationSettings: async () => {
    await delay(600);
    return mockNotificationSettings;
  },

  // Update notification settings
  updateNotificationSettings: async (settings) => {
    await delay(800);
    console.log("Updating notification settings:", settings);
    return settings;
  },

  // Get general settings
  getGeneralSettings: async () => {
    await delay(600);
    return mockGeneralSettings;
  },

  // Update general settings
  updateGeneralSettings: async (settings) => {
    await delay(800);
    console.log("Updating general settings:", settings);
    return settings;
  },

  // Update settings (general PUT /admin/settings)
  updateSettings: async (settings) => {
    await delay(1000);
    console.log("Updating general settings:", settings);
    return { success: true, message: "Settings updated successfully", data: settings };
  },

  // Save settings (legacy)
  saveSettings: async (settings) => {
    await delay(1000);
    console.log("Saving settings:", settings);
    return { success: true, message: "Settings saved successfully" };
  },
};
