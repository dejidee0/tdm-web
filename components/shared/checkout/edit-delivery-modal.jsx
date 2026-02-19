// components/checkout/EditDeliveryModal.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Plus, Check } from "lucide-react";

export default function EditDeliveryModal({
  isOpen,
  onClose,
  savedAddresses,
  onSave,
}) {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New address form state
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

    onSave?.({
      address: addressToSave,
      deliveryInstructions,
    });
    onClose();
  };

  const handleCancel = () => {
    setShowNewAddressForm(false);
    setNewAddress({
      label: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      saveForFuture: false,
    });
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 h-screen"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[560px] max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-[#e5e5e5]">
                <div>
                  <h2 className="text-[20px] font-semibold text-text-black">
                    Edit Delivery Details
                  </h2>
                  <p className="text-[13px] text-[#666666] mt-1">
                    Update where your materials will be shipped
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-background rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#666666]" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="space-y-6">
                  {/* Select Address Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-[#666666]" />
                      <h3 className="text-[13px] font-semibold text-[#666666] uppercase tracking-wide">
                        Select Address
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {/* Saved Addresses */}
                      {savedAddresses?.map((address) => (
                        <label
                          key={address.id}
                          className={`
                            flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all
                            ${
                              selectedAddress === address.id &&
                              !showNewAddressForm
                                ? "border-primary bg-primary/5"
                                : "border-[#e5e5e5] hover:border-[#d4d4d4]"
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={
                              selectedAddress === address.id &&
                              !showNewAddressForm
                            }
                            onChange={() => {
                              setSelectedAddress(address.id);
                              setShowNewAddressForm(false);
                            }}
                            className="mt-0.5 w-5 h-5 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[15px] font-semibold text-text-black">
                                {address.label}
                              </span>
                              {address.isDefault && (
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-semibold rounded uppercase">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[14px] text-[#666666] leading-relaxed">
                              {address.line1}
                              <br />
                              {address.city}, {address.state}, {address.country}
                            </p>
                          </div>
                        </label>
                      ))}

                      {/* Add New Address Button/Form */}
                      <div
                        className={`
                          border-2 rounded-xl transition-all
                          ${
                            showNewAddressForm
                              ? "border-primary bg-primary/5"
                              : "border-dashed border-[#d4d4d4]"
                          }
                        `}
                      >
                        {!showNewAddressForm ? (
                          <button
                            onClick={() => setShowNewAddressForm(true)}
                            className="w-full flex items-center gap-3 p-4 hover:bg-background/50 transition-colors"
                          >
                            <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                              <Plus className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-[15px] font-semibold text-text-black">
                              Add New Address
                            </span>
                          </button>
                        ) : (
                          <div className="p-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Plus className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-[15px] font-semibold text-text-black">
                                Add New Address
                              </span>
                            </div>

                            <div className="space-y-4">
                              {/* Street Address */}
                              <div>
                                <label className="block text-[13px] font-medium text-[#666666] mb-2">
                                  Street Address
                                </label>
                                <input
                                  type="text"
                                  value={newAddress.streetAddress}
                                  onChange={(e) =>
                                    setNewAddress({
                                      ...newAddress,
                                      streetAddress: e.target.value,
                                    })
                                  }
                                  placeholder="e.g. 123 Designer Way"
                                  className="w-full px-4 py-2.5 bg-background border border-transparent rounded-lg text-[14px] text-text-black placeholder:text-text-black/40 focus:outline-none focus:border-primary focus:bg-white transition-all"
                                />
                              </div>

                              {/* City, State, Zip */}
                              <div className="grid grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[13px] font-medium text-[#666666] mb-2">
                                    City
                                  </label>
                                  <input
                                    type="text"
                                    value={newAddress.city}
                                    onChange={(e) =>
                                      setNewAddress({
                                        ...newAddress,
                                        city: e.target.value,
                                      })
                                    }
                                    placeholder="City"
                                    className="w-full px-4 py-2.5 bg-background border border-transparent rounded-lg text-[14px] text-text-black placeholder:text-text-black/40 focus:outline-none focus:border-primary focus:bg-white transition-all"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[13px] font-medium text-[#666666] mb-2">
                                    State
                                  </label>
                                  <select
                                    value={newAddress.state}
                                    onChange={(e) =>
                                      setNewAddress({
                                        ...newAddress,
                                        state: e.target.value,
                                      })
                                    }
                                    className="w-full px-4 py-2.5 bg-background border border-transparent rounded-lg text-[14px] text-text-black focus:outline-none focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
                                    style={{
                                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                      backgroundRepeat: "no-repeat",
                                      backgroundPosition:
                                        "right 0.75rem center",
                                      paddingRight: "2.5rem",
                                    }}
                                  >
                                    <option value="">State</option>
                                    <option value="NY">NY</option>
                                    <option value="CA">CA</option>
                                    <option value="TX">TX</option>
                                    <option value="FL">FL</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[13px] font-medium text-[#666666] mb-2">
                                    Zip Code
                                  </label>
                                  <input
                                    type="text"
                                    value={newAddress.zipCode}
                                    onChange={(e) =>
                                      setNewAddress({
                                        ...newAddress,
                                        zipCode: e.target.value,
                                      })
                                    }
                                    placeholder="10001"
                                    className="w-full px-4 py-2.5 bg-background border border-transparent rounded-lg text-[14px] text-text-black placeholder:text-text-black/40 focus:outline-none focus:border-primary focus:bg-white transition-all"
                                  />
                                </div>
                              </div>

                              {/* Save Checkbox */}
                              <div className="flex items-center gap-3 pt-2">
                                <input
                                  type="checkbox"
                                  id="saveAddress"
                                  checked={newAddress.saveForFuture}
                                  onChange={(e) =>
                                    setNewAddress({
                                      ...newAddress,
                                      saveForFuture: e.target.checked,
                                    })
                                  }
                                  className="w-4 h-4 rounded border-[#d4d4d4] text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                                />
                                <label
                                  htmlFor="saveAddress"
                                  className="text-[13px] text-text-black cursor-pointer"
                                >
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
                      <svg
                        className="w-4 h-4 text-[#666666]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="text-[13px] font-semibold text-[#666666] uppercase tracking-wide">
                        Delivery Instructions
                      </h3>
                    </div>
                    <div className="relative">
                      <textarea
                        value={deliveryInstructions}
                        onChange={(e) =>
                          setDeliveryInstructions(e.target.value)
                        }
                        rows={3}
                        maxLength={200}
                        placeholder="Gate code is 4451. Please leave at front door."
                        className="w-full px-4 py-3 bg-background border border-transparent rounded-lg text-[14px] text-text-black placeholder:text-text-black/40 focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                      />
                      <span className="absolute bottom-3 right-3 text-[11px] text-[#999999]">
                        {deliveryInstructions.length}/200
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-[#e5e5e5] bg-background/50">
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 text-[14px] font-medium text-text-black hover:bg-[#e5e5e5] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-[14px] font-medium hover:bg-primary/90 transition-colors"
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
