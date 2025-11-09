# AGENTS — elements (feature‑level components)

Scope
- This folder contains feature‑level UI components that orchestrate user flows (“agent‑like” responsibilities) for the GenAI frontend.
- Components here coordinate inputs (prompt, files, model selection), call backend APIs via thin wrappers, and render results with consistent UX and error handling.

Contents
- Chatbot.tsx — floating conversational “Chat Agent”
- ErrorAlert.tsx — standardized error presentation wrapper
- FilePanel.tsx — upload + prompt “File‑to‑Text Agent” (image/document/audio)
- MarkdownOutput.tsx — Markdown renderer for responses
- ModelSelect.tsx — Gemini model picker
- TextPanel.tsx — prompt‑only “Text Generation Agent”

Component catalog

1) TextPanel.tsx — Text Generation Agent
- Purpose: Compose a prompt with optional system instruction and model; submit for a text response.
- Dependencies: generateTextApi (from src/api), ModelSelect, Button, Card, Field, IconButton, Textarea, MarkdownOutput, ErrorAlert, ClipboardDocumentIcon.
- Internal state:
  - prompt, systemInstruction, model (string)
  - loading (boolean)
  - result (GenerateResponse | null)
  - errorMsg (string)
- Behavior:
  - Submit: POST /generate-text via generateTextApi
  - Validation: disables Generate if prompt is empty; shows “Prompt is required” inline while loading if empty
  - Keyboard: Cmd/Ctrl + Enter submits
  - Copy output: copies response text when available
  - Clear: resets inputs and output
- Output: Renders GenerateResponse.text as Markdown; displays normalized errors via ErrorAlert.
- Notes: Uses the same ModelSelect as other flows; leaves model blank to use backend default.

2) FilePanel.tsx — File‑to‑Text Agent (image/document/audio)
- Purpose: Upload a file with optional prompt/system instruction/model; submit for a text response.
- Props:
  - mode: 'image' | 'document' | 'audio'
  - submit: (params: { file; prompt?; model?; systemInstruction? }) => Promise<GenerateResponse>
  - accept: string (file input accept filter)
  - helper?: string (UI helper text, e.g., size limits)
- Dependencies: Button, Card, IconButton, Field, Textarea, ModelSelect, MarkdownOutput, ErrorAlert, cn, heroicons (ArrowUpTrayIcon, DocumentTextIcon, MusicalNoteIcon, PhotoIcon, ClipboardDocumentIcon).
- Internal state:
  - file (File | null)
  - prompt, systemInstruction, model
  - loading (boolean)
  - result (GenerateResponse | null)
  - errorMsg (string)
  - dragActive (boolean)
- Behavior:
  - Upload UI: drag‑and‑drop or browse; shows selected file with size; Remove resets input
  - Submit: calls provided submit function:
    - image → generateFromImageApi
    - document → generateFromDocumentApi
    - audio → generateFromAudioApi
  - Validation: disables Generate until a file is selected
  - Keyboard: Cmd/Ctrl + Enter submits
  - Previews: image preview for images; audio player for audio
  - Copy output and Clear similar to TextPanel
- Output: Renders GenerateResponse.text as Markdown; surfaces backend error reasons via ErrorAlert.
- Notes:
  - Accept and helper are passed by pages (e.g., ImagePage, DocumentPage, AudioPage) to match backend constraints.
  - HTTP error codes like 413 (too large) and 415 (unsupported) are normalized in src/api/errors.ts.

3) ModelSelect.tsx — Model Selector (supporting utility)
- Purpose: Allow users to choose a Gemini model or leave blank to use backend default (gemini-1.5-flash).
- Props:
  - value?: string
  - onChange: (value: string) => void
- Dependencies: Headless UI Listbox + Transition, Heroicons (Check/Chevron), Alert, cn.
- Behavior:
  - Option groups:
    - Default: blank value → “Use backend default (gemini-1.5-flash)”
    - Recommended: gemini-1.5-flash, gemini-1.5-flash-8b
    - Paid: gemini-1.5-pro, gemini-2.0-flash, gemini-2.0-pro (availability/billing dependent)
  - Selected state is memoized for performance and correctness
  - Shows a notice that paid models may require access and billing
