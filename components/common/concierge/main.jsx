"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  X,
  Minus,
  Send,
  Sparkles,
  Eye,
  Truck,
  CalendarDays,
  Check,
  AlertCircle,
  Play,
  ChevronDown,
  ChevronUp,
  LogIn,
} from "lucide-react";

// ── Check auth by hitting the /api/account/me proxy (returns 401 if not logged in)
function useIsAuthenticated() {
  const [isAuth, setIsAuth] = useState(null); // null = loading
  useEffect(() => {
    fetch("/api/account/me")
      .then((r) => setIsAuth(r.ok))
      .catch(() => setIsAuth(false));
  }, []);
  return isAuth;
}

// ── Quick actions shown under the first message ───────────────────────────────
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
  id: "init",
  role: "assistant",
  text: "Hello! I'm your TBM Concierge. How can I help you renovate your space today?",
  time: "TBM ASSISTANT · JUST NOW",
};

// ── Proxy API helpers (auth token handled server-side via cookies) ─────────────
async function proxyPost(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(text) };
  } catch {
    return { ok: res.ok, status: res.status, data: text };
  }
}

async function proxyGet(path) {
  const res = await fetch(path);
  const text = await res.text();
  try {
    return { ok: res.ok, data: JSON.parse(text) };
  } catch {
    return { ok: res.ok, data: text };
  }
}

async function proxyPatch(path, body) {
  const res = await fetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  try {
    return { ok: res.ok, data: JSON.parse(text) };
  } catch {
    return { ok: res.ok, data: text };
  }
}

// ── Task Card ─────────────────────────────────────────────────────────────────
function TaskCard({ task, onStatusChange }) {
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (status) => {
    setUpdating(true);
    await proxyPatch(`/api/assistant/tasks/${task.id}`, { status });
    onStatusChange?.(task.id, status);
    setUpdating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl px-4 py-3 text-[13px]"
      style={{
        background: "rgba(74,124,245,0.12)",
        border: "1px solid rgba(74,124,245,0.25)",
      }}
    >
      <p className="text-white/80 font-medium mb-2">
        {task.title || task.description}
      </p>
      {task.description && task.title && (
        <p className="text-white/45 text-[12px] mb-3">{task.description}</p>
      )}
      <div className="flex gap-2">
        <button
          disabled={updating || task.status === "completed"}
          onClick={() => handleStatus("completed")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
          style={{
            background:
              task.status === "completed"
                ? "rgba(52,211,153,0.2)"
                : "rgba(52,211,153,0.12)",
            border: "1px solid rgba(52,211,153,0.3)",
            color: "#34d399",
            opacity: updating ? 0.6 : 1,
          }}
        >
          <Check className="w-3 h-3" /> Done
        </button>
        <button
          disabled={updating || task.status === "dismissed"}
          onClick={() => handleStatus("dismissed")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.45)",
            opacity: updating ? 0.6 : 1,
          }}
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}

