# Shared Types — Agents Overview

This folder provides small, shared TypeScript types that the UI uses to coordinate agent‑like flows (text, image, document, audio) and navigation. Think of these types as the “contracts” between UI components and the application shell.

While this project is not an autonomous agent framework, it exposes focused UI responsibilities (“agent‑like” flows) that call the GenAI backend. The types in this folder help wire those flows into the layout, routing, and navigation.

## What this subfolder contains

- `navigation.ts`
  - Defines `TabKey` and `NavItem`, which represent the available workflows (tabs) and their display metadata.
  - These types are consumed by `src/App.tsx` and `src/layouts/*` to render the sidebar, header, and the active page.

## How these types support agent‑like flows

Each agent‑like UI flow is represented by a tab:

- Text Generation Agent (Prompt‑only)
  - Tab key: `text`
  - Uses `NavItem` to provide label, description, and icon in the UI.
- File‑to‑Text Agent (Multimodal: image/document/audio)
  - Tab keys: `image`, `document`, `audio`
  - Each uses `NavItem` to render dedicated routes and panels.
- Chat Agent (Conversational)
  - Chat runs in a floating window, but navigation still benefits from consistent tab metadata and layout behavior.

`TabKey` restricts valid keys to `'text' | 'image' | 'document' | 'audio'`, which keeps navigation wiring and lazy page loading in `src/App.tsx` type‑safe.

## Related types in other subfolders

- `src/api/types.ts`
  - `GenerateResponse`: `{ model?: string; text?: string; error?: string }`
  - `ChatHistoryItem`: `{ role: 'user' | 'assistant' | 'system'; content: string }`
  - These are the data contracts returned by the backend and consumed by UI components like `TextPanel`, `FilePanel`, and `Chatbot`.

This subfolder focuses on UI/navigation types. If you need response/request shapes tied to backend calls, prefer importing from `src/api/types.ts`.

## Conventions and guidelines

- Keep this folder limited to UI‑level shared types (navigation, layout, and cross‑cutting UI metadata).
- Domain/request/response types should live in `src/api/types.ts`.
- When adding a new agent‑like flow:
  1. Extend `TabKey` with a new key (e.g., `'video'`).
  2. Add a `NavItem` for the new tab (label, description, icon).
  3. Wire the new tab in `src/App.tsx` (update `navItems` and `pageComponents`).
  4. Implement the corresponding page in `src/pages/*` and UI panel(s) in `src/components/elements/*`.

## Type details

- `TabKey`
  - Union of valid workflow keys: `'text' | 'image' | 'document' | 'audio'`.
  - Used throughout the app (sidebar, mobile nav, main outlet) to select the active view.
- `NavItem`
  - Shape: `{ key: TabKey; label: string; description: string; icon: ComponentType<SVGProps<SVGSVGElement>> }`
  - Ensures each tab/workflow is consistently represented (name, help text, icon).

## Why it matters

A clear separation of shared UI types (here) and backend data types (`src/api/types.ts`) keeps the codebase easy to extend:
- Adding a new UI workflow remains low‑risk and strongly typed.
- Navigation and layout code can trust `TabKey` and `NavItem` to be complete and correct.
- Components can import only the types they need from focused modules.

## Summary

This `src/types` subfolder defines small, shared types for navigation and layout that stitch together agent‑like flows in the UI. For data contracts with the backend (prompts, file uploads, chat), rely on `src/api/types.ts`. Use these types to extend or refine workflows while keeping the app structure strongly typed and maintainable.