- Notes: Keeping the select blank defers the model choice to the server’s configuration.

4) MarkdownOutput.tsx — Markdown Renderer
- Purpose: Render response text as Markdown consistently.
- Dependencies: react-markdown, remark-gfm.
- Behavior:
  - Custom components:
    - link: opens in a new tab with safe rel attributes, styled as link
    - code:
      - inline code styled with mono font and border
      - code block wrapped in <pre> with scroll and dark theme
  - If content is empty/falsey, shows a friendly “(no text)” placeholder
- Notes: Use across all flows for consistent presentation.

5) ErrorAlert.tsx — Error Presentation
- Purpose: Show human‑friendly error messages in a consistent visual style.
- Props:
  - message: string
  - title?: string (defaults to “Something went wrong”)
- Dependencies: Alert (base component).
- Notes: Combine with src/api/errors.ts normalization so users see actionable messages (e.g., missing Gemini API key on the backend).

6) Chatbot.tsx — Conversational Chat Agent
- Purpose: Provide a floating chat UI for quick conversational queries with history context.
- Dependencies: chatWithGeminiApi (src/api/chat), Button, IconButton, MarkdownOutput, cn.
- Internal state:
  - isOpen (boolean) — controls floating window visibility
  - messages: array of { id, text, sender: 'user' | 'bot', status?: 'error' }
  - inputValue (string)
  - isSending (boolean)
  - refs: messagesEndRef, messagesContainerRef, inputRef
- Behavior:
  - Toggle and close controls, with desktop floating window and mobile full‑screen overlay
  - Submit:
    - Sends latest prompt and local history mapped to ChatHistoryItem roles
    - Renders bot replies as Markdown
    - Error replies are styled distinctly and presented as plain text
  - Scrolling:
    - Auto‑scrolls to bottom after message additions
    - Smooth scrolling when open; direct jump when closed
  - Keyboard: Enter submits (single‑line input)
  - Accessibility: labels, roles, aria attributes on the floating dialog and message log
- Output: Assistant replies and error notices appended to chat transcript.
- Notes: Independent from the main panels; intentionally lightweight local state with no global store.

How these elements act as “agents”
- TextPanel: “Text Generation Agent” — Input: prompt/model/system; Output: text
- FilePanel: “File‑to‑Text Agent” — Input: file (+prompt/model/system); Output: text; supports image/audio previews
- Chatbot: “Chat Agent” — Input: prompt (+local history/model/system); Output: assistant reply
- Shared utilities:
  - ModelSelect → model choice mediator
  - MarkdownOutput → response renderer
  - ErrorAlert → error surface aligned with src/api/errors.ts

Conventions and UX notes
- Error handling: surface normalized messages from src/api/errors.ts (e.g., missing GEMINI_API_KEY/GOOGLE_API_KEY).
- Keyboard shortcuts:
  - TextPanel/FilePanel: Cmd/Ctrl + Enter to submit
  - Chatbot: Enter to submit
- Copy to clipboard: available in TextPanel/FilePanel when output text exists.
- Layout: Panels are designed to pair a form on the left with an output card on the right for clarity.

Extending this folder
- Add a new feature‑level panel by mirroring TextPanel/FilePanel:
  - Keep state local for input, loading, result, error
  - Use centralized API wrappers in src/api (add new wrapper if needed)
  - Render MarkdownOutput for consistency
  - Use ErrorAlert for failures
  - Consider ModelSelect if the flow benefits from user‑selectable model
  - Provide clear helper text and validation states
- For new conversational variants:
  - Follow Chatbot patterns for history composition, scrolling, and keyboard/accessibility

Constraints and assumptions
- No streaming UI in these components; responses are rendered after request completion.
- File size/type validation relies on backend; UI reflects errors via normalized messages.
- Backend must be reachable with CORS at the resolved API base URL.

Related modules
- src/api/generate.ts — text/image/document/audio APIs
- src/api/chat.ts — conversational API call
- src/api/errors.ts — parseError + humanizeHttpError (centralized messaging)
- src/api/config.ts — API_BASE and network error message