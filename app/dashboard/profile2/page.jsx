// app/dashboard/profile/page.jsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  MapPin,
  Calendar,
  Tag,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

// ─── API call ──────────────────────────────────────────────────────────────
async function fetchProfile() {
  // Hits Next.js proxy which reads the HTTP-only cookie and forwards as Bearer token
  const res = await fetch("/api/account/profile");

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);

  const json = await res.json();
  // Most APIs wrap in { success, data, message } — handle both shapes
  return json?.data ?? json;
}

// ─── Field renderers ────────────────────────────────────────────────────────
const FIELD_ICONS = {
  email: Mail,
  phone: Phone,
  phoneNumber: Phone,
  role: Shield,
  roles: Shield,
  address: MapPin,
  city: MapPin,
  country: MapPin,
  createdAt: Calendar,
  updatedAt: Calendar,
  joinedAt: Calendar,
};

function getIcon(key) {
  const Icon = FIELD_ICONS[key] || Tag;
  return <Icon className="w-4 h-4" />;
}

function formatKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function formatValue(val) {
  if (val === null || val === undefined)
    return <span className="text-gray-300 italic">—</span>;
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (Array.isArray(val)) return val.join(", ") || "—";
  if (typeof val === "object") return JSON.stringify(val, null, 2);
  // ISO date
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
    return new Date(val).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return String(val);
}

// ─── Sub-components ─────────────────────────────────────────────────────────
function ProfileField({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#f0f0f0] last:border-0">
      <span className="mt-0.5 text-primary/60 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-[#999] uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-[14px] text-[#1a1a1a] font-medium break-words">
          {formatValue(value)}
        </p>
      </div>
    </div>
  );
}

function Avatar({ name, avatar }) {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <div className="relative w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border-4 border-white shadow-md">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-2xl font-bold text-primary">{initials}</span>
      )}
    </div>
  );
}

function SkeletonField() {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#f0f0f0] last:border-0">
      <div className="w-4 h-4 rounded bg-gray-100 animate-pulse mt-0.5 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

function RawResponseToggle({ data }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-[13px] font-semibold text-[#666] hover:bg-gray-50 transition-colors"
      >
        <span>Raw API Response (debug)</span>
        {open ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {open && (
        <pre className="px-5 pb-5 text-[12px] text-[#333] overflow-x-auto leading-relaxed bg-[#fafafa] border-t border-[#f0f0f0]">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

// ─── Priority fields shown in hero card ─────────────────────────────────────
const HERO_FIELDS = [
  "firstName",
  "lastName",
  "fullName",
  "email",
  "phoneNumber",
  "phone",
];
// Fields to skip from the detail grid (shown in hero already)
const SKIP_IN_GRID = new Set([
  "firstName",
  "lastName",
  "fullName",
  "avatar",
  "profilePicture",
  "photo",
  "id",
]);

// ─── Main page ───────────────────────────────────────────────────────────────
export default function ProfileTestPage() {
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["profile-test"],
    queryFn: fetchProfile,
    retry: 1,
    staleTime: 60 * 1000,
  });

  const displayName =
    profile?.fullName ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "User";

  // Separate hero fields from rest
  const heroFields = HERO_FIELDS.filter((k) => profile?.[k] !== undefined);
  const gridFields = profile
    ? Object.entries(profile).filter(([k]) => !SKIP_IN_GRID.has(k))
    : [];

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-manrope py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[24px] font-bold text-[#0F172A]">
              Profile API Test
            </h1>
            <p className="text-[13px] text-[#999] mt-0.5">
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[12px]">
                GET /api/v1/account/profile
              </code>
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-[#666] bg-white border border-[#e5e5e5] rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refetch
          </button>
        </div>

        {/* Error State */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-5"
          >
            <p className="text-[14px] font-semibold text-red-700 mb-1">
              Request Failed
            </p>
            <p className="text-[13px] text-red-600">{error?.message}</p>
            {error?.message === "UNAUTHORIZED" && (
              <p className="text-[12px] text-red-400 mt-2">
                The auth cookie may be missing or expired. Try logging in again.
              </p>
            )}
          </motion.div>
        )}

        {/* Hero Card — always shown, skeleton when loading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-2xl border border-[#e5e5e5] p-6"
        >
          <div className="flex items-center gap-4 mb-5">
            {isLoading ? (
              <div className="w-20 h-20 rounded-full bg-gray-100 animate-pulse shrink-0" />
            ) : (
              <Avatar
                name={displayName}
                avatar={
                  profile?.avatar || profile?.profilePicture || profile?.photo
                }
              />
            )}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <>
                  <div className="h-5 w-36 bg-gray-100 rounded animate-pulse mb-2" />
                  <div className="h-3.5 w-24 bg-gray-100 rounded animate-pulse" />
                </>
              ) : (
                <>
                  <h2 className="text-[20px] font-bold text-[#0F172A] truncate">
                    {displayName}
                  </h2>
                  {profile?.role && (
                    <span className="inline-block mt-1 text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      {Array.isArray(profile.role)
                        ? profile.role.join(", ")
                        : profile.role}
                      {Array.isArray(profile.roles) && !profile.role
                        ? profile.roles.join(", ")
                        : ""}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Hero fields */}
          <div>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonField key={i} />
                ))
              : heroFields.map((key) => (
                  <ProfileField
                    key={key}
                    label={formatKey(key)}
                    value={profile[key]}
                    icon={getIcon(key)}
                  />
                ))}
          </div>
        </motion.div>

        {/* All other fields from API */}
        {!isLoading && gridFields.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-white rounded-2xl border border-[#e5e5e5] p-6"
          >
            <h3 className="text-[13px] font-semibold text-[#999] uppercase tracking-wider mb-3">
              All Fields
            </h3>
            {gridFields.map(([key, value]) => (
              <ProfileField
                key={key}
                label={formatKey(key)}
                value={value}
                icon={getIcon(key)}
              />
            ))}
          </motion.div>
        )}

        {/* Raw response toggle */}
        {!isLoading && profile && <RawResponseToggle data={profile} />}

        {/* Empty state */}
        {!isLoading && !isError && !profile && (
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-10 text-center">
            <User className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-[14px] text-[#999]">API returned empty data</p>
          </div>
        )}
      </div>
    </div>
  );
}
