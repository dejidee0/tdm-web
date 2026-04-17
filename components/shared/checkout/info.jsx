// components/checkout/DeliveryInformation.jsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Pencil, CheckCircle } from "lucide-react";
import EditDeliveryModal from "./edit-delivery-modal";

const inputClass =
  "w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-[14px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "block text-[12px] font-medium text-white/30 uppercase tracking-widest mb-2";

export default function DeliveryInformation({
  savedAddress,
  savedAddresses = [],
  onComplete,
  readonly = false,
  onEdit,
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [fullName, setFullName] = useState(savedAddress?.fullName || "");
  const [phone, setPhone] = useState(savedAddress?.phone || "");
  const [address, setAddress] = useState(savedAddress?.address || savedAddress?.line1 || "");
  const [city, setCity] = useState(savedAddress?.city || "");
  const [state, setState] = useState(savedAddress?.state || "");
  const [notes, setNotes] = useState("");

  const handleModalSave = (data) => {
    const addr = data.address;
    setFullName(addr.fullName || "");
    setPhone(addr.phone || "");
    setAddress(addr.address || addr.line1 || addr.streetAddress || "");
    setCity(addr.city || "");
    setState(addr.state || "");
    setNotes(data.deliveryInstructions || "");
    setShowEditModal(false);
  };

  const handleContinue = () => {
    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim()) {
      return;
    }
    onComplete?.({ fullName, phone, address, city, state, notes });
  };

  if (readonly) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/08 p-6"
        style={{ background: "#0d0b08" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h2 className="text-[18px] font-semibold text-white">Delivery Information</h2>
          </div>
          <button
            onClick={onEdit}
            className="p-2 hover:bg-white/05 rounded-lg transition-colors"
            aria-label="Edit delivery"
          >
            <Pencil className="w-4 h-4 text-white/40" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[14px]">
          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-0.5">Name</p>
            <p className="text-white font-medium">{fullName || "—"}</p>
          </div>
          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-0.5">Phone</p>
            <p className="text-white font-medium">{phone || "—"}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-0.5">Address</p>
            <p className="text-white/60">{address}, {city}, {state}</p>
          </div>
          {notes && (
            <div className="sm:col-span-2">
              <p className="text-[11px] text-white/30 uppercase tracking-widest mb-0.5">Delivery Note</p>
              <p className="text-white/50">{notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  const hasSavedAddresses = savedAddresses.length > 0;
  const isFormComplete = fullName.trim() && phone.trim() && address.trim() && city.trim() && state.trim();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl border border-white/08 p-6"
        style={{ background: "#0d0b08" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-semibold text-white">Delivery Information</h2>
          {hasSavedAddresses && (
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#D4AF37] font-medium hover:bg-[#D4AF37]/05 rounded-lg transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Use Saved Address
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
            <div>
              <label className={labelClass}>Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+234 800 000 0000"
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={labelClass}>Street Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClass}
              placeholder="123 Lagos Street, Victoria Island"
              autoComplete="street-address"
            />
          </div>

          {/* City, State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
                placeholder="Lagos"
                autoComplete="address-level2"
              />
            </div>
            <div>
              <label className={labelClass}>State *</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={inputClass}
                placeholder="Lagos State"
                autoComplete="address-level1"
              />
            </div>
          </div>

          {/* Delivery Note */}
          <div>
            <label className={labelClass}>Delivery Note <span className="normal-case text-white/20 tracking-normal">(optional)</span></label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder='"Gate code is 4451. Please leave at front door."'
            />
          </div>

          <button
            onClick={handleContinue}
            disabled={!isFormComplete}
            className="w-full py-3.5 rounded-lg font-semibold transition-opacity hover:opacity-90 text-black disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
          >
            Continue to Payment
          </button>
        </div>
      </motion.div>

      {hasSavedAddresses && (
        <EditDeliveryModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          savedAddresses={savedAddresses}
          currentDeliveryNote={notes}
          onSave={handleModalSave}
        />
      )}
    </>
  );
}
