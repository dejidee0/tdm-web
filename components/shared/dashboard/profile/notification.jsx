// components/dashboard/profile/NotificationPreferences.jsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUpdateNotifications, useDeleteAccount } from "@/hooks/use-profile";

export default function NotificationPreferences({
  profile,
  isLoading,
  setHasChanges,
}) {
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    designConsultations: true,
    promotionsInspiration: false,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const updateNotifications = useUpdateNotifications();
  const deleteAccount = useDeleteAccount();

  useEffect(() => {
    if (profile?.notifications) {
      setNotifications(profile.notifications);
    }
  }, [profile]);

  const handleToggle = (key) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    updateNotifications.mutate(newNotifications);
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
      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
        <h3 className="text-[18px] font-semibold text-primary mb-6">
          Notification Preferences
        </h3>

        <div className="space-y-5">
          {/* Order Updates */}
          <NotificationToggle
            title="Order Updates"
            description="Receive updates about your delivery status and tracking information"
            checked={notifications.orderUpdates}
            onChange={() => handleToggle("orderUpdates")}
          />

          {/* Design Consultations */}
          <NotificationToggle
            title="Design Consultations"
            description="Stay up-to-date on upcoming video calls with designers"
            checked={notifications.designConsultations}
            onChange={() => handleToggle("designConsultations")}
          />

          {/* Promotions & Inspiration */}
          <NotificationToggle
            title="Promotions & Inspiration"
            description="Get the latest deals, tips and new offers"
            checked={notifications.promotionsInspiration}
            onChange={() => handleToggle("promotionsInspiration")}
          />
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-[#ef4444] mb-2">
              Delete Account
            </h3>
            <p className="text-[13px] text-[#666666] max-w-lg">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-[#fef2f2] text-[#ef4444] rounded-lg text-[13px] font-medium hover:bg-[#fee2e2] transition-colors"
          >
            Discard
          </button>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setHasChanges(false)}
          className="px-6 py-3 bg-white border border-[#e5e5e5] text-primary rounded-lg text-[14px] font-medium hover:bg-[#f8f8f8] transition-colors"
        >
          Discard
        </button>
        <button className="px-6 py-3 bg-primary text-white rounded-lg text-[14px] font-medium hover:bg-[#2a2a2a] transition-colors">
          Save Changes
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={(password) => {
            deleteAccount.mutate(password, {
              onSuccess: () => {
                alert("Account deleted successfully");
                // Redirect to login or home
              },
            });
          }}
        />
      )}
    </motion.div>
  );
}

function NotificationToggle({ title, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-[#f0f0f0] last:border-0">
      <div className="flex-1 pr-4">
        <h4 className="text-[15px] font-medium text-primary mb-1">{title}</h4>
        <p className="text-[13px] text-[#666666] leading-relaxed">
          {description}
        </p>
      </div>
      <button
        onClick={onChange}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2
          ${checked ? "bg-primary" : "bg-[#d4d4d4]"}
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}

function DeleteAccountModal({ onClose, onConfirm }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(password);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl p-6 max-w-md w-full"
      >
        <h3 className="text-[20px] font-semibold text-[#ef4444] mb-2">
          Delete Account?
        </h3>
        <p className="text-[14px] text-[#666666] mb-6">
          This action cannot be undone. All your data, orders, designs, and
          saved items will be permanently deleted.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#666666] mb-2">
              Enter your password to confirm
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#f8f8f8] border border-transparent rounded-lg text-[14px] focus:outline-none focus:border-[#ef4444] focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#f5f5f5] text-primary rounded-lg text-[14px] font-medium hover:bg-[#e5e5e5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#ef4444] text-white rounded-lg text-[14px] font-medium hover:bg-[#dc2626] transition-colors"
            >
              Delete Account
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
      <div className="animate-pulse space-y-5">
        <div className="h-6 bg-gray-200 rounded w-48" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="w-11 h-6 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
