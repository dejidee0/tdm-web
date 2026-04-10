"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon,
  Video,
  UploadCloud,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Crown,
  ChevronDown,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useDashboardUser } from "@/hooks/use-user-dashboard";
import {
  useCreateDesignSession,
  useUploadSessionPhoto,
  useGenerateDesign,
  useDesignSessionStatus,
} from "@/hooks/use-designs";
import { useCreateAIProject } from "@/hooks/use-ai-services";
import { aiGenerationApi } from "@/lib/api/ai-services";
import { useSubscriptionState } from "@/hooks/use-subscription";
import UpgradeWallModal from "./upgrade-wall-modal";

const ROOM_TYPES = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining Room",
  "Home Office",
  "Other",
];

const GENERATION_STAGES = [
  "Analysing your description…",
  "Mapping Nigerian materials and context…",
  "Rendering spatial layout…",
  "Applying lighting and textures…",
  "Finalising your design…",
];

function useGenerationStage(active) {
  const [stageIndex, setStageIndex] = useState(0);
  useEffect(() => {
    if (!active) { setStageIndex(0); return; }
    const id = setInterval(() => {
      setStageIndex((i) => (i + 1) % GENERATION_STAGES.length);
    }, 3200);
    return () => clearInterval(id);
  }, [active]);
  return GENERATION_STAGES[stageIndex];
}

