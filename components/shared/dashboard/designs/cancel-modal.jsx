"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useCancelSubscription } from "@/hooks/use-subscription";

const REASONS = [
  "Too expensive",
  "Not using it enough",
  "Missing features I need",
  "Switching to another tool",
  "Technical issues",
  "Just taking a break",
  "Other",
];

export default function CancelModal({ isOpen, onClose, accessUntil }) {
  const [step, setStep] = useState(1); // 1 | 2 | 3
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  const cancel = useCancelSubscription();

  const accessDate = accessUntil
    ? new Date(accessUntil).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const handleConfirmCancel = async () => {
    try {
      await cancel.mutateAsync({ reason, feedback });
      setDone(true);
      setTimeout(() => {
        onClose?.();
        setStep(1);
        setReason("");
        setFeedback("");
        setDone(false);
      }, 2000);
    } catch {
      // error shown inline
    }
  };

  const handleClose = () => {
    if (cancel.isPending) return;
    setStep(1);
    setReason("");
    setFeedback("");
    setDone(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden font-manrope"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-primary">
                  {step === 1 && "Cancel Subscription?"}
                  {step === 2 && "One quick question"}
                  {step === 3 && "Confirm Cancellation"}
                </h2>
                <button
                  onClick={handleClose}
                  disabled={cancel.isPending}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-6 py-6">
                {/* Step 1 — Confirmation */}
                {step === 1 && (
                  <div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Are you sure you want to cancel? Your access continues
                      until your current billing period ends.
                    </p>
                    {accessDate && (
                      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 font-medium">
                        You'll have full access until{" "}
                        <span className="font-bold">{accessDate}</span>.
                      </div>
                    )}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 py-2.5 border border-red-300 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
                      >
                        Continue to Cancel
                      </button>
                      <button
                        onClick={handleClose}
                        className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#273054] transition-colors"
                      >
                        Keep My Plan
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2 — Questionnaire */}
                {step === 2 && (
                  <div>
                    <p className="text-gray-500 text-sm mb-4">
                      Help us improve — why are you leaving?{" "}
                      <span className="text-gray-400">(optional)</span>
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {REASONS.map((r) => (
                        <button
                          key={r}
                          onClick={() => setReason(r === reason ? "" : r)}
                          className={`text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                            reason === r
                              ? "border-primary bg-primary/5 text-primary font-medium"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Anything else you'd like us to know…"
                      rows={3}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-primary resize-none text-primary placeholder-gray-300"
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setStep(1)}
                        className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        className="flex-1 py-2.5 border border-red-300 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => {
                          setReason("");
                          setFeedback("");
                          setStep(3);
                        }}
                        className="px-4 py-2.5 text-gray-400 text-sm hover:text-gray-600 transition-colors"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3 — Final confirm */}
                {step === 3 && (
                  <div>
                    {done ? (
                      <div className="text-center py-8">
                        <p className="text-green-600 font-semibold text-base">
                          Subscription canceled.
                        </p>
                        {accessDate && (
                          <p className="text-gray-500 text-sm mt-2">
                            You have access until {accessDate}.
                          </p>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          This will cancel your subscription at the end of your
                          current billing period.{accessDate && (
                            <> You'll retain access until{" "}
                              <strong>{accessDate}</strong>.</>
                          )}
                        </p>

                        {cancel.isError && (
                          <p className="text-red-500 text-sm mb-3">
                            {cancel.error?.message || "Cancellation failed. Please try again."}
                          </p>
                        )}

                        <div className="flex gap-3">
                          <button
                            onClick={() => setStep(2)}
                            disabled={cancel.isPending}
                            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleConfirmCancel}
                            disabled={cancel.isPending}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {cancel.isPending && (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            Yes, Cancel Subscription
                          </button>
                          <button
                            onClick={handleClose}
                            disabled={cancel.isPending}
                            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#273054] transition-colors disabled:opacity-50"
                          >
                            Keep Plan
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
