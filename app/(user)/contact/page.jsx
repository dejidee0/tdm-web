"use client";
import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  ChevronDown,
  FileText,
  SendHorizonal,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { showToast } from "@/components/shared/toast";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.yourbackend.com";

// Form types — maps URL ?type param to a display label and pipeline tag
const FORM_TYPES = [
  { key: "consultation", label: "Book a Consultation", pipeline: "Renovation Lead" },
  { key: "estimate", label: "Get a Project Estimate", pipeline: "Renovation Lead" },
  { key: "product", label: "Product / Material Inquiry", pipeline: "Product Inquiry" },
  { key: "ziora", label: "Ziora AI Inquiry", pipeline: "Ziora Lead" },
  { key: "partnership", label: "Partnership / Vendor Inquiry", pipeline: "Partnership" },
  { key: "other", label: "General Inquiry", pipeline: "General" },
];

const BUDGETS = [
  "Under ₦1M",
  "₦1M – ₦5M",
  "₦5M – ₦15M",
  "₦15M – ₦30M",
  "Above ₦30M",
  "Prefer not to say",
];

const CONTACT_METHODS = ["WhatsApp", "Email", "Phone Call", "Video Call", "In-Person"];

const FAQS = [
  {
    q: "How quickly can I schedule a consultation?",
    a: "We typically confirm consultations within 24 hours of a request. Same-week slots are usually available for Abuja and Lagos.",
  },
  {
    q: "Do you offer virtual consultations?",
    a: "Yes — video consultations are available. You can also use Ziora AI to generate a design concept before booking a formal session.",
  },
  {
    q: "Is there a fee for the initial project review?",
    a: "There is a structured consultation fee which is fully credited toward your project cost if you proceed with TBM.",
  },
  {
    q: "Can I inquire about a specific product from the Bogat store?",
    a: "Yes — select 'Product / Material Inquiry' and describe the product you're interested in. Our team will respond with availability and pricing.",
  },
];

