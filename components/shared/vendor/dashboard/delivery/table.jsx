"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Package, MoreVertical, Clock } from "lucide-react";

const statusStyles = {
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    icon: "⏱",
  },
  info: {
    bg: "bg-info/10",
    text: "text-info",
    icon: "★",
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    icon: "●",
  },
  error: {
    bg: "bg-danger/10",
    text: "text-danger",
    icon: "⚠",
  },
  purple: {
    bg: "bg-chart-1/10",
    text: "text-chart-1",
    icon: "★",
  },
};

export default function DeliveryAssignmentsTable({ assignments, isLoading }) {
  const [selectedAssignments, setSelectedAssignments] = useState([]);

  const handleSelectAssignment = (assignmentId) => {
    setSelectedAssignments((prev) =>
      prev.includes(assignmentId)
        ? prev.filter((id) => id !== assignmentId)
        : [...prev, assignmentId],
    );
  };

  const handleSelectAll = () => {
    if (selectedAssignments.length === assignments?.length) {
      setSelectedAssignments([]);
    } else {
      setSelectedAssignments(assignments?.map((a) => a.id) || []);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl border border-white/08">
        <div className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-white/08 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted font-manrope text-[14px]">
            Loading assignments...
          </p>
        </div>
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-white/08 p-12 text-center">
        <p className="text-muted font-manrope text-[14px]">
          No assignments found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-white/08 overflow-hidden">
      {/* Assigning a delivery partner / tracking number has no backend
          endpoint yet (BACKLOG.md #13) — surfaced honestly as upcoming rather
          than left as a control that fails when clicked. */}
      <div className="flex items-center gap-2 px-6 py-3 bg-info/10 border-b border-white/08">
        <Clock size={14} className="text-info shrink-0" />
        <p className="font-manrope text-[12px] text-info">
          Assigning delivery partners and tracking numbers from this table is
          coming soon.
        </p>
      </div>

      {/* Table Header */}
      <div className="overflow-x-auto table-scroll">
        <div className="px-6 py-4 bg-white/05 border-b border-white/08 min-w-[1020px]">
          <div className="grid grid-cols-[40px_100px_140px_260px_120px_180px_180px_100px] gap-4 items-center">
            <input
              type="checkbox"
              checked={selectedAssignments.length === assignments.length}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-white/08 text-white focus:ring-2 focus:ring-accent/40 cursor-pointer"
            />
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              STATUS
            </span>
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              ORDER ID
            </span>
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              CUSTOMER DETAILS
            </span>
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              EXP. DATE
            </span>
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              DELIVERY PARTNER
            </span>
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              TRACKING #
            </span>
            <span className="font-manrope text-[11px] font-bold text-muted uppercase tracking-wider">
              ACTIONS
            </span>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/08 overflow-x-auto table-scroll">
          {assignments.map((assignment, index) => {
            const statusStyle = statusStyles[assignment.statusColor];
            const isSelected = selectedAssignments.includes(assignment.id);

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`px-6 py-4 transition-colors min-w-[1020px] ${
                  isSelected ? "bg-white/05" : "hover:bg-white/05"
                }`}
              >
                <div className="grid grid-cols-[40px_100px_140px_260px_120px_180px_180px_100px] gap-4 items-center">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectAssignment(assignment.id)}
                    className="w-4 h-4 rounded border-white/08 text-white focus:ring-2 focus:ring-accent/40 cursor-pointer"
                  />

                  {/* Status */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px]">{statusStyle.icon}</span>
                    <span
                      className={`px-2.5 py-1 rounded font-manrope text-[11px] font-bold ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {assignment.status}
                    </span>
                  </div>

                  {/* Order ID */}
                  <span className="font-manrope text-[14px] font-bold text-white">
                    #{assignment.orderId}
                  </span>

                  {/* Customer Details */}
                  <div>
                    <p className="font-manrope text-[14px] font-medium text-white mb-0.5">
                      {assignment.customer.name}
                    </p>
                    <p className="font-manrope text-[12px] text-muted truncate">
                      {assignment.customer.address}
                    </p>
                  </div>

                  {/* Expected Date */}
                  <span
                    className={`font-manrope text-[13px] ${
                      assignment.isOverdue
                        ? "text-danger font-bold"
                        : "text-white"
                    }`}
                  >
                    {assignment.expectedDate}
                    {assignment.isOverdue && " (Overdue)"}
                  </span>

                  {/* Delivery Partner */}
                  <div className="flex items-center gap-2">
                    {assignment.deliveryPartner ? (
                      <>
                        <span className="w-4 h-4 bg-accent-solid rounded flex items-center justify-center text-white text-[8px] flex-shrink-0">
                          📦
                        </span>
                        <span className="font-manrope text-[13px] text-white truncate">
                          {assignment.deliveryPartner}
                        </span>
                      </>
                    ) : (
                      <span
                        className="font-manrope text-[12px] text-muted/60 italic"
                        title="Assigning a delivery partner from this table is coming soon"
                      >
                        Not assigned yet
                      </span>
                    )}
                  </div>

                  {/* Tracking Number */}
                  {assignment.trackingNumber ? (
                    <span className="font-manrope text-[13px] text-white font-mono">
                      {assignment.trackingNumber}
                    </span>
                  ) : (
                    <span
                      className="font-manrope text-[12px] text-muted/60 italic"
                      title="Adding a tracking number from this table is coming soon"
                    >
                      —
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {assignment.status === "Picked Up" && (
                      <button className="font-manrope text-[13px] text-info hover:underline font-medium">
                        Track
                      </button>
                    )}
                    {assignment.status === "In Transit" && (
                      <button className="font-manrope text-[13px] text-info hover:underline font-medium">
                        Track
                      </button>
                    )}
                    {(assignment.status === "Pending" ||
                      assignment.status === "Urgent") && (
                      <button
                        disabled
                        title="Assigning a delivery partner is coming soon"
                        className="p-2 text-muted/30 rounded-lg cursor-not-allowed"
                      >
                        <Package size={18} />
                      </button>
                    )}
                    {assignment.status === "Assigned" && (
                      <button
                        disabled
                        title="Editing delivery details is coming soon"
                        className="p-2 text-muted/30 rounded-lg cursor-not-allowed"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-muted hover:bg-white/08 rounded-lg transition-colors"
                      title="More"
                    >
                      <MoreVertical size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
