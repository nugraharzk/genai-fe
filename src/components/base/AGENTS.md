# Base UI Primitives — Agents Overview

This folder contains foundational, reusable UI primitives that power the higher‑level “agent‑like” flows (Text, Image/Document/Audio, and Chat) found in `src/components/elements` and pages. These primitives standardize interaction patterns, styling, and accessibility across the app.

Subfolder purpose
- Provide consistent controls and containers used by feature panels.
- Encapsulate common behaviors (loading, disabled states, tones/variants, layout).
- Serve as the building blocks (“agent primitives”) for the application’s workflows.

Contents
- `Alert.tsx` — feedback surface for success/info/warning/error messages.
- `Button.tsx` — primary and secondary action trigger.
- `Card.tsx` — container panel for grouping related content.
- `IconButton.tsx` — compact, icon‑only action trigger with tone/size variants.
- `Tabs.tsx` — tabbed navigation primitive for switching between views.
- `index.ts` — re‑exports all primitives for easy consumption.

How these primitives act like “agents”
- Action Agent (`Button`, `IconButton`)
  - Responsibility: Initiate user actions (submit, open, clear).
  - Behavior: Respect `disabled` and `isLoading` states; provide keyboard and screen reader hints via attributes like `type`, `aria-label`.
- Feedback Agent (`Alert`)
  - Responsibility: Communicate system and validation outcomes in a coherent tone.
  - Behavior: Accepts a `tone` such as `error`, `info`, `success`, `warning`. Presents `title` and descriptive children content.
- Container Agent (`Card`)
  - Responsibility: Visually group and separate tasks/outputs (e.g., prompt setup vs. generated output).
  - Behavior: Wraps children with consistent panel styling; supports additional `className`.
- View Switcher Agent (`Tabs`)
  - Responsibility: Provide structured navigation for multiple views.
  - Behavior: Renders a selectable strip or panel arrangement to move between content areas.

Usage in the app
- `Button`
  - Used in feature panels for actions like Generate, Clear, Browse files, and Chat Send.
  - Common props seen across the app:
    - `variant`: `"primary" | "outline" | "ghost"` — choose visual priority.
    - `size`: `"sm" | "lg"` — pick compact or prominent sizing.
    - `isLoading`: `boolean` — shows a busy state and prevents duplicate submits.
    - `disabled`: `boolean` — prevents interaction when prerequisites aren’t met.
- `IconButton`
  - Used in places where space is limited or the action is contextual (e.g., Copy response, Close chat).
  - Common props:
    - `tone`: `"brand" | "neutral"` — adjust contrast and emphasis.
    - `size`: `"sm"` and other sizes as implemented.
    - Always provide an `aria-label` describing the action (e.g., `"Copy response"`).
- `Alert`
  - Displayed for error and informational messages with clear, humanized text.
  - Example pattern: `ErrorAlert` composes `Alert` with `tone="error"` to surface backend/network issues.
- `Card`
  - Wraps form sections (Prompt, System Instruction, Model Selector) and result areas (Output).
  - Helps achieve a consistent look for panels across all flows.
- `Tabs`
  - Available for tabbed interactions; aligns with navigation patterns used in layouts.

Design and accessibility notes
- Styling: TailwindCSS class composition is used throughout; primitives accept `className` for extension.
- Accessibility:
  - Provide `aria-label` for `IconButton` so screen readers can announce the purpose.
  - Ensure `Button` uses correct `type="button" | "submit"` depending on context.
  - Place `Alert` near the content it describes; consider `role="alert"` semantics when appropriate.

Interactions with other folders
- `src/components/elements/*`:
  - Composes these primitives to build “agent‑like” workflows:
    - `TextPanel` (prompt‑only generation)
    - `FilePanel` (image/document/audio upload + prompt)
    - `Chatbot` (floating conversational window)
    - `ModelSelect` (Gemini model picker)
- `src/components/form/*`:
  - Works alongside `Field`, `Input`, `Textarea` — primitives wrap and align form content and actions.
- `src/layouts/*`:
  - `Card`, `Button`, and `IconButton` are used for headers, sidebars, footers, and mobile nav interactions.

Behavioral guidelines
- Loading and disabled states:
  - Use `isLoading` to prevent double submissions and reflect busy operations.
  - Respect `disabled` to guard actions when prerequisites aren’t met (e.g., missing prompt or file).
- Tone and variant consistency:
  - Choose `variant="primary"` for main actions; `outline` or `ghost` for secondary/tertiary actions.
  - Use `tone="brand"` for affirmative emphasis; `neutral` for utility actions.
- Composition:
  - Prefer composing primitives inside `Card` to maintain visual rhythm across pages.

Extending this subfolder
- When adding a primitive:
  - Keep prop APIs simple and consistent with existing naming (`variant`, `size`, `tone`, `isLoading`).
  - Centralize class names and rely on existing utilities like `cn` for conditional styling.
  - Document expected accessibility attributes (e.g., `aria-label` for icon-only controls).
- When adding a new `variant` or `tone`:
  - Define semantic intent (e.g., “destructive” for risk‑increasing actions) and ensure visual distinction.
  - Update usage in `elements` to reinforce consistent meaning across flows.

Testing considerations
- Snapshot tests for visual variants to guard against unintended style regressions.
- Interaction tests (e.g., disabled buttons don’t trigger handlers; `isLoading` prevents multiple submissions).
- Accessibility checks (presence of `aria-label` for `IconButton`; focus states visible; keyboard operability).

Summary
This `base` subfolder houses the UI primitives that act as small, focused “agents” for actions, feedback, and layout. They enable consistent, accessible, and composable experiences across all feature panels and are the foundation on which the app’s agent‑like flows are built.