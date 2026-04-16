"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isDeleting = false,
}) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d0b08] border border-white/08 rounded-2xl shadow-2xl max-w-md w-full"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/08">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-950/40 flex items-center justify-center">
                      <AlertTriangle className="text-red-400" size={20} />
                    </div>
                    <div>
                      <h2 className="font-manrope text-[20px] font-bold text-white">
                        Delete User
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={isDeleting}
                    className="text-white/30 hover:text-white/60 transition-colors disabled:opacity-50"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                <p className="font-manrope text-[15px] text-white/50 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-white">
                    {userName || "this user"}
                  </span>
                  ? This action cannot be undone and all associated data will be
                  permanently removed.
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-white/08 bg-white/03 rounded-b-2xl">
                <motion.button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 border border-white/10 rounded-lg font-manrope text-[14px] font-medium text-white/60 hover:bg-white/05 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 bg-[#EF4444] text-white rounded-lg font-manrope text-[14px] font-medium hover:bg-[#DC2626] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete User"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
