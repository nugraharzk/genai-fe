# Components — Agents Overview

This folder contains the reusable UI building blocks that power the app’s “agent-like” workflows: text generation, multimodal file processing, and conversational chat. Components here are organized into primitives, form elements, and higher-level composites that orchestrate calls to the backend.

The components are designed to:
- Keep responsibilities local and composable
- Provide consistent UX for prompting, uploading, and viewing responses
- Normalize error presentation
- Support optional model selection and system instructions

## Subfolders and contents

### `base/` — UI primitives
Foundational components used throughout the app. They provide consistent styling, accessibility, and behavior.

- `Alert.tsx`
  - Purpose: Display contextual messages (info, error, etc.) with tone-based styling.
  - Used by: `elements/ErrorAlert.tsx`, `elements/ModelSelect.tsx` (informational notes).
- `Button.tsx`
  - Purpose: Primary and secondary buttons with variants, sizes, and loading states.
  - Used by: `TextPanel`, `FilePanel`, `Chatbot`, and many other UI actions.
- `Card.tsx`
  - Purpose: Container with padding, border, and subtle background for grouping UI sections.
  - Used by: Prompt setup panels and Output areas.
- `IconButton.tsx`
  - Purpose: Accessible, focus-visible icon-only actions (e.g., copy output, close chat).
  - Used by: Output copy buttons and Chatbot close.
- `Tabs.tsx`
  - Purpose: Tabbed navigation primitive; used when switching between workflows or sections.
- `index.ts`
  - Purpose: Re-exports all primitives for simple imports (`export * from './Alert'`, etc.).

These primitives support keyboard/focus UX (e.g., visible focus rings) and make it easy to build consistent UI.

### `form/` — Form components
Helpers for building accessible forms with labels, errors, and inputs.

- `Field.tsx`
  - Purpose: Wrapper that renders a label, optional hint, and error state for an input.
  - Pattern: Controlled via render-prop to associate the generated `id` with the labeled input.
- `Input.tsx`
  - Purpose: Styled text input via `forwardRef`, compatible with standard `InputHTMLAttributes`.
- `Textarea.tsx`
  - Purpose: Styled multiline input with `forwardRef`; used for prompts and system instructions.
- `index.ts`
  - Purpose: Re-exports form components.

Keyboard shortcuts:
- In composite panels, `Ctrl+Enter` or `Cmd+Enter` triggers submit.

### `elements/` — Composite components for workflows
Higher-level components that coordinate UI state, call API wrappers, and render results. These can be reasoned about as “agent-like” flows.

- `TextPanel.tsx` — Text Generation Flow
  - Inputs: `Prompt` (required), `System Instruction` (optional), `Model` (optional).
  - Calls: `generateTextApi({ prompt, model?, systemInstruction? })`.
  - Output: Renders `GenerateResponse.text` via `MarkdownOutput`; supports copy-to-clipboard.
  - Errors: Normalized and displayed via `ErrorAlert`.
  - UX: Clear/reset action, keyboard submit (`Ctrl/Cmd + Enter`).

- `FilePanel.tsx` — File-to-Text Flow (Multimodal)
  - Modes: `'image' | 'document' | 'audio'` via `mode` prop.
  - Inputs: A file plus optional `Prompt`, `System Instruction`, `Model`.
  - Calls:
    - `generateFromImageApi({ file, prompt?, model?, systemInstruction? })`
    - `generateFromDocumentApi({ file, prompt?, model?, systemInstruction? })`
    - `generateFromAudioApi({ file, prompt?, model?, systemInstruction? })`
  - Output: Renders `GenerateResponse.text` via `MarkdownOutput`.
  - Errors: Normalized via `ErrorAlert`; surfaces server codes like 413 (too large) and 415 (unsupported type).
  - UX: Drag-and-drop upload, manual file selection, inline file preview (image/audio), clear/reset, copy-to-clipboard.

- `ModelSelect.tsx` — Gemini Model Picker
  - Behavior: Uses Headless UI `Listbox` with grouped options. Blank value selects the backend-default (described as `gemini-1.5-flash` in the label).
  - UX: Clear selection affordances and tone-based highlighting of the current choice.
  - Notes: Paid models may require access/billing; the component surfaces an informational alert.

- `MarkdownOutput.tsx` — Markdown Renderer
  - Purpose: Render rich text using `react-markdown` with GFM (`remark-gfm`).
  - UX: Styled code blocks, accessible links, readable prose formatting.

- `ErrorAlert.tsx` — Error Presentation
  - Purpose: Wrap errors in a consistent alert style with a default title and humanized messages.

- `Chatbot.tsx` — Conversational Chat Agent (UI)
  - Inputs: Free-form user messages; each submission composes local chat history.
  - Calls: `chatWithGeminiApi({ prompt, history?, model?, systemInstruction? })` → `POST /api/chat`.
  - Output: Assistant replies rendered via `MarkdownOutput`.
  - Errors: Displayed in distinct styling within the message stream.
  - UX: Floating mobile/desktop panel, accessible toggling, `Enter` to submit, maintains scroll-to-bottom behavior, focus management on send.

These composites orchestrate frontend responsibilities—validation, loading states, error handling—and delegate the actual generation to the backend API.

### `utils/` — Utilities
- `cn.ts` (exposed via `utils/index.ts`)
  - Purpose: Class name concatenation helper for conditional Tailwind styling.

### Root files
- `index.ts`
  - Purpose: Barrel file for re-exporting `base`, `form`, `tokens`, and `utils` to simplify imports across the app.

- `tokens.ts`
  - Purpose: Provides shared tokens/constants for components. See the file for exact definitions and usage within this codebase.

## How these components relate to “agents”
While this frontend doesn’t implement autonomous server-side agents, each composite component encapsulates a responsibility that resembles an agent-like flow:
- Text Generation Agent: `TextPanel` → transforms prompt/context into generated text via the backend.
- File-to-Text Agent: `FilePanel` → transforms uploaded file + optional prompt/context into text via the backend.
- Chat Agent: `Chatbot` → maintains conversational context and requests replies from the backend.

Each uses:
- API wrappers from `src/api/*` (`generate.ts`, `chat.ts`)
- Types from `src/api/types.ts` (e.g., `GenerateResponse`, `ChatHistoryItem`)
- Error normalization from `src/api/errors.ts` (`parseError`, `humanizeHttpError`)
- Runtime base URL from `src/api/config.ts` (`API_BASE`, `NETWORK_ERROR_MESSAGE`)

## Extending this folder
To add a new agent-like UI flow:
1. Create a composite in `elements/` (e.g., `MyNewPanel.tsx`) that follows `TextPanel` or `FilePanel` patterns:
   - Controlled local state
   - Submit handler calling a thin API wrapper
   - `ErrorAlert` for error states
   - `MarkdownOutput` for rendering generated text
2. Add any primitives you need under `base/` and form helpers in `form/`.
3. Export it via `components/index.ts` for convenient imports.

## UX and accessibility highlights
- Visible focus states on interactive elements.
- Keyboard shortcuts for efficient submission:
  - `Ctrl+Enter`/`Cmd+Enter` within prompt textareas.
  - `Enter` in chat input to send.
- Copy-to-clipboard affordances for generated output.
- Error messages presented consistently and unobtrusively.

## Limitations
- Streaming responses are not implemented on the frontend; content renders after the request completes.
- File size/type constraints are enforced by the backend; UI surfaces these via normalized errors.
- Backend must be reachable with CORS at the resolved `API_BASE`.

By keeping primitives simple and composites focused, the `components/` subtree provides a clear foundation for agent-like experiences that are easy to extend and maintain.