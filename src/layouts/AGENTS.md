# Layouts — Agents Overview

This folder implements the app scaffold: header, sidebar, content outlet, footer, and mobile navigation. These components coordinate the overall user experience and can be viewed as “agent-like” UI responsibilities that orchestrate navigation, responsive layout, and context around the core page flows.

## What this subfolder contains

- `Header.tsx`
  - Responsibility: Fixed top app bar providing branding/context and optional actions (e.g., docs link).
  - Integration: Receives an `offsetClass` (from `App.tsx`) to align content when the sidebar is collapsed or expanded.
  - Behavior: Non-owning of feature state; purely presentational/layout control at the top.

- `Sidebar.tsx`
  - Responsibility: Primary navigation “agent” in a collapsible layout on larger screens.
  - Integration: Receives nav items (`NavItem[]`), the active tab (`TabKey`), expansion state, and handlers for hover, toggle collapse, and selecting an item. It also receives the resolved `apiBase` string from `App.tsx` (e.g., for display or contextual info).
  - Behavior: Manages hover-expanded vs. pinned-expanded visual states and coordinates active selection.

- `MainOutlet.tsx`
  - Responsibility: Content outlet wrapper where the active page renders.
  - Integration: Receives the nav items, the active key, and the active item metadata. Accepts children (the lazily loaded page components from `src/pages/*`).
  - Behavior: Provides the structural layout and descriptive context around the active workflow.

- `MobileBottomNav.tsx`
  - Responsibility: Bottom navigation for small screens mirroring the sidebar tabs.
  - Integration: Receives nav items and the active tab, plus a selection handler.
  - Behavior: Ensures the app remains navigable and ergonomic on mobile, acting as the mobile variant of the sidebar “agent.”

- `Footer.tsx`
  - Responsibility: Global footer with app-level notes/links and closing structure for each page.
  - Behavior: Presentation-only; provides consistent end-of-page context.

- `index.ts`
  - Responsibility: Barrel file that re-exports the layout components for cleaner imports.

## How these “agent-like” layouts work together

- `Header` and `Sidebar` coordinate the shell state: `App.tsx` passes computed classes (e.g., `offsetClass`) and expansion state, so the content area shifts appropriately.
- `MainOutlet` wraps the currently active workflow (Text/Image/Document/Audio), which is lazily loaded in `App.tsx` with a suspense fallback.
- `MobileBottomNav` mirrors the tab navigation for small screens, ensuring the app remains intuitive across breakpoints.
- `Footer` consistently anchors the app with shared context below the main content.

## Interactions with the rest of the app

- Pages (`src/pages/*`) render inside `MainOutlet`.
- Core feature panels (e.g., `TextPanel`, `FilePanel`) are placed within the content area controlled by these layouts.
- The floating `Chatbot` (from `src/components/elements/Chatbot.tsx`) is independent but visually overlays the scaffold; the layout classes ensure it sits correctly alongside the sidebar/header structure.

## Extending the layouts

- Add new layout components here when you need global shell features (e.g., global banners, context bars) rather than page-local UI.
- Keep state minimal; prefer passing state/handlers from `App.tsx` so layout components remain predictable and reusable.
- Preserve responsiveness: pair desktop sidebar patterns with mobile alternatives (like `MobileBottomNav`) and use Tailwind utility classes for adaptive behavior.
- Maintain consistency: export new components via `index.ts` and document their props and responsibilities.

## Summary

The `src/layouts` folder houses the scaffold that frames every feature flow: it provides navigation (desktop sidebar and mobile bottom nav), header, content outlet, and footer. These components act as composable “agents” responsible for structure and navigation, while feature logic lives in `src/components/elements/*` and `src/pages/*`. This separation keeps the app UI clean, extensible, and consistent across devices.