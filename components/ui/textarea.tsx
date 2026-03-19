import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, style, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-xl px-3 py-2 text-sm transition-all duration-150 resize-none",
            "placeholder:text-(--foreground-subtle)",
            "focus:outline-none focus:ring-2",
            error ? "ring-1 ring-(--danger)" : "",
            className
          )}
          style={{
            background: "var(--surface-2)",
            border: `1px solid ${error ? "var(--danger)" : "var(--border-strong)"}`,
            color: "var(--foreground)",
            ...style,
          }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs" style={{ color: "var(--danger)" }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
