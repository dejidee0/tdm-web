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
      className="rounded-2xl border border-white/08 p-6 md:p-8"
      style={{ background: "#0d0b08" }}
    >
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all"
                style={
                  currentStep >= step.number
                    ? { background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)", borderColor: "#D4AF37" }
                    : { background: "transparent", borderColor: "rgba(255,255,255,0.15)" }
                }
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5 text-black" />
                ) : (
                  <span
                    className={`text-[16px] font-semibold ${
                      currentStep >= step.number ? "text-black" : "text-white/30"
                    }`}
                  >
                    {step.number}
                  </span>
                )}
              </div>
              <span
                className={`text-[13px] font-medium mt-2 ${
                  currentStep >= step.number ? "text-white" : "text-white/30"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-4 transition-all"
                style={{
                  background: currentStep > step.number
                    ? "linear-gradient(90deg, #D4AF37, #b8962e)"
                    : "rgba(255,255,255,0.08)",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
