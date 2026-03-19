"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { fetcher, ApiError } from "@/lib/fetcher";
import type { ChatRequest, ChatResponse, Citation } from "@/lib/schemas";
import { Sparkles, Zap, BookOpen, FileSearch } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

interface ChatPanelProps {
  namespace: string;
}

const suggestions = [
  { icon: Zap, text: "Summarize the key points" },
  { icon: BookOpen, text: "Explain the main concepts" },
  { icon: FileSearch, text: "Find specific information" },
];

export function ChatPanel({ namespace }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async (data: ChatRequest) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: data.message };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetcher<ChatResponse>("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setThreadId(res.thread_id);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: res.answer, citations: res.citations },
      ]);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to get response. Please try again.";
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col items-center justify-center px-6 py-12"
            >
              <motion.div
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, rgba(124,111,247,0.25), rgba(6,214,160,0.15))",
                  border: "1px solid rgba(124,111,247,0.3)",
                  boxShadow: "0 0 40px rgba(124,111,247,0.2)",
                }}
                animate={{ boxShadow: ["0 0 24px rgba(124,111,247,0.15)", "0 0 48px rgba(124,111,247,0.3)", "0 0 24px rgba(124,111,247,0.15)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-10 w-10" style={{ color: "var(--accent)" }} />
              </motion.div>

              <h2 className="mb-2 text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                Ask your documents
              </h2>
              <p className="mb-8 max-w-sm text-center text-sm leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                Upload documents to the knowledge base, then ask questions and get AI-powered answers with source citations.
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map(({ icon: Icon, text }, i) => (
                  <motion.button
                    key={text}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    onClick={() => handleSubmit({ message: text, namespace, thread_id: threadId })}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
                    style={{ background: "var(--glass)", border: "1px solid var(--border)", color: "var(--foreground-muted)" }}
                    whileHover={{ background: "var(--accent-subtle)", borderColor: "rgba(124,111,247,0.3)", color: "var(--accent)", scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="messages" className="mx-auto max-w-3xl px-4 py-6">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} role={msg.role} content={msg.content} citations={msg.citations} />
              ))}

              <AnimatePresence>
                {loading && <AIThinkingIndicator />}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ChatInput onSubmit={handleSubmit} loading={loading} namespace={namespace} threadId={threadId} />
    </div>
  );
}

function AIThinkingIndicator() {
  return (
    <motion.div
      className="flex gap-3 py-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
    >
      {/* Avatar */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{
          background: "linear-gradient(135deg, rgba(124,111,247,0.2), rgba(6,214,160,0.1))",
          border: "1px solid rgba(124,111,247,0.25)",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
        </motion.div>
      </div>

      {/* Thinking bubble */}
      <div
        className="flex items-center gap-3 rounded-2xl rounded-tl-sm px-4 py-3"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        {/* Waveform bars */}
        <div className="flex items-center gap-0.75">
          {[0, 0.1, 0.2, 0.1, 0.2].map((delay, i) => (
            <motion.span
              key={i}
              className="w-0.75 rounded-full"
              style={{ background: "var(--accent)", height: 14 }}
              animate={{ scaleY: [0.3, 1, 0.3] }}
              transition={{ duration: 0.9, repeat: Infinity, delay, ease: "easeInOut" }}
            />
          ))}
        </div>
        <span className="text-xs font-medium" style={{ color: "var(--foreground-muted)" }}>
          Thinking…
        </span>
      </div>
    </motion.div>
  );
}
