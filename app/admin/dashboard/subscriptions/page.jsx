"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  X,
  Check,
  Tag,
  ChevronDown,
} from "lucide-react";
import {
  useAdminPricing,
  useUpdateAdminPricing,
  useAdminDiscounts,
  useCreateAdminDiscount,
  useUpdateAdminDiscount,
  useDeleteAdminDiscount,
} from "@/hooks/use-admin-subscriptions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIER_COLORS = {
  economy: { bg: "#DCFCE7", text: "#1A7A4A", label: "Economy" },
  premium: { bg: "#DBEAFE", text: "#1A4A8A", label: "Premium" },
  luxury: { bg: "#F3E8FF", text: "#7B2FBE", label: "Luxury" },
};

const STATUS_CHIP = {
  active: { bg: "#DCFCE7", text: "#1A7A4A", label: "Active" },
  scheduled: { bg: "#DBEAFE", text: "#1A4A8A", label: "Scheduled" },
  expired: { bg: "#F1F5F9", text: "#64748B", label: "Expired" },
};

function formatNGN(val) {
  if (val == null) return "—";
  return `₦${Number(val).toLocaleString()}`;
}

function discountStatus(d) {
  const now = new Date();
  if (!d.isActive) return "expired";
  if (new Date(d.startDate) > now) return "scheduled";
  if (new Date(d.endDate) < now) return "expired";
  return "active";
}

// ─── Pricing Row ──────────────────────────────────────────────────────────────

