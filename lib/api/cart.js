// lib/api/cart.js
// ─── Dual-mode cart ───────────────────────────────────────────────────────────
// Guest  → localStorage (same as before, no auth required)
// Authed → backend /api/v1/cart/* endpoints via Next.js proxy
// On login → call mergeGuestCart() once to sync local → backend, then clear local
// ─────────────────────────────────────────────────────────────────────────────

const CART_KEY = "tdm_cart";
const TAX_RATE = 0.0875;

// ─── Auth detection (lightweight — reads cookie name only) ───────────────────
function isAuthenticated() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith("authToken="));
}

// ─── localStorage helpers (guest cart) ───────────────────────────────────────
function readLocalCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocalCart(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function clearLocalCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

// ─── Totals helper (used for guest and to normalise backend responses) ────────
function computeTotals(items) {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0,
  );
  return {
    items,
    subtotal,
    shipping: 0,
    taxRate: TAX_RATE,
    tax: subtotal * TAX_RATE,
    total: subtotal + subtotal * TAX_RATE,
    estimatedDelivery: {
      earliest: "Wednesday, Oct 26",
      latest: "Friday, Oct 27",
    },
  };
}

// ─── Backend API helpers ──────────────────────────────────────────────────────
async function backendFetch(path, options = {}) {
  const res = await fetch(`/api/v1${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  if (!res.ok) {
    throw new Error(json?.message || json?.title || `Cart error ${res.status}`);
  }
  return json;
}

/**
 * Normalise the backend cart response into the same shape
 * the frontend expects: { items, subtotal, tax, total, shipping, taxRate }
 *
 * Backend may return: { data: { items: [...] } } or { items: [...] }
 * Each item may use cartItemId / productId / unitPrice / qty etc.
 */
function normaliseBackendCart(raw) {
  const root = raw?.data ?? raw ?? {};
  const rawItems = root.items ?? root.cartItems ?? [];

  const items = rawItems.map((item) => ({
    id: String(item.cartItemId ?? item.id ?? item.itemId),
    productId: item.productId ?? item.id,
    name: item.productName ?? item.name,
    sku: item.sku ?? null,
    price: item.unitPrice ?? item.price ?? 0,
    priceDisplay:
      item.priceDisplay ??
      `₦${(item.unitPrice ?? item.price ?? 0).toLocaleString()}.00`,
    quantity: item.quantity ?? item.qty ?? 1,
    image: item.imageUrl ?? item.primaryImageUrl ?? item.image ?? null,
    inStock: item.inStock ?? true,
    stockQuantity: item.stockQuantity ?? null,
    categoryName: item.categoryName ?? "",
    brandName: item.brandName ?? "",
    slug: item.slug ?? null,
  }));

  const subtotal =
    root.subtotal ?? items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = root.tax ?? root.taxAmount ?? subtotal * TAX_RATE;
  const total = root.total ?? root.grandTotal ?? subtotal + tax;

  return {
    items,
    subtotal,
    shipping: root.shipping ?? root.shippingCost ?? 0,
    taxRate: TAX_RATE,
    tax,
    total,
    warnings: root.warnings ?? [],
    estimatedDelivery: root.estimatedDelivery ?? {
      earliest: "Wednesday, Oct 26",
      latest: "Friday, Oct 27",
    },
  };
}

// ─── Promo codes (guest fallback) ─────────────────────────────────────────────
const PROMO_CODES = {
  SAVE10: { discount: 0.1, type: "percentage" },
  FIRST20: { discount: 0.2, type: "percentage" },
  FLAT50: { discount: 50, type: "fixed" },
};

// ═════════════════════════════════════════════════════════════════════════════
// Cart API — public surface
// ═════════════════════════════════════════════════════════════════════════════
export const cartApi = {
  // ── GET cart ────────────────────────────────────────────────────────────────
  getCart: async () => {
    if (isAuthenticated()) {
      // Try GET /api/v1/cart first (primary), fallback to /api/v1/cart/api/cart
      try {
        const raw = await backendFetch("/cart");
        return normaliseBackendCart(raw);
      } catch {
        // backend may 404 if cart doesn't exist yet — return empty
        return computeTotals([]);
      }
    }
    // Guest path
    return computeTotals(readLocalCart());
  },

  // ── Add item ────────────────────────────────────────────────────────────────
  // POST /api/v1/cart/items  { productId, quantity }
  addToCart: async (product, quantity = 1) => {
    if (isAuthenticated()) {
      const raw = await backendFetch("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      return {
        success: true,
        message: raw?.message || "Added to cart",
        ...normaliseBackendCart(raw),
      };
    }

    // Guest path (unchanged)
    const items = readLocalCart();
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
      writeLocalCart(items);
      return {
        success: true,
        item: existing,
        message: "Updated cart quantity",
      };
    }
    const cartItem = {
      id: `cart-${product.id}`,
      productId: product.id,
      name: product.name,
      sku: product.sku && product.sku !== "null" ? product.sku : null,
      price: product.price ?? 0,
      priceDisplay: product.priceDisplay,
      quantity,
      image: product.primaryImageUrl || product.images?.[0] || null,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      categoryName: product.categoryName,
      brandName: product.brandName,
      slug: product.slug,
    };
    items.push(cartItem);
    writeLocalCart(items);
    return { success: true, item: cartItem, message: "Added to cart" };
  },

  // ── Update quantity ─────────────────────────────────────────────────────────
  // PUT /api/v1/cart/items/{itemId}  { quantity }
  updateQuantity: async (itemId, quantity) => {
    if (isAuthenticated()) {
      const raw = await backendFetch(`/cart/items/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });
      return { success: true, ...normaliseBackendCart(raw) };
    }

    const items = readLocalCart();
    const item = items.find((i) => i.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      writeLocalCart(items);
    }
    return { success: true, item };
  },

  // ── Remove item ─────────────────────────────────────────────────────────────
  // DELETE /api/v1/cart/items/{itemId}
  removeItem: async (itemId) => {
    if (isAuthenticated()) {
      await backendFetch(`/cart/items/${itemId}`, { method: "DELETE" });
      return { success: true };
    }

    writeLocalCart(readLocalCart().filter((i) => i.id !== itemId));
    return { success: true };
  },

  // ── Clear cart ──────────────────────────────────────────────────────────────
  // DELETE /api/v1/cart
  clearCart: async () => {
    if (isAuthenticated()) {
      await backendFetch("/cart", { method: "DELETE" });
    }
    clearLocalCart();
    return { success: true };
  },

  // ── Apply promo ─────────────────────────────────────────────────────────────
  // POST /api/cart/apply-promo  { code }
  applyPromoCode: async (code) => {
    if (isAuthenticated()) {
      const raw = await backendFetch("/cart/apply-promo", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      return { success: true, ...raw };
    }
    const promo = PROMO_CODES[code.toUpperCase()];
    if (!promo) throw new Error("Invalid promo code");
    return { success: true, code: code.toUpperCase(), ...promo };
  },

  // ── Merge guest → backend (call once after login) ──────────────────────────
  // POST /api/v1/cart/merge  { items: [{ productId, quantity }] }
  mergeGuestCart: async () => {
    const localItems = readLocalCart();
    if (localItems.length === 0) return { success: true, warnings: [] };

    const payload = {
      items: localItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price ?? 0,
      })),
    };

    try {
      const raw = await backendFetch("/cart/merge", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      clearLocalCart();
      return {
        success: true,
        warnings: raw?.warnings ?? [],
        cart: normaliseBackendCart(raw),
      };
    } catch (err) {
      // Non-fatal — guest items stay local if merge fails
      console.warn("[cart] merge failed:", err.message);
      return { success: false, warnings: [], error: err.message };
    }
  },

  // ── Item count helper (sync, for initial badge render) ───────────────────
  getCartCount: () => readLocalCart().reduce((sum, i) => sum + i.quantity, 0),
};
