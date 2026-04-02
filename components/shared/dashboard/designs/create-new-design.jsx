"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { useDashboardUser } from "@/hooks/use-user-dashboard";

export default function CreateNewDesignModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("text-to-image");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useDashboardUser();
  const firstName = user?.firstName || "there";

  const tabs = [
    { id: "text-to-image", label: "TEXT TO IMAGE" },
    { id: "image-to-image", label: "IMAGE TO IMAGE" },
    { id: "image-to-video", label: "IMAGE TO VIDEO" },
  ];

  const handleCreate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    try {
      console.log("Creating design:", { tab: activeTab, prompt });
      // replace with real async call
      await new Promise((r) => setTimeout(r, 1500));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Enter") handleCreate();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, prompt, activeTab, loading]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Wrapper — bottom sheet on mobile, centered on sm+ */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none sm:px-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 48 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden"
              style={{ maxHeight: "92dvh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Drag handle (mobile only) ── */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>

              {/* ── Tab Bar ── */}
              <div className="flex items-center border-b border-gray-200 px-4 sm:px-8 pt-3 sm:pt-6">
                {/* Invisible spacer mirrors the close button width so tabs stay centred */}
                <div className="w-7 shrink-0" />

                {/* Tabs — centered, horizontally scrollable if they overflow */}
                <div className="flex-1 flex items-center justify-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative pb-3 text-[10px] sm:text-[11px] font-extrabold tracking-widest whitespace-nowrap transition-colors duration-200 ${
                        activeTab === tab.id
                          ? "text-[#1a2340]"
                          : "text-[#b0b8c9] hover:text-[#8890a0]"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="tab-underline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                          style={{ backgroundColor: "#1a2340" }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 38,
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="w-7 h-7 shrink-0 flex items-center justify-center mb-3 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── Body ── */}
              <div className="flex flex-col flex-1 px-4 sm:px-8 font-poppins overflow-y-auto">
                {/* Greeting */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className="flex-1 flex flex-col items-center justify-center text-center py-8 sm:py-10"
                >
                  <h2
                    className="font-bold font-poppins leading-tight mb-2 text-primary text-2xl sm:text-[28px]"
                    style={{ letterSpacing: "-0.3px" }}
                  >
                    Hey, {firstName}.
                  </h2>
                  <p className="font-semibold mb-2 text-primary text-base sm:text-[17px]">
                    What shall we build today?
                  </p>
                  <p className="text-[13px] sm:text-[13.5px] text-primary/70">
                    Start typing your vision or upload a reference.
                  </p>
                </motion.div>

                {/* ── Input Row ── */}
                <div className="pb-5 sm:pb-6">
                  <div
                    className="flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-1 transition-all duration-200"
                    style={{
                      border: `1.5px solid ${loading ? "#1a2340" : "#e5e8ef"}`,
                      boxShadow: loading
                        ? "0 0 0 3px rgba(26,35,64,0.12)"
                        : "none",
                    }}
                  >
                    {/* Plus button — hidden for text-to-image */}
                    {activeTab !== "text-to-image" && (
                      <>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="shrink-0 w-9 h-9 rounded-lg shadow flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/*"
                        />
                      </>
                    )}

                    {/* Text input */}
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      placeholder="Describe your dream space..."
                      className="flex-1 min-w-0 text-[14px] placeholder-gray-400 outline-none bg-transparent py-2.5"
                      style={{ color: "#1a2340" }}
                    />

                    {/* Create button */}
                    <motion.button
                      whileTap={loading ? {} : { scale: 0.97 }}
                      onClick={handleCreate}
                      disabled={loading}
                      className="shrink-0 text-white text-[13px] sm:text-[13.5px] font-semibold px-4 sm:px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#1a2340" }}
                      onMouseEnter={(e) => {
                        if (!loading)
                          e.currentTarget.style.backgroundColor = "#273054";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#1a2340";
                      }}
                    >
                      {loading && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      {loading ? "Creating…" : "Create"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
