// lib/api/cart.js

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let mockCartItems = [
  {
    id: "cart-001",
    productId: "prod-001",
    name: "Italian Marble Tile - Carrara White Premium",
    sku: "IM-CAW-1012",
    price: 12.5,
    quantity: 50,
    unit: "sqft",
    image: "/products/marble-tile.jpg",
    stockStatus: "In Stock",
    category: "materials",
    type: "product",
  },
  {
    id: "cart-002",
    productId: "prod-002",
    name: "Premium Oak Flooring - Natural Finish",
    sku: "POF-NF-001",
    price: 8.75,
    quantity: 200,
    unit: "sqft",
    image: "/products/oak-flooring.jpg",
    stockStatus: "In Stock",
    category: "materials",
    type: "product",
  },
  {
    id: "cart-003",
    productId: "serv-001",
    name: "1-Hour Interior Design Consultation",
    sku: "CONS-01",
    price: 75.0,
    quantity: 1,
    unit: null,
    image: "/services/consultation-icon.jpg",
    stockStatus: "Service",
    category: "service",
    type: "service",
    isPriceFixed: true,
  },
];

const mockRelatedProducts = [
  {
    id: "rel-001",
    name: "Premium White Grout",
    price: 19.99,
    image: "/products/white-grout.jpg",
    rating: 4.8,
  },
  {
    id: "rel-002",
    name: 'Tile Spacers (1/8")',
    price: 8.5,
    image: "/products/tile-spacers.jpg",
    rating: 4.6,
  },
  {
    id: "rel-003",
    name: "Wood Floor Adhesive",
    price: 145.0,
    image: "/products/floor-adhesive.jpg",
    rating: 4.9,
  },
  {
    id: "rel-004",
    name: "Pro Knee Pads",
    price: 34.99,
    image: "/products/knee-pads.jpg",
    rating: 4.7,
  },
];

export const cartApi = {
  // Get cart items
  getCart: async () => {
    await delay(800);
    return {
      items: mockCartItems,
      subtotal: mockCartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      shipping: 0, // Free shipping
      taxRate: 0.0875, // 8.75% - calculated at checkout
      estimatedDelivery: {
        earliest: "Wednesday, Oct 26",
        latest: "Friday, Oct 27",
      },
    };
  },

  // Update item quantity
  updateQuantity: async (itemId, quantity) => {
    await delay(500);
    const item = mockCartItems.find((i) => i.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
    return { success: true, item };
  },

  // Remove item from cart
  removeItem: async (itemId) => {
    await delay(500);
    const index = mockCartItems.findIndex((i) => i.id === itemId);
    if (index > -1) {
      mockCartItems.splice(index, 1);
    }
    return { success: true };
  },

  // Apply promo code
  applyPromoCode: async (code) => {
    await delay(600);

    // Mock promo codes
    const promoCodes = {
      SAVE10: { discount: 0.1, type: "percentage" },
      FIRST20: { discount: 0.2, type: "percentage" },
      FLAT50: { discount: 50, type: "fixed" },
    };

    const promo = promoCodes[code.toUpperCase()];
    if (!promo) {
      throw new Error("Invalid promo code");
    }

    return {
      success: true,
      code: code.toUpperCase(),
      discount: promo.discount,
      type: promo.type,
    };
  },

  // Get related products
  getRelatedProducts: async () => {
    await delay(700);
    return mockRelatedProducts;
  },

  // Add related product to cart
  addToCart: async (productId) => {
    await delay(500);
    return { success: true, message: "Added to cart" };
  },
};
