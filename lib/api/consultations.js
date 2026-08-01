// lib/api/consultations.js
// Consultation booking. All requests go through the Next.js proxy (/api/proxy/v1).
//
// ─── What the backend actually offers (observed 2026-07-31, dev host) ────────
//
// The backend models exactly one thing: a *site inspection*. There is no
// consultation-type resource, no availability calendar, no category or fee
// table, and no admin surface. The five consultation types the product calls
// for are therefore a **client-side taxonomy** carried into `additionalNotes`
// until the backend grows a field for them. See BACKLOG.md.
//
//   POST /api/v1/inspections/book          → { success, bookingId, status, message }
//   POST /api/v1/inspections/verify-payment → { success, verified, amount, reference, paidAt, message }
//   POST /api/v1/uploads/document          → multipart; returns a URL
//
// Note the booking response is **flat — not the `{ success, message, data }`
// envelope** most of /api/v1 uses. `bookingId` and `status` sit at the top
// level. Do not reach for `.data` here; it does not exist.
//
// Required fields, established by walking the validation chain (the OpenAPI
// document marks every one of them optional, which is wrong):
//   contactName, contactPhone, contactEmail, siteAddress, siteCity, siteState,
//   preferredDate1
// Optional: preferredDate2, uploadedFileUrls, paymentReference, additionalNotes
//
// ─── Payment is not wired, and cannot be from here ───────────────────────────
//
// `/inspections/verify-payment` only *confirms* a reference already attached to
// a booking — it returns `{ verified: false, "No inspection booking matches
// this payment reference." }` for anything else. Nothing in the API can
// *initiate* a consultation payment: the only payment-initiation endpoint in
// all 266 operations is `POST /Checkout/payment`, which is cart-scoped, and
// `GET /pricing` returns AI subscription plans only — there is no consultation
// fee to read. So the fee-and-pay step of the journey is deliberately absent
// rather than faked. `verifyPayment` is here and correct so the moment the
// backend adds an initiate endpoint, the callback half already works.

import { logApiError, getFriendlyMessage } from "@/lib/errors";