function ContactPageInner() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const defaultType =
    FORM_TYPES.find((t) => t.key === typeParam) || FORM_TYPES[0];

  const [selectedType, setSelectedType] = useState(defaultType);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isMethodOpen, setIsMethodOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  // Re-sync if URL param changes
  useEffect(() => {
    const found = FORM_TYPES.find((t) => t.key === typeParam);
    if (found) setSelectedType(found);
  }, [typeParam]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      showToast.error({ title: "Missing Info", message: "Please enter your full name." });
      return;
    }
    if (!formData.email.trim()) {
      showToast.error({ title: "Missing Info", message: "Please enter your email address." });
      return;
    }
    if (!formData.message.trim()) {
      showToast.error({ title: "Missing Info", message: "Please tell us about your project." });
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      subject: `[${selectedType.pipeline}] ${selectedType.label}`,
      message: formData.message.trim(),
      budget: selectedBudget || undefined,
      preferredContact: selectedMethod || undefined,
      pipeline: selectedType.pipeline,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();
      let json = null;
      try { json = JSON.parse(rawText); } catch {}

      if (!res.ok) {
        const errMsg = json?.message || json?.title || rawText || `Server returned ${res.status}`;
        showToast.error({ title: `Error ${res.status}`, message: errMsg });
        return;
      }

      showToast.success({
        title: "Message Sent!",
        message: json?.message || "We'll get back to you within 24 hours.",
      });

      setFormData({ fullName: "", email: "", phoneNumber: "", message: "" });
      setSelectedType(FORM_TYPES[0]);
      setSelectedBudget("");
      setSelectedMethod("");
    } catch (err) {
      showToast.error({
        title: "Network Error",
        message: err.message || "Unable to send message. Please check your connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E7EB] font-manrope">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12 pt-32 lg:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column — Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2 mb-4 sm:mb-6"
            >
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-primary text-xs sm:text-sm font-medium tracking-wide uppercase">
                Contact Us
              </span>
            </motion.div>

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
              Choose your inquiry type below and we&apos;ll route your message to the right team — renovation, materials, Ziora AI, or partnerships.
            </motion.p>

            {/* Contact quick-links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 sm:mb-8"
            >
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wide">Call</span>
                </div>
                <a href="tel:+2349066913241" className="text-primary text-sm font-bold">
                  (+234) 906-691-3241
                </a>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wide">WhatsApp</span>
                </div>
                <a
                  href="https://wa.me/2349066913241"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 text-sm font-bold"
                >
                  Chat Now
                </a>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wide">Email</span>
                </div>
                <a href="mailto:info@tbmbuilding.com" className="text-primary text-sm font-bold break-all">
                  info@tbmbuilding.com
                </a>
              </div>
            </motion.div>

            {/* Office info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8"
            >
              <div className="flex items-start gap-2 text-sm text-[#475569]">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Showroom: Maitama, Abuja (& Lagos branch)</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-[#475569]">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Mon – Sat: 8am – 6pm</span>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              {/* Inquiry type */}
              <div>
                <label className="block text-primary text-base sm:text-lg font-bold mb-2">
                  What can we help you with?
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsTypeOpen(!isTypeOpen)}
                    className="w-full bg-white rounded-xl px-4 py-4 text-left text-primary shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium">{selectedType.label}</span>
                      <span className="ml-2 text-xs text-primary/50 font-inter">→ {selectedType.pipeline}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isTypeOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isTypeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
                      >
                        {FORM_TYPES.map((t) => (
                          <button
                            key={t.key}
                            type="button"
                            onClick={() => { setSelectedType(t); setIsTypeOpen(false); }}
                            className={`w-full px-4 py-3.5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${selectedType.key === t.key ? "bg-primary/5 text-primary" : "text-gray-700"}`}
                          >
                            <span className="font-medium text-sm">{t.label}</span>
                            <span className="text-xs text-gray-400">{t.pipeline}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="bg-white rounded-xl px-4 py-3 sm:py-4 text-sm sm:text-base text-primary placeholder:text-[#94a3b8] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="bg-white rounded-xl px-4 py-3 sm:py-4 text-sm sm:text-base text-primary placeholder:text-[#94a3b8] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone / WhatsApp Number"
                className="w-full bg-white rounded-xl px-4 py-3 sm:py-4 text-sm sm:text-base text-primary placeholder:text-[#94a3b8] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {/* Budget + preferred contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsBudgetOpen(!isBudgetOpen)}
                    className="w-full bg-white rounded-xl px-4 py-3 sm:py-4 text-left text-[#94a3b8] text-sm sm:text-base shadow-sm flex items-center justify-between"
                  >
                    <span className={selectedBudget ? "text-primary" : ""}>
                      {selectedBudget || "Budget Range (Optional)"}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isBudgetOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isBudgetOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
                      >
                        {BUDGETS.map((b, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => { setSelectedBudget(b); setIsBudgetOpen(false); }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 text-primary text-sm"
                          >
                            {b}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMethodOpen(!isMethodOpen)}
                    className="w-full bg-white rounded-xl px-4 py-3 sm:py-4 text-left text-[#94a3b8] text-sm sm:text-base shadow-sm flex items-center justify-between"
                  >
                    <span className={selectedMethod ? "text-primary" : ""}>
                      {selectedMethod || "Preferred Contact Method"}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isMethodOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isMethodOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
                      >
                        {CONTACT_METHODS.map((m, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => { setSelectedMethod(m); setIsMethodOpen(false); }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 text-primary text-sm"
                          >
                            {m}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={
                  selectedType.key === "product"
                    ? "Describe the product or material you're looking for..."
                    : selectedType.key === "ziora"
                    ? "Tell us about your AI design inquiry or project..."
                    : selectedType.key === "partnership"
                    ? "Tell us about your company and what you're proposing..."
                    : "Tell us about your project — space, scope, timeline, location..."
                }
                rows={5}
                required
                className="w-full bg-white rounded-xl px-4 py-3 sm:py-4 text-sm sm:text-base text-primary placeholder:text-[#94a3b8] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />

              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white rounded-xl py-3 sm:py-4 text-sm sm:text-base font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-opacity"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <SendHorizonal className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </motion.button>

              <p className="text-[#94a3b8] text-xs text-center mt-2">
                By submitting, you agree to our Terms and Privacy Policy.
              </p>
            </motion.form>

            {/* WhatsApp quick CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-4"
            >
              <a
                href="https://wa.me/2349066913241"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3.5 text-sm font-semibold transition-colors shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp Instead
              </a>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-10 sm:mt-12"
            >
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <h2 className="text-primary text-lg sm:text-xl font-bold">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between text-primary text-sm sm:text-base font-medium"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <p className="px-4 sm:px-6 pb-4 sm:pb-5 text-[#64748b] text-sm sm:text-base leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column — Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative h-[500px] sm:h-[600px] lg:h-full lg:min-h-[700px] lg:mt-[72px]"
          >
            <div className="relative h-[94%] overflow-hidden rounded-2xl">
              <Image
                src="/contact.svg"
                alt="TBM Building Services"
                fill
                className="object-cover w-full h-full"
              />

              {/* Testimonial overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 lg:bottom-60 lg:top-auto bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-white"
              >
                <svg className="w-8 h-8 mb-3" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M10 18c0-4.4 3.6-8 8-8v4c-2.2 0-4 1.8-4 4v2h4v8h-8v-10zm16 0c0-4.4 3.6-8 8-8v4c-2.2 0-4 1.8-4 4v2h4v8h-8v-10z" />
                </svg>
                <p className="text-sm sm:text-base leading-relaxed mb-4">
                  &ldquo;TBM transformed our renovation process. The Ziora AI tool gave us clarity before we spent a naira — and the execution team delivered exactly what was promised.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-white text-sm">
                    KA
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Kemi Adeoti</div>
                    <div className="text-xs opacity-80">Homeowner, Maitama Abuja</div>
                  </div>
                </div>
              </motion.div>

              {/* Showroom badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 bg-black/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-white flex items-center gap-3"
              >
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold">Visit Our Showroom</p>
                  <p className="text-xs opacity-70">Abuja & Lagos · Mon–Sat 8am–6pm</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageInner />
    </Suspense>
  );
}
