"use client";

import { cn } from "@/lib/cn";
import type { Citation } from "@/lib/schemas";
import { FileText, User, Bot } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export function ChatMessage({ role, content, citations }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 py-4", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>

        {citations && citations.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-gray-200 pt-2 dark:border-gray-600">
            <p className="text-xs font-medium opacity-70">Sources:</p>
            {citations.map((c, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg bg-white/10 p-2 text-xs"
              >
                <FileText className="mt-0.5 h-3 w-3 shrink-0 opacity-60" />
                <div>
                  <span className="font-medium">{c.source}</span>
                  <span className="ml-1 opacity-60">
                    (chunk {c.chunk_index})
                  </span>
                  <p className="mt-0.5 opacity-70">{c.preview}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
