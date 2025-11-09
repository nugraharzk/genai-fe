# GenAI FE — Agents Overview (src tree)

This document explains the “agent-like” responsibilities implemented in the `src` tree, and what each subfolder contains. Although this project is not an autonomous agent framework, it provides focused UI flows (you can think of them as agents) that orchestrate requests to a NestJS GenAI backend (Gemini) and render results.

Core “agent-like” flows:
- Text generation agent — compose a prompt with optional system instruction and model.
- File-to-text agent — upload image/document/audio plus optional prompt/system instruction/model.
- Chat agent — floating conversational UI that maintains local history and sends it to the backend.

The UI is built with React + Vite + TypeScript and TailwindCSS, using small `fetch` wrappers for API calls and centralized error handling.

## Runtime configuration

- `API_BASE` resolution order (`src/api/config.ts`):
  1. `globalThis.__APP_CONFIG__?.API_BASE_URL` (runtime-injected)
  2. `import.meta.env.VITE_API_BASE_URL` (from `.env`)
  3. Default `http://localhost:5000`
- Network failures surface a friendly message via `NETWORK_ERROR_MESSAGE`.

## Backend endpoints used

- `POST /generate-text` — JSON `{ prompt, model?, systemInstruction? }`
- `POST /generate-from-image` — FormData `image`, optional `prompt`, `model`, `systemInstruction`
- `POST /generate-from-document` — FormData `document`, optional `prompt`, `model`, `systemInstruction`
- `POST /generate-from-audio` — FormData `audio`, optional `prompt`, `model`, `systemInstruction`
- `POST /api/chat` — JSON `{ prompt, messages?, model?, systemInstruction? }`

Response shape:
- `GenerateResponse = { model?: string; text?: string; error?: string }`
- `ChatHistoryItem = { role: 'user' | 'assistant' | 'system'; content: string }`

Error normalization (`src/api/errors.ts`):
- Converts HTTP status + body to friendly messages via `humanizeHttpError`.
- Special-case: if server mentions `GEMINI_API_KEY` or `GOOGLE_API_KEY`, the UI shows that the Gemini API key is missing on the backend.
- Common codes handled: 400, 401/403, 413 (file too large), 415 (unsupported type), 429 (rate limit), 5xx.

---

## Subfolder overview and responsibilities

### `src/api`
Client-side modules that call the backend and normalize errors.

- `config.ts`
  - Exposes `API_BASE`, resolving from runtime config, environment, or default.
  - Provides `NETWORK_ERROR_MESSAGE` for consistent network failure messaging.

- `generate.ts`
  - Implements:
    - `generateTextApi({ prompt, model?, systemInstruction? })`
    - `generateFromImageApi({ file, prompt?, model?, systemInstruction? })`
    - `generateFromDocumentApi({ file, prompt?, model?, systemInstruction? })`
    - `generateFromAudioApi({ file, prompt?, model?, systemInstruction? })`
  - Uses `FormData` for file uploads; validates `res.ok`; delegates error parsing to `parseError`.

- `chat.ts`
  - Implements `chatWithGeminiApi({ prompt, history?, model?, systemInstruction? })` calling `POST /api/chat`.
  - Sends local history (`messages`) with each prompt for conversational context.

- `errors.ts`
  - `parseError(res: Response)` — tries to parse JSON or text; extracts `error|message|text`.
  - `humanizeHttpError(status, rawMessage?)` — maps failures to clear, human-friendly messages.
  - Flags missing Gemini API key messages when detected.

- `types.ts`
  - `GenerateResponse` — common success/error payload from backend.
  - `ChatHistoryItem` — history item format sent to the chat endpoint.

- `index.ts`
  - Re-exports API functions/types for simpler imports elsewhere.

What this folder contains: Thin wrappers around `fetch`, centralized error normalization, and shared API types. It acts as the “transport” layer for agent-like UI flows.

---

### `src/components`
All reusable UI elements, split by category. These components implement the user-facing parts of “agents.”

- `base/`
  - `Alert.tsx` — standardized status messaging (success/info/warn/error).
  - `Button.tsx` — primary/secondary/ghost/etc button styles with loading states.
  - `Card.tsx` — container panel with consistent styling.
  - `IconButton.tsx` — icon-only button (e.g., copy/close actions).
  - `Tabs.tsx` — tabs foundation used by the layout/flow.
  - `index.ts` — re-exports base components.

  What this subfolder contains: Low-level building blocks used throughout the UI.

- `form/`
  - `Field.tsx` — labeled field wrapper with error and optional flags.
  - `Input.tsx` — styled `input` with Tailwind classes.
  - `Textarea.tsx` — styled `textarea` with Tailwind classes.
  - `index.ts` — re-exports form components.

  What this subfolder contains: Form primitives and composition helpers for consistent inputs.

