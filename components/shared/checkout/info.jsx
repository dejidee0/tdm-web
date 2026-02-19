// components/checkout/DeliveryInformation.jsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Pencil, CheckCircle } from "lucide-react";
import EditDeliveryModal from "./edit-delivery-modal";

export default function DeliveryInformation({
  savedAddress,
  savedAddresses = [], // Array of all saved addresses
  onComplete,
  readonly = false,
  onEdit,
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [shippingTo, setShippingTo] = useState(savedAddress?.label || "Home");
  const [address, setAddress] = useState(savedAddress?.line1 || "");
  const [city, setCity] = useState(savedAddress?.city || "");
  const [state, setState] = useState(savedAddress?.state || "");
  const [zipCode, setZipCode] = useState(savedAddress?.zipCode || "");
  const [deliveryNote, setDeliveryNote] = useState("");

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleModalSave = (data) => {
    // Update fields from modal
    setShippingTo(data.address.label || data.address.streetAddress);
    setAddress(data.address.line1 || data.address.streetAddress);
    setCity(data.address.city);
    setState(data.address.state);
    setZipCode(data.address.zipCode);
    setDeliveryNote(data.deliveryInstructions);
    setShowEditModal(false);
  };

  const handleContinue = () => {
    onComplete?.({
      label: shippingTo,
      line1: address,
      city,
      state,
      zipCode,
      deliveryNote,
    });
  };

  // Readonly view (when on payment step)
  if (readonly) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-[#e5e5e5] p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#16a34a]" />
              <h2 className="text-[18px] font-semibold text-text-black">
                Delivery Information
              </h2>
            </div>
            <button
              onClick={onEdit}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4 text-[#666666]" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[12px] text-[#999999] uppercase tracking-wide mb-1">
                Shipping To
              </p>
              <p className="text-[14px] font-medium text-text-black">
                {shippingTo}
              </p>
            </div>
            <div>
              <p className="text-[14px] text-[#666666] leading-relaxed">
                {address}
                <br />
                {city}, {state} {zipCode}
              </p>
            </div>
            {deliveryNote && (
              <div>
                <p className="text-[12px] text-[#999999] uppercase tracking-wide mb-1">
                  Delivery Note
                </p>
                <p className="text-[14px] text-[#666666]">{deliveryNote}</p>
              </div>
            )}
          </div>
        </motion.div>
      </>
    );
  }

  // Check if user has saved addresses (logged in with saved addresses)
  const hasSavedAddresses = savedAddresses && savedAddresses.length > 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl border border-[#e5e5e5] p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-semibold text-text-black">
            Delivery Information
          </h2>
          {hasSavedAddresses && (
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-3 py-1.5 text-[14px] text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        <div className="space-y-5">
          {/* Shipping To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-[#999999] uppercase tracking-wide mb-2">
                Shipping To
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={shippingTo}
                  onChange={(e) => setShippingTo(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-transparent rounded-lg text-[14px] text-text-black placeholder:text-text-black/50 focus:outline-none focus:border-primary focus:bg-white transition-all"
                  placeholder="e.g., Home, Office"
                  disabled={hasSavedAddresses}
                />
                {hasSavedAddresses && (
                  <button
                    onClick={handleEditClick}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white rounded transition-colors"
                    aria-label="Edit address"
                  >
                    <Pencil className="w-4 h-4 text-[#999999]" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-transparent rounded-lg text-[14px] text-text-black placeholder:text-text-black/50 focus:outline-none focus:border-primary focus:bg-white transition-all"
                placeholder="Street address"
                disabled={hasSavedAddresses}
              />
              {hasSavedAddresses && (
                <button
                  onClick={handleEditClick}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white rounded transition-colors"
                  aria-label="Edit address"
                >
                  <Pencil className="w-4 h-4 text-[#999999]" />
                </button>
              )}
            </div>
          </div>

          {/* City, State, ZIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-transparent rounded-lg text-[14px] text-text-black placeholder:text-text-black/50 focus:outline-none focus:border-primary focus:bg-white transition-all disabled:cursor-not-allowed disabled:opacity-75"
              placeholder="City"
              disabled={hasSavedAddresses}
            />
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-transparent rounded-lg text-[14px] text-text-black placeholder:text-text-black/50 focus:outline-none focus:border-primary focus:bg-white transition-all disabled:cursor-not-allowed disabled:opacity-75"
              placeholder="State"
              disabled={hasSavedAddresses}
            />
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-transparent rounded-lg text-[14px] text-text-black placeholder:text-text-black/50 focus:outline-none focus:border-primary focus:bg-white transition-all disabled:cursor-not-allowed disabled:opacity-75"
              placeholder="ZIP Code"
              disabled={hasSavedAddresses}
            />
          </div>

          {/* Delivery Note */}
          <div>
            <label className="block text-[12px] font-medium text-[#999999] uppercase tracking-wide mb-2">
              Delivery Note
            </label>
            <div className="relative">
              <textarea
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-background border border-transparent rounded-lg text-[14px] text-text-black placeholder:text-text-black/50 focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                placeholder='"Gate code is 4451. Please leave at front door."'
              />
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Continue to Payment
          </button>
        </div>
      </motion.div>
      {/* Edit Modal - Only shows when user has saved addresses */}e
      {hasSavedAddresses && (
        <EditDeliveryModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          savedAddresses={savedAddresses}
          currentDeliveryNote={deliveryNote}
          onSave={handleModalSave}
        />
      )}
    </>
  );
}
