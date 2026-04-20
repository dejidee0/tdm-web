"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Download, Upload, ExternalLink, ChevronDown, User, X } from "lucide-react";
import { useProjectGallery, useUploadGalleryImage } from "@/hooks/use-project";

const STATIC_FILTERS = ["All Photos", "Recent"];

function PhotoCard({ photo, index, onClick }) {
  const imageUrl = photo?.imageUrl ?? photo?.url ?? photo?.src ?? null;
  const title = photo?.title ?? photo?.caption ?? photo?.name ?? "Site Photo";
  const description = photo?.description ?? photo?.notes ?? "";
  const uploader = photo?.uploadedBy ?? photo?.uploader ?? photo?.createdBy ?? "Team";
  const date = photo?.createdAt ?? photo?.uploadedAt ?? photo?.date ?? "";
  const tag = (photo?.tag ?? photo?.room ?? photo?.category ?? "SITE").toUpperCase();
  const formattedDate = date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="rounded-xl overflow-hidden border border-white/08 group cursor-pointer"
      style={{ background: "#0d0b08" }}
      onClick={() => onClick(photo)}
    >
      <div className="relative h-44 overflow-hidden bg-white/04">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/15 text-xs">No image</div>
        )}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="text-[10px] font-bold tracking-wider text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md">{tag}</span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-200" />
      </div>

      <div className="p-3.5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[13.5px] font-bold text-white line-clamp-1">{title}</h3>
          {formattedDate && <span className="text-[11.5px] text-white/30 shrink-0 ml-2">{formattedDate}</span>}
        </div>
        {description && <p className="text-[11.5px] text-white/40 leading-relaxed mb-3 line-clamp-2">{description}</p>}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-white/25">
            <User className="w-3 h-3" />
            <span>Uploaded by {uploader}</span>
          </div>
          <button className="flex items-center gap-1 text-[11.5px] font-semibold text-[#D4AF37] hover:text-[#D4AF37]/70 transition-colors" onClick={(e) => { e.stopPropagation(); onClick(photo); }}>
            View Full Screen <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/08 overflow-hidden animate-pulse" style={{ background: "#0d0b08" }}>
      <div className="h-44 bg-white/04" />
      <div className="p-3.5 space-y-2">
        <div className="h-4 bg-white/06 rounded w-3/4" />
        <div className="h-3 bg-white/06 rounded w-full" />
        <div className="h-3 bg-white/06 rounded w-2/3" />
      </div>
    </div>
  );
}

function Lightbox({ photo, onClose }) {
  const imageUrl = photo?.imageUrl ?? photo?.url ?? photo?.src ?? null;
  const title = photo?.title ?? photo?.caption ?? "Site Photo";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
      onClick={onClose}
    >
      <button className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" onClick={onClose}>
        <X className="w-5 h-5" />
      </button>
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-3xl w-full"
      >
        {imageUrl && <img src={imageUrl} alt={title} className="w-full max-h-[80vh] object-contain rounded-2xl" />}
        <p className="text-white/70 text-sm font-medium text-center mt-4">{title}</p>
      </motion.div>
    </motion.div>
  );
}

export default function SiteGallery({ projectId }) {
  const [activeFilter, setActiveFilter] = useState("All Photos");
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const fileInputRef = useRef(null);

  const { data: photos = [], isLoading } = useProjectGallery(projectId);
  const upload = useUploadGalleryImage();

  // Derive dynamic room/category filters from real data
  const categories = [...new Set(photos.map((p) => p?.tag ?? p?.room ?? p?.category).filter(Boolean))];
  const filters = [...STATIC_FILTERS, ...categories];

  const filtered = activeFilter === "All Photos"
    ? photos
    : activeFilter === "Recent"
    ? [...photos].sort((a, b) => new Date(b?.createdAt ?? 0) - new Date(a?.createdAt ?? 0)).slice(0, 6)
    : photos.filter((p) => (p?.tag ?? p?.room ?? p?.category)?.toLowerCase() === activeFilter.toLowerCase());

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function handleUpload(e) {
    const file = e.target.files?.[0];
    if (file && projectId) upload.mutate({ projectId, file });
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <h1 className="text-[26px] font-bold text-white leading-tight">Site Gallery</h1>
            <p className="text-[13px] text-white/40 mt-1 max-w-sm leading-relaxed">
              Track real-time construction progress and interior finishes through high-quality visual documentation.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 mt-1">
            <button
              className="flex items-center gap-1.5 text-[13px] font-semibold text-white/50 border border-white/10 px-3.5 py-2 rounded-lg hover:bg-white/05 transition-colors"
              style={{ background: "#0d0b08" }}
            >
              <Download className="w-3.5 h-3.5" /> Export All
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={upload.isPending}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-black px-3.5 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
            >
              <Upload className="w-3.5 h-3.5" /> {upload.isPending ? "Uploading…" : "Upload Photos"}
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.1 }}
          className="flex items-center gap-2 flex-wrap"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => { setActiveFilter(filter); setVisibleCount(6); }}
              className="text-[12.5px] font-semibold px-3.5 py-1.5 rounded-full transition-all capitalize"
              style={
                activeFilter === filter
                  ? { background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)", color: "#000" }
                  : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-white/25 text-[13px] py-12 text-center">No photos yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <AnimatePresence>
              {visible.map((photo, index) => (
                <PhotoCard key={photo?.id ?? index} photo={photo} index={index} onClick={setLightboxPhoto} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.4 }}
            className="flex justify-center"
          >
            <button
              onClick={() => setVisibleCount((v) => v + 6)}
              className="flex items-center gap-2 text-[13px] font-semibold text-white/40 border border-white/10 px-6 py-2.5 rounded-xl hover:bg-white/05 transition-colors"
              style={{ background: "#0d0b08" }}
            >
              Load More Photos <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />}
      </AnimatePresence>
    </div>
  );
}
