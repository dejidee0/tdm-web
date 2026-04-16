"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Plus,
  Minus,
  AlertCircle,
  ChevronDown,
  X,
  Search,
  Check,
} from "lucide-react";
import {
  useAdminAIMonthlySpend,
  useAdminAIUserCredits,
  useAdminAIAdjustCredits,
  useAdminAIUserUsage,
} from "@/hooks/use-admin";
import { useAdminUsers } from "@/hooks/use-admin-users";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const METRICS = [
  { key: "totalGenerations",   label: "Generations",   color: "#7B2FBE" },
  { key: "totalCreditsUsed",   label: "Credits Used",  color: "#1A4A8A" },
  { key: "totalEstimatedCost", label: "Est. Cost (₦)", color: "#1A7A4A" },
  { key: "distinctUsers",      label: "Active Users",  color: "#F59E0B" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionUnavailable({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-10 h-10 bg-white/08 rounded-full flex items-center justify-center mb-3">
        <AlertCircle size={18} className="text-white/40" />
      </div>
      <p className="font-manrope text-[13px] text-white/40">{message}</p>
    </div>
  );
}

function initials(user) {
  const name = user?.name || user?.fullName || user?.firstName || "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || (user?.email?.[0] || "U").toUpperCase();
}

// ─── Monthly Spend Chart ──────────────────────────────────────────────────────

function MonthlySpendChart({ data, metric }) {
  const values = data.map((d) => d[metric] ?? 0);
  const max = Math.max(...values, 1);
  const color = METRICS.find((m) => m.key === metric)?.color ?? "#7B2FBE";

  return (
    <div className="flex items-end gap-1.5 sm:gap-2 h-48 overflow-x-auto pb-1">
      {data.map((d, i) => {
        const val = d[metric] ?? 0;
        const barH = Math.round((val / max) * 168);
        const label = `${MONTH_NAMES[(d.month ?? 1) - 1]} ${d.year ?? ""}`.trim();

        return (
          <div key={i} className="flex flex-col items-center gap-1 min-w-9 flex-1 group">
            <div className="relative w-full flex flex-col items-center">
              <span className="font-manrope text-[10px] text-white/40 group-hover:font-bold group-hover:text-white transition-all truncate">
                {val.toLocaleString()}
              </span>
              <div className="flex flex-col-reverse items-center w-full" style={{ height: 168 }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: barH }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  className="w-full rounded-t cursor-default"
                  style={{
                    backgroundColor: val === 0 ? "rgba(255,255,255,0.08)" : color,
                    minHeight: 2,
                    opacity: val === 0 ? 0.5 : 1,
                  }}
                  title={`${label}: ${val.toLocaleString()}`}
                />
              </div>
            </div>
            <span className="font-manrope text-[10px] text-white/40 text-center leading-tight truncate w-full">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Metric Summary Cards ─────────────────────────────────────────────────────

function SummaryCards({ data }) {
  const totals = METRICS.reduce((acc, m) => {
    acc[m.key] = data.reduce((s, d) => s + (d[m.key] ?? 0), 0);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {METRICS.map((m) => (
        <div key={m.key} className="p-3 rounded-xl border border-white/08 bg-[#0d0b08]">
          <div
            className="w-6 h-6 rounded-md mb-2 flex items-center justify-center"
            style={{ backgroundColor: `${m.color}1A` }}
          >
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: m.color }} />
          </div>
          <p className="font-manrope text-[11px] text-white/40 leading-tight mb-0.5">{m.label}</p>
          <p className="font-manrope text-[18px] font-bold text-white">
            {totals[m.key].toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── User Picker ──────────────────────────────────────────────────────────────

function UserPicker({ selectedUser, onSelect }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { data: usersData, isLoading } = useAdminUsers({
    search: debouncedSearch,
    pageSize: 20,
    page: 1,
  });

  const users = usersData?.users || [];

  const handleSelect = useCallback((user) => {
    onSelect(user);
    setOpen(false);
    setSearch("");
    setDebouncedSearch("");
  }, [onSelect]);

  return (
    <div ref={ref} className="relative">
      {/* Selected user pill */}
      {selectedUser ? (
        <div className="flex items-center gap-3 p-2.5 border border-white/08 rounded-lg bg-white/05">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-manrope text-[12px] font-bold shrink-0"
            style={{
              backgroundColor: selectedUser.colorScheme?.bg || "#7B2FBE",
              color: selectedUser.colorScheme?.text || "#fff",
            }}
          >
            {selectedUser.initials || initials(selectedUser)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-manrope text-[13px] font-semibold text-white truncate">
              {selectedUser.fullName || selectedUser.name || selectedUser.email}
            </p>
            <p className="font-manrope text-[11px] text-white/40 truncate">
              {selectedUser.email}
            </p>
          </div>
          <button
            onClick={() => onSelect(null)}
            className="p-1 rounded hover:bg-white/08 transition-colors shrink-0"
          >
            <X size={14} className="text-white/40" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search by name, email, or ID…"
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg font-manrope text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-transparent transition-all"
          />
        </div>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {open && !selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-[#0d0b08] border border-white/12 rounded-xl shadow-2xl z-20 max-h-64 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-9 h-9 bg-white/08 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-white/08 rounded w-3/4" />
                      <div className="h-2.5 bg-white/08 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="py-8 text-center font-manrope text-[13px] text-white/40">
                No users found
              </div>
            ) : (
              <ul className="divide-y divide-white/08">
                {users.map((user) => {
                  const userRole = Array.isArray(user?.roles) ? user.roles[0] : user?.role;
                  return (
                    <li key={user.id}>
                      <button
                        onClick={() => handleSelect(user)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/05 transition-colors text-left"
                      >
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.fullName || user.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center font-manrope text-[13px] font-bold shrink-0"
                            style={{
                              backgroundColor: user.colorScheme?.bg || "rgba(255,255,255,0.08)",
                              color: user.colorScheme?.text || "rgba(255,255,255,0.6)",
                            }}
                          >
                            {user.initials || initials(user)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-manrope text-[13px] font-semibold text-white truncate">
                            {user.fullName || user.name || user.email}
                          </p>
                          <p className="font-manrope text-[11px] text-white/40 truncate">
                            {user.email}
                            {userRole && (
                              <span className="ml-2 text-[10px] font-semibold text-white/30 uppercase">
                                · {userRole}
                              </span>
                            )}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Credit Panel ─────────────────────────────────────────────────────────────

function CreditPanel({ userId }) {
  const { data: credits, isLoading, error, refetch } = useAdminAIUserCredits(userId);
  const { mutate: adjust, isPending } = useAdminAIAdjustCredits();

  const [form, setForm] = useState({ amount: "", reason: "", type: "add" });
  const [msg, setMsg] = useState(null);

  console.log("[AI Usage] user-credits →", credits, "| error:", error?.message);

  const handleAdjust = () => {
    setMsg(null);
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setMsg({ type: "error", text: "Enter a valid positive amount." });
      return;
    }
    if (!form.reason.trim()) {
      setMsg({ type: "error", text: "Reason is required." });
      return;
    }
    const amount = form.type === "add"
      ? Math.abs(Number(form.amount))
      : -Math.abs(Number(form.amount));

    adjust(
      { userId, amount, reason: form.reason.trim() },
      {
        onSuccess: () => {
          setMsg({ type: "success", text: `Credits ${form.type === "add" ? "added" : "deducted"} successfully.` });
          setForm((f) => ({ ...f, amount: "", reason: "" }));
          refetch();
        },
        onError: (err) => {
          setMsg({ type: "error", text: err?.response?.data?.message || "Adjustment failed." });
        },
      }
    );
  };

  if (isLoading) return <div className="h-20 bg-white/08 rounded-lg animate-pulse" />;
  if (error) return <SectionUnavailable message={`Could not load credits: ${error.message}`} />;

  const balance = credits?.balance ?? credits?.credits ?? credits?.total ?? credits?.remainingCredits;

  return (
    <div className="space-y-4">
      {/* Balance */}
      <div className="flex items-center justify-between p-4 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
        <div>
          <p className="font-manrope text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wide mb-0.5">
            Credit Balance
          </p>
          <p className="font-manrope text-[30px] font-bold text-[#D4AF37] leading-none">
            {balance != null ? Number(balance).toLocaleString() : "—"}
          </p>
        </div>
        <button onClick={() => refetch()} className="p-2 rounded-lg hover:bg-[#D4AF37]/20 transition-colors">
          <RefreshCw size={15} className="text-[#D4AF37]" />
        </button>
      </div>

      {/* Adjust */}
      <div>
        <p className="font-manrope text-[13px] font-semibold text-white mb-2">Adjust Credits</p>

        {/* Add / Deduct tabs */}
        <div className="flex rounded-lg border border-white/08 overflow-hidden mb-3">
          {["add", "deduct"].map((t) => (
            <button
              key={t}
              onClick={() => setForm((f) => ({ ...f, type: t }))}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 font-manrope text-[13px] font-semibold transition-colors capitalize ${
                form.type === t
                  ? t === "add" ? "bg-[#1A7A4A] text-white" : "bg-red-500 text-white"
                  : "bg-white/05 text-white/50 hover:bg-white/08"
              }`}
            >
              {t === "add" ? <Plus size={13} /> : <Minus size={13} />}
              {t === "add" ? "Add" : "Deduct"}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <input
            type="number"
            min="1"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            placeholder="Amount"
            className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg font-manrope text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-transparent transition-all"
          />
          <input
            type="text"
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            placeholder="Reason (required)"
            className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg font-manrope text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-transparent transition-all"
          />
        </div>

        {msg && (
          <p className={`font-manrope text-[12px] mt-2 ${msg.type === "error" ? "text-red-400" : "text-[#10B981]"}`}>
            {msg.text}
          </p>
        )}

        <button
          onClick={handleAdjust}
          disabled={isPending || !form.amount || !form.reason.trim()}
          className="mt-3 w-full py-2.5 rounded-lg font-manrope text-[13px] font-semibold text-black transition-opacity disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
        >
          {isPending ? "Applying…" : "Apply Adjustment"}
        </button>
      </div>
    </div>
  );
}

// ─── User Usage Panel ─────────────────────────────────────────────────────────

function UserUsagePanel({ userId }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: usage, isLoading, error } = useAdminAIUserUsage(userId, { year, month });

  console.log("[AI Usage] user-usage →", usage, "| error:", error?.message);

  return (
    <div className="space-y-4">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="appearance-none w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg font-manrope text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-transparent transition-all"
          >
            {MONTH_NAMES.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
        </div>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          min="2020"
          max={now.getFullYear() + 1}
          className="w-24 px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg font-manrope text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-transparent transition-all"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map((i) => <div key={i} className="h-16 bg-white/08 rounded-lg animate-pulse" />)}
        </div>
      ) : error ? (
        <SectionUnavailable message={`Could not load usage: ${error.message}`} />
      ) : usage && Object.keys(usage).length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(usage).map(([key, val]) => (
            <div key={key} className="p-3 bg-white/05 rounded-lg border border-white/08">
              <p className="font-manrope text-[11px] text-white/40 capitalize mb-0.5 leading-tight">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </p>
              <p className="font-manrope text-[16px] font-bold text-white">
                {typeof val === "number" ? val.toLocaleString() : String(val ?? "—")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <SectionUnavailable message="No usage data for this period." />
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

function AIUsageContent() {
  const searchParams = useSearchParams();
  const [spendMonths, setSpendMonths] = useState(6);
  const [activeMetric, setActiveMetric] = useState("totalGenerations");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const userId = searchParams.get("userId");
    const userName = searchParams.get("userName");
    const userEmail = searchParams.get("userEmail");
    if (userId) {
      setSelectedUser({ id: userId, name: userName || "", email: userEmail || "" });
    }
  }, [searchParams]);

  const {
    data: monthlySpend,
    isLoading: spendLoading,
    error: spendError,
    refetch: refetchSpend,
  } = useAdminAIMonthlySpend(spendMonths);

  const spendData = Array.isArray(monthlySpend) ? monthlySpend : [];

  return (
    <div className="max-w-360 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-inter text-[28px] sm:text-[32px] font-bold text-white mb-2">
          AI Usage
        </h1>
        <p className="font-manrope text-[13px] sm:text-[14px] text-white/50">
          Monitor platform-wide AI spend and manage individual user credits.
        </p>
      </div>

      {/* ── Summary Cards ── */}
      {spendData.length > 0 && <SummaryCards data={spendData} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Monthly Spend Chart ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0d0b08] rounded-xl border border-white/08 p-5 sm:p-6">
            {/* Chart header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="font-manrope text-[16px] font-bold text-white">
                  Monthly AI Spend
                </h2>
                <p className="font-manrope text-[12px] text-white/40 mt-0.5">
                  Platform-wide usage over time
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Metric selector */}
                <div className="flex rounded-lg border border-white/08 overflow-hidden">
                  {METRICS.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setActiveMetric(m.key)}
                      className={`px-2.5 py-1.5 font-manrope text-[11px] font-semibold transition-colors whitespace-nowrap ${
                        activeMetric === m.key
                          ? "text-white"
                          : "bg-transparent text-white/50 hover:bg-white/05"
                      }`}
                      style={activeMetric === m.key ? { backgroundColor: m.color } : {}}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                {/* Month range */}
                <div className="relative">
                  <select
                    value={spendMonths}
                    onChange={(e) => setSpendMonths(Number(e.target.value))}
                    className="appearance-none pl-3 pr-7 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg font-manrope text-[12px] text-white/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-transparent transition-all"
                  >
                    <option value={3}>3 mo</option>
                    <option value={6}>6 mo</option>
                    <option value={12}>12 mo</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>
                <button
                  onClick={refetchSpend}
                  className="p-1.5 rounded-lg border border-white/10 hover:bg-white/05 transition-colors"
                >
                  <RefreshCw size={13} className="text-white/40" />
                </button>
              </div>
            </div>

            {/* Active metric legend */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-3 h-3 rounded-sm inline-block"
                style={{ backgroundColor: METRICS.find((m) => m.key === activeMetric)?.color }}
              />
              <span className="font-manrope text-[12px] text-white/40">
                {METRICS.find((m) => m.key === activeMetric)?.label}
              </span>
            </div>

            {spendLoading ? (
              <div className="h-48 bg-white/05 rounded-lg animate-pulse" />
            ) : spendError ? (
              <SectionUnavailable message={`Could not load data: ${spendError.message}`} />
            ) : spendData.length === 0 ? (
              <SectionUnavailable message="No spend data available." />
            ) : (
              <MonthlySpendChart data={spendData} metric={activeMetric} />
            )}
          </div>

          {/* Per-user usage (appears after user is selected) */}
          <AnimatePresence>
            {selectedUser && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="bg-[#0d0b08] rounded-xl border border-white/08 p-5 sm:p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-manrope text-[16px] font-bold text-white">
                      Usage — {selectedUser.name || selectedUser.fullName || selectedUser.email}
                    </h2>
                    <p className="font-manrope text-[12px] text-white/40 mt-0.5">
                      Per-month AI generation breakdown
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-1.5 rounded-lg hover:bg-white/08 transition-colors"
                  >
                    <X size={15} className="text-white/40" />
                  </button>
                </div>
                <UserUsagePanel userId={selectedUser.id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: User picker + Credits ── */}
        <div className="space-y-4">
          {/* User picker */}
          <div className="bg-[#0d0b08] rounded-xl border border-white/08 p-5">
            <h2 className="font-manrope text-[15px] font-bold text-white mb-3">
              Select User
            </h2>
            <UserPicker selectedUser={selectedUser} onSelect={setSelectedUser} />

            {!selectedUser && (
              <p className="font-manrope text-[12px] text-white/40 mt-3 text-center">
                Search and select a user to view their credits and usage.
              </p>
            )}
          </div>

          {/* Credits (only once user is selected) */}
          <AnimatePresence>
            {selectedUser && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="bg-[#0d0b08] rounded-xl border border-white/08 p-5"
              >
                <h2 className="font-manrope text-[15px] font-bold text-white mb-4">
                  Credits
                </h2>
                <CreditPanel userId={selectedUser.id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function AIUsagePage() {
  return (
    <Suspense fallback={<div className="max-w-360 mx-auto animate-pulse h-96 bg-[#0d0b08] rounded-xl border border-white/08" />}>
      <AIUsageContent />
    </Suspense>
  );
}
