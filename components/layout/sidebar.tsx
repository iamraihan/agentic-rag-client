"use client";

import { useState } from "react";
import { UploadForm } from "@/components/upload/upload-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Layers,
  Settings,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface SidebarProps {
  namespace: string;
  onNamespaceChange: (ns: string) => void;
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({
  namespace,
  onNamespaceChange,
  open,
  onToggle,
}: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [nsInput, setNsInput] = useState(namespace);

  const handleNsChange = () => {
    const trimmed = nsInput.trim();
    if (trimmed) {
      onNamespaceChange(trimmed);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col transition-transform duration-300 ease-out",
          "lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          background: "linear-gradient(180deg, rgba(19, 19, 31, 0.98) 0%, rgba(13, 13, 20, 0.98) 100%)",
          borderRight: "1px solid rgba(255, 255, 255, 0.07)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background: "linear-gradient(135deg, rgba(124, 111, 247, 0.3), rgba(6, 214, 160, 0.2))",
                border: "1px solid rgba(124, 111, 247, 0.3)",
              }}
            >
              <Layers className="h-4 w-4" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h2
                className="text-sm font-semibold leading-none"
                style={{ color: "var(--foreground)" }}
              >
                Knowledge Base
              </h2>
              <p
                className="text-[10px] mt-0.5 leading-none"
                style={{ color: "var(--foreground-subtle)" }}
              >
                Document management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="rounded-lg p-1.5 transition-all duration-150"
              style={{ color: "var(--foreground-subtle)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "var(--glass-strong)";
                (e.currentTarget as HTMLElement).style.color = "var(--accent)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--foreground-subtle)";
              }}
            >
              {showSettings ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
            </button>
            <button
              onClick={onToggle}
              className="lg:hidden rounded-lg p-1.5 transition-all duration-150"
              style={{ color: "var(--foreground-subtle)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "var(--glass-strong)";
                (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--foreground-subtle)";
              }}
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div
            className="p-4 animate-fade-in"
            style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}
          >
            <label
              className="mb-2 block text-xs font-medium"
              style={{ color: "var(--foreground-muted)" }}
            >
              Active Namespace
            </label>
            <div className="flex gap-2">
              <Input
                value={nsInput}
                onChange={(e) => setNsInput(e.target.value)}
                placeholder="default"
                className="text-sm"
              />
              <Button size="sm" variant="secondary" onClick={handleNsChange}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Namespace badge */}
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}
        >
          <span
            className="text-[10px] font-medium uppercase tracking-widest"
            style={{ color: "var(--foreground-subtle)" }}
          >
            Namespace
          </span>
          <span
            className="rounded-md px-2 py-0.5 text-xs font-semibold"
            style={{
              background: "var(--accent-subtle)",
              color: "var(--accent)",
              border: "1px solid rgba(124, 111, 247, 0.2)",
            }}
          >
            {namespace}
          </span>
        </div>

        {/* Upload area */}
        <div className="flex-1 overflow-y-auto p-4">
          <UploadForm namespace={namespace} />
        </div>
      </aside>

      {/* Desktop toggle button when sidebar is closed */}
      {!open && (
        <button
          onClick={onToggle}
          className="fixed left-3 top-3.5 z-30 hidden lg:flex items-center justify-center rounded-xl h-8 w-8 transition-all duration-150"
          style={{
            background: "var(--glass-strong)",
            border: "1px solid var(--border)",
            color: "var(--foreground-muted)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = "var(--accent)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(124, 111, 247, 0.4)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = "var(--foreground-muted)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          }}
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}
    </>
  );
}
