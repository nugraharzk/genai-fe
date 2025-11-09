# GenAI FE — Agents Overview

This project is a lightweight React + Vite + Tailwind front‑end for a NestJS GenAI backend (Gemini). It exposes simple, focused UI flows to:
- Generate pure text from a prompt
- Upload an image, document, or audio and optionally provide a prompt/system instruction
- Select an optional Gemini model
- Chat conversationally via a floating chat window

It is not an autonomous agent framework. Instead, it implements client-side flows you can think of as “agent-like” orchestrations that call backend endpoints and render results.

## What this project does

- Provides a clean UI to send requests to a GenAI backend
- Wraps backend calls in a small `fetch` abstraction
- Normalizes common network and HTTP errors
- Renders responses as Markdown for readability
- Offers a floating chat UI for quick conversational queries

## Tech stack and structure

- React + Vite + TypeScript
- TailwindCSS for styling
- Headless UI for the model selector (`Listbox`)
- Heroicons for icons

Key directories and files:
- `src/App.tsx` — main app shell and navigation
- `src/pages/*` — route-level pages:
  - `TextPage.tsx`, `ImagePage.tsx`, `DocumentPage.tsx`, `AudioPage.tsx`
- `src/components/*` — reusable UI:
  - `elements/TextPanel.tsx` — prompt-only flow
  - `elements/FilePanel.tsx` — file + optional prompt/system/model
  - `elements/ModelSelect.tsx` — Gemini model picker
  - `elements/Chatbot.tsx` — floating chat UI
  - `elements/MarkdownOutput.tsx` — renders response with `react-markdown`
  - `elements/ErrorAlert.tsx` — presents errors clearly
- `src/api/*` — backend client:
  - `config.ts` — resolves `API_BASE`
  - `generate.ts` — endpoints for text/image/document/audio
  - `chat.ts` — conversational endpoint
  - `errors.ts` — `parseError` and `humanizeHttpError`
  - `types.ts` — `GenerateResponse`, `ChatHistoryItem`
- `src/layouts/*` — page scaffolding: header, sidebar, footer, mobile nav
- `README.md` — quick start and endpoint summary
- `vite.config.ts`, `tailwind.config.ts`, `Dockerfile` — tooling and packaging

## Runtime configuration

`API_BASE` resolution order (in `src/api/config.ts`):
1. `globalThis.__APP_CONFIG__?.API_BASE_URL` — injected at runtime
2. `import.meta.env.VITE_API_BASE_URL` — from `.env`
3. Fallback to `http://localhost:5000`

Network failure message is centralized via `NETWORK_ERROR_MESSAGE`.

## Backend endpoints used

From `src/api/generate.ts` and `src/api/chat.ts`, and documented in `README.md`:
- `POST /generate-text` — JSON `{ prompt, model?, systemInstruction? }`
- `POST /generate-from-image` — FormData: `image` plus optional `prompt`, `model`, `systemInstruction`
- `POST /generate-from-document` — FormData: `document` plus optional `prompt`, `model`, `systemInstruction`
- `POST /generate-from-audio` — FormData: `audio` plus optional `prompt`, `model`, `systemInstruction`
- `POST /api/chat` — JSON `{ prompt, messages?, model?, systemInstruction? }`

All return `GenerateResponse`:
- `GenerateResponse = { model?: string; text?: string; error?: string }`

Chat history item type:
- `ChatHistoryItem = { role: 'user' | 'assistant' | 'system'; content: string }`

## Error handling

- `parseError(res: Response)` attempts to parse JSON or text and maps to a human-friendly message via `humanizeHttpError(status, rawMessage?)`
- Special cases for missing Gemini API key:
  - If backend returns messages mentioning `GEMINI_API_KEY` or `GOOGLE_API_KEY`, the UI surfaces: “Server is missing its Gemini API key. Please configure it on the backend.”
- Common HTTP codes handled: 400, 401/403, 413 (file too large), 415 (unsupported type), 429 (rate limit), 5xx

## Agent-like flows (UI responsibilities)

1. Text Generation Agent (Prompt-only)
   - Component: `TextPanel`
   - Backend call: `generateTextApi({ prompt, model?, systemInstruction? })`
   - Inputs: prompt (required), optional model and system instruction
   - Output: `GenerateResponse.text` rendered as Markdown; supports copy-to-clipboard
   - Error path: shows `ErrorAlert` with normalized message

