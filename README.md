# Agentic RAG — Frontend

A modern AI-powered document chat interface built with Next.js. Upload documents to a knowledge base and ask questions — the AI answers with source citations.

## Backend

This frontend requires the Agentic RAG backend to be running.

**Backend repository:** [https://github.com/iamraihan/agentic-rag-backend](https://github.com/iamraihan/agentic-rag-backend)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Motion
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/iamraihan/agentic-rag-client
cd agentic-rag-client
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Set your backend URL in `.env.local`:

```env
API_BASE_URL=http://localhost:8000
```

### 3. Start the backend

Follow the setup instructions in the [backend repo](https://github.com/iamraihan/agentic-rag-backend) and make sure it's running before starting the frontend.

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Document upload** — PDF, TXT, and Markdown support (up to 10MB)
- **Namespace management** — Organize documents into separate knowledge bases
- **AI chat** — Ask questions and get answers with source citations
- **Animated UI** — Smooth transitions and an AI typing indicator
- **Dark theme** — Elegant dark-first design with glassmorphism accents

## Project Structure

```
app/
  api/          # Next.js API route proxies
  page.tsx      # Main page
  layout.tsx    # Root layout
components/
  chat/         # ChatPanel, ChatMessage, ChatInput
  layout/       # Header
  upload/       # UploadModal, UploadForm
  ui/           # Button, Input (primitives)
lib/
  schemas.ts    # Zod schemas and TypeScript types
  fetcher.ts    # HTTP utility
  api-config.ts # Backend URL config
```
