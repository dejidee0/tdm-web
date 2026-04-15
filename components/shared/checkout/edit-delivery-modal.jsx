// components/checkout/EditDeliveryModal.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Plus, Check } from "lucide-react";

const inputClass =
  "w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-[14px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all";

export default function EditDeliveryModal({
  isOpen,
  onClose,
  savedAddresses,
  onSave,
}) {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    label: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    saveForFuture: false,
  });

  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  useEffect(() => {
    if (isOpen && savedAddresses?.length > 0) {
      const defaultAddr = savedAddresses.find((addr) => addr.isDefault);
      setSelectedAddress(defaultAddr?.id || savedAddresses[0].id);
    }
  }, [isOpen, savedAddresses]);

  const handleSave = () => {
    const addressToSave = showNewAddressForm
      ? newAddress
      : savedAddresses.find((addr) => addr.id === selectedAddress);
    onSave?.({ address: addressToSave, deliveryInstructions });
    onClose();
  };

  const handleCancel = () => {
    setShowNewAddressForm(false);
    setNewAddress({ label: "", streetAddress: "", city: "", state: "", zipCode: "", saveForFuture: false });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 h-screen"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="rounded-2xl shadow-2xl w-full max-w-140 max-h-[90vh] overflow-hidden border border-white/10"
              style={{ background: "#0d0b08" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-white/08">
                <div>
                  <h2 className="text-[20px] font-semibold text-white">
                    Edit Delivery Details
                  </h2>
                  <p className="text-[13px] text-white/40 mt-1">
                    Update where your materials will be shipped
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-white/05 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="space-y-6">
                  {/* Select Address Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-white/40" />
                      <h3 className="text-[13px] font-semibold text-white/40 uppercase tracking-widest">
                        Select Address
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {/* Saved Addresses */}
                      {savedAddresses?.map((address) => (
                        <label
                          key={address.id}
                          className="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all"
                          style={
                            selectedAddress === address.id && !showNewAddressForm
                              ? { borderColor: "#D4AF37", background: "rgba(212,175,55,0.06)" }
                              : { borderColor: "rgba(255,255,255,0.08)", background: "transparent" }
                          }
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddress === address.id && !showNewAddressForm}
                            onChange={() => { setSelectedAddress(address.id); setShowNewAddressForm(false); }}
                            className="mt-0.5 w-5 h-5 accent-[#D4AF37]"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[15px] font-semibold text-white">
                                {address.label}
                              </span>
                              {address.isDefault && (
                                <span
                                  className="px-2 py-0.5 text-[11px] font-semibold rounded uppercase text-black"
                                  style={{ background: "rgba(212,175,55,0.80)" }}
                                >
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[14px] text-white/40 leading-relaxed">
                              {address.line1}
                              <br />
                              {address.city}, {address.state}, {address.country}
                            </p>
                          </div>
                        </label>
                      ))}

                      {/* Add New Address Button/Form */}
                      <div
                        className="border-2 rounded-xl transition-all"
                        style={
                          showNewAddressForm
                            ? { borderColor: "#D4AF37", background: "rgba(212,175,55,0.04)" }
                            : { borderColor: "rgba(255,255,255,0.10)", borderStyle: "dashed" }
                        }
                      >
                        {!showNewAddressForm ? (
                          <button
                            onClick={() => setShowNewAddressForm(true)}
                            className="w-full flex items-center gap-3 p-4 hover:bg-white/03 transition-colors"
                          >
                            <div className="w-5 h-5 rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
                              <Plus className="w-3 h-3 text-[#D4AF37]" />
                            </div>
                            <span className="text-[15px] font-semibold text-white">
                              Add New Address
                            </span>
                          </button>
                        ) : (
                          <div className="p-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
                              >
                                <Plus className="w-3 h-3 text-black" />
                              </div>
                              <span className="text-[15px] font-semibold text-white">
                                Add New Address
                              </span>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-[13px] font-medium text-white/40 mb-2">
                                  Street Address
                                </label>
                                <input
                                  type="text"
                                  value={newAddress.streetAddress}
                                  onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                                  placeholder="e.g. 123 Designer Way"
                                  className={inputClass}
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[13px] font-medium text-white/40 mb-2">City</label>
                                  <input type="text" value={newAddress.city}
                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                    placeholder="City" className={inputClass} />
                                </div>
                                <div>
                                  <label className="block text-[13px] font-medium text-white/40 mb-2">State</label>
                                  <select
                                    value={newAddress.state}
                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                    className={`${inputClass} appearance-none cursor-pointer`}
                                  >
                                    <option value="">State</option>
                                    <option value="Abuja">Abuja</option>
                                    <option value="Lagos">Lagos</option>
                                    <option value="Rivers">Rivers</option>
                                    <option value="Kano">Kano</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[13px] font-medium text-white/40 mb-2">Zip Code</label>
                                  <input type="text" value={newAddress.zipCode}
                                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                    placeholder="900001" className={inputClass} />
                                </div>
                              </div>

                              <div className="flex items-center gap-3 pt-2">
                                <input
                                  type="checkbox"
                                  id="saveAddress"
                                  checked={newAddress.saveForFuture}
                                  onChange={(e) => setNewAddress({ ...newAddress, saveForFuture: e.target.checked })}
                                  className="w-4 h-4 rounded border-white/20 bg-[#1a1a1a] accent-[#D4AF37]"
                                />
                                <label htmlFor="saveAddress" className="text-[13px] text-white/50 cursor-pointer">
                                  Save this address for future orders
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-[13px] font-semibold text-white/40 uppercase tracking-widest">
                        Delivery Instructions
                      </h3>
                    </div>
                    <div className="relative">
                      <textarea
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        rows={3}
                        maxLength={200}
                        placeholder="Gate code is 4451. Please leave at front door."
                        className={`${inputClass} resize-none`}
                      />
                      <span className="absolute bottom-3 right-3 text-[11px] text-white/25">
                        {deliveryInstructions.length}/200
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-white/08" style={{ background: "rgba(255,255,255,0.02)" }}>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 text-[14px] font-medium text-white/60 hover:bg-white/05 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-medium transition-opacity hover:opacity-90 text-black"
                  style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
