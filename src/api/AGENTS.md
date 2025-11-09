# API Client Layer — Agents Overview

This document explains the responsibilities of the `src/api` subfolder, the endpoints it targets, and the agent-like responsibilities implemented in this layer.

## What this subfolder contains

This subfolder implements the client-side API layer. It provides small, focused wrappers around `fetch`, common error handling, and shared types used by the UI flows.

- `config.ts`
  - Defines `API_BASE`, resolved in this order:
    1. `globalThis.__APP_CONFIG__?.API_BASE_URL` (runtime-injected)
    2. `import.meta.env.VITE_API_BASE_URL` (from `.env`)
    3. Fallback: `http://localhost:5000`
  - Exposes `NETWORK_ERROR_MESSAGE` for consistent user-facing messages when the server cannot be reached.

- `types.ts`
  - `GenerateResponse`: `{ model?: string; text?: string; error?: string }`
  - `ChatHistoryItem`: `{ role: 'user' | 'assistant' | 'system'; content: string }`

- `errors.ts`
  - `parseError(res: Response)`: tries to parse JSON or text from a failed HTTP response and returns a human-friendly message.
  - `humanizeHttpError(status: number, rawMessage?: string)`: maps common statuses to readable guidance:
    - `400`: input issues
    - `401`/`403`: authorization
    - `413`: file too large
    - `415`: unsupported file type
    - `429`: rate limit
    - `5xx`: server-side errors
  - Special handling for missing backend Gemini key (looks for `GEMINI_API_KEY` or `GOOGLE_API_KEY` in server messages).

- `generate.ts`
  - Text flow:
    - `generateTextApi(input: { prompt: string; model?: string; systemInstruction?: string })`
    - Endpoint: `POST /generate-text` (JSON)
  - File flows (internal helper `uploadWithPrompt` builds `FormData`):
    - `generateFromImageApi({ file, prompt?, model?, systemInstruction? })`
      - Endpoint: `POST /generate-from-image` (FormData with `image`)
    - `generateFromDocumentApi({ file, prompt?, model?, systemInstruction? })`
      - Endpoint: `POST /generate-from-document` (FormData with `document`)
    - `generateFromAudioApi({ file, prompt?, model?, systemInstruction? })`
      - Endpoint: `POST /generate-from-audio` (FormData with `audio`)
  - All functions return `Promise<GenerateResponse>` and use `parseError` on failures.

- `chat.ts`
  - Conversational flow:
    - `chatWithGeminiApi(input: { prompt: string; history?: ChatHistoryItem[]; model?: string; systemInstruction?: string })`
    - Endpoint: `POST /api/chat` (JSON)
  - Returns `Promise<GenerateResponse>`; uses `parseError` on failures.

- `index.ts`
  - Barrel file for API exports (present for convenience in import paths).

## Agent-like responsibilities in the API layer

While there are no autonomous agents here, each function plays a focused role that supports the UI “agents”:

1. Request Builder Agent
   - Responsibility: Construct `fetch` requests with the correct headers/body (`JSON` or `FormData`) and target path.
   - Files: `generate.ts`, `chat.ts`

2. Error Normalizer Agent
   - Responsibility: Convert raw HTTP responses into actionable, user-friendly messages.
   - Files: `errors.ts`

3. Runtime Configuration Agent
   - Responsibility: Resolve `API_BASE` from multiple sources and provide consistent network-failure messaging.
   - Files: `config.ts`

4. Types and Contracts Agent
   - Responsibility: Define the minimal shared contracts for request/response payloads.
   - Files: `types.ts`

## Endpoints and payloads

- `POST /generate-text`
  - Body: JSON `{ prompt: string, model?: string, systemInstruction?: string }`
  - Returns: `GenerateResponse`

- `POST /generate-from-image`
  - Body: `FormData` with:
    - `image: File`
    - Optional: `prompt`, `model`, `systemInstruction`
  - Returns: `GenerateResponse`

- `POST /generate-from-document`
  - Body: `FormData` with:
    - `document: File`
    - Optional: `prompt`, `model`, `systemInstruction`
  - Returns: `GenerateResponse`

- `POST /generate-from-audio`
  - Body: `FormData` with:
    - `audio: File`
    - Optional: `prompt`, `model`, `systemInstruction`
  - Returns: `GenerateResponse`

- `POST /api/chat`
  - Body: JSON `{ prompt: string, messages?: ChatHistoryItem[], model?: string, systemInstruction?: string }`
  - Returns: `GenerateResponse`

All endpoints return the shared shape `GenerateResponse`, which the UI uses to render Markdown text or errors.

## Error handling details

- Network failures:
  - If `fetch` throws (e.g., server down or CORS issues), functions rethrow `NETWORK_ERROR_MESSAGE`.
- HTTP errors:
  - The response is parsed with `parseError` to surface meaningful messages.
  - Known backend configuration issues (e.g., missing Gemini key) are translated to a clear message.

## Security and configuration notes

- No API keys are handled in the front-end; the backend must be configured with the Gemini API key.
- Ensure CORS is enabled on the backend at `API_BASE` for the browser to reach it.

## Extending the API layer

To add a new backend capability:
1. Define a new endpoint in the backend that returns a `GenerateResponse`-like payload.
2. Create a new client function (e.g., `src/api/myFeature.ts`) that:
   - Uses `API_BASE`
   - Calls the endpoint via `fetch`
   - Parses failures using `parseError`
3. Export the function through `src/api/index.ts` for convenient imports by UI components.
4. Integrate it into the UI with a panel or page that mirrors existing patterns (`TextPanel` or `FilePanel`).

## Summary

The `src/api` subfolder provides:
- Deterministic API base resolution (`config.ts`)
- Shared types (`types.ts`)
- Centralized error parsing and humanization (`errors.ts`)
- Small, composable request functions for text, files, and chat (`generate.ts`, `chat.ts`)

Together, these modules act as agent-like building blocks that the UI composes into text generation, multimodal reasoning, and chat workflows, while keeping concerns separated and error handling consistent.