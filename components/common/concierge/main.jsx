"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Send,
  Sparkles,
  Eye,
  Truck,
  CalendarDays,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    id: "visualize",
    label: "How AI Visualizer works?",
    Icon: Eye,
    highlight: true,
  },
  {
    id: "shipping",
    label: "Material shipping times",
    Icon: Truck,
    highlight: false,
  },
  {
    id: "designer",
    label: "Book a Designer",
    Icon: CalendarDays,
    highlight: false,
  },
];

const INITIAL_MESSAGE = {
  id: 1,
  role: "assistant",
  text: "Hello! I'm your TBM Concierge. How can I help you renovate your space today?",
  time: "TBM ASSISTANT · JUST NOW",
};

export default function TBMConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text) => {
    const msgText = text || input.trim();
    if (!msgText) return;
    setInput("");

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: msgText,
      time: "YOU · JUST NOW",
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "Thanks for reaching out! Our team will get back to you shortly. Feel free to explore our materials or use the AI Visualizer.",
          time: "TBM ASSISTANT · JUST NOW",
        },
      ]);
    }, 1400);
  };

  return (
    <>
      {/* ── Full-screen glossy white overlay when open ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Fixed container ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* ── Chat Panel ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col rounded-3xl overflow-hidden shadow-2xl"
              style={{
                width: "360px",
                background:
                  "linear-gradient(180deg, #1e2745 0%, #1a2340 30%, #18213d 100%)",
                maxHeight: "580px",
              }}
            >
              {/* ── Header ── */}
              <div
                className="flex items-center gap-3 px-5 py-4"
                style={{
                  background:
                    "linear-gradient(180deg, #1c2540 0%, #1a2340 100%)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Avatar circle */}
                <div className="relative shrink-0">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.10)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  {/* Green online dot */}
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400"
                    style={{ border: "2px solid #1a2340" }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white text-[15px] font-bold leading-tight tracking-tight">
                    TBM Concierge
                  </p>
                  <p className="text-white/45 text-[11px] font-medium">
                    Always active
                  </p>
                </div>

                {/* Minimize */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center text-white/35 hover:text-white/70 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center text-white/35 hover:text-white/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── Messages ── */}
              <div
                className="flex-1 overflow-y-auto px-5 py-5 space-y-4"
                style={{ minHeight: 0, scrollbarWidth: "none" }}
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {/* Avatar for assistant */}
                        {msg.role === "assistant" && (
                          <div
                            className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                            style={{
                              background: "rgba(255,255,255,0.10)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            {/* House/building icon matching screenshot */}
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
                                fill="white"
                                fillOpacity="0.85"
                              />
                            </svg>
                          </div>
                        )}

                        <div
                          className={`flex flex-col gap-1.5 ${
                            msg.role === "user"
                              ? "items-end max-w-[78%]"
                              : "items-start"
                          } ${msg.role === "assistant" ? "flex-1" : ""}`}
                        >
                          {/* Bubble */}
                          <div
                            className="px-4 py-3.5 text-[14px] leading-relaxed text-white"
                            style={
                              msg.role === "assistant"
                                ? {
                                    background: "rgba(255,255,255,0.09)",
                                    borderRadius: "4px 18px 18px 18px",
                                    maxWidth: "85%",
                                  }
                                : {
                                    background: "rgba(255,255,255,0.16)",
                                    borderRadius: "18px 4px 18px 18px",
                                  }
                            }
                          >
                            {msg.text}
                          </div>

                          {/* Timestamp */}
                          <span className="text-white/30 text-[9px] font-bold tracking-widest px-0.5">
                            {msg.time}
                          </span>
                        </div>
                      </div>

                      {/* Quick actions — OUTSIDE and BELOW the message row, left-aligned from avatar */}
                      {msg.id === 1 && msg.role === "assistant" && (
                        <div className="flex flex-col gap-2.5 mt-3 pl-12">
                          {QUICK_ACTIONS.map((action) =>
                            action.highlight ? (
                              /* Highlighted: plain blue text link style, no background box */
                              <motion.button
                                key={action.id}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleSend(action.label)}
                                className="flex items-center gap-2.5 text-[13.5px] font-medium text-left w-fit"
                                style={{ color: "#4a7cf5" }}
                              >
                                <Eye
                                  className="w-4 h-4 shrink-0"
                                  style={{ color: "#4a7cf5" }}
                                />
                                {action.label}
                              </motion.button>
                            ) : (
                              /* Normal: pill with subtle background, auto width */
                              <motion.button
                                key={action.id}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleSend(action.label)}
                                className="flex items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-medium text-left w-fit transition-all"
                                style={{
                                  background: "rgba(255,255,255,0.08)",
                                  border: "1px solid rgba(255,255,255,0.10)",
                                  color: "rgba(255,255,255,0.60)",
                                }}
                              >
                                <span
                                  className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                                  style={{
                                    background: "rgba(255,255,255,0.08)",
                                  }}
                                >
                                  <action.Icon
                                    className="w-3 h-3"
                                    style={{ color: "rgba(255,255,255,0.45)" }}
                                  />
                                </span>
                                {action.label}
                              </motion.button>
                            ),
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 pl-12"
                    >
                      <div
                        className="flex items-center gap-1 px-4 py-3 rounded-2xl"
                        style={{
                          background: "rgba(255,255,255,0.09)",
                          borderRadius: "4px 18px 18px 18px",
                        }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-white/50"
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              duration: 0.55,
                              repeat: Infinity,
                              delay: i * 0.14,
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* ── Input ── */}
              <div
                className="px-4 pb-5 pt-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="flex items-center gap-2 rounded-full px-4 py-2.5"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your question here..."
                    className="flex-1 bg-transparent text-white text-[13px] placeholder-white/30 outline-none"
                  />
                  {/* Send button — always filled blue per Figma */}
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => handleSend()}
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all"
                    style={{
                      background: "linear-gradient(135deg, #4a6cf7, #2a4fd4)",
                    }}
                  >
                    <Send
                      className="w-4 h-4 text-white"
                      style={{ transform: "translateX(1px)" }}
                    />
                  </motion.button>
                </div>

                <p className="text-center text-white/20 text-[9px] font-bold tracking-widest mt-2.5">
                  POWERED BY TBM NEURAL CORE
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom row: pill + FAB ── */}
        <div className="flex items-center gap-3">
          {/* "Need help?" pill */}
          <AnimatePresence>
            {!isOpen && (
              <motion.button
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-white rounded-full px-4 py-2.5 shadow-lg hover:shadow-xl transition-shadow"
              >
                <span
                  className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"
                  style={{ boxShadow: "0 0 0 3px rgba(52,211,153,0.25)" }}
                />
                <span className="text-[#1a2340] text-[12.5px] font-semibold whitespace-nowrap">
                  Need help? <span className="font-bold">Ask our AI</span>
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* FAB */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.06 }}
            onClick={() => setIsOpen((p) => !p)}
            className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #2a3560, #1a2340)",
            }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close-icon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="open-icon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Green status dot */}
            {!isOpen && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400"
                style={{ border: "2.5px solid white" }}
              />
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
}
