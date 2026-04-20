"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  X,
  Send,
  Eye,
  Truck,
  CalendarDays,
  Check,
  AlertCircle,
  Play,
  LogIn,
  SquarePen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ── Auth check ────────────────────────────────────────────────────────────────
function useIsAuthenticated() {
  const [isAuth, setIsAuth] = useState(null);
  useEffect(() => {
    fetch("/api/account/me")
      .then((r) => setIsAuth(r.ok))
      .catch(() => setIsAuth(false));
  }, []);
  return isAuth;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { id: "visualize", label: "How Ziora works", Icon: Eye },
  { id: "shipping",  label: "Shipping times",  Icon: Truck },
  { id: "designer",  label: "Book a designer", Icon: CalendarDays },
];

const INITIAL_MESSAGE = {
  id: "init",
  role: "assistant",
  text: "Hi! I'm Ziora, your TBM design assistant. Describe your dream space and I'll help bring it to life.",
  ts: null,
};

// ── Proxy helpers ─────────────────────────────────────────────────────────────
async function proxyPost(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, status: res.status, data: text }; }
}

async function proxyGet(path) {
  const res = await fetch(path);
  const text = await res.text();
  try { return { ok: res.ok, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, data: text }; }
}

async function proxyPatch(path, body) {
  const res = await fetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  try { return { ok: res.ok, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, data: text }; }
}

async function proxyDelete(path) {
  const res = await fetch(path, { method: "DELETE" });
  const text = await res.text();
  try { return { ok: res.ok, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, data: text }; }
}

// ── Bubble border-radius — first message in group gets the "tail" ─────────────
function getBubbleRadius(role, isFirst) {
  if (!isFirst) return "16px";
  return role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px";
}

