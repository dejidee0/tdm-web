// components/shared/toast.jsx
"use client";

import { motion } from "framer-motion";
import { Check, X, AlertCircle, Info, AlertTriangle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// ─── Animation variants ────────────────────────────────────────────────────────

const variants = {
  initial: { opacity: 0, y: -24, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hidden: { opacity: 0, y: -14, scale: 0.96 },
};

const transition = { duration: 0.42, ease: [0.16, 1, 0.3, 1] };

// ─── Config per type ───────────────────────────────────────────────────────────

const CONFIG = {
  success: {
    icon: Check,
    iconClass: "text-primary stroke-[2.5]",
    iconBg: "bg-primary/10",
    border: "border-primary/25",
    accentBar: "bg-primary",
  },
  error: {
    icon: AlertCircle,
    iconClass: "text-red-500 stroke-[2.5]",
    iconBg: "bg-red-50",
    border: "border-red-200",
    accentBar: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500 stroke-[2.5]",
    iconBg: "bg-amber-50",
    border: "border-amber-200",
    accentBar: "bg-amber-400",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-500 stroke-[2.5]",
    iconBg: "bg-blue-50",
    border: "border-blue-200",
    accentBar: "bg-blue-500",
  },
};

// ─── Base Toast ────────────────────────────────────────────────────────────────

function BaseToast({ t, type = "success", title, message }) {
  const cfg = CONFIG[type];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial="initial"
      animate={t.visible ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
      role="alert"
      aria-live="assertive"
      className={`
        relative flex items-start gap-4 overflow-hidden
        bg-white border ${cfg.border}
        shadow-[0_12px_40px_rgba(0,0,0,0.12)]
        rounded-2xl
        pl-5 pr-4 py-4
        w-[360px] max-w-[calc(100vw-32px)]
      `}
    >
      {/* Left accent bar */}
      <span
        className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.accentBar} rounded-l-2xl`}
      />

      {/* Icon */}
      <span
        className={`shrink-0 mt-0.5 w-10 h-10 rounded-full ${cfg.iconBg} flex items-center justify-center`}
      >
        <Icon className={`w-5 h-5 ${cfg.iconClass}`} />
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        {title && (
          <p className="text-[15px] font-bold text-gray-900 leading-tight tracking-[-0.01em]">
            {title}
          </p>
        )}
        {message && (
          <p
            className={`text-[13.5px] text-gray-500 leading-snug ${
              title ? "mt-0.5" : "text-[15px] font-semibold text-gray-800"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={() => toast.dismiss(t.id)}
        aria-label="Dismiss notification"
        className="shrink-0 mt-0.5 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </motion.div>
  );
}

// ─── Toaster Provider ──────────────────────────────────────────────────────────
// Drop <TBMToaster /> once in your layout — it handles positioning & stacking

export function TBMToaster() {
  return (
    <Toaster
      position="top-center"
      containerStyle={{ zIndex: 9999, top: 20 }}
      gutter={10}
      toastOptions={{ duration: Infinity }}
    />
  );
}

// ─── Exported helper functions ─────────────────────────────────────────────────

const DURATIONS = { success: 3500, error: 4500, warning: 4000, info: 3500 };

function fire(type, titleOrOptions, message) {
  // Supports two call signatures:
  //   showToast.success("Simple message")
  //   showToast.success({ title: "Done!", message: "Item added to cart." })
  const isObj = typeof titleOrOptions === "object" && titleOrOptions !== null;
  const title = isObj ? titleOrOptions.title : titleOrOptions;
  const body = isObj ? titleOrOptions.message : message;

  return toast.custom(
    (t) => <BaseToast t={t} type={type} title={title} message={body} />,
    { duration: DURATIONS[type], position: "top-center" },
  );
}

export const showToast = {
  success: (titleOrOptions, message) =>
    fire("success", titleOrOptions, message),
  error: (titleOrOptions, message) => fire("error", titleOrOptions, message),
  warning: (titleOrOptions, message) =>
    fire("warning", titleOrOptions, message),
  info: (titleOrOptions, message) => fire("info", titleOrOptions, message),
  dismiss: (id) => toast.dismiss(id),
  dismissAll: () => toast.dismiss(),
};
