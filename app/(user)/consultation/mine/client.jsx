"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarClock, MapPin, Video, X, RotateCcw, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { useSession } from "@/hooks/use-session";
import {
  useMyConsultations,
  useConsultationAvailability,
  useRescheduleConsultation,
  useCancelConsultation,
  useInitializeConsultationPayment,
} from "@/hooks/use-consultations";
import { formatFee } from "@/lib/api/consultations";
import { showToast } from "@/components/shared/toast";

// Only "PendingPayment", "Confirmed" and "Cancelled" have been observed live
// (lib/api/schemas/consultations.ts) — anything else renders its own label on
// a neutral badge rather than being mislabelled.
const STATUS_STYLES = {
  PendingPayment: { bg: "bg-amber-900/30", text: "text-amber-400" },
  Confirmed: { bg: "bg-green-900/30", text: "text-green-400" },
  Cancelled: { bg: "bg-red-900/20", text: "text-red-400" },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? { bg: "bg-white/08", text: "text-white/60" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 ${style.bg} ${style.text} text-[12px] font-medium rounded-md`}>
      {status}
    </span>
  );
}

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("en-NG", { weekday: "short", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" });
}

function todayValue() {
  return new Date().toISOString().slice(0, 10);
}
function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function formatSlotTime(iso) {
  return new Date(iso).toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" });
}
function formatPickerDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "long" });
}

function ReschedulePanel({ consultation, onDone, onCancel }) {
  const [date, setDate] = useState(todayValue());
  const { data: availability, isLoading } = useConsultationAvailability(consultation.typeKey, date);
  const reschedule = useRescheduleConsultation();

  const handlePick = (slot) => {
    reschedule.mutate(
      { id: consultation.id, scheduledStart: slot.start },
      {
        onSuccess: () => {
          showToast.success("Consultation rescheduled");
          onDone();
        },
        onError: (err) => showToast.error(err.message),
      },
    );
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/08">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => setDate((d) => (d > todayValue() ? addDays(d, -1) : d))} disabled={date <= todayValue()} className="h-9 w-9 grid place-items-center border border-white/10 text-white/60 hover:text-white disabled:opacity-30 transition-colors">
          <ChevronLeft size={14} />
        </button>
        <span className="text-[13px] font-medium text-white">{formatPickerDate(date)}</span>
        <button type="button" onClick={() => setDate((d) => addDays(d, 1))} className="h-9 w-9 grid place-items-center border border-white/10 text-white/60 hover:text-white transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-9 bg-white/06 rounded animate-pulse" />)}
        </div>
      ) : availability?.slots?.length ? (
        <div className="grid grid-cols-4 gap-2">
          {availability.slots.map((slot) => (
            <button
              key={slot.start}
              type="button"
              disabled={!slot.isAvailable || reschedule.isPending}
              onClick={() => handlePick(slot)}
              className={`h-9 text-[12px] font-medium border transition-colors ${
                slot.isAvailable ? "border-white/10 text-white hover:border-[#D4AF37]/50" : "border-white/10 text-white/20 line-through cursor-not-allowed"
              }`}
            >
              {formatSlotTime(slot.start)}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-[12px] text-white/40 text-center py-3">No slots this day — try another date.</p>
      )}

      <button type="button" onClick={onCancel} className="mt-3 text-[12px] text-white/40 hover:text-white">
        Cancel
      </button>
    </div>
  );
}

function ConsultationCard({ consultation }) {
  const [reschedulingId, setReschedulingId] = useState(null);
  const cancelConsultation = useCancelConsultation();
  const initPayment = useInitializeConsultationPayment();
  const isRescheduling = reschedulingId === consultation.id;

  const upcoming = new Date(consultation.scheduledStart) > new Date();
  const canManage = consultation.status === "Confirmed" && upcoming;

  const handleCancel = () => {
    if (!window.confirm("Cancel this consultation? This can't be undone.")) return;
    cancelConsultation.mutate(
      { id: consultation.id, reason: "Cancelled by customer" },
      {
        onSuccess: (res) => showToast.success("Consultation cancelled", res?.message),
        onError: (err) => showToast.error(err.message),
      },
    );
  };

  const handleCompletePayment = () => {
    initPayment.mutate(
      { id: consultation.id, email: consultation.contactEmail },
      {
        onSuccess: (payment) => {
          const url = payment?.data?.authorizationUrl;
          if (url) window.location.href = url;
          else showToast.error("Could not start payment for this booking.");
        },
        onError: (err) => showToast.error(err.message),
      },
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/08 p-5" style={{ background: "#0d0b08" }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-[15px] font-semibold text-white">{consultation.typeName}</h3>
          <p className="mt-1 text-[13px] text-white/50 flex items-center gap-1.5">
            <CalendarClock size={13} /> {formatDateTime(consultation.scheduledStart)}
          </p>
        </div>
        <StatusBadge status={consultation.status} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-white/40 mb-3">
        <span className="flex items-center gap-1.5">
          {consultation.format === "InPerson" ? <MapPin size={12} /> : <Video size={12} />}
          {consultation.format === "InPerson" ? "On site" : "Video call"}
        </span>
        <span>{formatFee(consultation.fee)}</span>
      </div>

      {consultation.status === "PendingPayment" && (
        <button
          onClick={handleCompletePayment}
          disabled={initPayment.isPending}
          className="w-full h-11 rounded-lg text-[13px] font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
        >
          {initPayment.isPending ? "Redirecting…" : "Complete Payment"}
        </button>
      )}

      {canManage && !isRescheduling && (
        <div className="flex gap-2">
          <button onClick={() => setReschedulingId(consultation.id)} className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 text-white text-[13px] font-medium hover:bg-white/05 transition-colors">
            <RotateCcw size={14} /> Reschedule
          </button>
          <button onClick={handleCancel} disabled={cancelConsultation.isPending} className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 text-red-400 text-[13px] font-medium hover:bg-red-500/10 transition-colors disabled:opacity-50">
            <X size={14} /> Cancel
          </button>
        </div>
      )}

      {isRescheduling && (
        <ReschedulePanel consultation={consultation} onDone={() => setReschedulingId(null)} onCancel={() => setReschedulingId(null)} />
      )}
    </motion.div>
  );
}

export default function MyConsultationsClient() {
  const { isAuthenticated, isLoading: sessionLoading } = useSession();
  const { data: consultations, isLoading, isError, refetch } = useMyConsultations();

  if (!sessionLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-sm">
          <p className="text-[16px] text-white mb-2">Sign in to view your consultations</p>
          <Link href="/sign-in?from=/consultation/mine" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-black" style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-semibold text-white">My Consultations</h1>
            <p className="mt-1.5 text-[14px] text-white/45">Every consultation you've booked, with real-time status.</p>
          </div>
          <Link href="/consultation" className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-white text-[13px] font-medium hover:bg-white/05 transition-colors">
            Book Another
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-2xl border border-white/08 bg-white/03 animate-pulse" />)}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-white/08 p-12 text-center" style={{ background: "#0d0b08" }}>
            <p className="text-[14px] text-white/40 mb-4">Couldn&rsquo;t load your consultations.</p>
            <button onClick={() => refetch()} className="text-[13px] text-[#D4AF37] hover:underline">Try again</button>
          </div>
        ) : !consultations?.length ? (
          <div className="rounded-2xl border border-white/08 p-12 text-center" style={{ background: "#0d0b08" }}>
            <p className="text-[14px] text-white/40 mb-4">No consultations booked yet.</p>
            <Link href="/consultation" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-black" style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}>
              Book a Consultation
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((c) => <ConsultationCard key={c.id} consultation={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