// ── Task Card ─────────────────────────────────────────────────────────────────
function TaskCard({ task, onStatusChange }) {
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (status) => {
    const tid = task.id ?? task.taskId;
    setUpdating(true);
    await proxyPatch(`/api/assistant/tasks/${tid}`, { status });
    onStatusChange?.(tid, status);
    setUpdating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl px-3.5 py-3"
      style={{
        background: "rgba(212,175,55,0.07)",
        border: "1px solid rgba(212,175,55,0.16)",
      }}
    >
      <p className="text-white/80 text-[13px] font-medium mb-2">
        {task.title || task.description}
      </p>
      {task.description && task.title && (
        <p className="text-white/40 text-[12px] mb-2.5">{task.description}</p>
      )}
      <div className="flex gap-2">
        <button
          disabled={updating || task.status === "completed"}
          onClick={() => handleStatus("completed")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-opacity"
          style={{
            background: task.status === "completed" ? "rgba(52,211,153,0.18)" : "rgba(52,211,153,0.10)",
            border: "1px solid rgba(52,211,153,0.25)",
            color: "#34d399",
            opacity: updating ? 0.5 : 1,
          }}
        >
          <Check className="w-3 h-3" /> Done
        </button>
        <button
          disabled={updating || task.status === "dismissed"}
          onClick={() => handleStatus("dismissed")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-opacity"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "rgba(255,255,255,0.38)",
            opacity: updating ? 0.5 : 1,
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
    const aid = action.id ?? action.actionId;
    const res = await proxyPost(`/api/assistant/tool-actions/${aid}/approval`, {
      approve: true, reason: "User approved via chat",
    });
    if (res.ok) { setApproved(true); onApprove?.(aid); }
    setApproving(false);
  };

  const handleExecute = async () => {
    const aid = action.id ?? action.actionId;
    setExecuting(true);
    const res = await proxyPost(`/api/assistant/tool-actions/${aid}/execute`, { dryRun: false });
    if (res.ok) { setExecuted(true); onExecute?.(aid, res.data); }
    setExecuting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl px-3.5 py-3"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
          style={{ background: "rgba(212,175,55,0.15)" }}
        >
          <Play className="w-2.5 h-2.5" style={{ color: "#D4AF37" }} />
        </span>
        <p className="text-white/80 text-[13px] font-semibold">
          {(action.name || action.toolName || "")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())}
        </p>
      </div>
      {action.description && (
        <p className="text-white/35 text-[11px] mb-3 pl-7">{action.description}</p>
      )}
      <div className="flex gap-2 pl-7">
        {!approved && !executed && (
          <button
            disabled={approving}
            onClick={handleApprove}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold text-black transition-opacity cursor-pointer"
            style={{ background: "linear-gradient(135deg, #D4AF37, #b8962e)", opacity: approving ? 0.6 : 1 }}
          >
            {approving ? "Approving…" : "Approve"}
          </button>
        )}
        {approved && !executed && (
          <button
            disabled={executing}
            onClick={handleExecute}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-opacity cursor-pointer"
            style={{
              background: "rgba(52,211,153,0.12)",
              border: "1px solid rgba(52,211,153,0.28)",
              color: "#34d399",
              opacity: executing ? 0.6 : 1,
            }}
          >
            <Play className="w-3 h-3" /> {executing ? "Running…" : "Execute"}
          </button>
        )}
        {executed && (
          <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#34d399" }}>
            <Check className="w-3 h-3" /> Executed
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── Inline markdown renderer (bold + bullet lists + line breaks) ──────────────
function renderInline(str) {
  const parts = str.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold" style={{ color: "rgba(255,255,255,0.95)" }}>{part}</strong>
      : part
  );
}

function MessageContent({ text }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-0.5" />;

        if (trimmed.startsWith("•")) {
          const content = trimmed.slice(1).trim();
          return (
            <div key={i} className="flex gap-2 items-start leading-relaxed">
              <span
                className="shrink-0 mt-0.75 w-1.5 h-1.5 rounded-full"
                style={{ background: "#D4AF37", minWidth: "6px" }}
              />
              <span>{renderInline(content)}</span>
            </div>
          );
        }

        return (
          <p key={i} className="leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TBMConcierge() {
  const router = useRouter();
  const isAuth = useIsAuthenticated();
  const [isOpen, setIsOpen]             = useState(false);
  const [messages, setMessages]         = useState([INITIAL_MESSAGE]);
  const [input, setInput]               = useState("");
  const [isTyping, setIsTyping]         = useState(false);
  const [sessionId, setSessionId]       = useState(null);
  const [tasks, setTasks]               = useState([]);
  const [showTasks, setShowTasks]       = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  const formatTime = (ts) => {
    if (!ts) return null;
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Enrich messages with group positioning flags
  const enrichedMessages = useMemo(() =>
    messages.map((msg, i) => ({
      ...msg,
      isFirstInGroup: i === 0 || messages[i - 1].role !== msg.role,
      isLastInGroup:  i === messages.length - 1 || messages[i + 1].role !== msg.role,
    })),
  [messages]);

  // ── Session loaders ───────────────────────────────────────────────────────
  const loadSession = useCallback(async (sid) => {
    const res = await proxyGet(`/api/assistant/sessions/${sid}`);
    if (!res.ok) return;
    const sessionData = res.data?.data ?? res.data;
    const history = sessionData?.messages ?? sessionData?.history ?? [];
    if (history.length > 0) {
      const mapped = history.map((m, i) => ({
        id: m.id ?? `hist-${i}`,
        role: m.role === "user" ? "user" : "assistant",
        text: m.content ?? m.text ?? m.message ?? "",
        ts: m.createdAt ?? null,
        tasks: m.tasks ?? [],
        toolActions: m.toolActions ?? [],
        links: m.links ?? [],
      }));
      setMessages([INITIAL_MESSAGE, ...mapped]);
    }
  }, []);

  const loadLatestSession = useCallback(async () => {
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
  }, [loadSession]);

  // ── Open / clear ──────────────────────────────────────────────────────────
  const handleOpen = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev && !sessionId) loadLatestSession();
      return !prev;
    });
  }, [sessionId, loadLatestSession]);

  const handleClearChat = useCallback(async () => {
    if (sessionId) await proxyDelete(`/api/assistant/sessions/${sessionId}`);
    setSessionId(null);
    setMessages([INITIAL_MESSAGE]);
    setTasks([]);
    setShowTasks(false);
  }, [sessionId]);

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = async (text) => {
    const msgText = text || input.trim();
    if (!msgText) return;
    if (!isAuth) { setShowAuthPrompt(true); return; }

    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text: msgText, ts: new Date().toISOString() },
    ]);
    setIsTyping(true);

    const res = await proxyPost("/api/assistant/message", {
      message: msgText,
      enableToolPlanning: true,
      ...(sessionId ? { sessionId } : {}),
    });

    setIsTyping(false);

    if (!res.ok) {
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        role: "assistant",
        text: "Sorry, I encountered an error. Please try again.",
        ts: new Date().toISOString(),
        isError: true,
      }]);
      return;
    }

    const d = res.data?.data ?? res.data;
    if (d?.sessionId && !sessionId) setSessionId(d.sessionId);

    const replyText =
      d?.assistantReply ?? d?.reply ?? d?.message ?? d?.response ??
      d?.content ?? d?.text ??
      (typeof d === "string" ? d : "I received your message. How else can I assist?");

    const newTasks    = d?.suggestedTasks ?? d?.tasks ?? [];
    const toolActions = d?.toolActions ?? d?.tool_actions ?? [];
    const links       = d?.links ?? [];

    const standaloneTasks = newTasks.filter((t) => !t.toolActionId);
    if (standaloneTasks.length > 0) { setTasks((prev) => [...prev, ...standaloneTasks]); setShowTasks(true); }

    setMessages((prev) => [...prev, {
      id: `ai-${Date.now()}`,
      role: "assistant",
      text: replyText,
      ts: new Date().toISOString(),
      tasks: newTasks,
      toolActions,
      links,
    }]);
  };

  const handleTaskStatusChange = useCallback((taskId, status) => {
    setTasks((prev) =>
      prev.map((t) => (t.id ?? t.taskId) === taskId ? { ...t, status } : t)
    );
  }, []);

  const activeTasks  = tasks.filter((t) => t.status !== "completed" && t.status !== "dismissed");
  const isFreshChat  = messages.length === 1;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(0,0,0,0.52)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* ── Chat Panel ─────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col overflow-hidden"
              style={{
                width: "420px",
                maxHeight: "680px",
                background: "#0f0e0b",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow:
                  "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(212,175,55,0.07), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Gold accent bar */}
              <div
                className="shrink-0"
                style={{
                  height: "2px",
                  background:
                    "linear-gradient(90deg, transparent 0%, #D4AF37 35%, #b8962e 65%, transparent 100%)",
                }}
              />

              {/* ── Header ──────────────────────────────────────────────────── */}
              <div
                className="flex items-center gap-3 px-5 py-3.5 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
                  >
                    <Image
                      src="/ziora-logo.png"
                      alt="Ziora"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <motion.span
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400"
                    style={{ border: "2px solid #0f0e0b" }}
                    animate={{ scale: [1, 1.35, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>

                {/* Name / status */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-white text-[14px] font-bold leading-none">Ziora</p>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                      style={{ background: "rgba(212,175,55,0.12)", color: "#D4AF37" }}
                    >
                      AI
                    </span>
                  </div>
                  <p className="text-white/35 text-[11px] mt-0.5">TBM Design Assistant</p>
                </div>

                {/* Tasks badge */}
                {activeTasks.length > 0 && (
                  <button
                    onClick={() => setShowTasks((p) => !p)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors"
                    style={{
                      background: "rgba(212,175,55,0.10)",
                      border: "1px solid rgba(212,175,55,0.22)",
                      color: "#D4AF37",
                    }}
                  >
                    {activeTasks.length} task{activeTasks.length !== 1 ? "s" : ""}
                    {showTasks
                      ? <ChevronUp className="w-3 h-3 ml-0.5" />
                      : <ChevronDown className="w-3 h-3 ml-0.5" />}
                  </button>
                )}

                {/* New conversation */}
                <button
                  onClick={handleClearChat}
                  title="New conversation"
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.07] transition-all"
                >
                  <SquarePen className="w-3.5 h-3.5" />
                </button>

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.07] transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* ── Tasks panel (collapsible) ────────────────────────────────── */}
              <AnimatePresence>
                {showTasks && activeTasks.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden shrink-0"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="px-4 py-3 space-y-2">
                      <p className="text-white/30 text-[9px] font-bold tracking-widest uppercase">
                        Suggested Tasks
                      </p>
                      {activeTasks.map((task) => (
                        <TaskCard key={task.id ?? task.taskId} task={task} onStatusChange={handleTaskStatusChange} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Messages ────────────────────────────────────────────────── */}
              <div
                className="flex-1 overflow-y-auto px-4 py-5"
                style={{ minHeight: 0, scrollbarWidth: "none" }}
              >
                <div className="space-y-0.5">
                  <AnimatePresence initial={false}>
                    {enrichedMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} ${msg.isFirstInGroup ? "mt-4" : "mt-0.5"}`}
                      >
                        {/* Assistant avatar — only on first in group */}
                        <div className="shrink-0 w-7 self-end">
                          {msg.role === "assistant" && msg.isFirstInGroup && (
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden"
                              style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
                            >
                              <Image
                                src="/ziora-logo.png"
                                alt="Ziora"
                                width={18}
                                height={18}
                                className="object-contain"
                              />
                            </div>
                          )}
                        </div>

                        <div
                          className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
                          style={{ maxWidth: "78%" }}
                        >
                          {/* Bubble */}
                          <div
                            className="px-4 py-3 text-[13.5px] leading-relaxed"
                            style={{
                              borderRadius: getBubbleRadius(msg.role, msg.isFirstInGroup),
                              color: msg.isError ? "#f87171" : "rgba(255,255,255,0.90)",
                              ...(msg.role === "assistant"
                                ? {
                                    background: msg.isError
                                      ? "rgba(239,68,68,0.09)"
                                      : "rgba(255,255,255,0.06)",
                                    border: msg.isError
                                      ? "1px solid rgba(239,68,68,0.18)"
                                      : "1px solid rgba(255,255,255,0.08)",
                                  }
                                : {
                                    background:
                                      "linear-gradient(135deg, rgba(212,175,55,0.20) 0%, rgba(184,150,46,0.14) 100%)",
                                    border: "1px solid rgba(212,175,55,0.20)",
                                  }),
                            }}
                          >
                            {msg.isError ? (
                              <div className="flex items-start gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>{msg.text}</span>
                              </div>
                            ) : (
                              <MessageContent text={msg.text} />
                            )}
                          </div>

                          {/* Timestamp — only on last message of group */}
                          {msg.isLastInGroup && (
                            <p className="text-white/20 text-[10px] px-1">
                              {msg.role === "user" ? "You" : "Ziora"}
                              {formatTime(msg.ts) ? ` · ${formatTime(msg.ts)}` : ""}
                            </p>
                          )}

                          {/* Link chips — skip raw API URLs, only show frontend routes */}
                          {msg.links?.filter((l) => l.url && !l.url.startsWith("/api/")).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {msg.links
                                .filter((l) => l.url && !l.url.startsWith("/api/"))
                                .map((link, i) => (
                                  <a
                                    key={i}
                                    href={link.url}
                                    title={link.description ?? ""}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-opacity hover:opacity-80"
                                    style={{
                                      background: "rgba(212,175,55,0.10)",
                                      border: "1px solid rgba(212,175,55,0.22)",
                                      color: "#D4AF37",
                                      textDecoration: "none",
                                    }}
                                  >
                                    {link.label}
                                  </a>
                                ))}
                            </div>
                          )}

                          {/* Tool actions */}
                          {msg.toolActions?.length > 0 && (
                            <div className="flex flex-col gap-2 mt-1.5 w-full">
                              {msg.toolActions.map((action) => (
                                <ToolActionCard key={action.id ?? action.actionId} action={action} />
                              ))}
                            </div>
                          )}

                          {/* Standalone tasks only — skip any task that is already represented by a toolAction */}
                          {msg.tasks?.filter((t) => !t.toolActionId).length > 0 && (
                            <div className="flex flex-col gap-2 mt-1.5 w-full">
                              {msg.tasks
                                .filter((t) => !t.toolActionId)
                                .map((task) => (
                                  <TaskCard key={task.id ?? task.taskId} task={task} onStatusChange={handleTaskStatusChange} />
                                ))}
                            </div>
                          )}
                        </div>
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
                        className="flex gap-2 mt-4"
                      >
                        <div
                          className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center self-end overflow-hidden"
                          style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
                        >
                          <Image
                            src="/ziora-logo.png"
                            alt="Ziora"
                            width={18}
                            height={18}
                            className="object-contain"
                          />
                        </div>
                        <div
                          className="flex items-center gap-1 px-4 py-3"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "4px 16px 16px 16px",
                          }}
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: "rgba(212,175,55,0.65)" }}
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut",
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div ref={messagesEndRef} />
              </div>

              {/* ── Quick action chips — visible on fresh conversation only ─── */}
              <AnimatePresence>
                {isFreshChat && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 px-4 pb-2"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div
                      className="flex gap-2 overflow-x-auto py-2.5"
                      style={{ scrollbarWidth: "none" }}
                    >
                      {QUICK_ACTIONS.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleSend(action.label)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium whitespace-nowrap shrink-0 transition-all hover:border-white/20 hover:text-white/70"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.09)",
                            color: "rgba(255,255,255,0.45)",
                          }}
                        >
                          <action.Icon className="w-3 h-3 shrink-0" />
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Input area ──────────────────────────────────────────────── */}
              <div
                className="px-4 pb-4 pt-3 shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Auth prompt */}
                <AnimatePresence>
                  {showAuthPrompt && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className="mb-3 rounded-2xl px-4 py-3.5"
                      style={{
                        background: "rgba(212,175,55,0.07)",
                        border: "1px solid rgba(212,175,55,0.16)",
                      }}
                    >
                      <div className="flex items-start gap-2.5 mb-3">
                        <div
                          className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                          style={{ background: "rgba(212,175,55,0.15)" }}
                        >
                          <LogIn className="w-3.5 h-3.5" style={{ color: "#D4AF37" }} />
                        </div>
                        <div>
                          <p className="text-white text-[13px] font-semibold leading-snug">
                            Sign in to chat
                          </p>
                          <p className="text-white/40 text-[12px] mt-0.5 leading-snug">
                            Log in to send messages and save your history.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pl-9">
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={() => router.push("/sign-in")}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold text-black"
                          style={{ background: "linear-gradient(135deg, #D4AF37, #b8962e)" }}
                        >
                          <LogIn className="w-3.5 h-3.5" /> Log in
                        </motion.button>
                        <button
                          onClick={() => setShowAuthPrompt(false)}
                          className="text-[11px] px-2 py-1 text-white/30 hover:text-white/55 transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input row */}
                <div
                  className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isTyping && handleSend()}
                    placeholder="Ask Ziora anything…"
                    disabled={isTyping}
                    className="flex-1 bg-transparent text-white text-[13.5px] placeholder-white/20 outline-none disabled:opacity-50"
                  />
                  <motion.button
                    whileTap={input.trim() && !isTyping ? { scale: 0.88 } : {}}
                    onClick={() => handleSend()}
                    disabled={isTyping || !input.trim()}
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:cursor-not-allowed"
                    style={{
                      background:
                        input.trim() && !isTyping
                          ? "linear-gradient(135deg, #D4AF37, #b8962e)"
                          : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <Send
                      className="w-3.5 h-3.5"
                      style={{
                        color:
                          input.trim() && !isTyping ? "#000" : "rgba(255,255,255,0.22)",
                        transform: "translateX(1px)",
                      }}
                    />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FAB row ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">

          {/* Pill */}
          <AnimatePresence>
            {!isOpen && (
              <motion.button
                key="pill"
                initial={{ opacity: 0, x: 12, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 12, scale: 0.94 }}
                transition={{ duration: 0.2 }}
                onClick={handleOpen}
                className="flex items-center gap-2.5 rounded-full px-5 py-3"
                style={{
                  background: "#0f0e0b",
                  border: "1px solid rgba(212,175,55,0.28)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.05)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"
                  style={{ boxShadow: "0 0 0 3px rgba(52,211,153,0.20)" }}
                />
                <span className="text-white/55 text-[13px] font-semibold whitespace-nowrap">
                  Ask{" "}
                  <span className="font-bold" style={{ color: "#D4AF37" }}>
                    Ziora
                  </span>
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* FAB */}
          <motion.button
            whileTap={{ scale: 0.90 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleOpen}
            className="relative w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)",
              boxShadow: "0 8px 32px rgba(212,175,55,0.28), 0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <X className="w-5 h-5 text-black" />
                </motion.div>
              ) : (
                <motion.div
                  key="logo"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <Image
                    src="/ziora-logo.png"
                    alt="Ziora"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Online dot */}
            {!isOpen && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400"
                style={{ border: "2.5px solid #0f0e0b" }}
              />
            )}
          </motion.button>
        </div>

      </div>
    </>
  );
}
