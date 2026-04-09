"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { X, Plus, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useDashboardUser } from "@/hooks/use-user-dashboard";
import {
  useUploadRoom,
  useCreateAIProject,
  useGenerateImage,
  useGenerateVideo,
} from "@/hooks/use-ai-services";

const ROOM_TYPES = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining Room",
  "Home Office",
  "Other",
];

// outputType: 1 = Image, 2 = Video (default)
const OUTPUT_TYPES = [
  { id: 2, label: "VIDEO" },
  { id: 1, label: "IMAGE" },
];

export default function CreateNewDesignModal({ isOpen, onClose }) {
  const [outputType, setOutputType] = useState(2);
  const [prompt, setPrompt] = useState("");
  const [contextLabel, setContextLabel] = useState("");
  const [file, setFile] = useState(null);
  const [step, setStep] = useState("form"); // "form" | "generating" | "done" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const { user } = useDashboardUser();
  const firstName = user?.firstName || "there";

  const uploadRoom = useUploadRoom();
  const createAIProject = useCreateAIProject();
  const generateImage = useGenerateImage();
  const generateVideo = useGenerateVideo();

  const canSubmit = prompt.trim() && file && step === "form";

  const handleCreate = async () => {
    if (!canSubmit) return;
    setErrorMsg("");
    setStep("generating");

    try {
      // 1. Upload source image
      const uploadRes = await uploadRoom.mutateAsync(file);
      const sourceImageUrl = uploadRes?.imageUrl;
      if (!sourceImageUrl) throw new Error("Image upload failed.");

      // 2. Create AI project
      const projectRes = await createAIProject.mutateAsync({
        sourceImageUrl,
        outputType,
        prompt,
        contextLabel: contextLabel || undefined,
      });
      const projectId =
        projectRes?.id ??
        projectRes?.data?.id ??
        projectRes?.data?.projectId;
      if (!projectId) throw new Error("Project creation failed.");

      // 3. Generate
      if (outputType === 1) {
        await generateImage.mutateAsync({ projectId });
      } else {
        await generateVideo.mutateAsync({ projectId, durationSeconds: 9 });
      }

      setStep("done");
      queryClient.invalidateQueries({ queryKey: ["ai-projects"] });
    } catch (err) {
      const msg =
        err?.message ||
        (err?.status === 403 && err?.code === "subscription_quota_exceeded"
          ? "AI generation quota exceeded."
          : "Something went wrong. Please try again.");
      setStep("error");
      setErrorMsg(msg);
    }
  };

  const handleClose = () => {
    if (step === "generating") return;
    setOutputType(2);
    setPrompt("");
    setContextLabel("");
    setFile(null);
    setStep("form");
    setErrorMsg("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Wrapper — bottom sheet on mobile, centered on sm+ */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none sm:px-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 48 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden"
              style={{ maxHeight: "92dvh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle (mobile only) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>

              {/* Tab Bar — output type selector */}
              <div className="flex items-center border-b border-gray-200 px-4 sm:px-8 pt-3 sm:pt-6">
                <div className="w-7 shrink-0" />
                <div className="flex-1 flex items-center justify-center gap-4 sm:gap-6">
                  {OUTPUT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => step === "form" && setOutputType(type.id)}
                      disabled={step !== "form"}
                      className={`relative pb-3 text-[10px] sm:text-[11px] font-extrabold tracking-widest whitespace-nowrap transition-colors duration-200 ${
                        outputType === type.id
                          ? "text-[#1a2340]"
                          : "text-[#b0b8c9] hover:text-[#8890a0]"
                      }`}
                    >
                      {type.label}
                      {outputType === type.id && (
                        <motion.div
                          layoutId="tab-underline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                          style={{ backgroundColor: "#1a2340" }}
                          transition={{ type: "spring", stiffness: 500, damping: 38 }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  disabled={step === "generating"}
                  className="w-7 h-7 shrink-0 flex items-center justify-center mb-3 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 px-4 sm:px-8 font-poppins overflow-y-auto">

                {/* Generating state */}
                {step === "generating" && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-16 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#1a2340]" />
                    <p className="text-[16px] font-semibold text-[#1a2340]">
                      Generating your design…
                    </p>
                    <p className="text-[13px] text-[#999]">
                      This may take a moment. Hang tight!
                    </p>
                  </div>
                )}

                {/* Done state */}
                {step === "done" && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-16 gap-4">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                    <p className="text-[16px] font-semibold text-[#1a2340]">
                      Design created!
                    </p>
                    <p className="text-[13px] text-[#999]">
                      Your design is ready in the gallery.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-2 px-6 py-2.5 bg-[#1a2340] text-white text-[14px] font-semibold rounded-xl hover:bg-[#273054] transition-colors"
                    >
                      View Designs
                    </button>
                  </div>
                )}

                {/* Error state */}
                {step === "error" && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-16 gap-4">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                    <p className="text-[16px] font-semibold text-[#1a2340]">
                      Something went wrong
                    </p>
                    <p className="text-[13px] text-[#999]">{errorMsg}</p>
                    <button
                      onClick={() => setStep("form")}
                      className="mt-2 px-6 py-2.5 bg-[#1a2340] text-white text-[14px] font-semibold rounded-xl hover:bg-[#273054] transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Form state */}
                {step === "form" && (
                  <>
                    {/* Greeting */}
                    <motion.div
                      key={outputType}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22 }}
                      className="flex flex-col items-center justify-center text-center py-6 sm:py-8"
                    >
                      <h2
                        className="font-bold font-poppins leading-tight mb-2 text-primary text-2xl sm:text-[28px]"
                        style={{ letterSpacing: "-0.3px" }}
                      >
                        Hey, {firstName}.
                      </h2>
                      <p className="font-semibold mb-1 text-primary text-base sm:text-[17px]">
                        What shall we build today?
                      </p>
                      <p className="text-[13px] sm:text-[13.5px] text-primary/70">
                        Upload a room photo and describe your vision.
                      </p>
                    </motion.div>

                    {/* Room Type (contextLabel) — optional */}
                    <div className="mb-4">
                      <label className="block text-[11px] font-semibold text-[#666] uppercase tracking-wider mb-1.5">
                        Room Type <span className="text-[#b0b8c9]">(optional)</span>
                      </label>
                      <select
                        value={contextLabel}
                        onChange={(e) => setContextLabel(e.target.value)}
                        className="w-full text-[13px] text-[#1a2340] border border-[#e5e8ef] rounded-xl px-3 py-2.5 outline-none focus:border-[#1a2340] bg-white"
                      >
                        <option value="">Select room type…</option>
                        {ROOM_TYPES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Input Row */}
                    <div className="pb-5 sm:pb-6">
                      <div
                        className="flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-1 transition-all duration-200"
                        style={{ border: "1.5px solid #e5e8ef" }}
                      >
                        {/* File upload */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="shrink-0 w-9 h-9 rounded-lg shadow flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
                          title="Upload source image"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />

                        {/* Text input */}
                        <input
                          type="text"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                          placeholder="Describe your dream space..."
                          className="flex-1 min-w-0 text-[14px] placeholder-gray-400 outline-none bg-transparent py-2.5"
                          style={{ color: "#1a2340" }}
                        />

                        {/* Create button */}
                        <motion.button
                          whileTap={canSubmit ? { scale: 0.97 } : {}}
                          onClick={handleCreate}
                          disabled={!canSubmit}
                          className="shrink-0 text-white text-[13px] sm:text-[13.5px] font-semibold px-4 sm:px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: "#1a2340" }}
                          onMouseEnter={(e) => {
                            if (canSubmit)
                              e.currentTarget.style.backgroundColor = "#273054";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#1a2340";
                          }}
                        >
                          Create
                        </motion.button>
                      </div>

                      {/* File indicator */}
                      {file ? (
                        <p className="mt-2 text-[12px] text-[#666] pl-1">{file.name}</p>
                      ) : (
                        <p className="mt-2 text-[12px] text-[#999] pl-1">
                          Upload a reference image to continue
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
