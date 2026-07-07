// components/checkout/DeliveryInformation.jsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Pencil, CheckCircle } from "lucide-react";
import EditDeliveryModal from "./edit-delivery-modal";
import { NIGERIA_STATES } from "@/lib/data/nigeria-states";
import { usePersistedState, CHECKOUT_KEYS } from "@/hooks/use-persisted-state";

const inputClass =
  "w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-[14px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "block text-[12px] font-medium text-white/30 uppercase tracking-widest mb-2";

export default function DeliveryInformation({
  savedAddress,
  savedAddresses = [],
  onComplete,
  readonly = false,
  onEdit,
  isGuest = false,
}) {
  const [showEditModal, setShowEditModal] = useState(false);

  // Live form fields, persisted so they survive a refresh / back-and-edit.
  const [form, setForm] = usePersistedState(CHECKOUT_KEYS.form, {
    fullName: savedAddress?.fullName || "",
    phone: savedAddress?.phone || "",
    address: savedAddress?.address || savedAddress?.line1 || "",
    city: savedAddress?.city || "",
    state: savedAddress?.state || "",
    notes: savedAddress?.notes || "",
    email: savedAddress?.email || "",
  });

  const { fullName, phone, address, city, state, notes, email } = form;
  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleModalSave = (data) => {
    const addr = data.address;
    setForm((f) => ({
      ...f,
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      address: addr.address || addr.line1 || addr.streetAddress || "",
      city: addr.city || "",
      state: addr.state || "",
      notes: data.deliveryInstructions || "",
    }));
    setShowEditModal(false);
  };

  const handleContinue = () => {
    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim()) {
      return;
    }
    onComplete?.({ fullName, phone, address, city, state, notes, email: isGuest ? email : undefined });
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
  const isFormComplete = fullName.trim() && phone.trim() && address.trim() && city.trim() && state.trim() && (!isGuest || email.trim());

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
                onChange={setField("fullName")}
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
                onChange={setField("phone")}
                className={inputClass}
                placeholder="+234 800 000 0000"
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Email — guests only */}
          {isGuest && (
            <div>
              <label className={labelClass}>Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={setField("email")}
                className={inputClass}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          )}

          {/* Address */}
          <div>
            <label className={labelClass}>Street Address *</label>
            <input
              type="text"
              value={address}
              onChange={setField("address")}
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
                onChange={setField("city")}
                className={inputClass}
                placeholder="Lagos"
                autoComplete="address-level2"
              />
            </div>
            <div>
              <label className={labelClass}>State *</label>
              <select
                value={state}
                onChange={setField("state")}
                className={`${inputClass} appearance-none pr-10 ${
                  state ? "text-white" : "text-white/25"
                }`}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff80' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "16px 16px",
                }}
                autoComplete="address-level1"
              >
                <option value="" disabled className="text-black">
                  Select state
                </option>
                {NIGERIA_STATES.map((s) => (
                  <option key={s} value={s} className="text-black">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Delivery Note */}
          <div>
            <label className={labelClass}>Delivery Note <span className="normal-case text-white/20 tracking-normal">(optional)</span></label>
            <textarea
              value={notes}
              onChange={setField("notes")}
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
