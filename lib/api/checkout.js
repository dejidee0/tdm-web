// lib/api/checkout.js
import { cartApi } from "./cart";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const checkoutApi = {
  // Get checkout data from cart
  getCheckoutData: async () => {
    await delay(500);

    // Get cart data
    const cart = await cartApi.getCart();

    if (!cart.items || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Transform cart items to checkout format
    const checkoutItems = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      description: `${item.sku}`,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price * item.quantity, // Total price for this item
      pricePerUnit: item.price,
      image: item.image,
      type: item.type,
    }));

    // Calculate totals
    const subtotal = cart.subtotal;
    const shipping = cart.shipping;
    const tax = Math.round(subtotal * 0.0875 * 100) / 100; // 8.75% tax
    const total = subtotal + shipping + tax;

    return {
      items: checkoutItems,
      subtotal,
      shipping,
      tax,
      total,
      isLoggedIn: true, // TODO: Get from auth
      savedAddresses: [
        {
          id: "addr-001",
          label: "Home",
          line1: "64, Awolowo Way",
          city: "Ikeja",
          state: "Lagos",
          zipCode: "",
          country: "Nigeria",
          isDefault: true,
        },
        {
          id: "addr-002",
          label: "Office",
          line1: "Adebolu Street, Ikeja",
          city: "Lagos",
          state: "Lagos",
          zipCode: "",
          country: "Nigeria",
          isDefault: false,
        },
      ],
      defaultAddress: {
        id: "addr-001",
        label: "Home",
        line1: "64, Awolowo Way",
        city: "Ikeja",
        state: "Lagos",
        zipCode: "",
        country: "Nigeria",
        isDefault: true,
      },
      deliveryNote: "",
    };
  },

  // Submit payment
  submitPayment: async (paymentData) => {
    await delay(2000);

    // TODO: Implement actual payment processing
    // This would typically:
    // 1. Validate payment details
    // 2. Process payment with payment gateway
    // 3. Create order in database
    // 4. Clear cart
    // 5. Send confirmation email

    return {
      success: true,
      orderId: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      message: "Payment successful",
    };
  },

  // Validate promo code
  validatePromoCode: async (code) => {
    await delay(500);

    const validCodes = {
      SAVE10: { discount: 0.1, type: "percentage" },
      WELCOME20: { discount: 0.2, type: "percentage" },
    };

    if (validCodes[code.toUpperCase()]) {
      return {
        success: true,
        code: code.toUpperCase(),
        ...validCodes[code.toUpperCase()],
      };
    }

    throw new Error("Invalid promo code");
  },
};
