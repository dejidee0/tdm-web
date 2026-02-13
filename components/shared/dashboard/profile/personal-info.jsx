// components/dashboard/profile/PersonalInformation.jsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  useUpdatePersonalInfo,
  useUpdateEmail,
  useUpdatePhone,
} from "@/hooks/use-profile";

export default function PersonalInformation({
  profile,
  isLoading,
  setHasChanges,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const updatePersonalInfo = useUpdatePersonalInfo();
  const updateEmail = useUpdateEmail();
  const updatePhone = useUpdatePhone();

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Split updates based on what changed
    const { firstName, lastName, email, phone } = formData;

    if (firstName !== profile.firstName || lastName !== profile.lastName) {
      updatePersonalInfo.mutate({ firstName, lastName });
    }

    if (email !== profile.email) {
      updateEmail.mutate(email);
    }

    if (phone !== profile.phone) {
      updatePhone.mutate(phone);
    }

    setHasChanges(false);
  };

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
      {/* Personal Information Section */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
        <h3 className="text-[18px] font-semibold text-primary mb-6">
          Personal Information
        </h3>

        <div className="space-y-5">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-medium text-[#666666] mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full px-4 py-3 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] text-primary focus:outline-none focus:border-[#3b82f6] focus:bg-white transition-all"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#666666] mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full px-4 py-3 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] text-primary focus:outline-none focus:border-[#3b82f6] focus:bg-white transition-all"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[13px] font-medium text-[#666666] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-3 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] text-primary focus:outline-none focus:border-[#3b82f6] focus:bg-white transition-all"
              placeholder="Enter email address"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[13px] font-medium text-[#666666] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-3 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] text-primary focus:outline-none focus:border-[#3b82f6] focus:bg-white transition-all"
              placeholder="Enter phone number"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
      <div className="animate-pulse space-y-5">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-2 gap-5">
          <div className="h-12 bg-gray-200 rounded-lg" />
          <div className="h-12 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-12 bg-gray-200 rounded-lg" />
        <div className="h-12 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
