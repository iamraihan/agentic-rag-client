"use client";

import { useState } from "react";
import { UploadForm } from "@/components/upload/upload-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Database,
  Settings,
  X,
  PanelLeftClose,
  PanelLeftOpen,
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
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-gray-200 bg-white transition-transform duration-200 dark:border-gray-700 dark:bg-gray-900",
          "lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold">Knowledge Base</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {showSettings ? (
                <X className="h-4 w-4" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={onToggle}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              Active Namespace
            </label>
            <div className="flex gap-2">
              <Input
                value={nsInput}
                onChange={(e) => setNsInput(e.target.value)}
                placeholder="default"
                className="text-sm"
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={handleNsChange}
              >
                Set
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {namespace}
            </span>
          </div>
          <UploadForm namespace={namespace} />
        </div>
      </aside>

      {/* Toggle button for desktop when closed (only visible on lg+) */}
      {!open && (
        <button
          onClick={onToggle}
          className="fixed left-2 top-3 z-30 hidden rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:block dark:hover:bg-gray-800"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
