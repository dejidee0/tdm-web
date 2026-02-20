"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  ChevronDown,
  FileText,
  SendHorizonal,
} from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  const [selectedService, setSelectedService] = useState(
    "Consultation for Home Renovation",
  );
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isMethodOpen, setIsMethodOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const services = [
    "Consultation for Home Renovation",
    "New Construction",
    "Interior Design",
    "Commercial Projects",
  ];

  const budgets = [
    "Under $50k",
    "$50k - $100k",
    "$100k - $250k",
    "Above $250k",
  ];
  const methods = ["Email", "Phone", "Video Call", "In-Person"];

  const faqs = [
    "How quickly can I schedule a consultation?",
    "Do you offer virtual consultations?",
    "Is there a fee for the initial project review?",
  ];

  return (
    <div className="min-h-screen bg-[#E5E7EB] font-manrope">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12 pt-32 lg:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Contact Us Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2 mb-4 sm:mb-6"
            >
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-primary text-xs sm:text-sm font-medium tracking-wide uppercase">
                Contact Us
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-primary text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 leading-tight"
            >
              Let&apos;s build your vision.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[#475569] text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed"
            >
              Have a project in mind? Choose a topic below and we&apos;ll route
              you to the right expert instantly.
            </motion.p>

            {/* Contact Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8"
            >
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="text-[#6B7280] text-xs sm:text-sm font-bold uppercase tracking-wide">
                    Call Us Now
                  </span>
                </div>
                <a
                  href="tel:+2349066913241"
                  className="text-primary text-base sm:text-lg font-bold break-all"
                >
                  (+234) 906-691-3241
                </a>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="text-[#6B7280] text-xs sm:text-sm font-bold uppercase tracking-wide">
                    Email Us
                  </span>
                </div>
                <a
                  href="mailto:info@tbmbuilding.com"
                  className="text-primary text-base sm:text-lg font-bold break-all"
                >
                  info@tbmbuilding.com
                </a>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              {/* Service Dropdown */}
              <div>
                <label className="block text-primary text-base sm:text-lg font-bold mb-2">
                  What can we help you with?
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsServiceOpen(!isServiceOpen)}
                    className="w-full bg-white rounded-xl px-4 py-4 text-left text-primary shadow-sm flex items-center justify-between"
                  >
                    <span>{selectedService}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        isServiceOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isServiceOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      {services.map((service, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setSelectedService(service);
                            setIsServiceOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 text-primary"
                        >
                          {service}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="bg-white rounded-xl px-4 py-3 sm:py-4 text-sm sm:text-base text-primary placeholder:text-[#94a3b8] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="bg-white rounded-xl px-4 py-3 sm:py-4 text-sm sm:text-base text-primary placeholder:text-[#94a3b8] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Budget and Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsBudgetOpen(!isBudgetOpen)}
                    className="w-full bg-white rounded-xl px-4 py-3 sm:py-4 text-left text-[#94a3b8] text-sm sm:text-base shadow-sm flex items-center justify-between"
                  >
                    <span className="truncate">
                      {selectedBudget || "Project Budget (Optional)"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        isBudgetOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isBudgetOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      {budgets.map((budget, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setSelectedBudget(budget);
                            setIsBudgetOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 text-primary"
                        >
                          {budget}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMethodOpen(!isMethodOpen)}
                    className="w-full bg-white rounded-xl px-4 py-3 sm:py-4 text-left text-[#94a3b8] text-sm sm:text-base shadow-sm flex items-center justify-between"
                  >
                    <span className="truncate">
                      {selectedMethod || "Preferred Contact Method"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        isMethodOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isMethodOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      {methods.map((method, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setSelectedMethod(method);
                            setIsMethodOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 text-primary"
                        >
                          {method}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Message */}
              <textarea
                placeholder="Tell us about your project..."
                rows={5}
                className="w-full bg-white rounded-xl px-4 py-3 sm:py-4 text-sm sm:text-base text-primary placeholder:text-[#94a3b8] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              ></textarea>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full bg-primary text-white rounded-xl py-3 sm:py-4 text-sm sm:text-base font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                Send Message
                <SendHorizonal className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              <p className="text-[#94a3b8] text-xs text-center mt-4">
                By submitting, you agree to our Terms and Privacy Policy.
              </p>
            </motion.form>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 sm:mt-12"
            >
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <h2 className="text-primary text-lg sm:text-xl font-bold">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between text-primary text-sm sm:text-base font-medium"
                    >
                      <span className="pr-4">{faq}</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          openFaq === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 sm:px-6 pb-4 sm:pb-5 text-[#64748b] text-sm sm:text-base"
                      >
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image with Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative h-[500px] sm:h-[600px] lg:h-full lg:min-h-[700px] lg:mt-[72px]"
          >
            <div className="relative h-[94%]  overflow-hidden">
              {/* Replaced img with Next.js Image */}
              <Image
                src="/contact.svg" // make sure this is in the public folder
                alt="Luxury interior"
                fill
                className="object-cover w-full h-full"
              />

              {/* Testimonial Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 lg:bottom-60 lg:top-auto bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-white"
              >
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4"
                  viewBox="0 0 40 40"
                  fill="currentColor"
                >
                  <path d="M10 18c0-4.4 3.6-8 8-8v4c-2.2 0-4 1.8-4 4v2h4v8h-8v-10zm16 0c0-4.4 3.6-8 8-8v4c-2.2 0-4 1.8-4 4v2h4v8h-8v-10z" />
                </svg>
                <p className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                  &ldquo;The team at TBM Digital transformed our renovation
                  process. The AI visualization was a game-changer, and the
                  support was instant.&ldquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400 rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-base">
                    KA
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">
                      Kemi Adeoti
                    </div>
                    <div className="text-xs sm:text-sm opacity-80">
                      Interior Architect, LBT
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Expert Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-32 sm:bottom-24 lg:bottom-20 left-4 sm:left-8 right-4 sm:right-auto bg-white/10 backdrop-blur-xl rounded-2xl p-3 sm:p-4 text-white flex items-center gap-3 sm:gap-4 max-w-[90%] sm:max-w-none"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs opacity-80 uppercase tracking-wide mb-0.5 sm:mb-1">
                    Your Local Expert
                  </div>
                  <div className="font-semibold text-sm sm:text-base">
                    Sarah Jenkins
                  </div>
                  <div className="text-xs opacity-80">
                    Avg. response in 5 mins
                  </div>
                </div>
                <button className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors shrink-0">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
              </motion.div>

              {/* Showroom Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-auto rounded-xl overflow-hidden text-white text-xs sm:text-sm font-medium flex items-center gap-2 sm:gap-3 px-3 py-6 sm:px-4 sm:py-3 bg-black/60 backdrop-blur-sm shadow-lg"
              >
                {/* Optional: background gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-white/10 via-gray-400/20 to-black/50 pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="whitespace-nowrap">Find Showroom</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
