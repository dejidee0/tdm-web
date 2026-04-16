"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import {
  usePaymentSettings,
  useAIConfiguration,
  useNotificationSettings,
  useGeneralSettings,
  useSaveSettings,
  useTogglePaymentGateway,
  useToggleAIModel,
} from "@/hooks/use-settings";
import { timezoneOptions } from "@/lib/mock/settings";
import PaymentSettingsForm from "@/components/admin/settings/PaymentSettingsForm";

// Import SVG icons
import paymentIcon from "@/public/icons/settings/payment.svg";
import aiConfigIcon from "@/public/icons/settings/aiConfiguration.svg";
import notificationsIcon from "@/public/icons/settings/notifications.svg";
import generalIcon from "@/public/icons/settings/general.svg";
import paymentGatewaysIcon from "@/public/icons/settings/ppaymentGateways.svg";
import stripeIcon from "@/public/icons/settings/stripePayments.svg";
import paypalIcon from "@/public/icons/settings/paypalIntegration.svg";
import cryptoIcon from "@/public/icons/settings/cryptoPayments.svg";
import quickActionsIcon from "@/public/icons/settings/quickActions.svg";
import rightArrowIcon from "@/public/icons/settings/rightArrow.svg";
import shieldIcon from "@/public/icons/settings/shield.svg";

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState("payment");
  const [hasChanges, setHasChanges] = useState(false);

  const { data: paymentSettings, isLoading: paymentLoading, error: paymentError } =
    usePaymentSettings();
  const { data: aiConfig, isLoading: aiLoading } = useAIConfiguration();
  const { data: notificationSettings, isLoading: notificationLoading } =
    useNotificationSettings();
  const { data: generalSettings, isLoading: generalLoading } =
    useGeneralSettings();

  // Debug logging
  console.log('Payment Settings:', paymentSettings);
  console.log('Payment Error:', paymentError);
  console.log('Payment Loading:', paymentLoading);
  const { mutate: saveSettings, isPending: isSaving } = useSaveSettings();
  const { mutate: toggleGateway } = useTogglePaymentGateway();
  const { mutate: toggleModel } = useToggleAIModel();

  // Local state for form values
  const [formData, setFormData] = useState({
    baseFee: 2.5,
    fixedFee: 0.3,
    currency: "USD",
    gateways: [],
  });

  // Initialize form data from API when payment settings load
  useEffect(() => {
    if (paymentSettings) {
      setFormData({
        baseFee: paymentSettings.basePlatformFee || 0,
        fixedFee: paymentSettings.fixedFeePerTransaction || 0,
        currency: paymentSettings.defaultCurrency || "USD",
        gateways: paymentSettings.gateways || [],
      });
    }
  }, [paymentSettings]);

  const isLoading =
    paymentLoading || aiLoading || notificationLoading || generalLoading;

  const tabs = [
    { id: "payment", label: "Payment", icon: paymentIcon },
    { id: "ai", label: "AI Configuration", icon: aiConfigIcon },
    { id: "notifications", label: "Notifications", icon: notificationsIcon },
    { id: "general", label: "General", icon: generalIcon },
  ];

  // Gateway icon mapping
  const gatewayIconMap = {
    stripe: stripeIcon,
    paypal: paypalIcon,
    crypto: cryptoIcon,
  };

  const handleSave = () => {
    saveSettings(formData, {
      onSuccess: () => {
        setHasChanges(false);
      },
    });
  };

  const handleCancel = () => {
    // Reset to API data
    if (paymentSettings) {
      setFormData({
        baseFee: paymentSettings.basePlatformFee || 0,
        fixedFee: paymentSettings.fixedFeePerTransaction || 0,
        currency: paymentSettings.defaultCurrency || "USD",
        gateways: paymentSettings.gateways || [],
      });
    }
    setHasChanges(false);
  };

  const handleToggleGateway = (gatewayId, currentStatus) => {
    // Update local form data
    const updatedGateways = formData.gateways.map((gateway) =>
      gateway.id === gatewayId ? { ...gateway, enabled: !currentStatus } : gateway
    );
    setFormData({ ...formData, gateways: updatedGateways });

    // Call API to toggle gateway
    toggleGateway({ gatewayId, enabled: !currentStatus });
    setHasChanges(true);
  };

  const handleToggleModel = (modelId, currentStatus) => {
    toggleModel({ modelId, enabled: !currentStatus });
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-360 mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/50 font-inter text-[14px]">
              Loading settings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="font-inter text-[28px] sm:text-[36px] lg:text-[44.79px] font-black leading-tight lg:leading-[49.77px] tracking-[-1.48px] text-white mb-2">
              Platform Settings
            </h1>
            <p className="font-inter text-[13px] sm:text-[14px] text-white/50">
              Manage global configurations for payments, AI models, and
              notifications. Changes affect the entire system immediately.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 border border-white/10 rounded-lg font-inter text-[13px] sm:text-[14px] font-medium text-white/60 hover:bg-white/05 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-inter text-[13px] sm:text-[14px] font-medium text-black transition-opacity disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/08 mb-6 sm:mb-8 -mx-4 sm:mx-0">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-inter text-[14px] sm:text-[16px] lg:text-[17.42px] font-bold leading-[26.13px] tracking-[0.26px] border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#D4AF37] text-[#D4AF37]"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              <Image
                src={tab.icon}
                alt={tab.label}
                className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]"
              />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Error Display */}
          {activeTab === "payment" && paymentError && (
            <div className="bg-red-950/30 border border-red-800/30 rounded-xl p-4 sm:p-6">
              <h3 className="font-inter text-[16px] font-bold text-red-400 mb-2">
                Error Loading Payment Settings
              </h3>
              <p className="font-inter text-[14px] text-red-400/80">
                {paymentError.message || 'Failed to load payment settings. Please try again.'}
              </p>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && paymentSettings && (
            <>
              {/* Payment Gateways */}
              <div className="bg-[#0d0b08] rounded-xl border border-white/08 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image
                        src={paymentGatewaysIcon}
                        alt="Payment Gateways"
                        className="h-[20px] w-[20px]"
                      />
                    </div>
                    <h2 className="font-inter text-[16px] sm:text-[18px] font-bold text-white">
                      Payment Gateways
                    </h2>
                  </div>
                  <span className="px-3 py-1 bg-transparent border-[1.24px] border-[#22C55E33] rounded-[12440.4px] font-inter text-[12px] sm:text-[14.93px] font-bold leading-[19.91px] text-[#22C55E] uppercase">
                    SYSTEM ACTIVE
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {paymentSettings.gateways.map((gateway) => (
                    <div
                      key={gateway.id}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-[9.95px] border-[1.24px] ${
                        gateway.enabled
                          ? "bg-white/05 border-white/10"
                          : gateway.id === "crypto"
                            ? "bg-white/03 opacity-75 border-white/08"
                            : "bg-white/03 border-white/08"
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Image
                            src={gatewayIconMap[gateway.id] || paymentIcon}
                            alt={gateway.name}
                            className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-inter text-[14px] sm:text-[15px] font-bold text-white">
                            {gateway.name}
                          </p>
                          <p className="font-inter text-[12px] sm:text-[13px] text-white/40 truncate">
                            {gateway.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleToggleGateway(gateway.id, gateway.enabled)
                        }
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-3"
                        style={{
                          backgroundColor: gateway.enabled
                            ? "#10B981"
                            : "#94A3B8",
                        }}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            gateway.enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction Fees - Formik Form */}
              <PaymentSettingsForm
                initialValues={formData}
                onSubmit={handleSave}
                onCancel={handleCancel}
                isSubmitting={isSaving}
              />
            </>
          )}

          {/* Payment Tab - No Data */}
          {activeTab === "payment" && !paymentSettings && !paymentError && !paymentLoading && (
            <div className="bg-yellow-950/30 border border-yellow-800/30 rounded-xl p-4 sm:p-6">
              <h3 className="font-inter text-[16px] font-bold text-yellow-400 mb-2">
                No Payment Settings Found
              </h3>
              <p className="font-inter text-[14px] text-yellow-400/80">
                Payment settings data is empty. Please check your API configuration.
              </p>
            </div>
          )}

          {/* AI Configuration Tab */}
          {activeTab === "ai" && aiConfig && (
            <div className="bg-[#0d0b08] rounded-xl border border-white/08 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-purple-950/40 rounded-lg flex items-center justify-center shrink-0">
                  <Image
                    src={aiConfigIcon}
                    alt="AI Configuration"
                    className="h-[20px] w-[20px]"
                  />
                </div>
                <h2 className="font-inter text-[16px] sm:text-[18px] font-bold text-white">
                  AI Models
                </h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {aiConfig.models.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-3 sm:p-4 bg-white/05 rounded-lg border border-white/08"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#9333EA] to-[#4F46E5] rounded-full flex items-center justify-center flex-shrink-0">
                        <Image
                          src={aiConfigIcon}
                          alt={model.name}
                          className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-inter text-[14px] sm:text-[15px] font-bold text-white">
                          {model.name}
                        </p>
                        <p className="font-inter text-[12px] sm:text-[13px] text-white/50 truncate">
                          {model.provider} • {model.purpose}
                        </p>
                        <p className="font-inter text-[11px] sm:text-[12px] text-white/30 mt-1">
                          ${model.costPerRequest} per request
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleModel(model.id, model.enabled)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-3"
                      style={{
                        backgroundColor: model.enabled ? "#10B981" : "#94A3B8",
                      }}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          model.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && notificationSettings && (
            <div className="bg-[#0d0b08] rounded-xl border border-white/08 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-blue-950/40 rounded-lg flex items-center justify-center shrink-0">
                  <Image
                    src={notificationsIcon}
                    alt="Notifications"
                    className="h-[20px] w-[20px]"
                  />
                </div>
                <h2 className="font-inter text-[16px] sm:text-[18px] font-bold text-white">
                  Notification Preferences
                </h2>
              </div>

              <div className="space-y-5 sm:space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="font-inter text-[14px] sm:text-[15px] font-bold text-white mb-3 sm:mb-4">
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.email).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="font-inter text-[13px] sm:text-[14px] text-white/50 capitalize flex-1">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <button
                            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
                            style={{
                              backgroundColor: value ? "#10B981" : "#94A3B8",
                            }}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* SMS Notifications */}
                <div className="pt-5 sm:pt-6 border-t border-white/08">
                  <h3 className="font-inter text-[14px] sm:text-[15px] font-bold text-white mb-3 sm:mb-4">
                    SMS Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.sms).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="font-inter text-[13px] sm:text-[14px] text-white/50 capitalize flex-1">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <button
                            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
                            style={{
                              backgroundColor: value ? "#10B981" : "#94A3B8",
                            }}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* General Tab */}
          {activeTab === "general" && generalSettings && (
            <div className="bg-[#0d0b08] rounded-xl border border-white/08 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-white/08 rounded-lg flex items-center justify-center shrink-0">
                  <Image
                    src={generalIcon}
                    alt="General Settings"
                    className="h-[20px] w-[20px]"
                  />
                </div>
                <h2 className="font-inter text-[16px] sm:text-[18px] font-bold text-white">
                  General Settings
                </h2>
              </div>

              <div className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block font-inter text-[14px] font-medium text-white/70 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    defaultValue={generalSettings.platformName}
                    className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg font-inter text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[14px] font-medium text-white/70 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    defaultValue={generalSettings.supportEmail}
                    className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg font-inter text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[14px] font-medium text-white/70 mb-2">
                    Timezone
                  </label>
                  <div className="relative">
                    <select
                      defaultValue={generalSettings.timezone}
                      className="appearance-none w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg font-inter text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-transparent transition-all"
                    >
                      {timezoneOptions.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#0d0b08] rounded-xl border border-white/08 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src={quickActionsIcon}
                alt="Quick Actions"
                className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]"
              />
              <h3 className="font-inter text-[15px] sm:text-[16px] font-bold text-white">
                Quick Actions
              </h3>
            </div>
            <p className="font-inter text-[12px] sm:text-[13px] text-white/40 mb-3 sm:mb-4">
              Common tasks for super admins.
            </p>
            <div className="space-y-2">
              {[
                "View Transaction Logs",
                "Manage Tax Rules",
                "Invoice Settings",
              ].map((action, i) => (
                <button
                  key={i}
                  className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white/05 hover:bg-white/08 rounded-[9.95px] border border-white/08 transition-colors group"
                >
                  <span className="font-inter text-[13px] sm:text-[14px] text-white/80">
                    {action}
                  </span>
                  <Image
                    src={rightArrowIcon}
                    alt=""
                    className="h-[14px] w-[14px] sm:h-[15px] sm:w-[15px] group-hover:translate-x-1 transition-transform shrink-0"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Security Context */}
          <div className="bg-[#0d0b08] rounded-[14.93px] border border-white/08 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src={shieldIcon}
                alt="Security"
                className="h-[18px] w-[22px] sm:h-[20px] sm:w-[25px] shrink-0"
              />
              <h3 className="font-inter text-[17px] sm:text-[19.91px] font-bold leading-tight sm:leading-[29.86px] text-[#D4AF37]">
                Security Context
              </h3>
            </div>
            <p className="font-inter text-[12px] sm:text-[13px] text-white/40 mb-3 sm:mb-4">
              Changes to payment configurations require 2FA verification upon
              saving.
            </p>
            <div className="flex items-center gap-2 text-white">
              <span className="w-2 h-2 bg-[#10B981] rounded-full shrink-0"></span>
              <span className="font-inter text-[12px] sm:text-[13px] font-medium text-white/70">
                Audit Logging Active
              </span>
            </div>
          </div>

          {/* Help */}
          <div className="bg-[#0d0b08] rounded-[14.93px] border border-white/08 p-4 sm:p-6">
            <p className="font-inter text-[13px] sm:text-[14px] text-white/50 mb-3">
              Need help with fee calculation?
            </p>
            <button className="flex items-center gap-2 font-inter text-[13px] sm:text-[14px] font-medium text-[#D4AF37] hover:underline">
              Read Documentation
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
