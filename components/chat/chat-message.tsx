"use client";

import { cn } from "@/lib/cn";
import type { Citation } from "@/lib/schemas";
import { FileText, User, Sparkles, ExternalLink } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export function ChatMessage({ role, content, citations }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 py-3 animate-fade-in",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={
          isUser
            ? {
                background: "linear-gradient(135deg, #7c6ff7, #9088f9)",
                boxShadow: "0 0 12px rgba(124, 111, 247, 0.4)",
              }
            : {
                background: "linear-gradient(135deg, rgba(124, 111, 247, 0.2), rgba(6, 214, 160, 0.1))",
                border: "1px solid rgba(124, 111, 247, 0.25)",
              }
        }
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Sparkles className="h-4 w-4" style={{ color: "var(--accent)" }} />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn("max-w-[78%] rounded-2xl px-4 py-3", isUser && "rounded-tr-sm")}
        style={
          isUser
            ? {
                background: "linear-gradient(135deg, #7c6ff7, #6b5ff0)",
                boxShadow: "0 4px 20px rgba(124, 111, 247, 0.3)",
                color: "white",
              }
            : {
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }
        }
      >
        <p
          className="whitespace-pre-wrap text-sm leading-relaxed"
          style={{ color: isUser ? "rgba(255,255,255,0.95)" : "var(--foreground)" }}
        >
          {content}
        </p>

        {citations && citations.length > 0 && (
          <div
            className="mt-3 space-y-1.5 pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Sources
            </p>
            {citations.map((c, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-xl p-2.5 text-xs transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <FileText
                  className="mt-0.5 h-3 w-3 shrink-0"
                  style={{ color: "var(--accent-2)", opacity: 0.8 }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="font-semibold truncate"
                      style={{ color: "rgba(255,255,255,0.85)" }}
                    >
                      {c.source}
                    </span>
                    <span
                      className="shrink-0 rounded px-1 py-px text-[9px]"
                      style={{
                        background: "rgba(6, 214, 160, 0.15)",
                        color: "var(--accent-2)",
                        border: "1px solid rgba(6, 214, 160, 0.2)",
                      }}
                    >
                      §{c.chunk_index}
                    </span>
                  </div>
                  {c.preview && (
                    <p
                      className="mt-0.5 leading-snug line-clamp-2"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {c.preview}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
