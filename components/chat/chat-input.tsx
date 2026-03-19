"use client";

import { useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatRequestSchema, type ChatRequest } from "@/lib/schemas";
import { Send, Square } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChatInputProps {
  onSubmit: (data: ChatRequest) => void;
  loading: boolean;
  namespace: string;
  threadId: string | null;
}

export function ChatInput({ onSubmit, loading, namespace, threadId }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasText, setHasText] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChatRequest>({
    resolver: zodResolver(chatRequestSchema),
    defaultValues: { message: "", namespace, thread_id: threadId },
  });

  const { ref: registerRef, onChange: registerOnChange, ...registerRest } = register("message");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    registerOnChange(e);
    setHasText(e.target.value.trim().length > 0);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  const submit = useCallback((data: ChatRequest) => {
    onSubmit({ ...data, namespace, thread_id: threadId });
    reset();
    setHasText(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [onSubmit, namespace, threadId, reset]);

  const onClickSend = useCallback(() => {
    handleSubmit(submit)();
  }, [handleSubmit, submit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onClickSend();
    }
  };

  return (
    <div
      className="px-4 pb-5 pt-3"
      style={{ background: "linear-gradient(to top, rgba(13,13,20,0.98) 60%, transparent)" }}
    >
      <div className="mx-auto max-w-2xl">
        <motion.div
          className="relative rounded-2xl p-px overflow-hidden"
          animate={{
            boxShadow: loading
              ? "0 0 0 1px rgba(124,111,247,0.6), 0 8px 40px rgba(124,111,247,0.2)"
              : hasText
              ? "0 0 0 1px rgba(124,111,247,0.4), 0 8px 32px rgba(0,0,0,0.35)"
              : "0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.3)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated gradient border while loading */}
          <AnimatePresence>
            {loading && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "linear-gradient(90deg, #7c6ff7, #06d6a0, #7c6ff7)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>

          <div
            className="relative rounded-2xl flex flex-col gap-2 px-4 pt-3.5 pb-3"
            style={{ background: "var(--surface-2)" }}
          >
            <textarea
              {...registerRest}
              ref={(el) => {
                registerRef(el);
                (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
              }}
              onChange={handleChange}
              placeholder="Ask anything about your documents..."
              rows={1}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="w-full resize-none bg-transparent text-sm leading-relaxed focus:outline-none disabled:opacity-60"
              style={{
                color: "var(--foreground)",
                minHeight: "24px",
                maxHeight: "140px",
                caretColor: "var(--accent)",
              }}
            />
            {errors.message && (
              <p className="text-xs" style={{ color: "var(--danger)" }}>
                {errors.message.message}
              </p>
            )}

            <div className="flex items-center justify-between">
              <p className="text-[10px]" style={{ color: "var(--foreground-subtle)" }}>
                Enter to send · Shift+Enter for new line
              </p>

              <motion.button
                type="button"
                onClick={onClickSend}
                disabled={!hasText && !loading}
                className="flex h-8 w-8 items-center justify-center rounded-xl disabled:cursor-not-allowed"
                animate={{
                  background: hasText || loading
                    ? "linear-gradient(135deg, #7c6ff7, #6b5ff0)"
                    : "rgba(255,255,255,0.05)",
                  opacity: hasText || loading ? 1 : 0.4,
                  boxShadow: hasText || loading ? "0 0 16px rgba(124,111,247,0.4)" : "none",
                }}
                whileHover={hasText ? { scale: 1.08 } : {}}
                whileTap={hasText ? { scale: 0.92 } : {}}
                transition={{ duration: 0.2 }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="stop"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Square className="h-3.5 w-3.5 text-white fill-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="send"
                      initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.6, rotate: 15 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Send className="h-3.5 w-3.5 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
