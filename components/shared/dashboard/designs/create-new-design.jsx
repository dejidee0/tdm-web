"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  ImageIcon,
  Video,
  UploadCloud,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Camera,
  ChevronDown,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useDashboardUser } from "@/hooks/use-user-dashboard";
import {
  useUploadRoom,
  useCreateAIProject,
  useGenerateImage,
  useGenerateVideo,
} from "@/hooks/use-ai-services";

// ── Constants ─────────────────────────────────────────────────────────────

const OUTPUT_TYPES = [
  {
    id: 1,
    label: "Still Image",
    sublabel: "A single high-resolution render of your redesigned space",
    Icon: ImageIcon,
  },
  {
    id: 2,
    label: "Video Tour",
    sublabel: "An animated walkthrough that brings the space to life",
    Icon: Video,
  },
];

const CONTEXT_CATEGORIES = [
  {
    label: "Interior Design",
    tags: [
      "Living room design", "Bedroom design", "Kitchen design", "Bathroom design",
      "Office interior", "Commercial interior", "Minimalist interior", "Luxury interior",
      "Modern interior", "Contemporary interior", "Scandinavian style", "Industrial style",
      "Traditional interior",
    ],
  },
  {
    label: "Construction",
    tags: [
      "Residential construction", "Commercial construction", "Renovation", "Remodeling",
      "Structural work", "Finishing work", "Civil works", "Drywall installation",
      "Flooring installation", "Roofing", "Plumbing", "Electrical works", "Painting & finishing",
    ],
  },
  {
    label: "Furniture",
    tags: [
      "Sofas", "Chairs", "Tables", "Wardrobes", "Cabinets",
      "TV units", "Bed frames", "Shelving", "Office desks", "Reception desks",
    ],
  },
  {
    label: "Materials",
    tags: [
      "Wood", "MDF", "Plywood", "Marble", "Granite", "Tiles", "PVC panels",
      "Gypsum board", "Concrete", "Steel", "Aluminum", "Glass", "Laminate", "Veneer",
    ],
  },
];

const EXAMPLE_PROMPTS = [
  "Modern minimalist living room with warm wood tones and natural light",
  "Luxury bedroom with floor-to-ceiling windows and neutral palette",
  "Contemporary kitchen with marble island and open shelving",
  "Cosy home office with built-in shelves and earthy tones",
];

const GENERATION_STAGES = [
  "Analysing your description…",
  "Mapping Nigerian materials and context…",
  "Rendering spatial layout…",
  "Applying lighting and textures…",
  "Finalising your design…",
];

function useGenerationStage(active) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!active) { setIndex(0); return; }
    const id = setInterval(() => setIndex((i) => (i + 1) % GENERATION_STAGES.length), 3200);
    return () => clearInterval(id);
  }, [active]);
  return GENERATION_STAGES[index];
}

// ── Context tag picker ────────────────────────────────────────────────────

