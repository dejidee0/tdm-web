"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, Circle, Lock, FileDown, Plus } from "lucide-react";
import DashboardLayout from "@/components/shared/dashboard/layout";

const phases = [
  {
    id: 1,
    number: "1.",
    title: "Project Planning & Design",
    status: "completed",
    badge: "COMPLETED",
    description:
      "Site survey, geological analysis, and structural blueprints finalize.",
    duration: "Jan 15 - Feb 28",
    durationLabel: "DURATION",
    tasks: ["Geotech Survey", "Environmental Permits", "Budget Allocation"],
    sections: null,
  },
  {
    id: 2,
    number: "2.",
    title: "Material & Machinery Procurement",
    status: "completed",
    badge: "COMPLETED",
    description:
      "Ordering TBM components, reinforcement steel, and segment liners.",
    duration: "Mar 01 - Apr 15",
    durationLabel: "DURATION",
    tasks: ["TBM Head Arrival", "Steel Rebar Stock", "Electrical Components"],
    sections: null,
  },
  {
    id: 3,
    number: "3.",
    title: "Tunnel Excavation & Construction",
    status: "in-progress",
    badge: "IN PROGRESS",
    description: "Primary boring operations, ring installation, and grouting.",
    duration: "Apr 20 - Oct 30",
    durationLabel: "CURRENT PHASE",
    tasks: null,
    sections: [
      { label: "SECTION A: NORTH SHAFT", percent: 82 },
      { label: "SECTION B: CENTRAL STATION", percent: 35 },
    ],
  },
  {
    id: 4,
    number: "4.",
    title: "Finishing & Systems Integration",
    status: "pending",
    badge: "PENDING",
    description:
      "Lighting, ventilation, emergency systems, and final inspections.",
    duration: "Nov 01 - Dec 20",
    durationLabel: "PLANNED",
    tasks: null,
    sections: null,
  },
];

const stats = [
  { label: "DAYS ELAPSED", value: "142", suffix: "/ 210" },
  { label: "TOTAL DISTANCE", value: "2,840m", suffix: "/ 4.2km" },
  { label: "CURRENT SPEED", value: "12.4m", suffix: "/ day" },
  { label: "SAFETY RATING", value: "98.2%", suffix: null },
];

function PhaseIcon({ status }) {
  if (status === "completed") {
    return (
      <div className="w-8 h-8 rounded-full bg-[#1a2340] flex items-center justify-center">
        <CheckCircle2 className="w-4 h-4 text-white" />
      </div>
    );
  }
  if (status === "in-progress") {
    return (
      <div className="w-8 h-8 rounded-full border-2 border-[#1a2340] bg-white flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-[#1a2340]" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
      <Circle className="w-3.5 h-3.5 text-gray-300" />
    </div>
  );
}

export default function ProjectTimeline() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f4f5f7] p-6 md:p-8">
        <div className="max-w-[680px] mx-auto space-y-5">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <h1 className="text-[26px] font-bold text-[#1a2340] leading-tight">
                Project Timeline
              </h1>
              <p className="text-[13px] text-gray-500 mt-1 max-w-[340px] leading-relaxed">
                Comprehensive schedule for the North Corridor Expansion.
                Currently in Construction phase with overall project health
                marked as excellent.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 mt-1">
              <button className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1a2340] border border-gray-300 bg-white px-3.5 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <FileDown className="w-3.5 h-3.5" />
                Export PDF
              </button>
              <button className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-[#1a2340] px-3.5 py-2 rounded-lg hover:bg-[#222d52] transition-colors">
                <Plus className="w-3.5 h-3.5" />
                New Milestone
              </button>
            </div>
          </motion.div>

          {/* Overall Completion */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 px-5 py-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold text-[#1a2340]">
                Overall Completion
              </span>
              <span className="text-[22px] font-bold text-[#1a2340]">65%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
                className="h-full rounded-full bg-[#1a2340]"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-gray-400">
                Started: Jan 15, 2024
              </span>
              <span className="text-[11px] text-gray-400">
                Expected Completion: Dec 20, 2024
              </span>
            </div>
          </motion.div>

          {/* Timeline phases */}
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gray-200 z-0" />

            <div className="space-y-3">
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + index * 0.09 }}
                  className="relative flex gap-4"
                >
                  {/* Icon on timeline */}
                  <div className="relative z-10 shrink-0 mt-4">
                    <PhaseIcon status={phase.status} />
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 rounded-2xl border px-5 py-4 ${
                      phase.status === "in-progress"
                        ? "bg-white border-[#1a2340] shadow-md"
                        : phase.status === "pending"
                          ? "bg-white border-gray-200"
                          : "bg-white border-gray-200"
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[14px] font-bold text-[#1a2340]">
                          {phase.number} {phase.title}
                        </h3>
                        <span
                          className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md ${
                            phase.status === "completed"
                              ? "bg-[#1a2340] text-white"
                              : phase.status === "in-progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {phase.badge}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                          {phase.durationLabel}
                        </p>
                        <p className="text-[12px] font-semibold text-[#1a2340] mt-0.5">
                          {phase.duration}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[12px] text-gray-500 mt-1.5">
                      {phase.description}
                    </p>

                    {/* Tasks */}
                    {phase.tasks && (
                      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
                        {phase.tasks.map((task) => (
                          <div key={task} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[11.5px] text-gray-500">
                              {task}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sections with progress */}
                    {phase.sections && (
                      <div className="mt-3 space-y-3">
                        {phase.sections.map((section) => (
                          <div key={section.label}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                {section.label}
                              </span>
                              <span className="text-[12px] font-bold text-[#1a2340]">
                                {section.percent}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${section.percent}%` }}
                                transition={{
                                  duration: 0.8,
                                  delay: 0.5,
                                  ease: "easeOut",
                                }}
                                className="h-full rounded-full bg-[#1a2340]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="grid grid-cols-4 gap-3"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-gray-200 px-4 py-3"
              >
                <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[20px] font-bold text-[#1a2340] leading-tight">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-[11px] text-gray-400">
                      {stat.suffix}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
