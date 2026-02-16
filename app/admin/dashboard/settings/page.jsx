"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  usePaymentSettings,
  useAIConfiguration,
  useNotificationSettings,
  useGeneralSettings,
  useSaveSettings,
  useTogglePaymentGateway,
  useToggleAIModel,
} from "@/hooks/use-settings";
import { currencyOptions, timezoneOptions } from "@/lib/mock/settings";

// Import SVG icons
import paymentIcon from "@/public/icons/settings/payment.svg";
import aiConfigIcon from "@/public/icons/settings/aiConfiguration.svg";
import notificationsIcon from "@/public/icons/settings/notifications.svg";
import generalIcon from "@/public/icons/settings/general.svg";
import paymentGatewaysIcon from "@/public/icons/settings/ppaymentGateways.svg";
import stripeIcon from "@/public/icons/settings/stripePayments.svg";
import paypalIcon from "@/public/icons/settings/paypalIntegration.svg";
import cryptoIcon from "@/public/icons/settings/cryptoPayments.svg";
import percentageIcon from "@/public/icons/settings/percentage.svg";
import dollarIcon from "@/public/icons/settings/dollar.svg";
import quickActionsIcon from "@/public/icons/settings/quickActions.svg";
import rightArrowIcon from "@/public/icons/settings/rightArrow.svg";
import shieldIcon from "@/public/icons/settings/shield.svg";

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState("payment");
  const [hasChanges, setHasChanges] = useState(false);

  const { data: paymentSettings, isLoading: paymentLoading } = usePaymentSettings();
  const { data: aiConfig, isLoading: aiLoading } = useAIConfiguration();
  const { data: notificationSettings, isLoading: notificationLoading } = useNotificationSettings();
  const { data: generalSettings, isLoading: generalLoading } = useGeneralSettings();
  const { mutate: saveSettings, isPending: isSaving } = useSaveSettings();
  const { mutate: toggleGateway } = useTogglePaymentGateway();
  const { mutate: toggleModel } = useToggleAIModel();

  // Local state for form values
  const [formData, setFormData] = useState({
    baseFee: 2.5,
    fixedFee: 0.30,
    currency: "USD",
  });

  const isLoading = paymentLoading || aiLoading || notificationLoading || generalLoading;

  const tabs = [
    { id: "payment", label: "Payment", icon: paymentIcon },
    { id: "ai", label: "AI Configuration", icon: aiConfigIcon },
    { id: "notifications", label: "Notifications", icon: notificationsIcon },
    { id: "general", label: "General", icon: generalIcon },
  ];

  // Gateway icon mapping
  const gatewayIconMap = {
    'stripe': stripeIcon,
    'paypal': paypalIcon,
    'crypto': cryptoIcon,
  };

  const handleSave = () => {
    saveSettings(formData, {
      onSuccess: () => {
        setHasChanges(false);
      },
    });
  };

  const handleCancel = () => {
    setFormData({
      baseFee: 2.5,
      fixedFee: 0.30,
      currency: "USD",
    });
    setHasChanges(false);
  };

  const handleToggleGateway = (gatewayId, currentStatus) => {
    toggleGateway({ gatewayId, enabled: !currentStatus });
    setHasChanges(true);
  };

  const handleToggleModel = (modelId, currentStatus) => {
    toggleModel({ modelId, enabled: !currentStatus });
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#E5E7EB] border-t-[#1E293B] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#64748B] font-inter text-[14px]">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="font-inter text-[28px] sm:text-[36px] lg:text-[44.79px] font-black leading-tight lg:leading-[49.77px] tracking-[-1.48px] text-[#1E293B] mb-2">
              Platform Settings
            </h1>
            <p className="font-inter text-[13px] sm:text-[14px] text-[#64748B]">
              Manage global configurations for payments, AI models, and notifications. Changes
              affect the entire system immediately.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-inter text-[13px] sm:text-[14px] font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-[#1E293B] text-white rounded-lg font-inter text-[13px] sm:text-[14px] font-medium hover:bg-[#334155] transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB] mb-6 sm:mb-8 -mx-4 sm:mx-0">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-inter text-[14px] sm:text-[16px] lg:text-[17.42px] font-bold leading-[26.13px] tracking-[0.26px] border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#1E293B] text-[#1E293B]"
                  : "border-transparent text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              <Image src={tab.icon} alt={tab.label} className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Tab */}
          {activeTab === "payment" && paymentSettings && (
            <>
              {/* Payment Gateways */}
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image src={paymentGatewaysIcon} alt="Payment Gateways" className="h-[20px] w-[20px]" />
                    </div>
                    <h2 className="font-inter text-[16px] sm:text-[18px] font-bold text-[#1E293B]">
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
                          ? "bg-[#F8FAFC] border-[#E5E7EB]"
                          : gateway.id === "crypto"
                          ? "bg-[#2730541A] opacity-75 border-[#E5E7EB]"
                          : "bg-[#2730541A] border-[#E5E7EB]"
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1E293B] rounded-full flex items-center justify-center flex-shrink-0">
                          <Image
                            src={gatewayIconMap[gateway.id] || paymentIcon}
                            alt={gateway.name}
                            className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-inter text-[14px] sm:text-[15px] font-bold text-[#1E293B]">
                            {gateway.name}
                          </p>
                          <p className="font-inter text-[12px] sm:text-[13px] text-[#64748B] truncate">
                            {gateway.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleGateway(gateway.id, gateway.enabled)}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-3"
                        style={{ backgroundColor: gateway.enabled ? "#10B981" : "#94A3B8" }}
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

              {/* Transaction Fees */}
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Image src={percentageIcon} alt="Transaction Fees" className="h-[20px] w-[20px]" />
                  </div>
                  <h2 className="font-inter text-[16px] sm:text-[18px] font-bold text-[#1E293B]">
                    Transaction Fees
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  {/* Base Platform Fee */}
                  <div>
                    <label className="block font-inter text-[14px] font-medium text-[#1E293B] mb-2">
                      Base Platform Fee (%)
                    </label>
                    <div className="relative">
                      <Image
                        src={percentageIcon}
                        alt=""
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-[16px] w-[16px]"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={formData.baseFee}
                        onChange={(e) => {
                          setFormData({ ...formData, baseFee: parseFloat(e.target.value) });
                          setHasChanges(true);
                        }}
                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-inter text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-inter text-[14px] text-[#64748B]">
                        %
                      </span>
                    </div>
                    <p className="font-inter text-[12px] text-[#94A3B8] mt-1">
                      Applied to all incoming transactions.
                    </p>
                  </div>

                  {/* Fixed Fee */}
                  <div>
                    <label className="block font-inter text-[14px] font-medium text-[#1E293B] mb-2">
                      Fixed Fee Per Transaction
                    </label>
                    <div className="relative">
                      <Image
                        src={dollarIcon}
                        alt=""
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-[16px] w-[16px]"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={formData.fixedFee}
                        onChange={(e) => {
                          setFormData({ ...formData, fixedFee: parseFloat(e.target.value) });
                          setHasChanges(true);
                        }}
                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-inter text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      />
                    </div>
                    <p className="font-inter text-[12px] text-[#94A3B8] mt-1">
                      Additional flat rate charge.
                    </p>
                  </div>
                </div>

                {/* Default Currency - Full width below */}
                <div>
                    <label className="block font-inter text-[14px] font-medium text-[#1E293B] mb-2">
                      Default Currency
                    </label>
                    <div className="relative">
                      <select
                        value={formData.currency}
                        onChange={(e) => {
                          setFormData({ ...formData, currency: e.target.value });
                          setHasChanges(true);
                        }}
                        className="appearance-none w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-inter text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      >
                        {currencyOptions.map((currency) => (
                          <option key={currency.value} value={currency.value}>
                            {currency.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                      />
                    </div>
                </div>
              </div>
            </>
          )}

          {/* AI Configuration Tab */}
          {activeTab === "ai" && aiConfig && (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-[#F3E8FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image src={aiConfigIcon} alt="AI Configuration" className="h-[20px] w-[20px]" />
                </div>
                <h2 className="font-inter text-[16px] sm:text-[18px] font-bold text-[#1E293B]">
                  AI Models
                </h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {aiConfig.models.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-3 sm:p-4 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#9333EA] to-[#4F46E5] rounded-full flex items-center justify-center flex-shrink-0">
                        <Image src={aiConfigIcon} alt={model.name} className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-inter text-[14px] sm:text-[15px] font-bold text-[#1E293B]">
                          {model.name}
                        </p>
                        <p className="font-inter text-[12px] sm:text-[13px] text-[#64748B] truncate">
                          {model.provider} • {model.purpose}
                        </p>
                        <p className="font-inter text-[11px] sm:text-[12px] text-[#94A3B8] mt-1">
                          ${model.costPerRequest} per request
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleModel(model.id, model.enabled)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-3"
                      style={{ backgroundColor: model.enabled ? "#10B981" : "#94A3B8" }}
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
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image src={notificationsIcon} alt="Notifications" className="h-[20px] w-[20px]" />
                </div>
                <h2 className="font-inter text-[16px] sm:text-[18px] font-bold text-[#1E293B]">
                  Notification Preferences
                </h2>
              </div>

              <div className="space-y-5 sm:space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="font-inter text-[14px] sm:text-[15px] font-bold text-[#1E293B] mb-3 sm:mb-4">
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.email).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between gap-3">
                        <span className="font-inter text-[13px] sm:text-[14px] text-[#64748B] capitalize flex-1">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <button
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
                          style={{ backgroundColor: value ? "#10B981" : "#94A3B8" }}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SMS Notifications */}
                <div className="pt-5 sm:pt-6 border-t border-[#E5E7EB]">
                  <h3 className="font-inter text-[14px] sm:text-[15px] font-bold text-[#1E293B] mb-3 sm:mb-4">
                    SMS Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.sms).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between gap-3">
                        <span className="font-inter text-[13px] sm:text-[14px] text-[#64748B] capitalize flex-1">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <button
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
                          style={{ backgroundColor: value ? "#10B981" : "#94A3B8" }}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* General Tab */}
          {activeTab === "general" && generalSettings && (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image src={generalIcon} alt="General Settings" className="h-[20px] w-[20px]" />
                </div>
                <h2 className="font-inter text-[16px] sm:text-[18px] font-bold text-[#1E293B]">
                  General Settings
                </h2>
              </div>

              <div className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block font-inter text-[14px] font-medium text-[#1E293B] mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    defaultValue={generalSettings.platformName}
                    className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-inter text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[14px] font-medium text-[#1E293B] mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    defaultValue={generalSettings.supportEmail}
                    className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-inter text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[14px] font-medium text-[#1E293B] mb-2">
                    Timezone
                  </label>
                  <div className="relative">
                    <select
                      defaultValue={generalSettings.timezone}
                      className="appearance-none w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-inter text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    >
                      {timezoneOptions.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
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
          <div className="bg-gradient-to-br from-[#273054] to-[#161F42] rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Image src={quickActionsIcon} alt="Quick Actions" className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px]" />
              <h3 className="font-inter text-[15px] sm:text-[16px] font-bold">Quick Actions</h3>
            </div>
            <p className="font-inter text-[12px] sm:text-[13px] text-[#94A3B8] mb-3 sm:mb-4">
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
                  className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-[#334155] hover:bg-[#475569] rounded-[9.95px] border-[1.24px] border-transparent transition-colors group"
                >
                  <span className="font-inter text-[13px] sm:text-[14px]">{action}</span>
                  <Image
                    src={rightArrowIcon}
                    alt=""
                    className="h-[14px] w-[14px] sm:h-[15px] sm:w-[15px] group-hover:translate-x-1 transition-transform flex-shrink-0"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Security Context */}
          <div className="bg-[#273054] rounded-[14.93px] border-[1.24px] border-[#273054] p-4 sm:p-6 text-white opacity-100">
            <div className="flex items-center gap-2 mb-3">
              <Image src={shieldIcon} alt="Security" className="h-[18px] w-[22px] sm:h-[20px] sm:w-[25px] flex-shrink-0" />
              <h3 className="font-inter text-[17px] sm:text-[19.91px] font-bold leading-tight sm:leading-[29.86px] text-[#F97316]">
                Security Context
              </h3>
            </div>
            <p className="font-inter text-[12px] sm:text-[13px] text-[#94A3B8] mb-3 sm:mb-4">
              Changes to payment configurations require 2FA verification upon saving.
            </p>
            <div className="flex items-center gap-2 text-white">
              <span className="w-2 h-2 bg-[#10B981] rounded-full flex-shrink-0"></span>
              <span className="font-inter text-[12px] sm:text-[13px] font-medium">Audit Logging Active</span>
            </div>
          </div>

          {/* Help */}
          <div className="bg-white rounded-[14.93px] border-[1.24px] border-[#314368] p-4 sm:p-6">
            <p className="font-inter text-[13px] sm:text-[14px] text-[#64748B] mb-3">
              Need help with fee calculation?
            </p>
            <button className="flex items-center gap-2 font-inter text-[13px] sm:text-[14px] font-medium text-[#3B82F6] hover:underline">
              Read Documentation
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
