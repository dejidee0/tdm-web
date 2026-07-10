// app/checkout/page.jsx
"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCheckoutData, useSubmitPayment } from "@/hooks/use-checkout";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@/hooks/use-session";
import {
  usePersistedState,
  clearPersistedState,
  CHECKOUT_KEYS,
} from "@/hooks/use-persisted-state";
import { checkoutApi } from "@/lib/api/checkout";
import CheckoutSteps from "@/components/shared/checkout/steps";
import DeliveryInformation from "@/components/shared/checkout/info";
import PaymentMethod from "@/components/shared/checkout/payment-method";
import OrderConfirmation from "@/components/shared/checkout/order-confirmation";
import OrderSummary from "@/components/shared/checkout/order-summary";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = usePersistedState(CHECKOUT_KEYS.step, 1);
  const [deliveryData, setDeliveryData] = usePersistedState(
    CHECKOUT_KEYS.delivery,
    null,
  );
  const [paymentData, setPaymentData] = usePersistedState(
    CHECKOUT_KEYS.payment,
    null,
  );
  const [promoCode, setPromoCode] = usePersistedState(CHECKOUT_KEYS.promoCode, "");
  const [promoDiscount, setPromoDiscount] = usePersistedState(
    CHECKOUT_KEYS.promoDiscount,
    0,
  );

  const router = useRouter();
  const { data: cartData } = useCart();
  const { data: checkoutData } = useCheckoutData();
  // Guest status comes from the session, not from a profile fetch: the profile
  // resolves a beat later, and treating that gap as "guest" would submit a
  // signed-in shopper's order as a guest order.
  const { isAuthenticated } = useSession();
  const submitPayment = useSubmitPayment();

  // Use cart data for items/totals (always available), checkout data for saved addresses
  const savedAddresses = checkoutData?.savedAddresses || [];
  const currentAddress =
    savedAddresses.find((a) => a.isDefault) || savedAddresses[0];

  // Build the summary from cart — map cart items to the shape OrderSummary expects

  const checkout = cartData
    ? {
        items: (cartData.items || []).map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          description: item.categoryName || item.brandName || "",
          quantity: item.quantity,
          pricePerUnit: item.price,
          price: item.price * item.quantity,
          unit: null,
        })),
        subtotal: cartData.subtotal || 0,
        shipping: cartData.shipping || 0,
        tax: cartData.tax || 0,
        discount: checkoutData?.discount || 0,
        // Prefer server total from checkoutData if available
        total: checkoutData?.total || cartData.total || 0,
      }
    : null;

  const handlePaymentComplete = useCallback(
    (data) => {
      setPaymentData(data);
      if (data.promoCode) setPromoCode(data.promoCode);
    },
    [setPaymentData, setPromoCode],
  );

  const handlePromoChange = useCallback(
    (code, discount) => {
      setPromoCode(code);
      setPromoDiscount(discount || 0);
    },
    [setPromoCode, setPromoDiscount],
  );

  // Redirect if cart is empty
  if (cartData && cartData.items?.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleDeliveryComplete = (data) => {
    setDeliveryData(data);
    setCurrentStep(2);
    setPaymentData((prev) => prev || { method: "Paystack", promoCode: "" });
  };

  const handleSubmitPayment = async () => {
    const delivery = deliveryData || currentAddress;
    const payment = paymentData || { method: "Paystack" };

    // Always fetch server-authoritative total right before submitting
    // to avoid "amount mismatch" errors from stale or client-computed totals
    let serverTotal = checkoutData?.total || 0;
    try {
      const fresh = await checkoutApi.getCheckoutData(promoCode || undefined);
      serverTotal = fresh?.total || serverTotal;
    } catch {
      // fall back to cached checkout total or cart total
      serverTotal = serverTotal || cartData?.total || 0;
    }

    const isGuest = !isAuthenticated;

    // A checkout originating from an AI design flow arrives as
    // /checkout?designSessionId=… — forward it when present.
    const designSessionId =
      new URLSearchParams(window.location.search).get("designSessionId") ||
      undefined;

    const payload = {
      designSessionId,
      // Guest identity — only sent for guests; authenticated users are
      // identified by their bearer token, so these stay omitted.
      guestEmail: isGuest ? deliveryData?.email || undefined : undefined,
      guestPhone: isGuest
        ? deliveryData?.phone || delivery.phone || undefined
        : undefined,
      guestSessionId: isGuest ? cartData?.guestSessionId || undefined : undefined,
      delivery: {
        fullName: delivery.fullName || null,
        phone: delivery.phone || null,
        address: delivery.address || delivery.line1 || null,
        city: delivery.city || null,
        state: delivery.state || null,
        notes: delivery.notes || null,
        customerNotes: delivery.notes || null,
      },
      payment: {
        method: payment.method || "Paystack",
        reference: null,
        callbackUrl: `${window.location.origin}/checkout/verify`,
      },
      total: serverTotal,
      promoCode: promoCode || undefined,
    };

    submitPayment.mutate(payload, {
      onSuccess: (data) => {
        // Order placed — clear the persisted checkout draft so a fresh
        // visit starts clean.
        clearPersistedState(Object.values(CHECKOUT_KEYS));
        if (data?.authorizationUrl) {
          window.location.href = data.authorizationUrl;
        } else if (data?.orderId) {
          // BankTransfer or instant confirmation
          router.push(
            `/checkout/verify?orderId=${data.orderId}&confirmed=true`,
          );
        }
      },
      onError: (err) => {
        alert(err.message || "Payment failed. Please try again.");
      },
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Sticky mobile bottom bar — only on payment step */}
      {currentStep === 2 && (
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/08 p-4"
          style={{ background: "#0d0b08" }}
        >
          <button
            onClick={handleSubmitPayment}
            disabled={submitPayment.isPending}
            className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 text-black disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)",
            }}
          >
            {submitPayment.isPending
              ? "Redirecting to Paystack…"
              : `Confirm & Pay · ₦${(checkout?.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back to Cart */}
        {currentStep !== 3 && (
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Cart
          </Link>
        )}

        <CheckoutSteps currentStep={currentStep} />

        {/* Grid — summary first on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-8 mt-6 pb-24 lg:pb-0">
          {/* Order Summary (top on mobile, right on desktop) */}
          <div className="order-first lg:order-last lg:sticky lg:top-6 h-fit">
            <OrderSummary
              checkout={checkout}
              currentStep={currentStep}
              onSubmitPayment={handleSubmitPayment}
              promoDiscount={promoDiscount}
              isSubmitting={submitPayment.isPending}
            />
          </div>

          {/* Forms */}
          <div className="order-last lg:order-first space-y-6">
            {currentStep === 1 && (
              <DeliveryInformation
                savedAddress={deliveryData || currentAddress}
                savedAddresses={savedAddresses}
                onComplete={handleDeliveryComplete}
                isGuest={!isAuthenticated}
              />
            )}

            {currentStep === 2 && (
              <>
                <DeliveryInformation
                  savedAddress={deliveryData || currentAddress}
                  savedAddresses={savedAddresses}
                  readonly={true}
                  onEdit={() => setCurrentStep(1)}
                />
                <PaymentMethod
                  onComplete={handlePaymentComplete}
                  onPromoChange={handlePromoChange}
                />
              </>
            )}

            {currentStep === 3 && <OrderConfirmation orderId={null} />}
          </div>
        </div>
      </div>
    </div>
  );
}
