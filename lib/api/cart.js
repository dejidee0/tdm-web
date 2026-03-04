// lib/api/cart.js
// ─── Pure frontend cart using localStorage ────────────────────────────────────
// When the real API is ready, replace each function body with the actual call.
// Auth-gated endpoint: POST /cart, GET /cart, PATCH /cart/{id}, DELETE /cart/{id}

const CART_KEY = "tdm_cart";
const TAX_RATE = 0.0875;

// ─── Storage helpers ─────────────────────────────────────────────────────────
function readCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeCart(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function computeTotals(items) {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
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

// ─── Promo codes ─────────────────────────────────────────────────────────────
const PROMO_CODES = {
  SAVE10: { discount: 0.1, type: "percentage" },
  FIRST20: { discount: 0.2, type: "percentage" },
  FLAT50: { discount: 50, type: "fixed" },
};

// ─── Cart API ─────────────────────────────────────────────────────────────────
export const cartApi = {
  /** Returns full cart state */
  getCart: async () => {
    const items = readCart();
    return computeTotals(items);
  },

  /**
   * Add a product to cart.
   * Accepts the full product object (from /Products/{id}) so we don't need
   * a separate lookup — the detail page passes the product it already has.
   */
  addToCart: async (product, quantity = 1) => {
    const items = readCart();
    const existing = items.find((i) => i.productId === product.id);

    if (existing) {
      existing.quantity += quantity;
      writeCart(items);
      return {
        success: true,
        item: existing,
        message: "Updated cart quantity",
      };
    }

    const cartItem = {
      id: `cart-${product.id}`, // stable ID — same product always same cart slot
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
    writeCart(items);
    return { success: true, item: cartItem, message: "Added to cart" };
  },

  /** Update the quantity of an existing cart item */
  updateQuantity: async (itemId, quantity) => {
    const items = readCart();
    const item = items.find((i) => i.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      writeCart(items);
    }
    return { success: true, item };
  },

  /** Remove an item from the cart */
  removeItem: async (itemId) => {
    const items = readCart().filter((i) => i.id !== itemId);
    writeCart(items);
    return { success: true };
  },

  /** Clear the entire cart */
  clearCart: async () => {
    writeCart([]);
    return { success: true };
  },

  /** Apply a promo code — returns discount info */
  applyPromoCode: async (code) => {
    const promo = PROMO_CODES[code.toUpperCase()];
    if (!promo) throw new Error("Invalid promo code");
    return { success: true, code: code.toUpperCase(), ...promo };
  },

  /** Item count for navbar badge */
  getCartCount: () => {
    return readCart().reduce((sum, i) => sum + i.quantity, 0);
  },
};
