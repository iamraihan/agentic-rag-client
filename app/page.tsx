"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { ChatPanel } from "@/components/chat/chat-panel";
import { UploadModal } from "@/components/upload/upload-modal";

export default function Home() {
  const [namespace, setNamespace] = useState("default");
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header
        namespace={namespace}
        onNamespaceChange={setNamespace}
        onOpenUpload={() => setUploadOpen(true)}
      />
      <main className="flex-1 overflow-hidden">
        <ChatPanel namespace={namespace} />
      </main>
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        namespace={namespace}
      />
    </div>
  );
}
