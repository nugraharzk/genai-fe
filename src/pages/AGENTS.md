# AGENTS — Pages (route wrappers)

This subfolder contains lightweight route-level wrappers for the primary GenAI workflows: text-only prompts and multimodal file + prompt flows. Each page delegates most logic to reusable components under `src/components/elements/*` and simply wires up configuration (e.g., accepted MIME types) and endpoint bindings.

## Purpose

- Provide shallow pages that host a specific “agent-like” workflow.
- Keep page components minimal; push UI logic and API concerns down into `TextPanel` and `FilePanel`.
- Enable lazy-loading and clean navigation via `src/App.tsx`.

## What lives here

- `TextPage.tsx`
  - Renders `TextPanel` (prompt-only flow).
  - No props; `TextPanel` manages its own state and calls `generateTextApi`.
- `ImagePage.tsx`
  - Renders `FilePanel` with `mode="image"`, `accept="image/*"`, `helper="Max 15MB"`.
  - Binds `submit={generateFromImageApi}`.
- `DocumentPage.tsx`
  - Renders `FilePanel` with `mode="document"`.
  - Uses `ACCEPT_TYPES` constant: `.pdf,.doc,.docx,.txt,.md,.rtf,.html,.htm,.ppt,.pptx,.xls,.xlsx,application/*,text/*`.
  - `helper="Max 20MB"`, `submit={generateFromDocumentApi}`.
- `AudioPage.tsx`
  - Renders `FilePanel` with `mode="audio"`, `accept="audio/*"`, `helper="Max 25MB"`.
  - Binds `submit={generateFromAudioApi}`.

These wrappers maintain no local state. They exist to provide clear entry points (routes/tabs) and pass the correct configuration to the underlying panels.

## How these pages fit the “agent” concept

While the project does not implement autonomous server-side agents, each page can be viewed as an agent-like orchestrator that:

- Collects user inputs for a specific modality (text, image, document, audio).
- Invokes the correct backend capability via a focused API function.
- Presents results using shared rendering (Markdown, error alerts).

Pages themselves are intentionally thin; `TextPanel` and `FilePanel` encapsulate the actual agent-like responsibilities (state handling, form validation, submissions, previews, error messaging, copy-to-clipboard).

## Relationships and dependencies

- Components:
  - `src/components/elements/TextPanel.tsx`
  - `src/components/elements/FilePanel.tsx`
- API bindings:
  - `src/api/generate.ts` (`generateTextApi`, `generateFromImageApi`, `generateFromDocumentApi`, `generateFromAudioApi`)
- Navigation:
  - `src/App.tsx` wires lazy imports and tab navigation (`navItems`, `pageComponents`).
  - Navigation keys come from `src/types/navigation.ts` (`'text' | 'image' | 'document' | 'audio'`).

## Runtime behavior

- Pages are lazy-loaded via `React.lazy` in `src/App.tsx`.
- Suspense fallback shows: “Loading workflow…” while the page component resolves.
- The panels use local state and call the backend using `fetch` wrappers. Errors are normalized via `src/api/errors.ts`.

## Extending pages (adding a new route/workflow)

1. Create a new page file under `src/pages/`, e.g., `VideoPage.tsx`.
2. Choose a panel pattern:
   - For pure prompt → reuse `TextPanel`.
   - For prompt + file → reuse `FilePanel` with the appropriate `mode`, `accept`, and `submit` handler.
3. Implement or bind an API function in `src/api/*` that targets your backend endpoint and leverages `parseError`.
4. Register the page:
   - Add a `NavItem` to `navItems` in `src/App.tsx`.
   - Add a lazy import in `pageComponents` keyed by your navigation key.
5. Align file size/type hints (`helper`, `accept`) with backend validation (413/415 responses are surfaced in `ErrorAlert`).

## Best practices

- Keep pages thin—push logic into the shared panels and API modules.
- Maintain consistency: use `MarkdownOutput` for rendering and `ErrorAlert` for failures.
- Match `accept` MIME types and UI hints to backend allowances to improve UX.
- Prefer explicit `mode` values (`'image' | 'document' | 'audio'`) to drive `FilePanel` semantics and visuals.

## Testing and QA notes

- Verify that selecting tabs (Text/Image/Document/Audio) renders the correct page and panel.
- Confirm the correct `accept` MIME filter is applied by the file picker.
- Exercise error scenarios:
  - Network outages (`NETWORK_ERROR_MESSAGE`).
  - File too large (HTTP 413).
  - Unsupported type (HTTP 415).
  - Missing backend API key (special-case messaging).
- Check copy-to-clipboard actions and Markdown rendering.

## Summary

The `src/pages` folder is the routing surface for the app’s agent-like workflows. Each file is a small wrapper that selects the right panel and API integration for its modality. This separation keeps navigation clean, pages lean, and shared components reusable across flows.