async function proxyFetch(path, options = {}) {
  const res = await fetch(`/api/proxy/v1${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    const backendMessage = json?.message || json?.title || `API error ${res.status}`;
    logApiError(path, res.status, json ?? text);
    throw Object.assign(new Error(getFriendlyMessage(res.status, backendMessage)), {
      status: res.status,
      backendMessage,
    });
  }
  const text = await res.text();
  return text ? JSON.parse(text) : { success: true };
}

/**
 * The fee for one consultation type, in naira.
 *
 * ─── This is a client-side constant, and it should not be ────────────────────
 * Nothing in the API exposes a consultation fee: `GET /pricing` returns AI
 * subscription plans only, and there is no consultation category or fee table
 * anywhere in the 266 operations. So the price lives here until the backend
 * owns it. One constant rather than a `fee` on each of the five types, because
 * a uniform price repeated five times is a uniform price waiting to drift.
 *
 * It is **displayed only**. The page cannot take payment — see the payment note
 * at the top of this file — so the booking completes unpaid and the fee is
 * settled out of band. Do not let the UI imply a checkout.
 */
export const CONSULTATION_FEE_NAIRA = 50_000;

/** `₦ 150,000` — the one place consultation money is formatted. */
export function formatFee(naira) {
  return `₦ ${naira.toLocaleString("en-NG")}`;
}

/**
 * The consultation types offered in the UI.
 *
 * `requiresSite` drives whether the address block is a site address or a
 * meeting note — a virtual consultation still needs a location for context
 * (which city's rates apply) but not a doorstep. Note it is read across the
 * whole *selection*: if any chosen type needs a site, the site block applies.
 *
 * `outcome` is what the client walks away holding. `desc` says what the session
 * is; on its own that describes a calendar entry rather than a reason to book
 * one, which is why every type carries both.
 *
 * These are **not** backend enum values. `BookInspectionRequestDto` declares
 * `additionalProperties: false`, so a `consultationTypes` key would be rejected
 * outright — the selection is folded into `additionalNotes` because it is
 * forced to be, not as a shortcut. See BACKLOG.md.
 */
export const CONSULTATION_TYPES = [
  {
    id: "virtual",
    label: "Virtual Consultation",
    desc: "A video call with a TBM consultant to talk through scope and options.",
    outcome: "A clear scope, a realistic budget range and an honest view of what your space can take.",
    format: "Video call",
    requiresSite: false,
    durationMinutes: 45,
    duration: "45 minutes",
    // The lowest-commitment way in: no site visit, works anywhere in Nigeria.
    // A product judgement about where to start, not a claim about volume.
    recommended: true,
  },
  {
    id: "site-inspection",
    label: "Site Inspection",
    desc: "A consultant visits your property to assess conditions and measure up.",
    outcome: "Measured dimensions, a condition assessment and the constraints that will shape the design.",
    format: "On site",
    requiresSite: true,
    durationMinutes: 90,
    duration: "1–2 hours on site",
  },
  {
    id: "design",
    label: "Design Consultation",
    desc: "Work through layout, materials and finishes with a designer.",
    outcome: "A direction you have actually decided on — layout, materials and finishes, not a mood board.",
    format: "Video call",
    requiresSite: false,
    durationMinutes: 60,
    duration: "1 hour",
  },
  {
    id: "renovation-planning",
    label: "Renovation Planning",
    desc: "Sequence the work, set a realistic programme and identify long-lead items.",
    outcome: "A build sequence, a programme you can hold people to, and the long-lead items flagged early.",
    format: "On site",
    requiresSite: true,
    durationMinutes: 60,
    duration: "1 hour",
  },
  {
    id: "estimate-review",
    label: "Estimate & Quotation Review",
    desc: "Walk through a Ziora estimate or an existing quotation line by line.",
    outcome: "Line-by-line confidence in a number — what is fair, what is missing and what is padded.",
    format: "Video call",
    requiresSite: false,
    durationMinutes: 45,
    duration: "45 minutes",
  },
];

export const PROPERTY_TYPES = [
  "Apartment / Flat",
  "Duplex",
  "Bungalow",
  "Detached House",
  "Office / Commercial",
  "Retail Space",
  "Hospitality",
  "Other",
];

export function getConsultationType(id) {
  return CONSULTATION_TYPES.find((t) => t.id === id) ?? null;
}

/**
 * Resolve selected ids to type objects, in the order they are listed above
 * rather than the order they were clicked — so two bookings for the same pair
 * of services read identically to whoever handles them.
 */
export function getConsultationTypes(ids) {
  if (!Array.isArray(ids)) return [];
  return CONSULTATION_TYPES.filter((t) => ids.includes(t.id));
}

/** Fees add up: each selected type is a separate service at the same rate. */
export function totalFee(ids) {
  return getConsultationTypes(ids).length * CONSULTATION_FEE_NAIRA;
}

/** Combined session length, in minutes, across the selection. */
export function totalMinutes(ids) {
  return getConsultationTypes(ids).reduce((n, t) => n + t.durationMinutes, 0);
}

/** "45 minutes" · "about 2 hours" · "about 2 hours 30 minutes" */
export function formatDuration(minutes) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const h = `${hours} hour${hours > 1 ? "s" : ""}`;
  return rest ? `about ${h} ${rest} minutes` : `about ${h}`;
}

/**
 * Fold the fields the backend has no column for into `additionalNotes`, so the
 * person reading the booking sees them. Ugly, and deliberately so — it is a
 * visible marker of a backend gap, not a design.
 *
 * The fee is written in too. The booking arrives unpaid and there is no fee
 * field on the DTO, so without this line whoever invoices has to re-derive what
 * the client was quoted from the list of services — and quoting a different
 * number afterwards is the fastest way to lose the job.
 */
function composeNotes({ consultationTypes, propertyType, projectDescription }) {
  const types = getConsultationTypes(consultationTypes);
  const labels = types.map((t) => t.label).join(", ");
  const fee = totalFee(consultationTypes);

  const lines = [
    `Consultation types: ${labels || "(none selected)"}`,
    propertyType ? `Property type: ${propertyType}` : null,
    `Quoted fee: ${formatFee(fee)} (${types.length} × ${formatFee(CONSULTATION_FEE_NAIRA)}) — unpaid at booking`,
    "",
    projectDescription || "",
  ].filter((line) => line !== null);
  return lines.join("\n").trim();
}

/**
 * Merge the chosen date and time into the ISO datetime the backend wants.
 * `date` is "YYYY-MM-DD" and `time` is "HH:MM", both from native inputs.
 * Returns null when either is missing so the caller can omit the field.
 */
function toIsoDateTime(date, time) {
  if (!date) return null;
  const local = new Date(`${date}T${time || "09:00"}:00`);
  if (Number.isNaN(local.getTime())) return null;
  return local.toISOString();
}

export const consultationsApi = {
  /**
   * POST /api/v1/inspections/book
   *
   * @param {object} values - the form's values, not the wire payload
   * @returns {Promise<{ success: boolean, bookingId: string, status: string, message: string }>}
   *   Flat, not enveloped.
   */
  book: (values) => {
    const payload = {
      contactName: values.contactName,
      contactPhone: values.contactPhone,
      contactEmail: values.contactEmail,
      siteAddress: values.siteAddress,
      siteCity: values.siteCity,
      siteState: values.siteState,
      preferredDate1: toIsoDateTime(values.preferredDate1, values.preferredTime1),
      preferredDate2: toIsoDateTime(values.preferredDate2, values.preferredTime2),
      uploadedFileUrls: values.uploadedFileUrls ?? [],
      additionalNotes: composeNotes(values),
    };
    // The backend rejects an explicit null for the optional second date.
    if (!payload.preferredDate2) delete payload.preferredDate2;

    return proxyFetch("/inspections/book", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * POST /api/v1/inspections/verify-payment
   * Confirms a Paystack reference already attached to a booking.
   * @param {string} reference
   * @returns {Promise<{ success: boolean, verified: boolean, amount: number, reference: string, paidAt: string|null, message: string }>}
   */
  verifyPayment: (reference) =>
    proxyFetch("/inspections/verify-payment", {
      method: "POST",
      body: JSON.stringify({ reference }),
    }),

  /**
   * POST /api/v1/uploads/document — multipart, field name `file`.
   * Returns the hosted URL for `uploadedFileUrls`.
   * @param {File} file
   * @returns {Promise<string>} the uploaded file's URL
   */
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/proxy/v1/uploads/document", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let backendMessage = `Upload failed (${res.status})`;
      try {
        backendMessage = JSON.parse(text)?.message || backendMessage;
      } catch {}
      logApiError("/uploads/document", res.status, text);
      throw Object.assign(
        new Error(getFriendlyMessage(res.status, backendMessage)),
        { status: res.status },
      );
    }

    const data = await res.json().catch(() => null);
    // The upload response is unmodelled: accept the handful of key names a
    // .NET upload controller plausibly returns rather than guessing one.
    const url =
      data?.url ??
      data?.fileUrl ??
      data?.documentUrl ??
      data?.data?.url ??
      data?.data?.fileUrl ??
      data?.data?.documentUrl ??
      null;

    if (!url) throw new Error("The file uploaded but the server returned no URL.");
    return url;
  },
};
