"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What areas does TBM serve?",
    a: "TBM currently operates in Abuja and Lagos, with delivery and project execution teams in both cities. We are expanding to other major Nigerian cities.",
  },
  {
    q: "How does the Ziora AI design tool work?",
    a: "Upload a photo of your room, select the room type and your preferred style, and Ziora generates a premium design concept within seconds. You can then use the result to get an estimate, shop matching materials, or book a consultation.",
  },
  {
    q: "Can I buy materials without booking a renovation project?",
    a: "Absolutely. The Bogat store is fully independent — you can browse, add to cart, and checkout for any product without engaging TBM for project execution.",
  },
  {
    q: "How long does a typical bathroom renovation take?",
    a: "Most bathroom renovations take 2–4 weeks depending on scope, existing conditions, and material availability. Your project manager will give you a precise timeline after the initial inspection.",
  },
  {
    q: "Do you offer a warranty on completed projects?",
    a: "Yes. TBM provides a workmanship warranty on all executed projects, and Bogat materials carry manufacturer warranties. Full details are included in every project agreement.",
  },
  {
    q: "What is the consultation fee?",
    a: "Initial consultations are structured to give you a full project assessment, scope, and estimate. Our team will confirm current consultation fees during the booking step — and the fee is credited toward your project if you proceed.",
  },
  {
    q: "Can I track my project progress?",
    a: "Yes. Your account dashboard includes a project tracker where you can see milestone updates, material delivery status, and team notes throughout the build.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-primary text-xs font-inter font-semibold uppercase tracking-widest mb-2">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-primary font-bold text-primary">
            Common Questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${
                open === index ? "border-primary/30 bg-primary/[0.02]" : "border-gray-200 bg-white"
              }`}
            >
              <button
                onClick={() => setOpen(open === index ? null : index)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-inter font-semibold text-gray-900 text-sm sm:text-base">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: open === index ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="shrink-0"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-colors ${open === index ? "text-primary" : "text-gray-400"}`}
                  />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5">
                      <p className="text-sm sm:text-base font-inter text-gray-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
