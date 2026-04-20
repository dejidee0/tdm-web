"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const MOCK_MILESTONES = [
  { id: 1, title: "Initial Design Concept", description: "Full architectural blueprints and mood boards approved by client.", status: "completed", date: "Completed Oct 05" },
  { id: 2, title: "Material Sourcing", description: "Finalizing selection for kitchen marble and custom floor tiling.", status: "in-progress", date: null },
  { id: 3, title: "Structural Work", description: "Wall demolition and HVAC rerouting scheduled for next month.", status: "pending", date: null },
  { id: 4, title: "Interior Finishing", description: "Paint, lighting fixtures, and custom cabinetry installation.", status: "pending", date: null },
];

export default function ProjectMilestones({ milestones, isLoading, projectId }) {
  const router = useRouter();
  const items = milestones ?? MOCK_MILESTONES;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="rounded-2xl border border-white/08 overflow-hidden"
      style={{ background: "#0d0b08" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/08">
        <div className="flex items-center gap-2">
          <span className="text-[15px] text-white/40">≡</span>
          <h2 className="text-[15px] font-bold text-white">Project Milestones</h2>
        </div>
        <button
          onClick={() => router.push(`/dashboard/projects/${projectId}/timeline`)}
          className="text-[13px] font-semibold text-[#D4AF37] hover:text-[#D4AF37]/70 transition-colors"
        >
          View
        </button>
      </div>

      {/* Milestone rows */}
      <div className="divide-y divide-white/06">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 px-5 py-4">
                <div className="w-8 h-8 rounded-full bg-white/06 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-white/06 rounded w-1/3" />
                  <div className="h-3 bg-white/06 rounded w-2/3" />
                </div>
              </div>
            ))
          : items.map((milestone, index) => {
              const isCompleted = milestone.status === "completed";
              const isInProgress = milestone.status === "in-progress";
              const Icon = isCompleted ? CheckCircle2 : isInProgress ? Circle : Lock;

              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + index * 0.07 }}
                  className="flex items-start gap-3 px-5 py-4"
                  style={isInProgress ? { background: "rgba(212,175,55,0.05)" } : undefined}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={
                      isCompleted
                        ? { background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }
                        : isInProgress
                        ? { background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.30)" }
                        : { background: "rgba(255,255,255,0.06)" }
                    }
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color: isCompleted ? "#000" : isInProgress ? "#D4AF37" : "rgba(255,255,255,0.25)",
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-white">{milestone.title}</p>
                    <p className="text-[12px] text-white/40 mt-0.5">{milestone.description}</p>
                  </div>

                  <div className="shrink-0 text-right">
                    {milestone.date && (
                      <span className="text-[11px] font-semibold text-white/30 tracking-wide">{milestone.date}</span>
                    )}
                    {!milestone.date && milestone.status !== "completed" && (
                      <span
                        className="inline-block text-[10px] font-bold tracking-widest px-2 py-1 rounded-md"
                        style={
                          isInProgress
                            ? { background: "rgba(212,175,55,0.12)", color: "#D4AF37" }
                            : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.30)" }
                        }
                      >
                        {isInProgress ? "IN PROGRESS" : "PENDING"}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
      </div>
    </motion.div>
  );
}
