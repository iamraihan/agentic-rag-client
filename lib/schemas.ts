import { z } from "zod";

// ---- Request Schemas ----

export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(4000, "Message must be under 4000 characters")
    .refine((val) => val.trim().length > 0, "Message cannot be empty"),
  thread_id: z.string().nullish(),
  namespace: z.string().min(1).max(255),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const uploadRequestSchema = z.object({
  namespace: z.string().min(1, "Namespace is required").max(255),
});

export type UploadRequest = z.infer<typeof uploadRequestSchema>;

// ---- Response Types ----

const citationSchema = z.object({
  source: z.string(),
  chunk_index: z.number(),
  preview: z.string(),
});

export type Citation = z.infer<typeof citationSchema>;

export type ChatResponse = {
  ok: boolean;
  answer: string;
  thread_id: string;
  citations: Citation[];
};

export const ingestionResponseSchema = z.object({
  ok: z.boolean(),
  namespace: z.string(),
  source: z.string(),
  total_chunks: z.number(),
});

export type IngestionResponse = z.infer<typeof ingestionResponseSchema>;
