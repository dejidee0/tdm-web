// components/shared/dashboard/profile/address.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Pencil, Trash2, Star, Loader2, X, Check } from "lucide-react";
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from "@/hooks/use-profile";
import { showToast } from "@/components/shared/toast";

const inputClass =
  "w-full px-3 py-2.5 text-[14px] text-white bg-[#1a1a1a] border border-white/10 rounded-lg focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all placeholder:text-white/20";

const EMPTY_FORM = {
  fullName: "", street: "", city: "", state: "",
  postalCode: "", country: "", phone: "", deliveryNotes: "", isDefault: false,
};

export default function AddressBook() {
  const { data: addressData, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const addresses = addressData?.data ?? addressData ?? [];

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };

  const openEdit = (addr) => {
    setForm({
      fullName: addr.fullName || "", street: addr.street || "",
      city: addr.city || "", state: addr.state || "",
      postalCode: addr.postalCode || "", country: addr.country || "",
      phone: addr.phone || "", deliveryNotes: addr.deliveryNotes || "",
      isDefault: addr.isDefault || false,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSave = () => {
    const opts = {
      onSuccess: () => {
        showToast.success({ title: editingId ? "Updated" : "Added", message: editingId ? "Address updated." : "New address added." });
        setShowForm(false);
      },
      onError: (err) => showToast.error({ title: "Error", message: err.message }),
    };
    if (editingId) updateAddress.mutate({ addressId: editingId, data: form }, opts);
    else createAddress.mutate(form, opts);
  };

  const handleDelete = (id) => {
    deleteAddress.mutate(id, {
      onSuccess: () => showToast.success({ title: "Removed", message: "Address deleted." }),
      onError: (err) => showToast.error({ title: "Error", message: err.message }),
    });
  };

  const isSaving = createAddress.isPending || updateAddress.isPending;

  if (isLoading) return <AddressSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="rounded-2xl border border-white/08 p-6" style={{ background: "#0d0b08" }}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-[18px] font-semibold text-white">Address Book</h2>
            <p className="text-[13px] text-white/40 mt-0.5">Manage your delivery addresses.</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-black rounded-lg hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
          >
            <Plus className="w-4 h-4" /> Add Address
          </button>
        </div>
      </div>

      {/* Address Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border p-6 space-y-4"
            style={{ background: "#0d0b08", borderColor: "rgba(212,175,55,0.30)" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-white">
                {editingId ? "Edit Address" : "New Address"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 text-white/30 hover:text-white/60 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Full Name" value={form.fullName} onChange={(v) => setForm((f) => ({ ...f, fullName: v }))} placeholder="John Doe" className="sm:col-span-2" />
              <FormField label="Street Address" value={form.street} onChange={(v) => setForm((f) => ({ ...f, street: v }))} placeholder="123 Main St" className="sm:col-span-2" />
              <FormField label="City" value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} placeholder="Lagos" />
              <FormField label="State" value={form.state} onChange={(v) => setForm((f) => ({ ...f, state: v }))} placeholder="Lagos State" />
              <FormField label="Postal Code" value={form.postalCode} onChange={(v) => setForm((f) => ({ ...f, postalCode: v }))} placeholder="100001" />
              <FormField label="Country" value={form.country} onChange={(v) => setForm((f) => ({ ...f, country: v }))} placeholder="Nigeria" />
              <FormField label="Phone" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="+234 800 000 0000" type="tel" />
              <FormField label="Delivery Notes" value={form.deliveryNotes} onChange={(v) => setForm((f) => ({ ...f, deliveryNotes: v }))} placeholder="Gate code, landmarks..." />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm((f) => ({ ...f, isDefault: !f.isDefault }))}
                className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                style={
                  form.isDefault
                    ? { background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)", border: "2px solid #D4AF37" }
                    : { background: "transparent", border: "2px solid rgba(255,255,255,0.15)" }
                }
              >
                {form.isDefault && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
              </div>
              <span className="text-[13px] text-white/50 font-medium">Set as default address</span>
            </label>

            <div className="flex justify-end gap-3 pt-2 border-t border-white/06">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-[14px] font-medium text-white/50 border border-white/10 rounded-lg hover:bg-white/05 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save Address"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-white/08 p-12 text-center" style={{ background: "#0d0b08" }}>
          <MapPin className="w-10 h-10 text-white/15 mx-auto mb-3" />
          <p className="text-[15px] font-medium text-white mb-1">No addresses yet</p>
          <p className="text-[13px] text-white/40">Add a delivery address to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-2xl border border-white/08 p-5"
                style={{ background: "#0d0b08" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(212,175,55,0.10)" }}
                    >
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14px] font-semibold text-white">{addr.fullName}</p>
                        {addr.isDefault && (
                          <span
                            className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(212,175,55,0.12)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.25)" }}
                          >
                            <Star className="w-2.5 h-2.5 fill-[#D4AF37]" /> Default
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-white/50">
                        {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p className="text-[13px] text-white/50">{addr.country}</p>
                      {addr.phone && <p className="text-[12px] text-white/30 mt-1">{addr.phone}</p>}
                      {addr.deliveryNotes && <p className="text-[12px] text-white/25 mt-1 italic">{addr.deliveryNotes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(addr)}
                      className="p-2 text-white/30 hover:text-[#D4AF37] hover:bg-white/05 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      disabled={deleteAddress.isPending}
                      className="p-2 text-white/30 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text", className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-[13px] font-medium text-white/30 uppercase tracking-widest">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function AddressSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="rounded-2xl border border-white/08 p-6 h-20" style={{ background: "#0d0b08" }} />
      {[...Array(2)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-white/08 p-5 h-28" style={{ background: "#0d0b08" }} />
      ))}
    </div>
  );
}
