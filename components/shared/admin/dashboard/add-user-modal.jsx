"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, RefreshCw } from "lucide-react";

export default function AddUserModal({
  isOpen,
  onClose,
  onCreateUser,
  editUser = null,
  onUpdateUser,
}) {
  const isEditMode = !!editUser;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    isActive: true,
    password: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editUser) {
      // Transform backend data structure to form structure
      // Backend: { fullName, email, roles: ["Vendor"], status: "Active" }
      // Form: { fullName, email, role: "Vendor", isActive: true }
      setFormData({
        fullName: editUser.fullName || editUser.name || "",
        email: editUser.email || "",
        role: Array.isArray(editUser.roles)
          ? editUser.roles[0]
          : (editUser.role || ""),
        isActive: editUser.status
          ? editUser.status.toLowerCase() === "active"
          : (editUser.isActive ?? true),
        password: "",
      });
    } else if (!isEditMode) {
      setFormData({
        fullName: "",
        email: "",
        role: "",
        isActive: true,
        password: "",
      });
    }
  }, [isEditMode, editUser, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleStatus = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleGeneratePassword = () => {
    setIsGenerating(true);
    // Generate a random password
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const password = Array.from({ length: 12 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");

    setTimeout(() => {
      handleChange("password", password);
      setIsGenerating(false);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode && onUpdateUser) {
      // For edit mode, send only changed data
      const updateData = {
        id: editUser.id,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
      };
      // Only include password if it's been set
      if (formData.password) {
        updateData.password = formData.password;
      }
      onUpdateUser(updateData);
    } else if (onCreateUser) {
      onCreateUser(formData);
    }
    // Reset form
    setFormData({
      fullName: "",
      email: "",
      role: "",
      isActive: true,
      password: "",
    });
    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      fullName: "",
      email: "",
      role: "",
      isActive: true,
      password: "",
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
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-[#E5E7EB]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-manrope text-[24px] font-bold text-primary mb-2">
                      {isEditMode ? "Edit User" : "Add New User"}
                    </h2>
                    <p className="font-manrope text-[14px] text-[#64748B]">
                      {isEditMode
                        ? "Update the user details below."
                        : "Fill in the details below to invite a new user to the platform."}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-[#94A3B8] hover:text-[#64748B] transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Full Name */}
                  <div>
                    <label className="block font-manrope text-[14px] font-medium text-primary mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[14px] text-primary placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block font-manrope text-[14px] font-medium text-primary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[14px] text-primary placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Role Selection */}
                  <div>
                    <label className="block font-manrope text-[14px] font-medium text-primary mb-2">
                      Role Selection
                    </label>
                    <div className="relative">
                      <select
                        value={formData.role}
                        onChange={(e) => handleChange("role", e.target.value)}
                        required
                        className="appearance-none w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[14px] text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      >
                        <option value="">Select a role</option>
                        <option value="Admin">Admin</option>
                        <option value="Vendor">Vendor</option>
                        <option value="Customer">Customer</option>
                        <option value="Auditor">Auditor</option>
                        <option value="Manager">Manager</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Account Status */}
                  <div>
                    <label className="block font-manrope text-[14px] font-medium text-primary mb-2">
                      Account Status
                    </label>
                    <div className="flex items-center gap-3 h-[42px]">
                      <button
                        type="button"
                        onClick={handleToggleStatus}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6]"
                        style={{
                          backgroundColor: formData.isActive
                            ? "#10B981"
                            : "#94A3B8",
                        }}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.isActive
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="font-manrope text-[14px] text-[#64748B]">
                        {formData.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Initial Password */}
                <div className="mb-6">
                  <label className="block font-manrope text-[14px] font-medium text-primary mb-2">
                    {isEditMode ? "New Password (optional)" : "Initial Password"}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      required={!isEditMode}
                      className="flex-1 px-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg font-manrope text-[14px] text-primary placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      placeholder={
                        isEditMode
                          ? "Leave blank to keep current password"
                          : "Enter or generate password"
                      }
                    />
                    <motion.button
                      type="button"
                      onClick={handleGeneratePassword}
                      disabled={isGenerating}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[14px] font-medium text-primary hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
                    >
                      <RefreshCw
                        size={16}
                        className={isGenerating ? "animate-spin" : ""}
                      />
                      Generate
                    </motion.button>
                  </div>
                  <p className="font-manrope text-[12px] text-[#94A3B8] italic mt-2">
                    {isEditMode
                      ? "Only enter a new password if you want to change it."
                      : "The user will be prompted to change this password on their first login."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E5E7EB]">
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2.5 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[14px] font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2.5 bg-primary text-white rounded-lg font-manrope text-[14px] font-medium hover:bg-[#334155] transition-colors"
                  >
                    {isEditMode ? "Update User" : "Create User"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
