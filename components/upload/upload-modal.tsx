"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { UploadForm } from "./upload-form";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  namespace: string;
}

export function UploadModal({ open, onClose, namespace }: UploadModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              className="relative w-full max-w-md pointer-events-auto rounded-3xl p-6"
              style={{
                background: "linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%)",
                border: "1px solid var(--border-strong)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,111,247,0.1)",
              }}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2
                    className="text-base font-bold tracking-tight"
                    style={{ color: "var(--foreground)" }}
                  >
                    Upload Document
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                    Add files to your knowledge base
                  </p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    background: "var(--glass-strong)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground-muted)",
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              </div>

              {/* Accent line */}
              <div
                className="absolute top-0 left-8 right-8 h-px rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, rgba(124,111,247,0.6), rgba(6,214,160,0.4), transparent)" }}
              />

              <UploadForm namespace={namespace} onSuccess={onClose} />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
