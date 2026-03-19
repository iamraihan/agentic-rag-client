"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadRequestSchema, type UploadRequest } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetcher, ApiError } from "@/lib/fetcher";
import type { IngestionResponse } from "@/lib/schemas";
import { Upload, FileUp, CheckCircle, AlertCircle } from "lucide-react";

const ACCEPTED_TYPES = ".pdf,.txt,.md";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

interface UploadStatus {
  type: "success" | "error";
  message: string;
}

interface UploadFormProps {
  namespace: string;
}

export function UploadForm({ namespace }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<UploadStatus | null>(null);
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

    if (!selected) {
      setFile(null);
      return;
    }

    if (selected.size > MAX_SIZE) {
      setStatus({ type: "error", message: "File exceeds 10MB limit" });
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const onSubmit = async (data: UploadRequest) => {
    if (!file) {
      setStatus({ type: "error", message: "Please select a file" });
      return;
    }

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
        message: `Uploaded "${res.source}" - ${res.total_chunks} chunks created`,
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof ApiError
            ? err.message
            : "Upload failed. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Namespace
        </label>
        <Input
          {...register("namespace")}
          placeholder="default"
          error={errors.namespace?.message}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Document
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-gray-750"
        >
          <FileUp className="mb-2 h-8 w-8 text-gray-400" />
          {file ? (
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {file.name}{" "}
              <span className="text-gray-400">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </p>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Click to select a file
              </p>
              <p className="mt-1 text-xs text-gray-400">
                PDF, TXT, or Markdown (max 10MB)
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {status && (
        <div
          className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
            status.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          {status.message}
        </div>
      )}

      <Button type="submit" loading={uploading} className="w-full">
        <Upload className="h-4 w-4" />
        Upload Document
      </Button>
    </form>
  );
}
