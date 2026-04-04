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

export const subscriptionApi = {
  /** GET /api/v1/subscription/current — authenticated */
  getCurrent: () => request("/current"),

  /** POST /api/v1/subscription/activate — Economy tier */
  activate: () => request("/activate", { method: "POST", body: "{}" }),

  /**
   * POST /api/v1/subscription/subscribe
   * body: { tier, billingCycle, promoCode? }
   * Backend returns { checkoutUrl? } for paid tiers when a payment provider is involved.
   */
  subscribe: (body) =>
    request("/subscribe", { method: "POST", body: JSON.stringify(body) }),

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
