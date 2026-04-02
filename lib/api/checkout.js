// lib/api/checkout.js
// All requests go through the Next.js proxy (/api/proxy/v1).

async function proxyFetch(path, options = {}) {
  const res = await fetch(`/api/proxy/v1${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = `API error ${res.status}`;
    try { message = JSON.parse(text)?.message || message; } catch {}
    throw Object.assign(new Error(message), { status: res.status });
  }
  const text = await res.text();
  return text ? JSON.parse(text) : { success: true };
}

export const checkoutApi = {
  /**
   * GET /api/v1/checkout
   * Returns items, subtotal, shipping, tax, discount, total, savedAddresses.
   * @param {string} [promoCode] - Optional promo code to pre-apply
   */
  getCheckoutData: (promoCode) => {
    const query = promoCode ? `?promoCode=${encodeURIComponent(promoCode)}` : "";
    return proxyFetch(`/checkout${query}`);
  },

  /**
   * POST /api/v1/checkout/validate-promo
   * @param {string} code - Promo code to validate
   */
  validatePromoCode: (code) =>
    proxyFetch("/checkout/validate-promo", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),

  /**
   * POST /api/v1/checkout/payment
   * Initiates payment and returns authorizationUrl (Paystack) or order details.
   *
   * @param {object} payload
   * @param {object} payload.delivery  - { fullName, phone, address, city, state, notes? }
   * @param {object} payload.payment   - { provider: "Paystack"|"BankTransfer", callbackUrl? }
   * @param {number} payload.total     - Must match server-side calculated total
   * @param {string} [payload.promoCode]
   * @param {string} [payload.designSessionId]
   * @param {string} [payload.idempotencyKey]
   */
  submitPayment: (payload) =>
    proxyFetch("/checkout/payment", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /**
   * GET /api/v1/checkout/payment/paystack/verify/{ref}
   * @param {string} reference - Paystack payment reference
   */
  verifyPaystackPayment: (reference) =>
    proxyFetch(`/checkout/payment/paystack/verify/${reference}`),
};
