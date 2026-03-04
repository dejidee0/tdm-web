"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { X, Plus } from "lucide-react";

export default function CreateNewDesignModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("text-to-image");
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef(null);

  const tabs = [
    { id: "text-to-image", label: "TEXT TO IMAGE" },
    { id: "image-to-image", label: "IMAGE TO IMAGE" },
    { id: "image-to-video", label: "IMAGE TO VIDEO" },
  ];

  const handleCreate = () => {
    if (!prompt.trim()) return;
    console.log("Creating design:", { tab: activeTab, prompt });
  };
  // Temporarily add this to CreateNewCard to verify the prop arrives

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
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4"
          >
            <div
              className="bg-white rounded-2xl w-full max-w-180 overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
              style={{ minHeight: "420px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Tab Bar ── */}
              <div className="flex items-center border-b border-gray-200 px-8 pt-6 relative">
                {/* Centered tabs */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative pb-3 text-[11px] font-extrabold tracking-widest whitespace-nowrap transition-colors duration-200 ${
                        activeTab === tab.id
                          ? "text-[#1a2340]"
                          : "text-[#b0b8c9] hover:text-[#8890a0]"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="tab-underline"
                          className="absolute bottom-0 left-0 right-0 h-0.75 rounded-full"
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

                {/* Close button pinned far right */}
                <button
                  onClick={onClose}
                  className="ml-auto mb-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* ── Body ── */}
              <div className="flex flex-col flex-1 px-8 font-poppins">
                {/* Greeting — vertically centered in the space above the input */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className="flex-1 flex flex-col items-center justify-center text-center py-10"
                >
                  <h2
                    className="font-bold font-poppins leading-tight mb-2 text-primary "
                    style={{
                      fontSize: "28px",

                      letterSpacing: "-0.3px",
                    }}
                  >
                    Hey, Jenny.
                  </h2>
                  <p
                    className="font-semibold mb-2 text-primary"
                    style={{ fontSize: "17px" }}
                  >
                    What shall we build today?
                  </p>
                  <p style={{ fontSize: "13.5px" }} className="text-primary/70">
                    Start typing your vision or upload a reference.
                  </p>
                </motion.div>

                {/* ── Input Row — flush to bottom ── */}
                <div className="pb-6">
                  <div
                    className="flex items-center gap-3 rounded-xl  px-4 py-1"
                    style={{ border: "1.5px solid #e5e8ef" }}
                  >
                    {/* Plus button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="shrink-0 w-8 h-8 rounded-lg shadow flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                    />

                    {/* Text input */}
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      placeholder="Describe your dream space..."
                      className="flex-1 text-[14px] placeholder-gray-400 outline-none bg-transparent"
                      style={{ color: "#1a2340" }}
                    />

                    {/* Create button */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleCreate}
                      className="shrink-0 text-white text-[13.5px] font-semibold px-6 py-2.5 rounded-xl transition-colors"
                      style={{ backgroundColor: "#1a2340" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#273054")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1a2340")
                      }
                    >
                      Create
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
