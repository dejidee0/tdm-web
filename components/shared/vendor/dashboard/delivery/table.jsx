"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Package, MoreVertical } from "lucide-react";
import { useUpdateDeliveryAssignment } from "@/hooks/use-delivery";

const statusStyles = {
  warning: {
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    icon: "⏱",
  },
  info: {
    bg: "bg-[#DBEAFE]",
    text: "text-[#1E40AF]",
    icon: "★",
  },
  success: {
    bg: "bg-[#D1FAE5]",
    text: "text-[#065F46]",
    icon: "●",
  },
  error: {
    bg: "bg-[#FEF2F2]",
    text: "text-[#DC2626]",
    icon: "⚠",
  },
  purple: {
    bg: "bg-[#F3E8FF]",
    text: "text-[#6B21A8]",
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
      <div className="bg-white rounded-xl border border-[#E5E7EB]">
        <div className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#64748B] font-manrope text-[14px]">
            Loading assignments...
          </p>
        </div>
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
        <p className="text-[#64748B] font-manrope text-[14px]">
          No assignments found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto table-scroll">
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E5E7EB] min-w-[1020px]">
          <div className="grid grid-cols-[40px_100px_140px_260px_120px_180px_180px_100px] gap-4 items-center">
            <input
              type="checkbox"
              checked={selectedAssignments.length === assignments.length}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-[#E5E7EB] text-primary focus:ring-2 focus:ring-primary cursor-pointer"
            />
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              STATUS
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              ORDER ID
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              CUSTOMER DETAILS
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              EXP. DATE
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              DELIVERY PARTNER
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              TRACKING #
            </span>
            <span className="font-manrope text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              ACTIONS
            </span>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#E5E7EB] overflow-x-auto table-scroll">
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
                  isSelected ? "bg-[#F8FAFC]" : "hover:bg-[#F8FAFC]"
                }`}
              >
                <div className="grid grid-cols-[40px_100px_140px_260px_120px_180px_180px_100px] gap-4 items-center">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectAssignment(assignment.id)}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-primary focus:ring-2 focus:ring-primary cursor-pointer"
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
                  <span className="font-manrope text-[14px] font-bold text-primary">
                    #{assignment.orderId}
                  </span>

                  {/* Customer Details */}
                  <div>
                    <p className="font-manrope text-[14px] font-medium text-primary mb-0.5">
                      {assignment.customer.name}
                    </p>
                    <p className="font-manrope text-[12px] text-[#64748B] truncate">
                      {assignment.customer.address}
                    </p>
                  </div>

                  {/* Expected Date */}
                  <span
                    className={`font-manrope text-[13px] ${
                      assignment.isOverdue
                        ? "text-[#DC2626] font-bold"
                        : "text-primary"
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
                      className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
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
                          <span className="w-4 h-4 bg-primary rounded flex items-center justify-center text-white text-[8px] flex-shrink-0">
                            📦
                          </span>
                          <span className="font-manrope text-[13px] text-primary truncate">
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
                          className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
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
                      className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-primary placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <>
                      {assignment.trackingNumber ? (
                        <span className="font-manrope text-[13px] text-primary font-mono">
                          {assignment.trackingNumber}
                        </span>
                      ) : (
                        <input
                          type="text"
                          placeholder="Enter Tracking #"
                          onFocus={() => handleEdit(assignment)}
                          className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg font-manrope text-[13px] text-[#94A3B8] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary"
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
                          className="p-2 text-[#10B981] hover:bg-[#D1FAE5] rounded-lg transition-colors"
                          title="Save"
                        >
                          ✓
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancel}
                          className="p-2 text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                          title="Cancel"
                        >
                          ✕
                        </motion.button>
                      </>
                    ) : (
                      <>
                        {assignment.status === "Picked Up" && (
                          <button className="font-manrope text-[13px] text-[#06B6D4] hover:underline font-medium">
                            Track
                          </button>
                        )}
                        {assignment.status === "In Transit" && (
                          <button className="font-manrope text-[13px] text-[#06B6D4] hover:underline font-medium">
                            Track
                          </button>
                        )}
                        {(assignment.status === "Pending" ||
                          assignment.status === "Urgent") && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(assignment)}
                            className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors"
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
                            className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors"
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
