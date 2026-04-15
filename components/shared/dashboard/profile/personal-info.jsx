// components/shared/dashboard/profile/personal-info.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save, Loader2 } from "lucide-react";
import { useUpdateProfile } from "@/hooks/use-profile";
import { showToast } from "@/components/shared/toast";

const inputClass =
  "w-full px-3 py-2.5 text-[14px] text-white bg-[#1a1a1a] border border-white/10 rounded-lg focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all placeholder:text-white/20";

export default function PersonalInformation({ profile, isLoading }) {
  const update = useUpdateProfile();

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "" });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
      });
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    update.mutate(form, {
      onSuccess: () => {
        showToast.success({ title: "Saved", message: "Personal details updated." });
        setIsDirty(false);
      },
      onError: (err) => showToast.error({ title: "Error", message: err.message || "Failed to update profile." }),
    });
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
      });
    }
    setIsDirty(false);
  };

  if (isLoading) return <PersonalInfoSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-white/08 p-6 space-y-6"
      style={{ background: "#0d0b08" }}
    >
      <div>
        <h2 className="text-[18px] font-semibold text-white">Personal Details</h2>
        <p className="text-[13px] text-white/40 mt-0.5">Update your name, email and phone number.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="First Name"
          icon={<User className="w-4 h-4" />}
          value={form.firstName}
          onChange={(v) => handleChange("firstName", v)}
          placeholder="Enter first name"
        />
        <Field
          label="Last Name"
          icon={<User className="w-4 h-4" />}
          value={form.lastName}
          onChange={(v) => handleChange("lastName", v)}
          placeholder="Enter last name"
        />
        <Field
          label="Email Address"
          icon={<Mail className="w-4 h-4" />}
          value={form.email}
          onChange={(v) => handleChange("email", v)}
          placeholder="Enter email"
          type="email"
          className="sm:col-span-2"
        />
        <Field
          label="Phone Number"
          icon={<Phone className="w-4 h-4" />}
          value={form.phoneNumber}
          onChange={(v) => handleChange("phoneNumber", v)}
          placeholder="+234 800 000 0000"
          type="tel"
          className="sm:col-span-2"
        />
      </div>

      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-end gap-3 pt-2 border-t border-white/06"
        >
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-[14px] font-medium text-white/50 border border-white/10 rounded-lg hover:bg-white/05 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={update.isPending}
            className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
          >
            {update.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {update.isPending ? "Saving..." : "Save Changes"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function Field({ label, icon, value, onChange, placeholder, type = "text", className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-[13px] font-medium text-white/40 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} pl-9`}
        />
      </div>
    </div>
  );
}

function PersonalInfoSkeleton() {
  return (
    <div className="rounded-2xl border border-white/08 p-6 space-y-6 animate-pulse" style={{ background: "#0d0b08" }}>
      <div className="h-5 w-40 bg-white/06 rounded" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`space-y-2 ${i >= 2 ? "col-span-2" : ""}`}>
            <div className="h-3 w-24 bg-white/06 rounded" />
            <div className="h-10 bg-white/06 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
