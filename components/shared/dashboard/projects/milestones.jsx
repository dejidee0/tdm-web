"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const MOCK_MILESTONES = [
  {
    id: 1,
    title: "Initial Design Concept",
    description:
      "Full architectural blueprints and mood boards approved by client.",
    status: "completed",
    date: "Completed Oct 05",
  },
  {
    id: 2,
    title: "Material Sourcing",
    description:
      "Finalizing selection for kitchen marble and custom floor tiling.",
    status: "in-progress",
    date: null,
  },
  {
    id: 3,
    title: "Structural Work",
    description: "Wall demolition and HVAC rerouting scheduled for next month.",
    status: "pending",
    date: null,
  },
  {
    id: 4,
    title: "Interior Finishing",
    description: "Paint, lighting fixtures, and custom cabinetry installation.",
    status: "pending",
    date: null,
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    iconClass: "text-white",
    iconBg: "bg-primary",
    badge: null,
    rowBg: "bg-white",
  },
  "in-progress": {
    icon: Circle,
    iconClass: "text-primary",
    iconBg: "bg-primary/10 border border-primary/30",
    badge: "IN PROGRESS",
    rowBg: "bg-[#f7f8ff] border border-[#e0e4ff]",
  },
  pending: {
    icon: Lock,
    iconClass: "text-gray-400",
    iconBg: "bg-gray-100",
    badge: "PENDING",
    rowBg: "bg-white",
  },
};

export default function ProjectMilestones({
  milestones,
  isLoading,
  projectId,
}) {
  const router = useRouter();
  const items = milestones ?? MOCK_MILESTONES;

  const handleView = () => {
    router.push(`/dashboard/projects/timeline`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-[15px]">≡</span>
          <h2 className="text-[15px] font-bold text-text-black">
            Project Milestones
          </h2>
        </div>
        <button
          onClick={handleView}
          className="text-[13px] font-semibold text-primary hover:underline"
        >
          View
        </button>
      </div>

      {/* Milestone rows */}
      <div className="divide-y divide-gray-100">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex items-center gap-3 px-5 py-4"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))
          : items.map((milestone, index) => {
              const cfg = statusConfig[milestone.status];
              const Icon = cfg.icon;

              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + index * 0.07 }}
                  className={`flex items-start gap-3 px-5 py-4 ${cfg.rowBg}`}
                >
                  {/* Icon */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${cfg.iconBg}`}
                  >
                    <Icon className={`w-4 h-4 ${cfg.iconClass}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-text-black">
                      {milestone.title}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Right: badge or date */}
                  <div className="shrink-0 text-right">
                    {milestone.date && (
                      <span className="text-[11px] font-semibold text-gray-400 tracking-wide">
                        {milestone.date}
                      </span>
                    )}
                    {cfg.badge && (
                      <span
                        className={`inline-block text-[10px] font-bold tracking-widest px-2 py-1 rounded-md ${
                          milestone.status === "in-progress"
                            ? "bg-primary/10 text-primary"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {cfg.badge}
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
