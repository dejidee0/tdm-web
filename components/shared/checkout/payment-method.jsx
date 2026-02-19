// components/checkout/PaymentMethod.jsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CreditCard, Building2, Landmark, Lock } from "lucide-react";

const paymentMethods = [
  { id: "credit-card", label: "Credit Card", icon: CreditCard },
  { id: "paypal", label: "PayPal", icon: Building2 },
  { id: "financing", label: "Financing", icon: Landmark },
];

export default function PaymentMethod({ onComplete }) {
  const [selectedMethod, setSelectedMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const formatCardNumber = (value) => {
    // Remove all non-numeric characters
    const v = value.replace(/\D/g, "");
    const parts = [];

    // Split into groups of 4
    for (let i = 0, len = v.length; i < len; i += 4) {
      parts.push(v.substring(i, i + 4));
    }

    return parts.join(" ");
  };

  const handleCardNumberChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 16) {
      const formatted = formatCardNumber(value);
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e) => {
    // Only allow numbers
    let value = e.target.value.replace(/\D/g, "");

    // Limit to 4 digits (MMYY)
    if (value.length > 4) {
      value = value.slice(0, 4);
    }

    // Auto-format as MM / YY
    if (value.length >= 2) {
      value = value.slice(0, 2) + " / " + value.slice(2, 4);
    }

    setExpiryDate(value);
  };

  const handleCvcChange = (e) => {
    // Only allow numbers, max 3 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvc(value);
  };

  const handleCardholderNameChange = (e) => {
    // Only allow letters, spaces, hyphens, and apostrophes
    const value = e.target.value.replace(/[^a-zA-Z\s\-']/g, "");
    setCardholderName(value);
  };

  const handleSubmit = () => {
    // Validate fields
    if (!cardNumber || !expiryDate || !cvc || !cardholderName) {
      alert("Please fill in all payment details");
      return;
    }

    // Validate card number length (should be 16 digits)
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      alert("Please enter a valid 16-digit card number");
      return;
    }

    // Validate expiry date (should be MM / YY format)
    if (expiryDate.length !== 7) {
      alert("Please enter a valid expiry date (MM / YY)");
      return;
    }

    // Validate CVC (should be 3 digits)
    if (cvc.length !== 3) {
      alert("Please enter a valid 3-digit CVC");
      return;
    }

    onComplete?.({
      method: selectedMethod,
      cardNumber: cardNumber.slice(-4), // Only store last 4 digits
      expiryDate,
      cardholderName,
      sameAsShipping,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl border border-[#e5e5e5] p-6"
    >
      <h2 className="text-[18px] font-semibold text-text-black mb-6">
        Payment Method
      </h2>

      {/* Payment Method Tabs */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`
                flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all
                ${
                  selectedMethod === method.id
                    ? "border-primary bg-primary/5"
                    : "border-[#e5e5e5] bg-white hover:border-[#d4d4d4]"
                }
              `}
            >
              <Icon className="w-5 h-5 text-[#666666]" />
              <span className="text-[14px] font-medium text-text-black">
                {method.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Credit Card Form */}
      {selectedMethod === "credit-card" && (
        <div className="space-y-5">
          {/* Card Number */}
          <div>
            <label className="block text-[13px] font-medium text-[#666666] mb-2">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="w-full pl-4 pr-12 py-3 bg-background border border-transparent rounded-lg text-[15px] text-text-black placeholder:text-text-black/40 focus:outline-none focus:border-primary focus:bg-white transition-all"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4d4d4]" />
            </div>
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#666666] mb-2">
                Expiration Date
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={expiryDate}
                onChange={handleExpiryChange}
                className="w-full px-4 py-3 bg-background border border-transparent rounded-lg text-[15px] text-text-black placeholder:text-text-black/40 focus:outline-none focus:border-primary focus:bg-white transition-all"
                placeholder="MM / YY"
                maxLength={7}
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#666666] mb-2 flex items-center gap-2">
                CVC
                <button
                  type="button"
                  className="text-[#999999] hover:text-[#666666]"
                  title="3-digit security code on back of card"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cvc}
                onChange={handleCvcChange}
                className="w-full px-4 py-3 bg-background border border-transparent rounded-lg text-[15px] text-text-black placeholder:text-text-black/40 focus:outline-none focus:border-primary focus:bg-white transition-all"
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-[13px] font-medium text-[#666666] mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardholderName}
              onChange={handleCardholderNameChange}
              className="w-full px-4 py-3 bg-background border border-transparent rounded-lg text-[15px] text-text-black placeholder:text-text-black/40 focus:outline-none focus:border-primary focus:bg-white transition-all"
              placeholder="Enter name as shown on card"
            />
          </div>

          {/* Billing Address Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="sameAsShipping"
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
              className="w-5 h-5 rounded border-[#d4d4d4] text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
            />
            <label
              htmlFor="sameAsShipping"
              className="text-[14px] text-text-black cursor-pointer"
            >
              Billing address same as shipping address
            </label>
          </div>
        </div>
      )}

      {/* Order Confirmation Info */}
      <div className="mt-8 p-4 bg-background rounded-lg flex items-start gap-3">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
          <span className="text-[16px]">ℹ️</span>
        </div>
        <div>
          <h4 className="text-[14px] font-semibold text-text-black mb-1">
            Order Confirmation
          </h4>
          <p className="text-[13px] text-[#666666] leading-relaxed">
            You will receive your Order ID # and tracking information via email.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