export default function ZioraStudio() {
  const [outputType, setOutputType] = useState("image"); // "image" | "video"
  const [prompt, setPrompt] = useState("");
  const [roomType, setRoomType] = useState("");
  const [tier, setTier] = useState(2);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [step, setStep] = useState("form"); // form | generating | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const { user } = useDashboardUser();
  const firstName = user?.firstName || "there";

  const {
    isLuxury,
    quotaExhausted,
    generationsUsed,
    generationsAllowed,
  } = useSubscriptionState();

  const createSession = useCreateDesignSession();
  const uploadPhoto = useUploadSessionPhoto();
  const generateDesign = useGenerateDesign();
  const createAIProject = useCreateAIProject();

  const generationStage = useGenerationStage(step === "generating");

  const { data: statusData } = useDesignSessionStatus(sessionId, {
    enabled: step === "generating" && outputType === "image",
  });

  useEffect(() => {
    if (!statusData) return;
    const status = statusData?.status ?? statusData;
    if (status === "Generated" || status === 4) {
      setStep("done");
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    } else if (status === "Failed" || status === 8) {
      setStep("error");
      setErrorMsg("Generation failed. Please try again.");
    }
  }, [statusData, queryClient]);

  useEffect(() => {
    return () => { if (filePreview) URL.revokeObjectURL(filePreview); };
  }, [filePreview]);

  const applyFile = useCallback((chosen) => {
    if (!chosen) return;
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(chosen);
    setFilePreview(URL.createObjectURL(chosen));
  }, [filePreview]);

  const handleFileChange = (e) => {
    applyFile(e.target.files?.[0] ?? null);
    e.target.value = "";
  };

  const removeFile = () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(null);
    setFilePreview(null);
  };

  // Drag-and-drop handlers
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && /^image\/(jpeg|png|webp)$/.test(dropped.type)) applyFile(dropped);
  };

  const canSubmit =
    prompt.trim() &&
    (outputType === "video" || roomType) &&
    step === "form";

  const handleGenerate = async () => {
    if (!canSubmit) return;
    if (quotaExhausted) { setShowUpgradeModal(true); return; }

    setErrorMsg("");
    setStep("generating");

    try {
      if (outputType === "video") {
        const projectRes = await createAIProject.mutateAsync({
          name: prompt.slice(0, 80),
          description: prompt,
        });
        const projectId =
          projectRes?.data?.id ?? projectRes?.data?.projectId ?? projectRes?.id;
        await aiGenerationApi.generateVideo({ projectId });
        setStep("done");
        queryClient.invalidateQueries({ queryKey: ["ai-projects"] });
      } else {
        const sessionRes = await createSession.mutateAsync({
          projectName: prompt.slice(0, 80),
          roomType,
          visionText: prompt,
          tier,
        });
        const id =
          sessionRes?.data?.id ?? sessionRes?.data?.sessionId ?? sessionRes?.id;
        setSessionId(id);
        if (file) await uploadPhoto.mutateAsync({ sessionId: id, file });
        await generateDesign.mutateAsync(id);
      }
    } catch (err) {
      setStep("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleReset = () => {
    setPrompt("");
    setRoomType("");
    setTier(2);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(null);
    setFilePreview(null);
    setSessionId(null);
    setStep("form");
    setErrorMsg("");
  };

  return (
    <>
      <section className="max-w-315 mx-auto px-4 sm:px-6 lg:px-8 py-10 font-manrope">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3 h-3" /> Ziora Studio
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Hey, {firstName}. What shall we build?
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Describe your vision and let Ziora bring it to life.
            </p>
          </div>

          {generationsAllowed !== null ? (
            <div className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold ${
              quotaExhausted ? "bg-orange-100 text-orange-700" : "bg-primary/5 text-primary"
            }`}>
              {generationsUsed} / {generationsAllowed} generations used
            </div>
          ) : (
            <div className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-100 text-purple-700 text-sm font-semibold">
              <Crown className="w-3.5 h-3.5" /> Unlimited generations
            </div>
          )}
        </div>

        {/* Studio card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-gray-200 shadow-sm overflow-hidden"
        >
          {/* Generating state */}
          <AnimatePresence>
            {step === "generating" && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center px-8 py-24 gap-5"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <Loader2 className="w-16 h-16 animate-spin text-primary/20 absolute inset-0" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-primary">Working on your design…</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={generationStage}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35 }}
                      className="text-sm text-gray-400 mt-1"
                    >
                      {generationStage}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Done state */}
          <AnimatePresence>
            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center px-8 py-24 gap-4"
              >
                <CheckCircle className="w-14 h-14 text-green-500" />
                <div>
                  <p className="text-lg font-semibold text-primary">
                    {outputType === "video" ? "Video" : "Design"} created!
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Ready in your gallery.
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold hover:bg-[#273054] transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Generate Another
                  </button>
                  <a
                    href="/dashboard/ai-designs"
                    className="px-5 py-2.5 border border-gray-300 text-primary text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    View Gallery
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error state */}
          <AnimatePresence>
            {step === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center px-8 py-24 gap-4"
              >
                <AlertCircle className="w-14 h-14 text-red-400" />
                <div>
                  <p className="text-lg font-semibold text-primary">Something went wrong</p>
                  <p className="text-sm text-gray-400 mt-1">{errorMsg}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="mt-1 px-6 py-2.5 bg-primary text-white text-sm font-semibold hover:bg-[#273054] transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form state */}
          <AnimatePresence>
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* ── Output type toggle ─────────────────────────── */}
                <div className="flex items-center gap-1 px-6 sm:px-8 pt-6 pb-0">
                  {[
                    { id: "image", label: "Image", Icon: ImageIcon },
                    { id: "video", label: "Video", Icon: Video },
                  ].map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setOutputType(id)}
                      className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold border-b-2 transition-colors ${
                        outputType === id
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
                <div className="border-b border-gray-100 mx-6 sm:mx-8" />

                <div className="px-6 sm:px-8 py-7 space-y-5">

                  {/* ── Prompt textarea ─────────────────────────── */}
                  <div>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && e.metaKey && handleGenerate()}
                      rows={5}
                      placeholder={
                        outputType === "video"
                          ? "Describe the scene you want to animate — e.g. a cinematic walk-through of a modern open-plan living space with warm evening lighting…"
                          : "Describe your vision — e.g. a modern minimalist kitchen with marble countertops, warm pendant lighting and open shelving…"
                      }
                      className="w-full text-[15px] text-primary placeholder-gray-300 border border-gray-200 px-4 py-4 outline-none focus:border-primary bg-white resize-none transition-colors leading-relaxed"
                    />
                    <p className="mt-1.5 text-xs text-gray-300 text-right">
                      {prompt.length > 0 && `${prompt.length} chars · `}⌘ + Enter to generate
                    </p>
                  </div>

                  {/* ── Room type row (image only) ───────────────── */}
                  <AnimatePresence>
                    {outputType === "image" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1">
                            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                              Room type <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                              <select
                                value={roomType}
                                onChange={(e) => setRoomType(e.target.value)}
                                className="w-full appearance-none text-sm text-primary border border-gray-200 px-3 py-2.5 pr-8 outline-none focus:border-primary bg-white"
                              >
                                <option value="">Select room type…</option>
                                {ROOM_TYPES.map((r) => (
                                  <option key={r} value={r}>{r}</option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                          </div>

                          {isLuxury && (
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                                Quality
                              </label>
                              <div className="flex border border-gray-200 overflow-hidden">
                                {[{ val: 1, label: "Luxury" }, { val: 2, label: "Standard" }].map(({ val, label }) => (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() => setTier(val)}
                                    className={`px-5 py-2.5 text-xs font-semibold transition-colors ${
                                      tier === val
                                        ? "bg-primary text-white"
                                        : "bg-white text-gray-400 hover:text-primary"
                                    }`}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Reference image upload ───────────────────── */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Reference Image
                      <span className="ml-1.5 normal-case font-normal tracking-normal text-gray-300">— optional</span>
                    </label>

                    <AnimatePresence mode="wait">
                      {filePreview ? (
                        /* ── Preview ── */
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="relative inline-block"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={filePreview}
                            alt="Reference"
                            className="h-44 w-auto max-w-xs object-cover border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={removeFile}
                            className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <p className="mt-1 text-xs text-gray-400 truncate max-w-xs">{file?.name}</p>
                        </motion.div>
                      ) : (
                        /* ── Drop zone ── */
                        <motion.div
                          key="dropzone"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`flex flex-col items-center justify-center gap-2 py-7 border-2 border-dashed cursor-pointer transition-colors ${
                            isDragging
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                          }`}
                        >
                          <UploadCloud className={`w-7 h-7 ${isDragging ? "text-primary" : "text-gray-300"}`} />
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">
                              Drag a photo here, or{" "}
                              <span className="text-primary underline underline-offset-2">browse</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              JPG, PNG or WEBP · max 1 image
                            </p>
                          </div>
                          <p className="text-xs text-gray-400 text-center max-w-xs leading-relaxed mt-1 px-4">
                            Attaching a photo of your existing space gives Ziora more context
                            and produces a significantly more accurate result.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* ── Generate button ──────────────────────────── */}
                  <div className="flex justify-end pt-1">
                    <motion.button
                      whileTap={canSubmit ? { scale: 0.97 } : {}}
                      onClick={handleGenerate}
                      disabled={!canSubmit}
                      className="flex items-center gap-2 px-7 py-3 bg-primary text-white text-sm font-semibold hover:bg-[#273054] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate {outputType === "video" ? "Video" : "Design"}
                    </motion.button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <UpgradeWallModal
        isOpen={showUpgradeModal}
        reason="quota"
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  );
}
