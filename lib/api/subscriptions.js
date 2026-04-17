const BASE = "/api/v1/subscription";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = {};
    }
    const message = err.message || err.title || `Request failed (${res.status})`;
    const code = err.code || null;
    const error = new Error(message);
    error.code = code;
    error.status = res.status;
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

  /** POST /api/v1/subscription/activate — Economy tier. Sends planId as the subscription reference. */
  activate: ({ planId }) =>
    request("/activate", { method: "POST", body: JSON.stringify({ planId }) }),

  /**
   * POST /api/v1/subscription/subscribe
   * body: { tier, cycle, promoCode?, callbackUrl }
   * tier:  0=Economy, 1=Premium, 2=Luxury
   * cycle: 0=Monthly, 1=Yearly
   * Backend returns { checkoutUrl? } for paid tiers.
   */
  subscribe: (body) =>
    request("/subscribe", { method: "POST", body: JSON.stringify({ dto: body }) }),

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
