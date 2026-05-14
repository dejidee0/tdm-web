// lib/api/orders.js
// Customer-facing order API — all requests go through the Next.js proxy.

import { logApiError, getFriendlyMessage } from "@/lib/errors";

async function proxyFetch(path, options = {}) {
  const res = await fetch(`/api/proxy/v1${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 401) throw new Error("Your session has expired. Please sign in again.");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let json = null;
    try { json = JSON.parse(text); } catch {}
    const backendMessage = json?.message || json?.title || `API error ${res.status}`;
    logApiError(path, res.status, json ?? text);
    throw Object.assign(new Error(getFriendlyMessage(res.status, backendMessage)), { status: res.status, backendMessage });
  }
  const text = await res.text();
  return text ? JSON.parse(text) : { success: true };
}

export const ordersApi = {
  /** GET /api/v1/orders/my-orders */
  getMyOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return proxyFetch(`/orders/my-orders${query ? `?${query}` : ""}`);
  },

  /** GET /api/v1/orders/{orderId} */
  getOrderDetails: (orderId) => proxyFetch(`/orders/${orderId}`),

  /** GET /api/v1/orders/number/{number} */
  getOrderByNumber: (number) => proxyFetch(`/orders/number/${number}`),

  /** GET /api/v1/orders/{orderId}/invoice */
  getInvoiceUrl: (orderId) => proxyFetch(`/orders/${orderId}/invoice`),

  /** POST /api/v1/orders/{orderId}/cancel */
  cancelOrder: (orderId, reason) =>
    proxyFetch(`/orders/${orderId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  /**
   * POST /api/v1/orders — create order directly from cart
   * @param {{ shippingFullName, shippingPhone, shippingAddress, shippingCity,
   *           shippingState, shippingCountry, shippingPostalCode,
   *           paymentMethod?, notes? }} data
   */
  createOrder: (data) =>
    proxyFetch("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
