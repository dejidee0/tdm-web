"use client";

import { motion } from "framer-motion";

export default function NotificationCard({ notification, index }) {
  const isRead = notification.isRead;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        relative rounded-xl px-6 py-3 max-w-[70%] mx-auto transition-all
        ${
          isRead
            ? "bg-[#475569] text-white"
            : "bg-white border-l-4 hover:shadow-md"
        }
      `}
      style={{
        borderLeftColor: isRead ? "transparent" : notification.borderColor,
      }}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: isRead
              ? "rgba(255, 255, 255, 0.1)"
              : notification.iconBg,
          }}
        >
          <span className="text-[24px]">{notification.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`
                  px-2.5 py-1 rounded font-manrope text-[10px] font-bold uppercase tracking-wider
                  ${
                    isRead
                      ? "bg-white/20 text-white"
                      : notification.badgeColor === "cyan"
                        ? "bg-[#CFFAFE] text-[#0E7490]"
                        : notification.badgeColor === "amber"
                          ? "bg-[#FEF3C7] text-[#92400E]"
                          : notification.badgeColor === "blue"
                            ? "bg-[#DBEAFE] text-[#1E40AF]"
                            : notification.badgeColor === "green"
                              ? "bg-[#D1FAE5] text-[#065F46]"
                              : "bg-[#F1F5F9] text-[#64748B]"
                  }
                `}
              >
                {notification.badge}
              </span>
              <span
                className={`
                  flex items-center gap-1.5 font-manrope text-[12px]
                  ${isRead ? "text-white/70" : "text-[#64748B]"}
                `}
              >
                <span className="w-1 h-1 rounded-full bg-current" />
                {notification.timestamp}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3
            className={`
              font-manrope text-[16px] font-bold mb-2
              ${isRead ? "text-white" : "text-[#1E293B]"}
            `}
          >
            {notification.title}
          </h3>

          {/* Message */}
          <p
            className={`
              font-manrope text-[14px] mb-4 leading-relaxed
              ${isRead ? "text-white/80" : "text-[#64748B]"}
            `}
          >
            {notification.message}
          </p>

          {/* Actions */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              {notification.actions.map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    font-manrope text-[13px] font-medium underline
                    ${isRead ? "text-white hover:text-white/90" : "text-[#3B82F6] hover:text-[#2563EB]"}
                  `}
                >
                  {action}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