2. File-to-Text Agent (Multimodal: image/document/audio)
   - Component: `FilePanel` (`mode: 'image' | 'document' | 'audio'`)
   - Backend calls:
     - `generateFromImageApi({ file, prompt?, model?, systemInstruction? })`
     - `generateFromDocumentApi({ file, prompt?, model?, systemInstruction? })`
     - `generateFromAudioApi({ file, prompt?, model?, systemInstruction? })`
   - Inputs: a file plus optional prompt/system/model
   - Output: `GenerateResponse.text` rendered as Markdown; previews image/audio where applicable
   - Error path: normalized messages; handles file size/type constraints (e.g., 413/415)
   - UX: drag-and-drop upload, browse file, clear/reset, copy-to-clipboard

3. Chat Agent (Conversational)
   - Component: `Chatbot`
   - Backend call: `chatWithGeminiApi({ prompt, history?, model?, systemInstruction? })` → `POST /api/chat`
   - Maintains local chat history; sends `messages` alongside the latest prompt
   - Output: assistant replies rendered as Markdown; error messages styled distinctly
   - UX: floating window, mobile full-screen mode, one-click toggle, keyboard submit

4. Error Normalizer
   - Module: `src/api/errors.ts`
   - Purpose: convert raw server responses and status codes into clear guidance

5. Model Selector
   - Component: `ModelSelect`
   - Options grouped as Default, Recommended (free/standard), Paid (billing required)
   - Behavior: blank value means “use backend default (gemini-1.5-flash)”

## UI flows in practice

- Text:
  - Fill `Prompt`, optionally `System Instruction`, optionally pick a `Model`
  - Click `Generate`
  - Result appears on the right; copy as needed

- Image/Document/Audio:
  - Pick or drag-and-drop a file, optionally add `Prompt` and `System Instruction`, optionally pick a `Model`
  - Click `Generate`
  - Preview (image/audio) and result appear; copy as needed

- Chat:
  - Open floating chat and type a message
  - Each submit sends the full local history with the new prompt
  - Responses are appended and rendered as Markdown

## Limits and assumptions

- Requires backend availability with CORS at `API_BASE`
- File size/type limits are enforced by the backend; UI surfaces HTTP errors like 413 and 415
- Responses are rendered after the request completes; streaming is not implemented client-side
- API keys are backend concerns; no client-side keys are used

## Extending the project (adding a new agent-like flow)

1. Add a new backend endpoint that accepts your inputs and returns a `GenerateResponse`-like payload.
2. Create a thin client in `src/api/` (e.g., `myFeature.ts`) using `fetch`, `parseError`, and `API_BASE`.
3. Implement a panel component following `TextPanel` or `FilePanel` patterns.
4. Add a page in `src/pages/` and wire navigation in `src/App.tsx` (`navItems`, lazy import).
5. Render results through `MarkdownOutput`, use `ErrorAlert` for errors, and consider `ModelSelect` if applicable.

## Operational notes

- `pnpm install && pnpm dev` to run locally (see `README.md`)
- Docker packaging is available via `Dockerfile`; `.dockerignore` reduces image context
- Tailwind and Vite configs are provided; ESLint config exists for linting
- Workspace config (`pnpm-workspace.yaml`) keeps the project focused; `ignoredBuiltDependencies`/`onlyBuiltDependencies` help build stability

## Key types and functions

- `GenerateResponse` — shared success/error shape
- `ChatHistoryItem` — role/content pairs for conversational context
- `generateTextApi`, `generateFromImageApi`, `generateFromDocumentApi`, `generateFromAudioApi` — upload/prompt flows
- `chatWithGeminiApi` — conversational API call
- `parseError`, `humanizeHttpError` — error parsing and humanization
- `API_BASE` — resolved runtime API base URL

## Summary

GenAI FE is a pragmatic front-end that organizes several “agent-like” tasks—text generation, multimodal file reasoning, and chat—around a NestJS Gemini backend. The components encapsulate responsibility, keep state local, and provide a consistent UX for prompting, selecting models, and viewing results with robust error handling. It’s easy to extend by adding new endpoints and mirroring existing panel patterns.