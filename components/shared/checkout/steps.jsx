// components/checkout/CheckoutSteps.jsx
"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { number: 1, label: "Delivery" },
  { number: 2, label: "Payment" },
  { number: 3, label: "Confirmation" },
];

export default function CheckoutSteps({ currentStep }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-[#e5e5e5] p-6 md:p-8"
    >
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                  ${
                    currentStep > step.number
                      ? "bg-primary border-primary"
                      : currentStep === step.number
                        ? "bg-primary border-primary"
                        : "bg-white border-[#d4d4d4]"
                  }
                `}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span
                    className={`text-[16px] font-semibold ${
                      currentStep >= step.number
                        ? "text-white"
                        : "text-[#999999]"
                    }`}
                  >
                    {step.number}
                  </span>
                )}
              </div>
              <span
                className={`text-[13px] font-medium mt-2 ${
                  currentStep >= step.number ? "text-primary" : "text-[#999999]"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-all ${
                  currentStep > step.number ? "bg-primary" : "bg-[#e5e5e5]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
