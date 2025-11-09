# Utilities — Agents Overview

This document explains what the `src/components/utils` subfolder contains and how it supports the rest of the UI through small, agent‑like responsibilities.

## Purpose

The `utils` folder provides lightweight, framework‑agnostic helpers used across components to keep styles and behavior consistent. These helpers act like “utility agents”:
- They have a single responsibility.
- They are pure (no side effects).
- They are reused across the UI wherever needed.

## Contents

- `index.ts`
  - A barrel file that re‑exports utilities for convenient imports.
  - Currently re‑exports the `cn` helper from `./cn`, providing a single import path for class name composition across the app.

## Key export: `cn`

- Role: A class name composition helper used throughout the UI to merge Tailwind CSS class strings conditionally.
- Typical usage patterns:
  - Compose base + conditional styles.
  - Apply hover/active/disabled variations.
  - Keep component style definitions readable and maintainable.
- Where it’s used (examples in this project):
  - `src/components/form/Input.tsx`
  - `src/components/elements/ModelSelect.tsx`
  - `src/components/elements/Chatbot.tsx`
  - `src/components/elements/FilePanel.tsx`

## Responsibilities of this subfolder (agent‑like)

1. Class Name Composer
   - Provides `cn` for combining Tailwind class strings with minimal overhead.
   - Ensures consistent styling logic across components.

2. Utility Hub
   - Serves as the central place to host small, pure helpers needed by multiple components.
   - Encourages code reuse and a single source of truth for common logic.

## Design guidelines

- Keep utilities pure:
  - No DOM access.
  - No React hooks.
  - Deterministic output based on input.
- Keep APIs small and stable:
  - Prefer simple function signatures.
  - Avoid leaking component‑specific concerns.
- Facilitate tree‑shaking:
  - Export named functions.
  - Re‑export through `index.ts` for consistent imports.
- Avoid side effects:
  - Utilities should not alter global state or rely on shared mutable data.

## Extending utilities

If you add helpers, place them in this folder and re‑export them from `index.ts`. Suggested patterns:
- Formatting helpers (e.g., bytes to human‑readable).
- String/array/object guards (e.g., `isNonEmptyString`, `isTruthy`).
- Class name helpers beyond `cn` if you need additional composition patterns.
- Non‑UI logic that multiple components share (e.g., simple validators).

## How these utilities support the app

- Improve readability and maintainability in component files.
- Centralize common behaviors to reduce duplication.
- Provide consistent styling logic for Tailwind classes via `cn`.
- Make UI code more declarative and less error‑prone, acting as small “utility agents” delegated with clear tasks.

## Summary

The `src/components/utils` subfolder houses small, focused helpers that act as utility agents across the UI. Today, `cn` is the primary export and is used widely to compose class names cleanly. As the app grows, add more pure, well‑scoped utilities here and re‑export them through `index.ts` to keep imports consistent and the codebase maintainable.