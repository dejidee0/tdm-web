"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function CreateOrderModal({ isOpen, onClose, onSubmit, isLoading = false, error = null }) {
  const [formData, setFormData] = useState({
    shippingFullName: "",
    shippingPhoneNumber: "",
    shippingAddress: "",
    shippingLGACity: "",
    shippingState: "",
    shippingNotes: "",
    customerNotes: "",
    promoCode: "",
    shippingCost: 0,
    tax: 0,
    discount: 0,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    // Reset form
    setFormData({
      shippingFullName: "",
      shippingPhoneNumber: "",
      shippingAddress: "",
      shippingLGACity: "",
      shippingState: "",
      shippingNotes: "",
      customerNotes: "",
      promoCode: "",
      shippingCost: 0,
      tax: 0,
      discount: 0,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-[#E5E7EB]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-manrope text-[20px] font-bold text-[#1E293B] mb-1">
                      Create New Order
                    </h2>
                    <p className="font-manrope text-[13px] text-[#64748B]">
                      Enter the details to create a new order for a customer.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="text-[#94A3B8] hover:text-[#64748B] transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* Shipping Information Section */}
                <div className="mb-6">
                  <h3 className="font-manrope text-[14px] font-bold text-[#1E293B] mb-4">
                    Shipping Information
                  </h3>

                  {/* Full Name */}
                  <div className="mb-4">
                    <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={formData.shippingFullName}
                      onChange={(e) =>
                        handleChange("shippingFullName", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="mb-4">
                    <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={formData.shippingPhoneNumber}
                      onChange={(e) =>
                        handleChange("shippingPhoneNumber", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-4">
                    <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                      Shipping Address
                    </label>
                    <input
                      type="text"
                      placeholder="Street address"
                      value={formData.shippingAddress}
                      onChange={(e) =>
                        handleChange("shippingAddress", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
                    />
                  </div>

                  {/* City/LGA and State Row */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* City/LGA */}
                    <div>
                      <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                        City/LGA
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ikeja"
                        value={formData.shippingLGACity}
                        onChange={(e) =>
                          handleChange("shippingLGACity", e.target.value)
                        }
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lagos"
                        value={formData.shippingState}
                        onChange={(e) =>
                          handleChange("shippingState", e.target.value)
                        }
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Shipping Notes */}
                  <div>
                    <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                      Shipping Notes (Optional)
                    </label>
                    <textarea
                      placeholder="Add delivery instructions or notes..."
                      value={formData.shippingNotes}
                      onChange={(e) =>
                        handleChange("shippingNotes", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Order Details Section */}
                <div className="mb-6">
                  <h3 className="font-manrope text-[14px] font-bold text-[#1E293B] mb-4">
                    Order Details
                  </h3>

                  {/* Customer Notes */}
                  <div className="mb-4">
                    <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                      Customer Notes (Optional)
                    </label>
                    <textarea
                      placeholder="Add any customer notes or special requests..."
                      value={formData.customerNotes}
                      onChange={(e) =>
                        handleChange("customerNotes", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Promo Code */}
                  <div className="mb-4">
                    <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                      Promo Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={formData.promoCode}
                      onChange={(e) =>
                        handleChange("promoCode", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
                    />
                  </div>

                  {/* Pricing Row */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Shipping Cost */}
                    <div>
                      <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                        Shipping Cost ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.shippingCost}
                        onChange={(e) =>
                          handleChange(
                            "shippingCost",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
                      />
                    </div>

                    {/* Tax */}
                    <div>
                      <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                        Tax ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.tax}
                        onChange={(e) =>
                          handleChange("tax", parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
                      />
                    </div>

                    {/* Discount */}
                    <div>
                      <label className="block font-manrope text-[13px] font-medium text-[#1E293B] mb-2">
                        Discount ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.discount}
                        onChange={(e) =>
                          handleChange(
                            "discount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E293B] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-[#E5E7EB]">
                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-manrope text-[13px] text-red-600">
                      {error.message || "Failed to create order. Please try again."}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#1E293B] text-white rounded-lg font-manrope text-[13px] font-medium hover:bg-[#334155] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {isLoading ? "Creating..." : "Create Order"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
