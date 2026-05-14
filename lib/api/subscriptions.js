import { logApiError, getFriendlyMessage } from "@/lib/errors";

const BASE = "/api/v1/subscription";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    let data;
    try { data = await res.json(); } catch { data = {}; }
    const backendMessage = data.message || data.title || `Request failed (${res.status})`;
    logApiError(path, res.status, data);
    const error = new Error(getFriendlyMessage(res.status, backendMessage));
    error.code = data.code || null;
    error.status = res.status;
    error.backendMessage = backendMessage;
    throw error;
  }
  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

function normalizeSubscription(raw) {
  if (!raw) return null;
  const s = raw.subscription ?? raw;
  if (!s?.id) return null;
  return {
    id: s.id,
    tier: s.tier?.toLowerCase() ?? null,
    status: s.status?.toLowerCase() ?? null,
    billingCycle: s.billingCycle?.toLowerCase() ?? null,
    generationsUsed: s.generationsUsed ?? 0,
    generationsAllowed: s.unlimitedGenerations ? null : (s.generationsLimit ?? null),
    unlimitedGenerations: s.unlimitedGenerations ?? false,
    prioritySupport: s.prioritySupport ?? false,
    amountPaid: s.amountPaid ?? 0,
    startDate: s.startDate ?? null,
    endDate: s.endDate ?? null,
    quotaResetAt: s.quotaResetAt ?? null,
  };
}

export const subscriptionApi = {
  /** GET /api/v1/subscription/current — authenticated */
  getCurrent: () => request("/current").then(normalizeSubscription),

  /** POST /api/v1/subscription/activate — Economy tier only. cycle: 0=Monthly, 1=Yearly */
  activate: ({ cycle }) =>
    request("/activate", { method: "POST", body: JSON.stringify({ tier: 0, cycle }) }),

  /**
   * POST /api/v1/subscription/subscribe — Premium or Luxury.
   * tier:  1=Premium, 2=Luxury
   * cycle: 0=Monthly, 1=Yearly
   * Backend returns { authorizationUrl } to redirect for payment.
   */
  subscribe: ({ tier, cycle, promoCode, callbackUrl }) =>
    request("/subscribe", {
      method: "POST",
      body: JSON.stringify({ tier, cycle, promoCode, callbackUrl }),
    }),

  /**
   * POST /api/v1/subscription/cancel
   * body: { reason?, feedback? }
   */
  cancel: (body = {}) =>
    request("/cancel", { method: "POST", body: JSON.stringify(body) }),

  /** POST /api/v1/subscription/renew */
  renew: (body = {}) =>
    request("/renew", { method: "POST", body: JSON.stringify(body) }),
};
