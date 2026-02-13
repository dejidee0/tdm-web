// components/dashboard/profile/Security.jsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useChangePassword } from "@/hooks/use-profile";

export default function Security({ setHasChanges }) {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const changePassword = useChangePassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (passwords.new !== passwords.confirm) {
      setError("New passwords do not match");
      return;
    }

    if (passwords.new.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    changePassword.mutate(
      { currentPassword: passwords.current, newPassword: passwords.new },
      {
        onSuccess: () => {
          alert("Password changed successfully!");
          setPasswords({ current: "", new: "", confirm: "" });
        },
        onError: () => {
          setError("Current password is incorrect");
        },
      },
    );
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Security Section */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
        <h3 className="text-[18px] font-semibold text-primary mb-6">
          Security
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-[13px] font-medium text-[#666666] mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwords.current}
                onChange={(e) => {
                  setPasswords({ ...passwords, current: e.target.value });
                  setHasChanges(true);
                }}
                className="w-full px-4 py-3 pr-12 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] text-primary focus:outline-none focus:border-[#3b82f6] focus:bg-white transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[13px] font-medium text-[#666666] mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwords.new}
                onChange={(e) => {
                  setPasswords({ ...passwords, new: e.target.value });
                  setHasChanges(true);
                }}
                className="w-full px-4 py-3 pr-12 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] text-primary focus:outline-none focus:border-[#3b82f6] focus:bg-white transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-[13px] font-medium text-[#666666] mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) => {
                  setPasswords({ ...passwords, confirm: e.target.value });
                  setHasChanges(true);
                }}
                className="w-full px-4 py-3 pr-12 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] text-primary focus:outline-none focus:border-[#3b82f6] focus:bg-white transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[#fef2f2] border border-[#fee2e2] rounded-lg">
              <p className="text-[13px] text-[#ef4444]">{error}</p>
            </div>
          )}

          {/* Forgot Password Link */}
          <div>
            <button
              type="button"
              className="text-[13px] text-[#3b82f6] hover:text-[#2563eb] font-medium"
            >
              Forgot your password?
            </button>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={changePassword.isPending}
            className="w-full px-4 py-3 bg-primary text-white rounded-lg text-[14px] font-medium hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
          >
            {changePassword.isPending ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
