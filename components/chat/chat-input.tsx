"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatRequestSchema, type ChatRequest } from "@/lib/schemas";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSubmit: (data: ChatRequest) => void;
  loading: boolean;
  namespace: string;
  threadId: string | null;
}

export function ChatInput({
  onSubmit,
  loading,
  namespace,
  threadId,
}: ChatInputProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatRequest>({
    resolver: zodResolver(chatRequestSchema),
    defaultValues: {
      message: "",
      namespace,
      thread_id: threadId,
    },
  });

  const submit = (data: ChatRequest) => {
    onSubmit({ ...data, namespace, thread_id: threadId });
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(submit)();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex items-end gap-2 border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
    >
      <Textarea
        {...register("message")}
        placeholder="Ask a question about your documents..."
        rows={1}
        error={errors.message?.message}
        onKeyDown={handleKeyDown}
        className="min-h-[44px] max-h-[120px]"
        disabled={loading}
      />
      <Button type="submit" loading={loading} className="shrink-0">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