// ── Tool Action Card ──────────────────────────────────────────────────────────
function ToolActionCard({ action, onApprove, onExecute }) {
  const [approving, setApproving] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [approved, setApproved] = useState(action.approved ?? false);
  const [executed, setExecuted] = useState(false);

  const handleApprove = async () => {
    setApproving(true);
    const res = await proxyPost(
      `/api/assistant/tool-actions/${action.id}/approval`,
      {
        approve: true,
        reason: "User approved via chat",
      },
    );
    if (res.ok) {
      setApproved(true);
      onApprove?.(action.id);
    }
    setApproving(false);
  };

  const handleExecute = async () => {
    setExecuting(true);
    const res = await proxyPost(
      `/api/assistant/tool-actions/${action.id}/execute`,
      { dryRun: false },
    );
    if (res.ok) {
      setExecuted(true);
      onExecute?.(action.id, res.data);
    }
    setExecuting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl px-4 py-3 text-[13px]"
      style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="w-5 h-5 rounded flex items-center justify-center shrink-0"
          style={{ background: "rgba(74,124,245,0.2)" }}
        >
          <Play className="w-2.5 h-2.5" style={{ color: "#4a7cf5" }} />
        </span>
        <p className="text-white/80 font-semibold">
          {action.name || action.toolName}
        </p>
      </div>
      {action.description && (
        <p className="text-white/40 text-[11px] mb-3 pl-7">
          {action.description}
        </p>
      )}
      <div className="flex gap-2 pl-7">
        {!approved && !executed && (
          <button
            disabled={approving}
            onClick={handleApprove}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
            style={{
              background: "linear-gradient(135deg, #4a6cf7, #2a4fd4)",
              color: "white",
              opacity: approving ? 0.6 : 1,
            }}
          >
            {approving ? "Approving…" : "Approve"}
          </button>
        )}
        {approved && !executed && (
          <button
            disabled={executing}
            onClick={handleExecute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
            style={{
              background: "rgba(52,211,153,0.15)",
              border: "1px solid rgba(52,211,153,0.3)",
              color: "#34d399",
              opacity: executing ? 0.6 : 1,
            }}
          >
            <Play className="w-3 h-3" /> {executing ? "Running…" : "Execute"}
          </button>
        )}
        {executed && (
          <span
            className="flex items-center gap-1.5 text-[11px] font-semibold"
            style={{ color: "#34d399" }}
          >
            <Check className="w-3 h-3" /> Executed
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TBMConcierge() {
  const router = useRouter();
  const isAuth = useIsAuthenticated();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTasks, setShowTasks] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => inputRef.current?.focus(), 300);
    if (!sessionId) loadLatestSession();
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const loadLatestSession = async () => {
    const res = await proxyGet("/api/assistant/sessions");
    if (!res.ok) return;

    const sessions = Array.isArray(res.data)
      ? res.data
      : (res.data?.data ?? res.data?.sessions ?? []);

    if (sessions.length > 0) {
      const latest = sessions[0];
      const sid = latest.id ?? latest.sessionId;
      setSessionId(sid);
      await loadSession(sid);
    }
  };

  const loadSession = async (sid) => {
    const res = await proxyGet(`/api/assistant/sessions/${sid}`);
    if (!res.ok) return;

    const sessionData = res.data?.data ?? res.data;
    const history = sessionData?.messages ?? sessionData?.history ?? [];

    if (history.length > 0) {
      const mapped = history.map((m, i) => ({
        id: m.id ?? `hist-${i}`,
        role: m.role === "user" ? "user" : "assistant",
        text: m.content ?? m.text ?? m.message ?? "",
        time:
          m.role === "user"
            ? "YOU · " + formatTime(m.createdAt)
            : "TBM ASSISTANT · " + formatTime(m.createdAt),
        tasks: m.tasks ?? [],
        toolActions: m.toolActions ?? [],
      }));
      setMessages([INITIAL_MESSAGE, ...mapped]);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "JUST NOW";
    return new Date(ts)
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      .toUpperCase();
  };

  const handleSend = async (text) => {
    const msgText = text || input.trim();
    if (!msgText) return;

    // Block unauthenticated users
    if (!isAuth) {
      setShowAuthPrompt(true);
      return;
    }

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: msgText,
        time: "YOU · JUST NOW",
      },
    ]);
    setIsTyping(true);

    const res = await proxyPost("/api/assistant/message", {
      message: msgText,
      enableToolPlanning: true,
      ...(sessionId ? { sessionId } : {}),
    });

    setIsTyping(false);

    if (!res.ok) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "Sorry, I encountered an error. Please try again.",
          time: "TBM ASSISTANT · JUST NOW",
          isError: true,
        },
      ]);
      return;
    }

    const d = res.data?.data ?? res.data;

    console.log("[TBM Concierge] Parsed data:", d);

    if (d?.sessionId && !sessionId) setSessionId(d.sessionId);

    const replyText =
      d?.assistantReply ??
      d?.reply ??
      d?.message ??
      d?.response ??
      d?.content ??
      d?.text ??
      (typeof d === "string"
        ? d
        : "I received your message. How else can I assist?");

    const newTasks = d?.suggestedTasks ?? d?.tasks ?? [];
    const toolActions = d?.toolActions ?? d?.tool_actions ?? [];
    const links = d?.links ?? [];

    if (newTasks.length > 0) {
      setTasks((prev) => [...prev, ...newTasks]);
      setShowTasks(true);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `ai-${Date.now()}`,
        role: "assistant",
        text: replyText,
        time: "TBM ASSISTANT · JUST NOW",
        tasks: newTasks,
        toolActions,
        links,
      },
    ]);
  };

  const handleTaskStatusChange = useCallback((taskId, status) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t)),
    );
  }, []);

  const activeTasks = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "dismissed",
  );

  return (
    <>
      {/* Overlay */}
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

      {/* Fixed container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Chat Panel */}
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
                maxHeight: "600px",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 px-5 py-4 shrink-0"
                style={{
                  background:
                    "linear-gradient(180deg, #1c2540 0%, #1a2340 100%)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
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

                {activeTasks.length > 0 && (
                  <button
                    onClick={() => setShowTasks((p) => !p)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all"
                    style={{
                      background: "rgba(74,124,245,0.2)",
                      border: "1px solid rgba(74,124,245,0.3)",
                      color: "#7aa3f8",
                    }}
                  >
                    {activeTasks.length} task
                    {activeTasks.length !== 1 ? "s" : ""}
                    {showTasks ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center text-white/35 hover:text-white/70 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center text-white/35 hover:text-white/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks Panel */}
              <AnimatePresence>
                {showTasks && activeTasks.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden shrink-0"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="px-4 py-3 space-y-2">
                      <p className="text-white/40 text-[9px] font-bold tracking-widest mb-2">
                        SUGGESTED TASKS
                      </p>
                      {activeTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStatusChange={handleTaskStatusChange}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
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
                        {msg.role === "assistant" && (
                          <div
                            className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                            style={{
                              background: "rgba(255,255,255,0.10)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
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
                          <div
                            className="px-4 py-3.5 text-[14px] leading-relaxed text-white"
                            style={
                              msg.role === "assistant"
                                ? {
                                    background: msg.isError
                                      ? "rgba(239,68,68,0.12)"
                                      : "rgba(255,255,255,0.09)",
                                    borderRadius: "4px 18px 18px 18px",
                                    maxWidth: "85%",
                                    border: msg.isError
                                      ? "1px solid rgba(239,68,68,0.25)"
                                      : "none",
                                  }
                                : {
                                    background: "rgba(255,255,255,0.16)",
                                    borderRadius: "18px 4px 18px 18px",
                                  }
                            }
                          >
                            {msg.isError && (
                              <AlertCircle className="w-3.5 h-3.5 inline mr-1.5 mb-0.5 text-red-400" />
                            )}
                            {msg.text}
                          </div>
                          <span className="text-white/30 text-[9px] font-bold tracking-widest px-0.5">
                            {msg.time}
                          </span>
                        </div>
                      </div>

                      {/* Quick actions under initial message */}
                      {msg.id === "init" && (
                        <div className="flex flex-col gap-2.5 mt-3 pl-12">
                          {QUICK_ACTIONS.map((action) =>
                            action.highlight ? (
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

                      {/* Tool actions from this message */}
                      {msg.toolActions?.length > 0 && (
                        <div className="flex flex-col gap-2 mt-3 pl-12">
                          {msg.toolActions.map((action) => (
                            <ToolActionCard key={action.id} action={action} />
                          ))}
                        </div>
                      )}

                      {/* Tasks from this message */}
                      {msg.tasks?.length > 0 && (
                        <div className="flex flex-col gap-2 mt-3 pl-12">
                          {msg.tasks.map((task) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              onStatusChange={handleTaskStatusChange}
                            />
                          ))}
                        </div>
                      )}

                      {/* Link chips from this message */}
                      {msg.links?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pl-12">
                          {msg.links.map((link, i) => (
                            <motion.a
                              key={i}
                              href={link.url}
                              whileTap={{ scale: 0.96 }}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                              style={{
                                background: "rgba(74,108,247,0.15)",
                                border: "1px solid rgba(74,108,247,0.30)",
                                color: "#7aa3f8",
                                textDecoration: "none",
                              }}
                            >
                              {link.label}
                            </motion.a>
                          ))}
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
                        className="flex items-center gap-1 px-4 py-3"
                        style={{
                          borderRadius: "4px 18px 18px 18px",
                          background: "rgba(255,255,255,0.09)",
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

              {/* Input */}
              <div
                className="px-4 pb-5 pt-3 shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Auth prompt — shown when unauthenticated user tries to send */}
                <AnimatePresence>
                  {showAuthPrompt && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.22 }}
                      className="mb-3 rounded-2xl px-4 py-3.5 flex flex-col gap-3"
                      style={{
                        background: "rgba(74,108,247,0.13)",
                        border: "1px solid rgba(74,108,247,0.28)",
                      }}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                          style={{ background: "rgba(74,108,247,0.25)" }}
                        >
                          <LogIn
                            className="w-3.5 h-3.5"
                            style={{ color: "#7aa3f8" }}
                          />
                        </div>
                        <div>
                          <p className="text-white text-[13px] font-semibold leading-snug">
                            Sign in to chat
                          </p>
                          <p className="text-white/45 text-[12px] mt-0.5 leading-snug">
                            You need to be logged in to send messages to TBM
                            Concierge.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pl-9">
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={() => router.push("/sign-in")}
                          className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold"
                          style={{
                            background:
                              "linear-gradient(135deg, #4a6cf7, #2a4fd4)",
                            color: "white",
                          }}
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          Log in
                        </motion.button>
                        <button
                          onClick={() => setShowAuthPrompt(false)}
                          className="text-[11px] font-medium px-2 py-1"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                    onKeyDown={(e) =>
                      e.key === "Enter" && !isTyping && handleSend()
                    }
                    placeholder="Type your question here..."
                    disabled={isTyping}
                    className="flex-1 bg-transparent text-white text-[13px] placeholder-white/30 outline-none disabled:opacity-50"
                  />
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => handleSend()}
                    disabled={isTyping || !input.trim()}
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all"
                    style={{
                      background:
                        input.trim() && !isTyping
                          ? "linear-gradient(135deg, #4a6cf7, #2a4fd4)"
                          : "rgba(74,108,247,0.4)",
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

        {/* Bottom row: pill + FAB */}
        <div className="flex items-center gap-3">
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

          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.06 }}
            onClick={() => setIsOpen((p) => !p)}
            className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2a3560, #1a2340)" }}
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
