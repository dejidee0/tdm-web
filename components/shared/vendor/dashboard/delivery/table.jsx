"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Package, MoreVertical } from "lucide-react";
import { useUpdateDeliveryAssignment } from "@/hooks/use-delivery";

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

const deliveryPartners = [
  "DHL Express",
  "FedEx",
  "UPS Ground",
  "USPS Priority",
  "Amazon Logistics",
];

export default function DeliveryAssignmentsTable({ assignments, isLoading }) {
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});

  const updateAssignment = useUpdateDeliveryAssignment();

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

  const handleEdit = (assignment) => {
    setEditingRow(assignment.id);
    setEditData({
      deliveryPartner: assignment.deliveryPartner || "",
      trackingNumber: assignment.trackingNumber || "",
    });
  };

  const handleSave = (assignmentId) => {
    updateAssignment.mutate({
      id: assignmentId,
      updates: editData,
    });
    setEditingRow(null);
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditData({});
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
            const isEditing = editingRow === assignment.id;

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
                  {isEditing ? (
                    <select
                      value={editData.deliveryPartner}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          deliveryPartner: e.target.value,
                        }))
                      }
                      className="px-3 py-2 bg-surface-raised border border-white/10 rounded-lg font-manrope text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-accent/40 appearance-none cursor-pointer"
                    >
                      <option value="">Select Partner</option>
                      {deliveryPartners.map((partner) => (
                        <option key={partner} value={partner}>
                          {partner}
                        </option>
                      ))}
                    </select>
                  ) : (
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
                        <select
                          onChange={(e) => {
                            handleEdit(assignment);
                            setEditData((prev) => ({
                              ...prev,
                              deliveryPartner: e.target.value,
                            }));
                          }}
                          className="w-full px-3 py-2 bg-surface-raised border border-white/10 rounded-lg font-manrope text-[13px] text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 appearance-none cursor-pointer"
                        >
                          <option value="">Select Partner</option>
                          {deliveryPartners.map((partner) => (
                            <option key={partner} value={partner}>
                              {partner}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  {/* Tracking Number */}
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="Enter Tracking #"
                      value={editData.trackingNumber}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          trackingNumber: e.target.value,
                        }))
                      }
                      className="px-3 py-2 bg-surface-raised border border-white/10 rounded-lg font-manrope text-[13px] text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  ) : (
                    <>
                      {assignment.trackingNumber ? (
                        <span className="font-manrope text-[13px] text-white font-mono">
                          {assignment.trackingNumber}
                        </span>
                      ) : (
                        <input
                          type="text"
                          placeholder="Enter Tracking #"
                          onFocus={() => handleEdit(assignment)}
                          className="px-3 py-2 bg-surface-raised border border-white/10 rounded-lg font-manrope text-[13px] text-muted placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
                        />
                      )}
                    </>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSave(assignment.id)}
                          className="p-2 text-success hover:bg-success/10 rounded-lg transition-colors"
                          title="Save"
                        >
                          ✓
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancel}
                          className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          ✕
                        </motion.button>
                      </>
                    ) : (
                      <>
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
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(assignment)}
                            className="p-2 text-muted hover:bg-white/08 rounded-lg transition-colors"
                            title="Assign"
                          >
                            <Package size={18} />
                          </motion.button>
                        )}
                        {assignment.status === "Assigned" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(assignment)}
                            className="p-2 text-muted hover:bg-white/08 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-muted hover:bg-white/08 rounded-lg transition-colors"
                          title="More"
                        >
                          <MoreVertical size={18} />
                        </motion.button>
                      </>
                    )}
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
