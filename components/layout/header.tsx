"use client";

import { Bot, PanelLeftOpen } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      <button
        onClick={onToggleSidebar}
        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
      >
        <PanelLeftOpen className="h-5 w-5" />
      </button>
      <Bot className="h-6 w-6 text-blue-600" />
      <h1 className="text-lg font-semibold">Agentic RAG</h1>
    </header>
  );
}