function PricingRow({ config, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    monthlyPrice: config.monthlyPrice ?? "",
    annualPrice: config.annualPrice ?? "",
    generationsAllowed: config.generationsAllowed ?? "",
    yearlyDiscountPct: config.yearlyDiscountPct ?? "",
    isActive: config.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

  const tier = config.tier?.toLowerCase() || "economy";
  const colors = TIER_COLORS[tier] || TIER_COLORS.economy;

  const handleSave = async () => {
    setSaving(true);
    await onSave(tier, {
      monthlyPrice: form.monthlyPrice !== "" ? Number(form.monthlyPrice) : undefined,
      annualPrice: form.annualPrice !== "" ? Number(form.annualPrice) : undefined,
      generationsAllowed:
        form.generationsAllowed !== "" ? Number(form.generationsAllowed) : null,
      yearlyDiscountPct:
        form.yearlyDiscountPct !== "" ? Number(form.yearlyDiscountPct) : undefined,
      isActive: form.isActive,
    });
    setSaving(false);
    setEditing(false);
  };

  return (
    <tr className="border-b border-[#E5E7EB] last:border-0">
      {/* Tier */}
      <td className="py-4 px-4">
        <span
          className="px-3 py-1 rounded-full font-manrope text-[12px] font-bold uppercase"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {colors.label}
        </span>
      </td>

      {/* Monthly Price */}
      <td className="py-4 px-4">
        {editing ? (
          <input
            type="number"
            value={form.monthlyPrice}
            onChange={(e) => setForm({ ...form, monthlyPrice: e.target.value })}
            className="w-28 px-2 py-1 border border-[#E5E7EB] rounded-lg font-manrope text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="e.g. 29990"
          />
        ) : (
          <span className="font-manrope text-[14px] text-primary">
            {tier === "economy" ? "Free" : formatNGN(config.monthlyPrice)}
          </span>
        )}
      </td>

      {/* Annual Price */}
      <td className="py-4 px-4">
        {editing ? (
          <input
            type="number"
            value={form.annualPrice}
            onChange={(e) => setForm({ ...form, annualPrice: e.target.value })}
            className="w-28 px-2 py-1 border border-[#E5E7EB] rounded-lg font-manrope text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="e.g. 287880"
            disabled={tier === "economy"}
          />
        ) : (
          <span className="font-manrope text-[14px] text-primary">
            {tier === "economy" ? "—" : formatNGN(config.annualPrice)}
          </span>
        )}
      </td>

      {/* Yearly Discount % */}
      <td className="py-4 px-4">
        {editing ? (
          <input
            type="number"
            value={form.yearlyDiscountPct}
            onChange={(e) => setForm({ ...form, yearlyDiscountPct: e.target.value })}
            className="w-20 px-2 py-1 border border-[#E5E7EB] rounded-lg font-manrope text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="20"
            disabled={tier === "economy"}
          />
        ) : (
          <span className="font-manrope text-[14px] text-primary">
            {tier === "economy" ? "—" : config.yearlyDiscountPct != null ? `${config.yearlyDiscountPct}%` : "—"}
          </span>
        )}
      </td>

      {/* Generations */}
      <td className="py-4 px-4">
        {editing ? (
          <input
            type="number"
            value={form.generationsAllowed}
            onChange={(e) => setForm({ ...form, generationsAllowed: e.target.value })}
            className="w-24 px-2 py-1 border border-[#E5E7EB] rounded-lg font-manrope text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="50 or blank=∞"
            disabled={tier === "luxury"}
          />
        ) : (
          <span className="font-manrope text-[14px] text-primary">
            {tier === "luxury" || config.generationsAllowed == null
              ? "Unlimited"
              : config.generationsAllowed}
          </span>
        )}
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        {editing ? (
          <button
            onClick={() => setForm({ ...form, isActive: !form.isActive })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            style={{ backgroundColor: form.isActive ? "#10B981" : "#94A3B8" }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        ) : (
          <span
            className={`px-2.5 py-1 rounded-full font-manrope text-[12px] font-semibold ${
              config.isActive
                ? "bg-[#DCFCE7] text-[#1A7A4A]"
                : "bg-[#F1F5F9] text-[#64748B]"
            }`}
          >
            {config.isActive ? "Active" : "Inactive"}
          </span>
        )}
      </td>

      {/* Last Updated */}
      <td className="py-4 px-4 text-[#94A3B8] font-manrope text-[12px]">
        {config.updatedAt ? new Date(config.updatedAt).toLocaleDateString() : "—"}
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        {editing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg font-manrope text-[12px] font-semibold hover:bg-[#334155] transition-colors disabled:opacity-50"
            >
              <Check size={12} />
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg font-manrope text-[12px] text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 px-3 py-1.5 border border-[#E5E7EB] rounded-lg font-manrope text-[12px] text-primary hover:bg-[#F8FAFC] transition-colors"
          >
            <Edit2 size={12} />
            Edit
          </button>
        )}
      </td>
    </tr>
  );
}

// ─── Discount Row ─────────────────────────────────────────────────────────────

function DiscountRow({ discount, onDeactivate, isDeactivating }) {
  const status = discountStatus(discount);
  const chip = STATUS_CHIP[status];

  return (
    <tr className="border-b border-[#E5E7EB] last:border-0">
      <td className="py-4 px-4">
        <p className="font-manrope text-[14px] font-semibold text-primary">
          {discount.name}
        </p>
        {discount.displayLabel && (
          <span className="px-2 py-0.5 mt-1 inline-block bg-amber-100 text-amber-700 rounded font-manrope text-[11px] font-semibold">
            {discount.displayLabel}
          </span>
        )}
      </td>
      <td className="py-4 px-4">
        {discount.tier ? (
          <span
            className="px-2.5 py-1 rounded-full font-manrope text-[12px] font-semibold capitalize"
            style={{
              backgroundColor: TIER_COLORS[discount.tier]?.bg || "#F1F5F9",
              color: TIER_COLORS[discount.tier]?.text || "#64748B",
            }}
          >
            {discount.tier}
          </span>
        ) : (
          <span className="font-manrope text-[13px] text-[#64748B]">All paid tiers</span>
        )}
      </td>
      <td className="py-4 px-4 font-manrope text-[13px] text-[#64748B] capitalize">
        {discount.billingCycle || "Both"}
      </td>
      <td className="py-4 px-4 font-manrope text-[14px] text-primary font-semibold">
        {discount.discountType === "percentage"
          ? `${discount.discountValue}%`
          : formatNGN(discount.discountValue)}
      </td>
      <td className="py-4 px-4 font-manrope text-[12px] text-[#64748B]">
        {discount.startDate ? new Date(discount.startDate).toLocaleDateString() : "—"}
        {" → "}
        {discount.endDate ? new Date(discount.endDate).toLocaleDateString() : "—"}
      </td>
      <td className="py-4 px-4">
        {discount.promoCode ? (
          <code className="px-2 py-1 bg-[#F1F5F9] rounded font-mono text-[12px] text-primary">
            {discount.promoCode}
          </code>
        ) : (
          <span className="font-manrope text-[12px] text-[#94A3B8]">Auto-applied</span>
        )}
      </td>
      <td className="py-4 px-4 font-manrope text-[13px] text-[#64748B]">
        {discount.redemptionCount ?? 0}
        {discount.maxRedemptions != null ? ` / ${discount.maxRedemptions}` : ""}
      </td>
      <td className="py-4 px-4">
        <span
          className="px-2.5 py-1 rounded-full font-manrope text-[12px] font-semibold"
          style={{ backgroundColor: chip.bg, color: chip.text }}
        >
          {chip.label}
        </span>
      </td>
      <td className="py-4 px-4">
        {status !== "expired" && (
          <button
            onClick={() => onDeactivate(discount.id)}
            disabled={isDeactivating}
            className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg font-manrope text-[12px] hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 size={12} />
            Deactivate
          </button>
        )}
      </td>
    </tr>
  );
}

// ─── Create Discount Modal ────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  tier: "",
  billingCycle: "",
  discountType: "percentage",
  discountValue: "",
  startDate: "",
  endDate: "",
  promoCode: "",
  maxRedemptions: "",
  displayLabel: "",
};

function CreateDiscountModal({ onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name || !form.discountType || !form.discountValue || !form.startDate || !form.endDate) {
      setFormError("Please fill in all required fields.");
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      setFormError("Start date must be before end date.");
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({
        name: form.name,
        tier: form.tier || undefined,
        billingCycle: form.billingCycle || undefined,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        startDate: form.startDate,
        endDate: form.endDate,
        promoCode: form.promoCode || undefined,
        maxRedemptions: form.maxRedemptions ? Number(form.maxRedemptions) : undefined,
        displayLabel: form.displayLabel || undefined,
      });
      onClose();
    } catch (err) {
      setFormError(err?.response?.data?.message || err.message || "Failed to create discount.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
              <Tag size={18} className="text-amber-600" />
            </div>
            <h2 className="font-manrope text-[18px] font-bold text-primary">
              New Discount Campaign
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <X size={18} className="text-[#64748B]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <p className="font-manrope text-[13px] text-red-700">{formError}</p>
            </div>
          )}

          {/* Campaign Name */}
          <div>
            <label className="block font-manrope text-[13px] font-semibold text-primary mb-1.5">
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Black Friday 2025"
              className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg font-manrope text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Tier + Billing Cycle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-manrope text-[13px] font-semibold text-primary mb-1.5">
                Tier
              </label>
              <div className="relative">
                <select
                  value={form.tier}
                  onChange={(e) => set("tier", e.target.value)}
                  className="appearance-none w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg font-manrope text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All paid tiers</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block font-manrope text-[13px] font-semibold text-primary mb-1.5">
                Billing Cycle
              </label>
              <div className="relative">
                <select
                  value={form.billingCycle}
                  onChange={(e) => set("billingCycle", e.target.value)}
                  className="appearance-none w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg font-manrope text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Both</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Discount Type + Value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-manrope text-[13px] font-semibold text-primary mb-1.5">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.discountType}
                  onChange={(e) => set("discountType", e.target.value)}
                  className="appearance-none w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg font-manrope text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed_amount">Fixed Amount (₦)</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block font-manrope text-[13px] font-semibold text-primary mb-1.5">
                Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.discountValue}
                onChange={(e) => set("discountValue", e.target.value)}
                placeholder={form.discountType === "percentage" ? "e.g. 25" : "e.g. 5000"}
                min="0"
                max={form.discountType === "percentage" ? "100" : undefined}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg font-manrope text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-manrope text-[13px] font-semibold text-primary mb-1.5">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg font-manrope text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block font-manrope text-[13px] font-semibold text-primary mb-1.5">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg font-manrope text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Promo Code */}
          <div>
            <label className="block font-manrope text-[13px] font-semibold text-primary mb-1.5">
              Promo Code <span className="text-[#94A3B8] font-normal">(optional — blank = auto-applied)</span>
            </label>
            <input
              type="text"
              value={form.promoCode}
              onChange={(e) => set("promoCode", e.target.value.toUpperCase())}
              placeholder="e.g. BLACKFRIDAY25"
              className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg font-mono text-[14px] uppercase focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Max Redemptions + Display Label */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-manrope text-[13px] font-semibold text-primary mb-1.5">
                Max Redemptions <span className="text-[#94A3B8] font-normal">(blank = unlimited)</span>
              </label>
              <input
                type="number"
                value={form.maxRedemptions}
                onChange={(e) => set("maxRedemptions", e.target.value)}
                placeholder="e.g. 100"
                min="1"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg font-manrope text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block font-manrope text-[13px] font-semibold text-primary mb-1.5">
                Display Label <span className="text-[#94A3B8] font-normal">(badge text)</span>
              </label>
              <input
                type="text"
                value={form.displayLabel}
                onChange={(e) => set("displayLabel", e.target.value)}
                placeholder="e.g. Black Friday"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg font-manrope text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-[#E5E7EB] rounded-lg font-manrope text-[14px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg font-manrope text-[14px] font-semibold hover:bg-[#334155] transition-colors disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create Campaign"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState("pricing");
  const [discountFilter, setDiscountFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pageError, setPageError] = useState(null);

  const { data: pricingData, isLoading: pricingLoading, error: pricingError } =
    useAdminPricing();
  const { data: discountsData, isLoading: discountsLoading, error: discountsError } =
    useAdminDiscounts({ status: discountFilter });

  const { mutateAsync: updatePricing } = useUpdateAdminPricing();
  const { mutateAsync: createDiscount } = useCreateAdminDiscount();
  const { mutate: deleteDiscount, isPending: isDeactivating } = useDeleteAdminDiscount();

  const pricing = Array.isArray(pricingData) ? pricingData : pricingData?.data ?? [];
  const discounts = Array.isArray(discountsData) ? discountsData : discountsData?.data ?? [];

  const handleUpdatePricing = async (tier, data) => {
    try {
      await updatePricing({ tier, data });
    } catch (err) {
      setPageError(err?.response?.data?.message || err.message || "Failed to save pricing.");
    }
  };

  const isLoading = pricingLoading || discountsLoading;

  if (isLoading) {
    return (
      <div className="max-w-360 mx-auto animate-pulse space-y-6">
        <div className="h-10 w-64 bg-[#E5E7EB] rounded-lg" />
        <div className="h-8 w-72 bg-[#E5E7EB] rounded" />
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-360 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-inter text-[28px] sm:text-[32px] font-bold text-primary mb-2">
          Subscriptions & Pricing
        </h1>
        <p className="font-manrope text-[13px] sm:text-[14px] text-[#64748B]">
          Manage subscription tier prices, generation quotas, and discount campaigns.
        </p>
      </div>

      {/* Error Banner */}
      {(pageError || pricingError || discountsError) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="font-manrope text-[14px] font-semibold text-red-800 mb-1">Error</p>
            <p className="font-manrope text-[13px] text-red-700">
              {pageError ||
                pricingError?.message ||
                discountsError?.message ||
                "Failed to load data."}
            </p>
          </div>
          <button onClick={() => setPageError(null)}>
            <X size={18} className="text-red-600" />
          </button>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="border-b border-[#E5E7EB] mb-6 -mx-4 sm:mx-0">
        <div className="flex gap-6 px-4 sm:px-0">
          {[
            { id: "pricing", label: "Pricing & Packages" },
            { id: "discounts", label: "Discount Campaigns" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 font-manrope text-[15px] font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-[#64748B] hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Pricing Tab ── */}
      {activeTab === "pricing" && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-[#E5E7EB]">
            <h2 className="font-manrope text-[16px] font-bold text-primary">
              Tier Pricing Configuration
            </h2>
            <p className="font-manrope text-[13px] text-[#64748B] mt-1">
              Click Edit on any row to update pricing. Changes take effect immediately for new subscribers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                  {["Tier", "Monthly Price", "Annual Price", "Yearly Discount %", "Generations / Period", "Status", "Last Updated", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-manrope text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {pricing.length > 0 ? (
                  pricing.map((config) => (
                    <PricingRow
                      key={config.tier}
                      config={config}
                      onSave={handleUpdatePricing}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center font-manrope text-[14px] text-[#94A3B8]">
                      No pricing data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Discounts Tab ── */}
      {activeTab === "discounts" && (
        <div className="space-y-4">
          {/* Discount Table Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter */}
            <div className="flex items-center gap-2">
              {["all", "active", "scheduled", "expired"].map((f) => (
                <button
                  key={f}
                  onClick={() => setDiscountFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-manrope text-[13px] font-semibold capitalize transition-colors ${
                    discountFilter === f
                      ? "bg-primary text-white"
                      : "border border-[#E5E7EB] text-[#64748B] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* New Discount */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-manrope text-[13px] font-semibold hover:bg-[#334155] transition-colors"
            >
              <Plus size={16} />
              New Discount
            </motion.button>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                    {["Campaign", "Tier", "Billing", "Value", "Date Range", "Promo Code", "Redemptions", "Status", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left font-manrope text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {discounts.length > 0 ? (
                    discounts.map((d) => (
                      <DiscountRow
                        key={d.id}
                        discount={d}
                        onDeactivate={(id) => deleteDiscount(id)}
                        isDeactivating={isDeactivating}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-12 text-center font-manrope text-[14px] text-[#94A3B8]">
                        No discount campaigns found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Discount Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateDiscountModal
            onClose={() => setShowCreateModal(false)}
            onCreate={createDiscount}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
