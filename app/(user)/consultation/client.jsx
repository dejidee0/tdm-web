"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFormik } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  FileUp,
  Loader2,
  Lock,
  MapPin,
  Paperclip,
  Trash2,
  Video,
  X,
} from "lucide-react";

import {
  CONSULTATION_TYPES,
  CONSULTATION_FEE_NAIRA,
  PROPERTY_TYPES,
  formatDuration,
  formatFee,
  getConsultationTypes,
  totalFee,
  totalMinutes,
} from "@/lib/api/consultations";
import { NIGERIA_STATES } from "@/lib/data/nigeria-states";
import { consultationSchema } from "@/lib/validations/consultation";
import {
  useBookConsultation,
  useUploadConsultationFile,
} from "@/hooks/use-consultation";
import { useSession } from "@/hooks/use-session";
import { showToast } from "@/components/shared/toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Service", Icon: Building2 },
  { id: 2, label: "Location & Time", Icon: MapPin },
  { id: 3, label: "Your Project", Icon: Paperclip },
];

/** Which fields each step owns, so "Continue" validates only what is on screen. */
const STEP_FIELDS = {
  1: ["consultationTypes", "propertyType"],
  2: [
    "contactName",
    "contactEmail",
    "contactPhone",
    "siteAddress",
    "siteCity",
    "siteState",
    "preferredDate1",
    "preferredTime1",
    "preferredDate2",
    "preferredTime2",
  ],
  3: ["projectDescription"],
};

/** 09:00–17:00, half-hourly — TBM's consulting hours. */
const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const minutes = 9 * 60 + i * 30;
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
});

const MAX_FILES = 8;
const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB — comfortably fits a short clip
const ACCEPTED =
  "image/jpeg,image/png,image/webp,image/heic,video/mp4,video/quicktime,application/pdf";

// Sharp corners, matching .btn-gold and .btn-outline — which this page
// already renders at border-radius: 0 inside what used to be rounded cards.
const CARD = "border border-z-line bg-z-panel";

