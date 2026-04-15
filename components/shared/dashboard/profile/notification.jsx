// components/shared/dashboard/profile/notification.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Smartphone, Loader2 } from "lucide-react";
import { useNotifications, useUpdateNotifications } from "@/hooks/use-profile";
import { showToast } from "@/components/shared/toast";

const DEFAULT_PREFS = {
  emailOrderUpdates: true,
  emailPromotions: false,
  pushOrderUpdates: true,
  pushMarketing: false,
};

export default function NotificationPreferences() {
  const { data: notifData, isLoading } = useNotifications();
  const updateNotifications = useUpdateNotifications();

  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (notifData) {
      setPrefs({
        emailOrderUpdates: notifData.emailOrderUpdates ?? true,
        emailPromotions: notifData.emailPromotions ?? false,
        pushOrderUpdates: notifData.pushOrderUpdates ?? true,
        pushMarketing: notifData.pushMarketing ?? false,
      });
    }
  }, [notifData]);

  const toggle = (key) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    setIsDirty(true);
  };

  const handleSave = () => {
    updateNotifications.mutate(prefs, {
      onSuccess: () => {
        showToast.success({ title: "Saved", message: "Notification preferences updated." });
        setIsDirty(false);
      },
      onError: (err) => showToast.error({ title: "Error", message: err.message }),
    });
  };

  if (isLoading) return <NotifSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-white/08 p-6 space-y-6"
      style={{ background: "#0d0b08" }}
    >
      <div>
        <h2 className="text-[18px] font-semibold text-white">Notification Preferences</h2>
        <p className="text-[13px] text-white/40 mt-0.5">Choose what updates you want to receive.</p>
      </div>

      {/* Email Notifications */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="w-4 h-4 text-white/30" />
          <p className="text-[13px] font-semibold text-white/30 uppercase tracking-widest">Email</p>
        </div>
        <NotifRow
          label="Order Updates"
          description="Shipping confirmations, delivery status, and order changes."
          enabled={prefs.emailOrderUpdates}
          onToggle={() => toggle("emailOrderUpdates")}
        />
        <NotifRow
          label="Promotions & Offers"
          description="Sales, discounts, and featured products."
          enabled={prefs.emailPromotions}
          onToggle={() => toggle("emailPromotions")}
        />
      </div>

      <div className="h-px bg-white/06" />

      {/* Push Notifications */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Smartphone className="w-4 h-4 text-white/30" />
          <p className="text-[13px] font-semibold text-white/30 uppercase tracking-widest">Push</p>
        </div>
        <NotifRow
          label="Order Updates"
          description="Real-time push notifications for your orders."
          enabled={prefs.pushOrderUpdates}
          onToggle={() => toggle("pushOrderUpdates")}
        />
        <NotifRow
          label="Marketing & Promotions"
          description="New arrivals, trending materials, and special offers."
          enabled={prefs.pushMarketing}
          onToggle={() => toggle("pushMarketing")}
        />
      </div>

      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end pt-2 border-t border-white/06"
        >
          <button
            onClick={handleSave}
            disabled={updateNotifications.isPending}
            className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
          >
            {updateNotifications.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {updateNotifications.isPending ? "Saving..." : "Save Preferences"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function NotifRow({ label, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/04 last:border-0">
      <div>
        <p className="text-[14px] font-medium text-white">{label}</p>
        <p className="text-[12px] text-white/35 mt-0.5">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className="relative w-12 h-6 rounded-full shrink-0 transition-colors duration-200 focus:outline-none"
        style={{ background: enabled ? "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" : "rgba(255,255,255,0.12)" }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

function NotifSkeleton() {
  return (
    <div className="rounded-2xl border border-white/08 p-6 space-y-6 animate-pulse" style={{ background: "#0d0b08" }}>
      <div className="h-5 w-48 bg-white/06 rounded" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="space-y-1.5">
              <div className="h-3.5 w-32 bg-white/06 rounded" />
              <div className="h-3 w-56 bg-white/06 rounded" />
            </div>
            <div className="w-12 h-6 bg-white/06 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