- `elements/`
  - `TextPanel.tsx` — Text generation agent UI:
    - Collects `prompt`, optional `systemInstruction`, optional `model`.
    - Calls `generateTextApi`.
    - Renders result via `MarkdownOutput` or shows `ErrorAlert`.
    - Supports copy-to-clipboard, clear/reset, and Ctrl/Cmd+Enter submit.
  - `FilePanel.tsx` — File-to-text agent UI (image/document/audio modes):
    - Drag-and-drop and browse file.
    - Optional `prompt`, `systemInstruction`, `model`.
    - Calls `generateFromImageApi` / `generateFromDocumentApi` / `generateFromAudioApi`.
    - Previews image and audio; renders result via `MarkdownOutput`.
  - `ModelSelect.tsx` — Gemini model picker grouped by Default/Recommended/Paid.
    - Leaving blank uses backend default (`gemini-1.5-flash`).
    - Uses Headless UI `Listbox`.
  - `MarkdownOutput.tsx` — renders Markdown with `react-markdown` + `remark-gfm`.
    - Inline and fenced code styling; link behavior with `target="_blank"`.
  - `ErrorAlert.tsx` — standardized error presentation with `Alert`.
  - `Chatbot.tsx` — Chat agent UI:
    - Floating, toggleable chat window (mobile full-screen).
    - Maintains local message history; calls `chatWithGeminiApi`.
    - Renders assistant replies as Markdown; handles error messages distinctly.

  What this subfolder contains: Higher-level UI components for each agent-like flow.

- `utils/`
  - `cn.ts` (re-exported in `utils/index.ts`) — class name utility (conditional class merging).

  What this subfolder contains: Small utilities used across components.

- `tokens.ts`
  - Design tokens and helper exports for styling consistency.

- `index.ts`
  - Re-exports `base`, `form`, `tokens`, and `utils` for convenience.

What this folder contains: The view-layer implementation of “agents” and supporting components.

---

### `src/layouts`
Page scaffolding: header, sidebar, footer, outlet containers, and mobile bottom nav.

- `Header.tsx` — sticky top header; exposes “docs” click (currently a stub).
- `Sidebar.tsx` — app navigation:
  - Collapsible/pinned behavior; lazy page switching via `navItems`.
  - Displays runtime `apiBase` value.
- `MainOutlet.tsx` — main content area with tabs description and panel container.
- `MobileBottomNav.tsx` — compact bottom navigation for mobile screens.
- `Footer.tsx` — site footer with basic information.
- `index.ts` — re-exports layout components.

What this folder contains: Shell and navigation components that frame the agent panels.

---

### `src/pages`
Lazy-loaded pages for each flow.

- `TextPage.tsx` — renders `TextPanel`.
- `ImagePage.tsx` — renders `FilePanel` with `mode="image"` and image MIME filter.
- `DocumentPage.tsx` — renders `FilePanel` with `mode="document"` and document MIME filters.
- `AudioPage.tsx` — renders `FilePanel` with `mode="audio"` and audio MIME filter.

What this folder contains: Route-level components that host agent panels; wired in `App.tsx`.

---

### `src/types`
Project-wide TypeScript types.

- `navigation.ts`
  - `TabKey` union type: `'text' | 'image' | 'document' | 'audio'`.
  - `NavItem` shape for the sidebar/tabs: `{ key, label, description, icon }`.

What this folder contains: Shared types (currently focused on navigation).

---

### Root files in `src`
- `App.tsx`
  - Main app wrapper: header, sidebar, outlet, footer, and floating `Chatbot`.
  - Defines `navItems` and lazy imports of each page.
  - Reads `apiBase` from runtime or env.
- `main.tsx`
  - Vite entry that mounts the React app.
- `index.css`, `App.css`
  - Tailwind and app-level styles.
- `vite-env.d.ts`
  - Vite/TypeScript environment types.

What these files contain: App bootstrap, page wiring, and global styling for the entire UI.

---

## Agent-like responsibilities summary

- Text Generation Agent (`TextPanel`)
  - Inputs: `prompt` (required), `systemInstruction` (optional), `model` (optional).
  - Call: `generateTextApi`.
  - Output: `MarkdownOutput` with copy-to-clipboard; errors via `ErrorAlert`.

- File-to-Text Agent (`FilePanel` with `mode`)
  - Inputs: `file` + optional `prompt`, `systemInstruction`, `model`.
  - Calls: `generateFromImageApi` / `generateFromDocumentApi` / `generateFromAudioApi`.
  - Output: Preview (image/audio) and Markdown; errors normalized.

- Chat Agent (`Chatbot`)
  - Inputs: message text; local chat history.
  - Call: `chatWithGeminiApi` (sends `messages` history).
  - Output: Markdown replies; error styling; mobile and desktop UX.

- Error Normalization (`src/api/errors.ts`)
  - Converts HTTP statuses and messages into readable guidance.

- Model Selection (`ModelSelect`)
  - Helps choose a Gemini model or leave blank to use backend default.

---

## Extending the src tree

To add a new agent-like flow:
1. Implement a backend endpoint returning a `GenerateResponse`-like payload.
2. Add a client wrapper in `src/api/` (e.g., `myFeature.ts`) using `fetch`, `API_BASE`, and `parseError`.
3. Build a panel component (mirroring `TextPanel` or `FilePanel`) under `src/components/elements/`.
4. Create a page under `src/pages/` and wire it into `navItems` and lazy imports in `App.tsx`.
5. Render results with `MarkdownOutput` and errors with `ErrorAlert`. Use `ModelSelect` if a model is applicable.

This keeps concerns well-separated: transport in `api`, view logic in `components/elements`, layout in `layouts`, and routing in `pages`.