function ContextTagPicker({ contextTags, setContextTags }) {
  const [openCategory, setOpenCategory] = useState(CONTEXT_CATEGORIES[0].label);

  const toggle = (tag) =>
    setContextTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  return (
    <div className="border border-gray-200 rounded-xl divide-y divide-gray-200 overflow-hidden mb-1">
      {CONTEXT_CATEGORIES.map(({ label, tags }) => {
        const isOpen = openCategory === label;
        const selectedInCategory = tags.filter((t) => contextTags.includes(t)).length;
        return (
          <div key={label}>
            {/* Category header — toggle */}
            <button
              type="button"
              onClick={() => setOpenCategory(isOpen ? null : label)}
              className="w-full flex items-center justify-between px-3 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {label}
                </span>
                {selectedInCategory > 0 && (
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white leading-none">
                    {selectedInCategory}
                  </span>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Tags — animated expand */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="tags"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 px-3 pb-3 pt-1 bg-gray-50/60">
                    {tags.map((tag) => {
                      const active = contextTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggle(tag)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all whitespace-nowrap ${
                            active
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary bg-white"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Footer — selected count + clear */}
      {contextTags.length > 0 && (
        <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50">
          <p className="text-xs font-semibold text-primary">
            {contextTags.length} tag{contextTags.length !== 1 ? "s" : ""} selected
          </p>
          <button
            type="button"
            onClick={() => setContextTags([])}
            className="text-xs font-medium text-gray-600 hover:text-gray-900 underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

// ── Step label ────────────────────────────────────────────────────────────

function StepLabel({ number, title, note }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shrink-0">
        {number}
      </span>
      <span className="text-sm font-bold text-primary">{title}</span>
      {note && <span className="text-xs font-medium text-gray-500 ml-0.5">{note}</span>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function CreateNewDesignModal({ isOpen, onClose }) {
  const [outputType, setOutputType] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [contextTags, setContextTags] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [step, setStep] = useState("form");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const { user } = useDashboardUser();
  const firstName = user?.firstName || "there";

  const uploadRoom = useUploadRoom();
  const createAIProject = useCreateAIProject();
  const generateImage = useGenerateImage();
  const generateVideo = useGenerateVideo();

  const generationStage = useGenerationStage(step === "generating");

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

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && /^image\/(jpeg|png|webp)$/.test(dropped.type)) applyFile(dropped);
  };

  const canSubmit = prompt.trim() && file && step === "form";

  const handleCreate = async () => {
    if (!canSubmit) return;
    setErrorMsg("");
    setStep("generating");

    try {
      let sourceImageUrl;
      if (file) {
        const uploadRes = await uploadRoom.mutateAsync(file);
        sourceImageUrl = uploadRes?.imageUrl;
        if (!sourceImageUrl) throw new Error("Image upload failed.");
      }

      const projectRes = await createAIProject.mutateAsync({
        sourceImageUrl,
        outputType,
        prompt,
        contextTags: contextTags.length > 0 ? contextTags : undefined,
      });
      const projectId =
        projectRes?.id ?? projectRes?.data?.id ?? projectRes?.data?.projectId;
      if (!projectId) throw new Error("Project creation failed.");

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
          ? "Your generation quota is used up. Upgrade your plan to continue."
          : "Something went wrong. Please try again.");
      setStep("error");
      setErrorMsg(msg);
    }
  };

  const handleClose = () => {
    if (step === "generating") return;
    setOutputType(1);
    setPrompt("");
    setContextTags([]);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(null);
    setFilePreview(null);
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
            className="fixed inset-0 bg-black/50 z-70"
          />

          {/* Sheet */}
          <div className="fixed inset-0 z-70 flex items-end sm:items-center justify-center pointer-events-none sm:px-4 sm:py-6">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 48 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden font-manrope"
              style={{ maxHeight: "92dvh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>

              {/* Header */}
              <div className="flex items-start justify-between px-5 sm:px-7 pt-5 sm:pt-6 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-base font-bold text-primary">
                    Create a New Design
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Fill in the steps below — Ziora will generate your space from your description.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={step === "generating"}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-6">

                {/* ── Generating ────────────────────────────── */}
                {step === "generating" && (
                  <div className="flex flex-col items-center justify-center text-center py-16 gap-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                      <Loader2 className="w-14 h-14 animate-spin text-primary/30 absolute inset-0" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-primary">
                        Working on your {outputType === 2 ? "video tour" : "design"}…
                      </p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={generationStage}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm text-gray-600 mt-1"
                        >
                          {generationStage}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* ── Done ──────────────────────────────────── */}
                {step === "done" && (
                  <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                    <div>
                      <p className="text-base font-semibold text-primary">
                        {outputType === 2 ? "Video tour" : "Design"} created!
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        Your result is ready in the gallery.
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="mt-1 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-[#273054] transition-colors"
                    >
                      View Designs
                    </button>
                  </div>
                )}

                {/* ── Error ─────────────────────────────────── */}
                {step === "error" && (
                  <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
                    <AlertCircle className="w-12 h-12 text-red-400" />
                    <div>
                      <p className="text-base font-semibold text-primary">Something went wrong</p>
                      <p className="text-sm text-gray-600 mt-0.5 max-w-xs">{errorMsg}</p>
                    </div>
                    <button
                      onClick={() => setStep("form")}
                      className="mt-1 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-[#273054] transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* ── Form ──────────────────────────────────── */}
                {step === "form" && (
                  <div className="space-y-7">

                    {/* STEP 1 — Output type */}
                    <div>
                      <StepLabel number="1" title="What do you want to create?" />
                      <div className="grid grid-cols-2 gap-3">
                        {OUTPUT_TYPES.map(({ id, label, sublabel, Icon }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setOutputType(id)}
                            className={`flex flex-col items-start gap-2 p-4 border-2 rounded-xl text-left transition-all ${
                              outputType === id
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              outputType === id ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className={`text-sm font-semibold ${outputType === id ? "text-primary" : "text-gray-800"}`}>
                                {label}
                              </p>
                              <p className={`text-xs leading-snug mt-0.5 ${outputType === id ? "text-primary/70" : "text-gray-600"}`}>
                                {sublabel}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* STEP 2 — Prompt */}
                    <div>
                      <StepLabel
                        number="2"
                        title="Describe what you want the space to look like"
                      />
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && e.metaKey && handleCreate()}
                        rows={3}
                        placeholder={
                          outputType === 2
                            ? "e.g. A cinematic walk-through of a modern open-plan living space with warm evening lighting and Nigerian hardwood floors…"
                            : "e.g. A modern minimalist bedroom with warm tones, linen textures, built-in wardrobes and soft ambient lighting…"
                        }
                        className="w-full text-sm text-primary placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-primary bg-white resize-none transition-colors leading-relaxed"
                      />

                      {/* Example prompt chips */}
                      {!prompt && (
                        <div className="mt-2.5">
                          <p className="text-xs font-medium text-gray-600 mb-1.5">Try an example:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {EXAMPLE_PROMPTS.map((ex) => (
                              <button
                                key={ex}
                                type="button"
                                onClick={() => setPrompt(ex)}
                                className="text-xs font-medium px-2.5 py-1 border border-gray-300 rounded-full text-gray-700 hover:border-primary hover:text-primary transition-colors bg-white"
                              >
                                {ex.length > 42 ? ex.slice(0, 42) + "…" : ex}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* STEP 3 — Context (tags + photo) */}
                    <div>
                      <StepLabel
                        number="3"
                        title="Add context"
                        note="— photo required"
                      />

                      {/* Context tags — collapsible categories */}
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        Tag your project — select all that apply
                      </p>
                      <ContextTagPicker
                        contextTags={contextTags}
                        setContextTags={setContextTags}
                      />
                      <div className="mb-4" />

                      {/* Photo upload */}
                      <p className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-primary">
                        <Camera className="w-3.5 h-3.5" />
                        Photo of the current space
                        <span className="text-red-500">*</span>
                        <span className="text-gray-600 font-normal">— Ziora needs this to generate your design</span>
                      </p>

                      <AnimatePresence mode="wait">
                        {filePreview ? (
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
                              className="h-36 w-auto max-w-full object-cover rounded-xl border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={removeFile}
                              className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <p className="mt-1 text-xs text-gray-600 truncate max-w-xs">{file?.name}</p>
                          </motion.div>
                        ) : (
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
                            className={`flex items-center gap-4 px-4 py-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                              isDragging
                                ? "border-primary bg-primary/5"
                                : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
                            }`}
                          >
                            <UploadCloud className={`w-8 h-8 shrink-0 ${isDragging ? "text-primary" : "text-gray-400"}`} />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Drag your photo here, or{" "}
                                <span className="text-primary underline underline-offset-2">click to browse</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                JPG, PNG or WEBP · 1 image max
                              </p>
                            </div>
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

                    {/* Generate CTA */}
                    <div className="pt-1 pb-2">
                      <motion.button
                        whileTap={canSubmit ? { scale: 0.98 } : {}}
                        onClick={handleCreate}
                        disabled={!canSubmit}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-[#273054] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Sparkles className="w-4 h-4" />
                        {outputType === 2 ? "Generate Video Tour" : "Generate My Design"}
                      </motion.button>
                      {!canSubmit && (
                        <p className="text-center text-xs font-medium text-gray-600 mt-2">
                          {prompt && file
                            ? null
                            : prompt
                            ? "Upload a photo of the space to continue"
                            : file
                            ? "Write a description above to continue"
                            : "Add a description and upload a photo to continue"}
                        </p>
                      )}
                    </div>

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
