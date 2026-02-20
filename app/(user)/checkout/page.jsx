// app/checkout/page.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCheckoutData, useSubmitPayment } from "@/hooks/use-checkout";
import CheckoutSteps from "@/components/shared/checkout/steps";
import DeliveryInformation from "@/components/shared/checkout/info";
import PaymentMethod from "@/components/shared/checkout/payment-method";
import OrderConfirmation from "@/components/shared/checkout/order-confirmation";
import OrderSummary from "@/components/shared/checkout/order-summary";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryData, setDeliveryData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const router = useRouter();
  const { data: checkout, isLoading, error } = useCheckoutData();
  const submitPayment = useSubmitPayment();

  // Redirect to cart if empty
  if (error && error.message === "Cart is empty") {
    router.push("/cart");
    return null;
  }

  const savedAddresses = checkout?.savedAddresses || [];
  const currentAddress =
    savedAddresses.find((addr) => addr.isDefault) || savedAddresses[0];

  const handleDeliveryComplete = (data) => {
    setDeliveryData(data);
    setCurrentStep(2);
  };

  const handlePaymentComplete = (data) => {
    setPaymentData(data);
    // Don't move to step 3 yet - wait for payment submission
  };

  const handleSubmitPayment = () => {
    if (!paymentData) {
      alert("Please complete payment information");
      return;
    }

    submitPayment.mutate(
      {
        delivery: deliveryData || currentAddress,
        payment: paymentData,
        items: checkout.items,
        total: checkout.total,
      },
      {
        onSuccess: (data) => {
          setOrderId(data.orderId);
          setCurrentStep(3);
        },
        onError: (error) => {
          alert(error.message || "Payment failed. Please try again.");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[14px] text-[#666666]">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-24 pt-20">
        {/* Checkout Steps */}
        <CheckoutSteps currentStep={currentStep} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-8 mt-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <DeliveryInformation
                savedAddress={currentAddress}
                savedAddresses={savedAddresses}
                onComplete={handleDeliveryComplete}
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
                <PaymentMethod onComplete={handlePaymentComplete} />
              </>
            )}

            {currentStep === 3 && <OrderConfirmation orderId={orderId} />}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-6 h-fit">
            <OrderSummary
              checkout={checkout}
              currentStep={currentStep}
              onSubmitPayment={handleSubmitPayment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
