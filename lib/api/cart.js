// lib/api/cart.js
// All cart operations go through the backend.
// Guest sessions are managed by the backend via the tbm_guest_id cookie
// (set automatically on the first GET /cart call).
// Authenticated sessions use the authBearerToken cookie.

import { logApiError, getFriendlyMessage } from "@/lib/errors";

const TAX_RATE = 0.0875;

// ─── Backend API helper ───────────────────────────────────────────────────────

async function backendFetch(path, options = {}) {
  const res = await fetch(`/api/v1${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  if (!res.ok) {
    const backendMessage = json?.message || json?.title || `Cart error ${res.status}`;
    logApiError(path, res.status, json ?? text);
    throw Object.assign(
      new Error(getFriendlyMessage(res.status, backendMessage)),
      { status: res.status, backendMessage },
    );
  }
  return json;
}

// ─── Normalise backend cart response ─────────────────────────────────────────

function normaliseBackendCart(raw) {
  const root = raw?.data ?? raw ?? {};
  const rawItems = root.items ?? [];

  const items = rawItems.map((item) => ({
    id: String(item.id),
    productId: item.productId,
    name: item.productName,
    sku: item.productSKU ?? null,
    price: item.unitPrice ?? 0,
    priceDisplay: `₦${(item.unitPrice ?? 0).toLocaleString()}.00`,
    quantity: item.quantity ?? 1,
    image: item.productImageUrl ?? null,
    inStock: item.inStock ?? true,
    stockQuantity: item.stockQuantity ?? null,
    categoryName: "",
    brandName: "",
    slug: null,
  }));

  const subtotal = root.subTotal ?? items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * TAX_RATE;

  return {
    items,
    subtotal,
    shipping: 0,
    taxRate: TAX_RATE,
    tax,
    total: subtotal + tax,
    warnings: [],
    estimatedDelivery: {
      earliest: "Wednesday, Oct 26",
      latest: "Friday, Oct 27",
    },
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// Cart API
// ═════════════════════════════════════════════════════════════════════════════

export const cartApi = {
  // GET /api/v1/Cart
  getCart: async () => {
    try {
      const raw = await backendFetch("/cart");
      return normaliseBackendCart(raw);
    } catch {
      return normaliseBackendCart({});
    }
  },

  // POST /api/v1/Cart/items  { productId, quantity }
  addToCart: async (product, quantity = 1) => {
    const raw = await backendFetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId: product.id, quantity }),
    });
    return {
      success: true,
      message: raw?.message || "Added to cart",
      ...normaliseBackendCart(raw),
    };
  },

  // PUT /api/v1/Cart/items/{itemId}  { quantity }
  updateQuantity: async (itemId, quantity) => {
    const raw = await backendFetch(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
    return { success: true, ...normaliseBackendCart(raw) };
  },

  // DELETE /api/v1/Cart/items/{itemId}
  removeItem: async (itemId) => {
    await backendFetch(`/cart/items/${itemId}`, { method: "DELETE" });
    return { success: true };
  },

  // DELETE /api/v1/Cart
  clearCart: async () => {
    await backendFetch("/cart", { method: "DELETE" });
    return { success: true };
  },

  // POST /api/v1/Cart/apply-promo  { code }
  applyPromoCode: async (code) => {
    const raw = await backendFetch("/cart/apply-promo", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    return { success: true, ...raw };
  },

  // POST /api/v1/Cart/merge
  // Called once after login — backend merges the tbm_guest_id session cart
  // into the newly authenticated user's cart using cookies automatically.
  mergeGuestCart: async () => {
    try {
      const raw = await backendFetch("/cart/merge", { method: "POST" });
      return {
        success: true,
        warnings: raw?.warnings ?? [],
        cart: normaliseBackendCart(raw),
      };
    } catch (err) {
      console.warn("[cart] merge failed:", err.message);
      return { success: false, warnings: [], error: err.message };
    }
  },

  // GET /api/v1/Cart/related
  getCartRelated: async () => {
    const raw = await backendFetch("/cart/related");
    const root = raw?.data ?? raw ?? {};
    return root?.items ?? root?.products ?? [];
  },
};
