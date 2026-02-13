// components/dashboard/profile/AddressBook.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Plus,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import {
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/use-profile";

export default function AddressBook({ profile, isLoading, setHasChanges }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Address Book Header */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-semibold text-primary">
            Address Book
          </h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-[13px] font-medium hover:bg-[#2a2a2a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {/* Address List */}
        <div className="space-y-4">
          {profile?.addresses?.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => setEditingAddress(address)}
              onDelete={() => deleteAddress.mutate(address.id)}
              onSetDefault={() => setDefaultAddress.mutate(address.id)}
            />
          ))}

          {(!profile?.addresses || profile.addresses.length === 0) && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-[#d4d4d4] mx-auto mb-3" />
              <p className="text-[14px] text-[#999999]">
                No addresses added yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      <AnimatePresence>
        {(showAddForm || editingAddress) && (
          <AddressFormModal
            address={editingAddress}
            onClose={() => {
              setShowAddForm(false);
              setEditingAddress(null);
            }}
            onSave={(data) => {
              if (editingAddress) {
                updateAddress.mutate({ addressId: editingAddress.id, data });
              } else {
                addAddress.mutate(data);
              }
              setShowAddForm(false);
              setEditingAddress(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative border-l-4 border-[#3b82f6] bg-[#f8f8f8] rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-[15px] font-semibold text-primary">
              {address.label}
            </h4>
            {address.isDefault && (
              <span className="px-2 py-0.5 bg-[#3b82f6] text-white text-[10px] font-semibold rounded uppercase">
                Default
              </span>
            )}
          </div>
          <p className="text-[14px] text-primary mb-1">{address.recipient}</p>
          <p className="text-[13px] text-[#666666] leading-relaxed">
            {address.addressLine1}
            {address.addressLine2 && <>, {address.addressLine2}</>}
            <br />
            {address.city}, {address.state} {address.zipCode}
            <br />
            {address.country}
          </p>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-white rounded-md transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-[#666666]" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-[#e5e5e5] py-1 z-10">
              {!address.isDefault && (
                <button
                  onClick={() => {
                    onSetDefault();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-[14px] text-primary hover:bg-[#f5f5f5] flex items-center gap-3"
                >
                  <Check className="w-4 h-4" />
                  Set as Default
                </button>
              )}
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2.5 text-left text-[14px] text-primary hover:bg-[#f5f5f5] flex items-center gap-3"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2.5 text-left text-[14px] text-[#ef4444] hover:bg-[#fef2f2] flex items-center gap-3"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddressFormModal({ address, onClose, onSave }) {
  const [formData, setFormData] = useState(
    address || {
      label: "",
      recipient: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      isDefault: false,
    },
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-[20px] font-semibold text-primary mb-6">
          {address ? "Edit Address" : "Add New Address"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Label */}
          <div>
            <label className="block text-[13px] font-medium text-[#666666] mb-2">
              Address Label
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] focus:outline-none focus:border-[#3b82f6] focus:bg-white"
              placeholder="e.g., Home, Office"
              required
            />
          </div>

          {/* Recipient */}
          <div>
            <label className="block text-[13px] font-medium text-[#666666] mb-2">
              Recipient Name
            </label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) =>
                setFormData({ ...formData, recipient: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] focus:outline-none focus:border-[#3b82f6] focus:bg-white"
              placeholder="Full name"
              required
            />
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-[13px] font-medium text-[#666666] mb-2">
              Address Line 1
            </label>
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) =>
                setFormData({ ...formData, addressLine1: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] focus:outline-none focus:border-[#3b82f6] focus:bg-white"
              placeholder="Street address, P.O. box"
              required
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-[13px] font-medium text-[#666666] mb-2">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              value={formData.addressLine2}
              onChange={(e) =>
                setFormData({ ...formData, addressLine2: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] focus:outline-none focus:border-[#3b82f6] focus:bg-white"
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>

          {/* City, State, ZIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#666666] mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] focus:outline-none focus:border-[#3b82f6] focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#666666] mb-2">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] focus:outline-none focus:border-[#3b82f6] focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#666666] mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] focus:outline-none focus:border-[#3b82f6] focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Default Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData({ ...formData, isDefault: e.target.checked })
              }
              className="w-5 h-5 rounded border-[#d4d4d4] text-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-0"
            />
            <label htmlFor="isDefault" className="text-[14px] text-primary">
              Set as default address
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#f5f5f5] text-primary rounded-lg text-[14px] font-medium hover:bg-[#e5e5e5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg text-[14px] font-medium hover:bg-[#2a2a2a] transition-colors"
            >
              Save Address
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-32 bg-gray-200 rounded-lg" />
        <div className="h-32 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
