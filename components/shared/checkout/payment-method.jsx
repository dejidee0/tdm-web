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

const inputClass =
  "w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-[15px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all";

export default function PaymentMethod({ onComplete }) {
  const [selectedMethod, setSelectedMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, "");
    const parts = [];
    for (let i = 0, len = v.length; i < len; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(" ");
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 16) setCardNumber(formatCardNumber(value));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) value = value.slice(0, 2) + " / " + value.slice(2, 4);
    setExpiryDate(value);
  };

  const handleCvcChange = (e) => {
    setCvc(e.target.value.replace(/\D/g, "").slice(0, 3));
  };

  const handleCardholderNameChange = (e) => {
    setCardholderName(e.target.value.replace(/[^a-zA-Z\s\-']/g, ""));
  };

  const handleSubmit = () => {
    if (!cardNumber || !expiryDate || !cvc || !cardholderName) {
      alert("Please fill in all payment details");
      return;
    }
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      alert("Please enter a valid 16-digit card number");
      return;
    }
    if (expiryDate.length !== 7) {
      alert("Please enter a valid expiry date (MM / YY)");
      return;
    }
    if (cvc.length !== 3) {
      alert("Please enter a valid 3-digit CVC");
      return;
    }

    onComplete?.({
      method: selectedMethod,
      cardNumber: cardNumber.slice(-4),
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
      className="rounded-2xl border border-white/08 p-6"
      style={{ background: "#0d0b08" }}
    >
      <h2 className="text-[18px] font-semibold text-white mb-6">
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
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all"
              style={
                selectedMethod === method.id
                  ? { borderColor: "#D4AF37", background: "rgba(212,175,55,0.08)" }
                  : { borderColor: "rgba(255,255,255,0.10)", background: "transparent" }
              }
            >
              <Icon className="w-5 h-5 text-white/50" />
              <span className="text-[14px] font-medium text-white">
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
            <label className="block text-[13px] font-medium text-white/40 mb-2">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className={`${inputClass} pr-12`}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            </div>
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-white/40 mb-2">
                Expiration Date
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={expiryDate}
                onChange={handleExpiryChange}
                className={inputClass}
                placeholder="MM / YY"
                maxLength={7}
              />
            </div>
            <div>
              <label className="flex text-[13px] font-medium text-white/40 mb-2 items-center gap-2">
                CVC
                <button
                  type="button"
                  className="text-white/30 hover:text-white/50"
                  title="3-digit security code on back of card"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cvc}
                onChange={handleCvcChange}
                className={inputClass}
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-[13px] font-medium text-white/40 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardholderName}
              onChange={handleCardholderNameChange}
              className={inputClass}
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
              className="w-5 h-5 rounded border-white/20 bg-[#1a1a1a] accent-[#D4AF37]"
            />
            <label htmlFor="sameAsShipping" className="text-[14px] text-white/60 cursor-pointer">
              Billing address same as shipping address
            </label>
          </div>
        </div>
      )}

      {/* Order Confirmation Info */}
      <div
        className="mt-8 p-4 rounded-lg flex items-start gap-3"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(212,175,55,0.12)" }}
        >
          <span className="text-[14px] text-[#D4AF37] font-bold">i</span>
        </div>
        <div>
          <h4 className="text-[14px] font-semibold text-white mb-1">
            Order Confirmation
          </h4>
          <p className="text-[13px] text-white/40 leading-relaxed">
            You will receive your Order ID # and tracking information via email.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
