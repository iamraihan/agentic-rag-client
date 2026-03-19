"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadRequestSchema, type UploadRequest } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetcher, ApiError } from "@/lib/fetcher";
import type { IngestionResponse } from "@/lib/schemas";
import { Upload, FileUp, CheckCircle, AlertCircle, File } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const ACCEPTED_TYPES = ".pdf,.txt,.md";
const MAX_SIZE = 10 * 1024 * 1024;

interface UploadStatus {
  type: "success" | "error";
  message: string;
}

interface UploadFormProps {
  namespace: string;
  onSuccess?: () => void;
}

export function UploadForm({ namespace, onSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<UploadStatus | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadRequest>({
    resolver: zodResolver(uploadRequestSchema),
    defaultValues: { namespace },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setStatus(null);
    if (!selected) { setFile(null); return; }
    if (selected.size > MAX_SIZE) {
      setStatus({ type: "error", message: "File exceeds 10MB limit" });
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    if (dropped.size > MAX_SIZE) {
      setStatus({ type: "error", message: "File exceeds 10MB limit" });
      return;
    }
    setFile(dropped);
    setStatus(null);
  };

  const onSubmit = async (data: UploadRequest) => {
    if (!file) { setStatus({ type: "error", message: "Please select a file" }); return; }

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("namespace", data.namespace);

    try {
      const res = await fetcher<IngestionResponse>("/api/upload", {
        method: "POST",
        body: formData,
      });

      setStatus({
        type: "success",
        message: `"${res.source}" — ${res.total_chunks} chunks indexed`,
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => onSuccess?.(), 1200);
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof ApiError ? err.message : "Upload failed. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--foreground-muted)" }}>
          Namespace
        </label>
        <Input {...register("namespace")} placeholder="default" error={errors.namespace?.message} />
      </div>

      {/* Drop zone */}
      <div>
        <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--foreground-muted)" }}>
          Document
        </label>
        <motion.div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          animate={{
            borderColor: dragging ? "rgba(124,111,247,0.7)" : file ? "rgba(6,214,160,0.4)" : "rgba(255,255,255,0.1)",
            background: dragging ? "rgba(124,111,247,0.08)" : "rgba(255,255,255,0.02)",
          }}
          transition={{ duration: 0.15 }}
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl p-6 text-center"
          style={{ border: "2px dashed rgba(255,255,255,0.1)" }}
        >
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <div
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: "var(--accent-2-subtle)", border: "1px solid rgba(6,214,160,0.25)" }}
                >
                  <File className="h-5 w-5" style={{ color: "var(--accent-2)" }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{file.name}</p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--foreground-subtle)" }}>
                  {(file.size / 1024).toFixed(1)} KB · Ready to upload
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <div
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: "var(--glass-strong)", border: "1px solid var(--border)" }}
                >
                  <FileUp className="h-5 w-5" style={{ color: "var(--foreground-subtle)" }} />
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground-muted)" }}>
                  Drop a file or click to browse
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--foreground-subtle)" }}>
                  PDF, TXT, or Markdown · Max 10MB
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES} onChange={handleFileChange} className="hidden" />
        </motion.div>
      </div>

      {/* Status */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-2.5 rounded-xl p-3 text-xs"
            style={{
              background: status.type === "success" ? "var(--success-subtle)" : "var(--danger-subtle)",
              border: `1px solid ${status.type === "success" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
              color: status.type === "success" ? "var(--success)" : "var(--danger)",
            }}
          >
            {status.type === "success"
              ? <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              : <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>

      <Button type="submit" loading={uploading} className="w-full" variant="primary">
        <Upload className="h-4 w-4" />
        {uploading ? "Uploading..." : "Upload Document"}
      </Button>
    </form>
  );
}
