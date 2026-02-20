// lib/api/cart.js
import { getProductById } from "@/lib/data/products";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let mockCartItems = [
  {
    id: "cart-001",
    productId: "1",
    name: "Italian Marble Tile - Carrara White Premium",
    sku: "IM-CAW-1012",
    price: 8.5,
    quantity: 50,
    unit: "sqft",
    image: "/mock/1.svg",
    stockStatus: "In Stock",
    category: "materials",
    type: "product",
  },
  {
    id: "cart-002",
    productId: "2",
    name: "Premium Oak Flooring - Natural Finish",
    sku: "POF-NF-001",
    price: 8.75,
    quantity: 200,
    unit: "sqft",
    image: "/mock/2.svg",
    stockStatus: "In Stock",
    category: "materials",
    type: "product",
  },
];

const mockRelatedProducts = [
  {
    id: "rel-001",
    name: "Premium White Grout",
    price: 19.99,
    image: "/mock/1.svg",
    rating: 4.8,
  },
  {
    id: "rel-002",
    name: 'Tile Spacers (1/8")',
    price: 8.5,
    image: "/mock/2.svg",
    rating: 4.6,
  },
  {
    id: "rel-003",
    name: "Wood Floor Adhesive",
    price: 145.0,
    image: "/mock/3.svg",
    rating: 4.9,
  },
  {
    id: "rel-004",
    name: "Pro Knee Pads",
    price: 34.99,
    image: "/mock/4.svg",
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

  // Add product to cart
  addToCart: async (productId, quantity = 1) => {
    await delay(500);

    const product = getProductById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Check if item already exists in cart
    const existingItem = mockCartItems.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += quantity;
      return {
        success: true,
        item: existingItem,
        message: "Updated cart quantity",
      };
    }

    // Create new cart item
    const cartItem = {
      id: `cart-${Date.now()}`,
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.pricePerSqFt,
      quantity,
      unit: "sqft",
      image: product.images[0],
      stockStatus: product.inStock ? "In Stock" : "Out of Stock",
      category: "materials",
      type: "product",
    };

    mockCartItems.push(cartItem);
    return { success: true, item: cartItem, message: "Added to cart" };
  },
};
