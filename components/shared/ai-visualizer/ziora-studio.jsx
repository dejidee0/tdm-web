"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Crown,
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

const TABS = [
  { id: "text-to-image", label: "Text to Image" },
  { id: "image-to-image", label: "Image to Image" },
  { id: "image-to-video", label: "Image to Video" },
];

export default function ZioraStudio() {
  const [activeTab, setActiveTab] = useState("text-to-image");
  const [prompt, setPrompt] = useState("");
  const [roomType, setRoomType] = useState("");
  const [tier, setTier] = useState(2);
  const [file, setFile] = useState(null);
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
    isPremium,
    quotaExhausted,
    generationsUsed,
    generationsAllowed,
  } = useSubscriptionState();

  const createSession = useCreateDesignSession();
  const uploadPhoto = useUploadSessionPhoto();
  const generateDesign = useGenerateDesign();
  const createAIProject = useCreateAIProject();

  const needsFile = activeTab !== "text-to-image";

  const { data: statusData } = useDesignSessionStatus(sessionId, {
    enabled: step === "generating" && activeTab !== "image-to-video",
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

  const canSubmit =
    prompt.trim() &&
    (activeTab === "image-to-video" || roomType) &&
    (!needsFile || file) &&
    step === "form";

  const handleGenerate = async () => {
    if (!canSubmit) return;
    if (quotaExhausted) {
      setShowUpgradeModal(true);
      return;
    }

    setErrorMsg("");
    setStep("generating");

    try {
      if (activeTab === "image-to-video") {
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

        if (activeTab === "image-to-image" && file) {
          await uploadPhoto.mutateAsync({ sessionId: id, file });
        }

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
    setFile(null);
    setSessionId(null);
    setStep("form");
    setErrorMsg("");
  };

  return (
    <>
      <section className="max-w-315 mx-auto px-4 sm:px-6 lg:px-8 py-10 font-manrope">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3 h-3" /> Ziora Studio
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Hey, {firstName}. What shall we build?
            </h1>
            <p className="text-gray-500 mt-1">
              Describe your vision or upload a reference photo.
            </p>
          </div>

          {/* Quota badge */}
          {generationsAllowed !== null ? (
            <div
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold ${
                quotaExhausted
                  ? "bg-orange-100 text-orange-700"
                  : "bg-primary/5 text-primary"
              }`}
            >
              {generationsUsed} / {generationsAllowed} generations used
            </div>
          ) : (
            <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-100 text-purple-700 text-sm font-semibold">
              <Crown className="w-3.5 h-3.5" /> Unlimited generations
            </div>
          )}
        </div>

        {/* Studio card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
        >
          {/* Tab bar */}
          <div className="flex gap-6 px-6 sm:px-8 pt-6 border-b border-gray-100 overflow-x-auto scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => step === "form" && setActiveTab(tab.id)}
                disabled={step !== "form"}
                className={`pb-3 text-[12px] font-bold tracking-widest whitespace-nowrap border-b-2 transition-colors duration-200 -mb-px ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="px-6 sm:px-8 py-8">
            {/* Generating */}
            {step === "generating" && (
              <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-lg font-semibold text-primary">
                  Generating your design…
                </p>
                <p className="text-sm text-gray-400">
                  This may take a moment. Hang tight!
                </p>
              </div>
            )}

            {/* Done */}
            {step === "done" && (
              <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <p className="text-lg font-semibold text-primary">
                  Design created!
                </p>
                <p className="text-sm text-gray-400">
                  Your design is ready in the gallery.
                </p>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-[#273054] transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Generate Another
                  </button>
                  <a
                    href="/dashboard/ai-designs"
                    className="px-5 py-2.5 border border-gray-300 text-primary text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    View Gallery
                  </a>
                </div>
              </div>
            )}

            {/* Error */}
            {step === "error" && (
              <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-lg font-semibold text-primary">
                  Something went wrong
                </p>
                <p className="text-sm text-gray-400">{errorMsg}</p>
                <button
                  onClick={handleReset}
                  className="mt-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-[#273054] transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Form */}
            {step === "form" && (
              <div className="space-y-5">
                {/* Room type + tier (not for video) */}
                {activeTab !== "image-to-video" && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Room Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        className="w-full text-sm text-primary border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-primary bg-white"
                      >
                        <option value="">Select room type…</option>
                        {ROOM_TYPES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Only show tier selector for Luxury users who unlocked both */}
                    {isLuxury && (
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                          Quality
                        </label>
                        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setTier(1)}
                            className={`px-5 py-2.5 text-xs font-semibold transition-colors ${
                              tier === 1
                                ? "bg-primary text-white"
                                : "bg-white text-gray-400 hover:text-primary"
                            }`}
                          >
                            Luxury
                          </button>
                          <button
                            type="button"
                            onClick={() => setTier(2)}
                            className={`px-5 py-2.5 text-xs font-semibold transition-colors ${
                              tier === 2
                                ? "bg-primary text-white"
                                : "bg-white text-gray-400 hover:text-primary"
                            }`}
                          >
                            Standard
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Prompt input */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Describe your vision
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-1 focus-within:border-primary transition-colors">
                    {needsFile && (
                      <>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="shrink-0 w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
                          title="Upload reference image"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) =>
                            setFile(e.target.files?.[0] ?? null)
                          }
                        />
                      </>
                    )}
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !e.shiftKey && handleGenerate()
                      }
                      placeholder={
                        activeTab === "image-to-video"
                          ? "Describe the scene to animate…"
                          : "E.g. Modern minimalist kitchen with marble countertops…"
                      }
                      className="flex-1 min-w-0 text-sm placeholder-gray-300 outline-none bg-transparent py-3 text-primary"
                    />
                    <motion.button
                      whileTap={canSubmit ? { scale: 0.97 } : {}}
                      onClick={handleGenerate}
                      disabled={!canSubmit}
                      className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-[#273054] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </motion.button>
                  </div>

                  {needsFile && (
                    <p className="mt-2 text-xs text-gray-400 pl-1">
                      {file ? `File: ${file.name}` : "Upload a reference image to continue"}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
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
