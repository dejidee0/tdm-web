"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  MapPin, ArrowRight, Clock, CheckCircle2,
  FolderOpen, Plus, FileText, Image, BarChart2, Calendar,
} from "lucide-react";
import DashboardLayout from "@/components/shared/dashboard/layout";
import { useProjects } from "@/hooks/use-project";

const STATUS_STYLES = {
  "in-progress":  { label: "In Progress",  bg: "rgba(212,175,55,0.12)", color: "#D4AF37" },
  "inprogress":   { label: "In Progress",  bg: "rgba(212,175,55,0.12)", color: "#D4AF37" },
  "completed":    { label: "Completed",    bg: "rgba(34,197,94,0.12)",  color: "#22c55e" },
  "planning":     { label: "Planning",     bg: "rgba(99,102,241,0.12)", color: "#818cf8" },
  "pending":      { label: "Pending",      bg: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.40)" },
};

function statusStyle(status = "") {
  return STATUS_STYLES[status.toLowerCase().replace(/\s+/g, "-")] ?? STATUS_STYLES["pending"];
}

function ProjectCard({ project, index }) {
  const router = useRouter();
  const id = project?.id;
  const name = project?.name ?? project?.title ?? "Unnamed Project";
  const address = project?.address ?? project?.location ?? project?.city ?? "";
  const progress = project?.progress ?? project?.completionPercent ?? 0;
  const status = project?.status ?? "pending";
  const createdAt = project?.createdAt ? new Date(project.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
  const estCompletion = project?.estCompletion ?? project?.estimatedCompletion ?? "";
  const style = statusStyle(status);

  const subLinks = [
    { label: "Timeline",   icon: Calendar,  href: `/dashboard/projects/${id}/timeline` },
    { label: "Gallery",    icon: Image,     href: `/dashboard/projects/${id}/gallery` },
    { label: "Documents",  icon: FileText,  href: `/dashboard/projects/${id}/project-documents` },
    { label: "Financials", icon: BarChart2, href: `/dashboard/projects/${id}/financial-overview` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-2xl border border-white/08 overflow-hidden"
      style={{ background: "#0d0b08" }}
    >
      {/* Card header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md"
            style={{ background: style.bg, color: style.color }}
          >
            {style.label}
          </span>
          {createdAt && (
            <span className="text-[11px] text-white/30">{createdAt}</span>
          )}
        </div>

        <h3
          onClick={() => router.push(`/dashboard/projects/${id}`)}
          className="text-[18px] font-bold text-white leading-snug mb-1.5 cursor-pointer hover:text-[#D4AF37] transition-colors line-clamp-2"
        >
          {name}
        </h3>

        {address && (
          <div className="flex items-center gap-1.5 text-white/35 text-[12px]">
            <MapPin className="w-3 h-3 shrink-0" />
            {address}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-white/40">Overall Progress</span>
          <span className="text-[13px] font-bold text-white">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 + index * 0.08 }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #D4AF37, #b8962e)" }}
          />
        </div>
        {estCompletion && (
          <p className="text-[11px] text-white/25 mt-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Est. completion: {estCompletion}
          </p>
        )}
      </div>

      {/* Sub-page quick links */}
      <div className="border-t border-white/06 px-5 py-3 grid grid-cols-4 gap-1">
        {subLinks.map(({ label, icon: Icon, href }) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white/05 transition-colors group"
          >
            <Icon className="w-3.5 h-3.5 text-white/30 group-hover:text-[#D4AF37] transition-colors" />
            <span className="text-[10px] text-white/30 group-hover:text-white/60 transition-colors">{label}</span>
          </button>
        ))}
      </div>

      {/* View project */}
      <div className="px-5 pb-5">
        <button
          onClick={() => router.push(`/dashboard/projects/${id}`)}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/10 text-[13px] font-semibold text-white/50 hover:text-white hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/05 transition-all"
        >
          View Project <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-2xl border border-white/08 flex items-center justify-center mb-5" style={{ background: "#0d0b08" }}>
        <FolderOpen className="w-7 h-7 text-white/20" />
      </div>
      <h3 className="text-[17px] font-bold text-white mb-2">No projects yet</h3>
      <p className="text-[13px] text-white/35 max-w-xs leading-relaxed mb-6">
        Once you pay for a renovation, your project will appear here with full tracking — timeline, gallery, documents and financials.
      </p>
      <button
        onClick={() => window.location.href = "/ai-visualizer"}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-black"
        style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
      >
        <Plus className="w-4 h-4" /> Start with AI Visualizer
      </button>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/08 overflow-hidden animate-pulse" style={{ background: "#0d0b08" }}>
      <div className="px-5 pt-5 pb-4 space-y-3">
        <div className="h-5 bg-white/06 rounded w-24" />
        <div className="h-6 bg-white/06 rounded w-3/4" />
        <div className="h-3.5 bg-white/06 rounded w-1/2" />
      </div>
      <div className="px-5 pb-4 space-y-1.5">
        <div className="h-1.5 bg-white/06 rounded-full" />
      </div>
      <div className="border-t border-white/06 px-5 py-4">
        <div className="h-8 bg-white/06 rounded-xl" />
      </div>
    </div>
  );
}

export default function ProjectsListPage() {
  const { data: projects = [], isLoading, isError } = useProjects();

  return (
    <DashboardLayout>
      <div className="space-y-6 pt-12 md:pt-0 w-full">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-[26px] font-bold text-white">My Projects</h1>
            <p className="text-[13px] text-white/35 mt-0.5">
              Track every renovation from start to finish.
            </p>
          </div>
          {!isLoading && projects.length > 0 && (
            <span className="text-[12px] text-white/30 font-medium">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </span>
          )}
        </motion.div>

        {/* Content */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-white/35 text-[13px]">Could not load your projects. Please refresh.</p>
          </div>
        )}

        {!isLoading && !isError && projects.length === 0 && <EmptyState />}

        {!isLoading && !isError && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map((project, i) => (
              <ProjectCard key={project?.id ?? i} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
