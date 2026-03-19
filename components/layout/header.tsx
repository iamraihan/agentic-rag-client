"use client";

import { useState } from "react";
import { Sparkles, Upload, Settings, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  namespace: string;
  onNamespaceChange: (ns: string) => void;
  onOpenUpload: () => void;
}

export function Header({ namespace, onNamespaceChange, onOpenUpload }: HeaderProps) {
  const [showNsEditor, setShowNsEditor] = useState(false);
  const [nsInput, setNsInput] = useState(namespace);

  const handleNsApply = () => {
    const trimmed = nsInput.trim();
    if (trimmed) {
      onNamespaceChange(trimmed);
      setShowNsEditor(false);
    }
  };

  return (
    <header
      className="relative z-20 flex h-14 items-center gap-3 px-5"
      style={{
        background: "rgba(13, 13, 20, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{
            background: "linear-gradient(135deg, #7c6ff7, #06d6a0)",
            boxShadow: "0 0 16px rgba(124, 111, 247, 0.45)",
          }}
        >
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1
            className="text-sm font-semibold leading-none tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Agentic RAG
          </h1>
          <p className="text-[10px] mt-0.5 leading-none" style={{ color: "var(--foreground-subtle)" }}>
            AI-powered document chat
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Namespace badge / editor */}
        <div className="relative">
          <motion.button
            onClick={() => setShowNsEditor(!showNsEditor)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all"
            style={{
              background: "var(--accent-subtle)",
              color: "var(--accent)",
              border: "1px solid rgba(124, 111, 247, 0.25)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {namespace}
            <Settings className="h-3 w-3 opacity-60" />
          </motion.button>

          <AnimatePresence>
            {showNsEditor && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl p-3 z-50"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-strong)",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--foreground-subtle)" }}>
                    Namespace
                  </span>
                  <button onClick={() => setShowNsEditor(false)} style={{ color: "var(--foreground-subtle)" }}>
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={nsInput}
                    onChange={(e) => setNsInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleNsApply()}
                    placeholder="default"
                    className="text-xs py-1.5"
                  />
                  <Button size="sm" onClick={handleNsApply}>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Upload button */}
        <motion.button
          onClick={onOpenUpload}
          className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold"
          style={{
            background: "linear-gradient(135deg, #7c6ff7, #6b5ff0)",
            color: "white",
            boxShadow: "0 4px 14px rgba(124, 111, 247, 0.35)",
          }}
          whileHover={{ scale: 1.04, boxShadow: "0 6px 20px rgba(124, 111, 247, 0.5)" }}
          whileTap={{ scale: 0.96 }}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload Docs
        </motion.button>
      </div>
    </header>
  );
}
