# Agents Overview — Form Components

This subfolder contains reusable, styled form primitives used throughout the UI flows (“agent-like” panels) in the application. These primitives keep markup, accessibility, and styling consistent, while allowing feature panels to focus on behavior and orchestration with the GenAI backend.

## What this subfolder contains

- `Field.tsx`
  - A compositional wrapper for form fields that manages label, optional flag, and error display.
  - Exposes a render prop pattern to supply a stable `id` to the actual input control, ensuring correct association between labels and inputs.
  - Centralizes spacing and text styles so all form fields look and behave consistently.
- `Input.tsx`
  - A styled `input` control that forwards refs and merges class names via `cn`.
  - Designed for general text entry, small configuration inputs, and quick prompts.
- `Textarea.tsx`
  - A styled `textarea` control that forwards refs and merges class names via `cn`.
  - Used for multi-line prompts and system instructions.
- `index.ts`
  - Barrel file that re-exports `Field`, `Input`, and `Textarea` for convenient imports.

## Role in agent-like flows

The application implements several user-facing flows that you can think of as “agents” orchestrating requests to the backend:
- Text Generation Agent (prompt-only) — `TextPanel.tsx`
- File-to-Text Agents (image/document/audio) — `FilePanel.tsx`
- Chat Agent (conversational) — `Chatbot.tsx`

Form primitives in this folder support those flows by:
- Standardizing how prompts and system instructions are captured.
- Providing accessible labels and error messages where needed.
- Keeping the UI consistent across panels and routes.

## Design principles

- Composability:
  - `Field` uses a render prop `(id: string) => JSX.Element` so the child control receives the exact `id` tied to its label. This avoids duplicate `aria-*` and ensures accessibility without complex props.
- Accessibility:
  - Labels and inputs are properly associated through matching `id` and `htmlFor`.
  - Errors are presented adjacent to the field with clear text styles.
- Consistency:
  - Shared Tailwind classes are applied in a single place, reducing duplicated styles and drift between panels.
- Flexibility:
  - Form components accept native attributes (`InputHTMLAttributes`, `TextareaHTMLAttributes`), so feature panels can wire custom event handlers (e.g. keyboard shortcuts, `onChange`) without special wrappers.
  - `forwardRef` is used to support focus management and integrations that need direct element access.

## Where these components are used

- `src/components/elements/TextPanel.tsx`
  - Captures prompt and optional system instruction for text generation.
- `src/components/elements/FilePanel.tsx`
  - Captures optional prompt and system instruction along with file uploads for image/document/audio flows.
- `src/components/elements/Chatbot.tsx`
  - Uses a simple input for messages; the same styling approach applies.

## Error and validation conventions

- Panels handle validation and error states and pass error messages to `Field` when appropriate.
- Network and server error messaging are handled separately by the API layer (`src/api/errors.ts`) and rendered by `ErrorAlert`, not by the form controls themselves.

## Extending the form components

If you add a new agent-like flow or field type:
1. Prefer building on `Field` for label, optional marker, and error handling.
2. Create a new primitive (e.g. `Select`, `Checkbox`) following the same patterns:
   - Forward refs
   - Accept native attributes
   - Merge classes via `cn`
   - Keep accessible associations (`id`, `aria-*`) clear
3. Export from `index.ts` so panels can import from a single path.
4. Maintain consistent spacing and typography to match existing form components.

## Notes for maintainers

- Keep visual tokens (colors, spacing, radii) aligned with the brand system used across components.
- Avoid embedding feature-specific logic in these primitives; keep flows orchestrated at the panel level.
- Test keyboard interactions in panels (e.g. Ctrl/Cmd+Enter submission) using `Textarea`/`Input` event props rather than modifying the primitives here.

## Summary

This subfolder provides the foundational building blocks for collecting user input in the app’s agent-like workflows. By centralizing labels, error display, and styling in `Field`, `Input`, and `Textarea`, we ensure accessible and consistent forms across Text, File-to-Text, and Chat experiences, while keeping each flow’s logic isolated in its respective panel.