function formatTime(value) {
  if (!value) return "";
  const [hh, mm] = value.split(":");
  const hour = Number(hh);
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}:${mm} ${suffix}`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const todayValue = () => new Date().toISOString().slice(0, 10);

// ─── Small shared inputs ──────────────────────────────────────────────────────

function Field({ label, error, touched, required, children, hint }) {
  const showError = touched && error;
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-white/70 mb-2">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </span>
      {children}
      {hint && !showError && (
        <span className="block text-[12px] text-white/50 mt-1.5">{hint}</span>
      )}
      {showError && (
        <span className="block text-[12px] text-red-400 mt-1.5">{error}</span>
      )}
    </label>
  );
}

const inputClass =
  "w-full min-h-11 bg-white/4 border border-z-line px-4 py-3 text-[14px] text-white placeholder:text-white/50 outline-none transition-colors focus:border-gold/60 focus:bg-white/6";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConsultationClient() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading: sessionLoading } = useSession();

  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]); // { key, name, size, status, url, error }
  const [confirmation, setConfirmation] = useState(null);

  const bookMutation = useBookConsultation();
  const uploadMutation = useUploadConsultationFile();
  const fileInputRef = useRef(null);
  const headingRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      consultationTypes: [],
      propertyType: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      siteAddress: "",
      siteCity: "",
      siteState: "",
      preferredDate1: "",
      preferredTime1: "",
      preferredDate2: "",
      preferredTime2: "",
      projectDescription: "",
      uploadedFileUrls: [],
    },
    validationSchema: consultationSchema,
    onSubmit: async (values) => {
      try {
        const result = await bookMutation.mutateAsync({
          ...values,
          uploadedFileUrls: files
            .filter((f) => f.status === "done")
            .map((f) => f.url),
        });
        setConfirmation({
          bookingId: result?.bookingId ?? null,
          status: result?.status ?? "Pending",
          message: result?.message ?? "",
          types: getConsultationTypes(values.consultationTypes),
          fee: totalFee(values.consultationTypes),
          date: values.preferredDate1,
          time: values.preferredTime1,
          email: values.contactEmail,
        });
        showToast.success(
          "Consultation requested",
          "We'll confirm your slot within 24 hours.",
        );
      } catch (err) {
        // `.message` here is already user-safe — lib/errors replaces it.
        showToast.error("Booking failed", err.message);
      }
    },
  });

  // Prefill from the session once it resolves, without clobbering typing.
  useEffect(() => {
    if (!user) return;
    const name = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" ");
    if (name && !formik.values.contactName) {
      formik.setFieldValue("contactName", name);
    }
    if (user.email && !formik.values.contactEmail) {
      formik.setFieldValue("contactEmail", user.email);
    }
    // Only react to identity landing, not to every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const selectedIds = formik.values.consultationTypes;
  const selectedTypes = getConsultationTypes(selectedIds);

  /**
   * ANY selected type needing a site makes this a site booking.
   *
   * This is the one place the single-select logic could not be ported by
   * renaming a variable. It used to read one type's flag; read as "the first
   * one" or "the last one" it would show the wrong address copy for a mixed
   * selection — a site inspection booked with no street address is a wasted
   * visit, and the failure is silent.
   */
  const requiresSite = selectedTypes.some((t) => t.requiresSite);

  const selectionFee = totalFee(selectedIds);
  const selectionDuration = formatDuration(totalMinutes(selectedIds));

  const toggleType = (id) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    formik.setFieldValue("consultationTypes", next);
    formik.setFieldTouched("consultationTypes", true, false);
  };

  const uploading = files.some((f) => f.status === "uploading");
  const submitting = formik.isSubmitting || bookMutation.isPending;

  const stepIsValid = useMemo(() => {
    const fields = STEP_FIELDS[step] ?? [];
    return fields.every((name) => !formik.errors[name]);
  }, [step, formik.errors]);

  function goToStep(next) {
    setStep(next);
    headingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleContinue() {
    const fields = STEP_FIELDS[step] ?? [];
    // Touch this step's fields so their errors become visible, then validate.
    await formik.setTouched(
      fields.reduce((acc, name) => ({ ...acc, [name]: true }), {
        ...formik.touched,
      }),
      true,
    );
    const errors = await formik.validateForm();
    const blocked = fields.filter((name) => errors[name]);
    if (blocked.length > 0) {
      showToast.error("Check this step", "Some required fields still need attention.");
      return;
    }
    goToStep(step + 1);
  }

  // ─── Files ──────────────────────────────────────────────────────────────────

  function handleFilesPicked(event) {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = ""; // let the same file be re-picked after a removal

    const room = MAX_FILES - files.length;
    if (room <= 0) {
      showToast.warning("Attachment limit", `You can attach up to ${MAX_FILES} files.`);
      return;
    }

    picked.slice(0, room).forEach((file) => {
      if (file.size > MAX_FILE_BYTES) {
        showToast.error(
          "File too large",
          `${file.name} is ${formatBytes(file.size)}. The limit is 25 MB.`,
        );
        return;
      }

      const key = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
      setFiles((current) => [
        ...current,
        { key, name: file.name, size: file.size, status: "uploading", url: null },
      ]);

      uploadMutation
        .mutateAsync(file)
        .then((url) => {
          setFiles((current) =>
            current.map((f) => (f.key === key ? { ...f, status: "done", url } : f)),
          );
        })
        .catch((err) => {
          setFiles((current) =>
            current.map((f) =>
              f.key === key ? { ...f, status: "error", error: err.message } : f,
            ),
          );
          showToast.error("Upload failed", `${file.name}: ${err.message}`);
        });
    });

    if (picked.length > room) {
      showToast.warning(
        "Some files skipped",
        `Only ${MAX_FILES} attachments are allowed per booking.`,
      );
    }
  }

  function removeFile(key) {
    setFiles((current) => current.filter((f) => f.key !== key));
  }

  // ─── Confirmation ───────────────────────────────────────────────────────────

  if (confirmation) {
    return <Confirmation confirmation={confirmation} />;
  }

  return (
    <div className="min-h-screen bg-black pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div ref={headingRef} className="scroll-mt-28">
          <p className="text-gold text-[12px] font-bold tracking-[0.2em] uppercase">
            TBM Building Services
          </p>
          <h1 className="mt-3 font-primary font-extrabold text-[2rem] sm:text-[2.75rem] text-white leading-[1.05] tracking-tight">
            Book a Consultation
          </h1>
          <p className="mt-4 text-white/50 text-[15px] leading-relaxed max-w-xl">
            Tell us what you are planning and when suits you. A TBM consultant
            reviews every request and confirms your slot within 24 hours.
          </p>
        </div>

        {/* Stepper */}
        <ol className="mt-10 flex items-center gap-2 sm:gap-3">
          {STEPS.map(({ id, label, Icon }, index) => {
            const done = step > id;
            const active = step === id;
            return (
              <li key={id} className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => done && goToStep(id)}
                  disabled={!done}
                  aria-current={active ? "step" : undefined}
                  className={`flex items-center gap-2 min-h-11 px-2 sm:px-3 transition-colors ${
                    done ? "hover:bg-white/06 cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span
                    className={`w-8 h-8 shrink-0 rounded-full grid place-items-center text-[12px] font-bold transition-colors ${
                      done
                        ? "bg-gold text-black"
                        : active
                          ? "bg-gold/15 text-gold border border-gold/50"
                          : "bg-white/6 text-white/50"
                    }`}
                  >
                    {done ? <Check size={14} strokeWidth={3} /> : <Icon size={14} />}
                  </span>
                  <span
                    className={`hidden sm:block text-[13px] font-medium truncate ${
                      active ? "text-white" : done ? "text-white/70" : "text-white/50"
                    }`}
                  >
                    {label}
                  </span>
                </button>
                {index < STEPS.length - 1 && (
                  <span
                    className={`h-px flex-1 min-w-4 ${done ? "bg-gold/40" : "bg-white/10"}`}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <form onSubmit={formik.handleSubmit} className="mt-8">
          <AnimatePresence mode="wait">
            {/* ── Step 1: service & property ── */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <fieldset>
                  <legend className="text-[15px] font-semibold text-white">
                    What do you need help with?
                  </legend>
                  <p className="mt-1.5 mb-5 text-[13px] text-white/70 leading-relaxed">
                    Pick as many as apply — we cover them in one session.
                    {" "}
                    {formatFee(CONSULTATION_FEE_NAIRA)} per service.
                  </p>

                  {/* Full-width rows, not a 2-col grid: five items leave an
                      orphan in two columns, and a row has the width to carry
                      the outcome line that makes the option worth choosing. */}
                  <div className="border border-z-line divide-y divide-z-line">
                    {CONSULTATION_TYPES.map((type) => {
                      const checked = selectedIds.includes(type.id);
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => toggleType(type.id)}
                          role="checkbox"
                          aria-checked={checked}
                          className={`group w-full text-left p-5 sm:p-6 flex gap-4 sm:gap-5 transition-colors ${
                            checked ? "bg-gold/6" : "bg-z-panel hover:bg-white/4"
                          }`}
                        >
                          {/* Square mark — a checkbox, because several are
                              allowed. The old circle read as a radio. */}
                          <span
                            aria-hidden
                            className={`w-5 h-5 shrink-0 mt-0.5 border grid place-items-center transition-colors ${
                              checked
                                ? "border-gold bg-gold"
                                : "border-white/30 group-hover:border-white/60"
                            }`}
                          >
                            {checked && (
                              <Check size={13} strokeWidth={3} className="text-black" />
                            )}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                              <span className="text-[15px] font-semibold text-white">
                                {type.label}
                              </span>
                              {type.recommended && (
                                <span className="z-micro text-[10px] text-gold border border-gold/40 px-2 py-0.5">
                                  Start here if you&rsquo;re unsure
                                </span>
                              )}
                            </span>

                            <span className="mt-2 block text-[13px] text-white/70 leading-relaxed">
                              {type.outcome}
                            </span>

                            <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                              <span className="z-micro text-[10px] flex items-center gap-1.5">
                                {type.requiresSite ? (
                                  <MapPin size={11} aria-hidden />
                                ) : (
                                  <Video size={11} aria-hidden />
                                )}
                                {type.format}
                              </span>
                              <span className="z-micro text-[10px] flex items-center gap-1.5">
                                <CalendarClock size={11} aria-hidden />
                                {type.duration}
                              </span>
                              <span className="z-micro text-[10px] text-white/70">
                                {formatFee(CONSULTATION_FEE_NAIRA)}
                              </span>
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Running total — so adding a fourth service is never a
                      surprise on the invoice. */}
                  <div className="mt-4 border border-z-line bg-z-deep p-4 sm:p-5">
                    {selectedTypes.length === 0 ? (
                      <p className="text-[13px] text-white/50">
                        Nothing selected yet.
                      </p>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                          <p className="z-micro">
                            {selectedTypes.length} selected
                            {selectionDuration ? ` · ${selectionDuration}` : ""}
                            {" · one session"}
                          </p>
                          <p className="text-white text-xl font-extrabold font-primary tabular-nums">
                            {formatFee(selectionFee)}
                          </p>
                        </div>
                        <p className="mt-2.5 text-[12px] text-white/50 leading-relaxed">
                          {selectedTypes.length} × {formatFee(CONSULTATION_FEE_NAIRA)}.
                          Nothing is charged now — we confirm the fee when we
                          confirm your slot.
                        </p>
                      </>
                    )}
                  </div>

                  {formik.touched.consultationTypes &&
                    formik.errors.consultationTypes && (
                      <p className="text-[12px] text-red-400 mt-2">
                        {formik.errors.consultationTypes}
                      </p>
                    )}
                </fieldset>

                <Field
                  label="Property type"
                  required
                  error={formik.errors.propertyType}
                  touched={formik.touched.propertyType}
                >
                  <select
                    name="propertyType"
                    value={formik.values.propertyType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass}
                  >
                    <option value="">Select property type</option>
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-z-panel">
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>
              </motion.div>
            )}

            {/* ── Step 2: contact, location, schedule ── */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <section className={`${CARD} p-5 sm:p-6 space-y-5`}>
                  <h2 className="text-[15px] font-semibold text-white">Your details</h2>

                  <Field
                    label="Full name"
                    required
                    error={formik.errors.contactName}
                    touched={formik.touched.contactName}
                  >
                    <input
                      name="contactName"
                      value={formik.values.contactName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Email"
                      required
                      error={formik.errors.contactEmail}
                      touched={formik.touched.contactEmail}
                    >
                      <input
                        name="contactEmail"
                        type="email"
                        inputMode="email"
                        value={formik.values.contactEmail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </Field>

                    <Field
                      label="Phone"
                      required
                      error={formik.errors.contactPhone}
                      touched={formik.touched.contactPhone}
                    >
                      <input
                        name="contactPhone"
                        type="tel"
                        inputMode="tel"
                        value={formik.values.contactPhone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="0803 123 4567"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </section>

                <section className={`${CARD} p-5 sm:p-6 space-y-5`}>
                  <div>
                    <h2 className="text-[15px] font-semibold text-white">
                      Project location
                    </h2>
                    <p className="mt-1 text-[13px] text-white/70 leading-relaxed">
                      {requiresSite
                        ? "A consultant will travel to this address, so please be precise."
                        : "Your session is remote — we still need the location to apply the right rates and team."}
                    </p>
                  </div>

                  <Field
                    label="Street address"
                    required
                    error={formik.errors.siteAddress}
                    touched={formik.touched.siteAddress}
                  >
                    <input
                      name="siteAddress"
                      value={formik.values.siteAddress}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="12 Shehu Shagari Way"
                      className={inputClass}
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="City / area"
                      required
                      error={formik.errors.siteCity}
                      touched={formik.touched.siteCity}
                    >
                      <input
                        name="siteCity"
                        value={formik.values.siteCity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Maitama"
                        className={inputClass}
                      />
                    </Field>

                    <Field
                      label="State"
                      required
                      error={formik.errors.siteState}
                      touched={formik.touched.siteState}
                    >
                      <select
                        name="siteState"
                        value={formik.values.siteState}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={inputClass}
                      >
                        <option value="">Select state</option>
                        {NIGERIA_STATES.map((state) => (
                          <option key={state} value={state} className="bg-z-panel">
                            {state}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </section>

                <section className={`${CARD} p-5 sm:p-6 space-y-5`}>
                  <div>
                    <h2 className="text-[15px] font-semibold text-white">
                      Preferred date &amp; time
                    </h2>
                    <p className="mt-1 text-[13px] text-white/70 leading-relaxed">
                      Consulting hours are 9:00 AM – 5:00 PM. Give us a second
                      option and we are far more likely to confirm on the first
                      try.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Preferred date"
                      required
                      error={formik.errors.preferredDate1}
                      touched={formik.touched.preferredDate1}
                    >
                      <input
                        name="preferredDate1"
                        type="date"
                        min={todayValue()}
                        value={formik.values.preferredDate1}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`${inputClass} [color-scheme:dark]`}
                      />
                    </Field>

                    <Field
                      label="Preferred time"
                      required
                      error={formik.errors.preferredTime1}
                      touched={formik.touched.preferredTime1}
                    >
                      <select
                        name="preferredTime1"
                        value={formik.values.preferredTime1}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={inputClass}
                      >
                        <option value="">Select time</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot} className="bg-z-panel">
                            {formatTime(slot)}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 pt-1">
                    <Field
                      label="Alternative date"
                      hint="Optional"
                      error={formik.errors.preferredDate2}
                      touched={formik.touched.preferredDate2}
                    >
                      <input
                        name="preferredDate2"
                        type="date"
                        min={formik.values.preferredDate1 || todayValue()}
                        value={formik.values.preferredDate2}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`${inputClass} [color-scheme:dark]`}
                      />
                    </Field>

                    <Field
                      label="Alternative time"
                      hint="Optional"
                      error={formik.errors.preferredTime2}
                      touched={formik.touched.preferredTime2}
                    >
                      <select
                        name="preferredTime2"
                        value={formik.values.preferredTime2}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={inputClass}
                      >
                        <option value="">Select time</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot} className="bg-z-panel">
                            {formatTime(slot)}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {/* The backend exposes no availability calendar, so a slot is a
                      request, not a reservation. Say so rather than implying a
                      booked time the team has not agreed to. */}
                  <p className="text-[12px] text-white/50 leading-relaxed flex gap-2">
                    <CalendarClock size={14} className="shrink-0 mt-px text-white/50" />
                    Times are requests, not confirmed reservations. We will confirm
                    your slot by email within 24 hours.
                  </p>
                </section>
              </motion.div>
            )}

            {/* ── Step 3: description, files, review ── */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <section className={`${CARD} p-5 sm:p-6 space-y-5`}>
                  <Field
                    label="Describe your project"
                    required
                    error={formik.errors.projectDescription}
                    touched={formik.touched.projectDescription}
                    hint={`${formik.values.projectDescription.length} / 2000 characters`}
                  >
                    <textarea
                      name="projectDescription"
                      rows={6}
                      maxLength={2000}
                      value={formik.values.projectDescription}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="What are you planning? Rooms involved, rough budget, timing, and anything already decided."
                      className={`${inputClass} resize-y leading-relaxed`}
                    />
                  </Field>
                </section>

                <section className={`${CARD} p-5 sm:p-6`}>
                  <h2 className="text-[15px] font-semibold text-white">
                    Photos, videos &amp; documents
                  </h2>
                  <p className="mt-1 text-[13px] text-white/70 leading-relaxed">
                    Optional, but a few photos of the space make the first session
                    far more useful. Up to {MAX_FILES} files, 25 MB each.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED}
                    onChange={handleFilesPicked}
                    className="sr-only"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={files.length >= MAX_FILES}
                    className="mt-4 w-full min-h-11 border border-dashed border-z-line hover:border-gold/50 disabled:opacity-40 disabled:hover:border-z-line transition-colors py-6 flex flex-col items-center justify-center gap-2"
                  >
                    <FileUp size={20} className="text-white/50" />
                    <span className="text-[13px] text-white/70 font-medium">
                      {files.length >= MAX_FILES
                        ? "Attachment limit reached"
                        : "Choose files"}
                    </span>
                    <span className="text-[12px] text-white/50">
                      JPG, PNG, WEBP, HEIC, MP4, MOV or PDF
                    </span>
                  </button>

                  {files.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {files.map((file) => (
                        <li
                          key={file.key}
                          className="flex items-center gap-3 bg-white/4 border border-z-line px-3 py-2.5"
                        >
                          <span className="shrink-0">
                            {file.status === "uploading" && (
                              <Loader2 size={16} className="text-gold animate-spin" />
                            )}
                            {file.status === "done" && (
                              <CheckCircle2 size={16} className="text-emerald-400" />
                            )}
                            {file.status === "error" && (
                              <X size={16} className="text-red-400" />
                            )}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-[13px] text-white truncate">
                              {file.name}
                            </span>
                            <span className="block text-[12px] text-white/50">
                              {file.status === "error"
                                ? file.error
                                : formatBytes(file.size)}
                            </span>
                          </span>

                          <button
                            type="button"
                            onClick={() => removeFile(file.key)}
                            aria-label={`Remove ${file.name}`}
                            className="shrink-0 h-11 w-11 grid place-items-center text-white/50 hover:text-red-400 hover:bg-white/06 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* Review */}
                <section className={`${CARD} p-5 sm:p-6`}>
                  <h2 className="text-[15px] font-semibold text-white mb-4">
                    Review your request
                  </h2>
                  <dl className="space-y-3">
                    <SummaryRow
                      label={
                        selectedTypes.length > 1 ? "Consultations" : "Consultation"
                      }
                      value={selectedTypes.map((t) => t.label).join(", ")}
                    />
                    <SummaryRow label="Property" value={formik.values.propertyType} />
                    {/* The fee is on the review step because this is the last
                        screen before submitting — a number first seen on the
                        confirmation is a number that feels sprung on you. */}
                    <SummaryRow
                      label="Fee"
                      value={
                        selectionFee
                          ? `${formatFee(selectionFee)} · confirmed with your slot`
                          : null
                      }
                    />
                    <SummaryRow
                      label="Location"
                      value={[
                        formik.values.siteAddress,
                        formik.values.siteCity,
                        formik.values.siteState,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    />
                    <SummaryRow
                      label="Preferred"
                      value={
                        formik.values.preferredDate1
                          ? `${formatDate(formik.values.preferredDate1)} · ${formatTime(formik.values.preferredTime1)}`
                          : null
                      }
                    />
                    {formik.values.preferredDate2 && (
                      <SummaryRow
                        label="Alternative"
                        value={`${formatDate(formik.values.preferredDate2)} · ${formatTime(formik.values.preferredTime2)}`}
                      />
                    )}
                    <SummaryRow
                      label="Attachments"
                      value={
                        files.filter((f) => f.status === "done").length > 0
                          ? `${files.filter((f) => f.status === "done").length} file(s)`
                          : "None"
                      }
                    />
                  </dl>

                  {/* Fee: the backend has no consultation price and no way to
                      charge for one. State the truth rather than inventing a
                      figure or showing a dead "Pay now" button. */}
                  <div className="mt-5 pt-5 border-t border-z-line">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[13px] font-medium text-white/70">
                          Consultation fee
                        </p>
                        <p className="mt-1 text-[12px] text-white/50 leading-relaxed max-w-sm">
                          Confirmed by your consultant when they accept the
                          booking, and credited toward your project if you
                          proceed with TBM. Nothing is charged now.
                        </p>
                      </div>
                      <span className="text-[13px] text-white/50 shrink-0 whitespace-nowrap">
                        On confirmation
                      </span>
                    </div>
                  </div>
                </section>

                {/* Account wall — required to book, per the product rule that
                    exploring is free but committing is not. */}
                {!sessionLoading && !isAuthenticated && (
                  <div className="border border-gold/25 bg-gold/6 p-5">
                    <div className="flex items-start gap-3">
                      <Lock size={16} className="text-gold shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-white">
                          Sign in to confirm your booking
                        </p>
                        <p className="mt-1 text-[13px] text-white/50 leading-relaxed">
                          An account lets you track this consultation, reschedule
                          it, and keep your estimates and designs in one place.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {/* `from` is the convention useLogin() reads — see
                              hooks/use-auth.js. `callbackUrl` is silently ignored. */}
                          <Link
                            href={`/sign-in?from=${encodeURIComponent(pathname)}`}
                            className="btn-gold px-5 py-2.5 min-h-11"
                          >
                            Log In
                          </Link>
                          <Link
                            href={`/sign-up?from=${encodeURIComponent(pathname)}`}
                            className="btn-outline px-5 py-2.5 min-h-11"
                          >
                            Create Account
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Navigation ── */}
          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => goToStep(step - 1)}
                className="min-h-11 px-5 inline-flex items-center gap-2 text-[14px] text-white/70 hover:text-white hover:bg-white/6 transition-colors"
              >
                <ArrowLeft size={15} /> Back
              </button>
            ) : (
              <span />
            )}

            {step < STEPS.length ? (
              <button
                type="button"
                onClick={handleContinue}
                className="btn-gold px-7 py-3.5 min-h-11"
              >
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting || uploading || !isAuthenticated}
                className="btn-gold px-7 py-3.5 min-h-11 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Sending…
                  </>
                ) : uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Uploading files…
                  </>
                ) : (
                  <>
                    Request Consultation <ArrowRight size={14} />
                  </>
                )}
              </button>
            )}
          </div>

          {step === STEPS.length && !stepIsValid && formik.submitCount > 0 && (
            <p className="mt-3 text-[12px] text-red-400 text-right">
              Some details are still missing — check the steps above.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-[13px] text-white/50 shrink-0">{label}</dt>
      <dd className="text-[13px] text-white text-right min-w-0 break-words">
        {value || <span className="text-white/50">Not set</span>}
      </dd>
    </div>
  );
}

function Confirmation({ confirmation }) {
  return (
    <div className="min-h-screen bg-black pt-28 pb-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`${CARD} p-6 sm:p-8 text-center`}
        >
          <span className="w-14 h-14 mx-auto rounded-full bg-emerald-500/12 grid place-items-center">
            <CheckCircle2 size={26} className="text-emerald-400" />
          </span>

          <h1 className="mt-5 font-primary font-extrabold text-[1.75rem] text-white tracking-tight">
            Consultation Requested
          </h1>
          <p className="mt-3 text-[14px] text-white/70 leading-relaxed">
            {confirmation.message ||
              "Your request is with our team. We will confirm your slot within 24 hours."}
          </p>

          <dl className="mt-7 space-y-3 text-left bg-white/4 border border-z-line p-4">
            {confirmation.bookingId && (
              <SummaryRow
                label="Reference"
                value={confirmation.bookingId.slice(0, 8).toUpperCase()}
              />
            )}
            <SummaryRow label="Status" value={confirmation.status} />
            <SummaryRow
              label={
                confirmation.types?.length > 1 ? "Consultations" : "Consultation"
              }
              value={confirmation.types?.map((t) => t.label).join(", ")}
            />
            {/* "Not yet charged" is not padding. A bare amount on a
                confirmation screen reads as a receipt, and nothing was
                taken — the page cannot take payment at all. */}
            <SummaryRow
              label="Fee"
              value={
                confirmation.fee
                  ? `${formatFee(confirmation.fee)} · not yet charged`
                  : null
              }
            />
            <SummaryRow
              label="Requested"
              value={
                confirmation.date
                  ? `${formatDate(confirmation.date)} · ${formatTime(confirmation.time)}`
                  : null
              }
            />
          </dl>

          <p className="mt-5 text-[12px] text-white/50 leading-relaxed">
            A confirmation has been sent to {confirmation.email}. To reschedule or
            cancel, reply to that email or call the office — at least 24 hours
            before your slot.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="btn-gold px-6 py-3 min-h-11 justify-center">
              Go to Dashboard
            </Link>
            <Link
              href="/bogat/materials"
              className="btn-outline px-6 py-3 min-h-11 justify-center"
            >
              Shop with BOGAT
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
