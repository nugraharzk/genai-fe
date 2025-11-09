# Public — Agents Overview (Static Assets)

This document explains the purpose of the `public` folder and its “agent-like” responsibilities in the GenAI FE project.

Overview
- The `public` folder contains static assets that are copied as-is to the build output and served from the site root.
- Typical contents include favicons, logos, images, manifests, and other files that should not be processed or hashed by Vite.
- In this project, `public` currently includes:
  - `favicon.svg` — the site’s favicon.
  - `vite.svg` — Vite’s default logo, often referenced by the initial HTML template.

Agent-like responsibilities
- Provide stable, unprocessed assets to the application at runtime.
- Ensure key brand and platform files are available at predictable URLs (e.g., `/favicon.svg`, `/manifest.json`).
- Support SEO and PWA metadata (e.g., `robots.txt`, `sitemap.xml`, `manifest.json`) when added.

How Vite treats `public`
- Files in `public` are:
  - Not transformed or hashed.
  - Copied verbatim to the final `dist` output.
  - Served at the root path (e.g., `public/logo.png` → `/logo.png` in the app).

When to use `public` vs `src`
- Use `public` for assets that must be available at a fixed URL and should not be processed by Vite (e.g., favicons, app icons, robots.txt).
- Use `src` for assets that are imported in components and can benefit from bundler features (e.g., tree-shaking, hashing, asset inlining).

Referencing assets
- HTML: reference files via root-relative URLs (e.g., `/favicon.svg`).
- CSS/TSX: you can also reference `/your-file.ext` when you need a non-imported asset with a stable path.
- Note: assets in `public` won’t be fingerprinted, so their URLs remain constant across builds.

Caching and versioning
- Because assets in `public` are not hashed:
  - Browsers may cache aggressively; consider cache-busting via file names (e.g., `favicon.v2.svg`) or query parameters (e.g., `/logo.svg?v=2`) when updating.
  - For highly changeable assets, consider importing them from `src` so Vite can hash them.

Common additions
- Favicons and app icons:
  - `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `android-chrome-512x512.png`, etc.
- PWA and metadata:
  - `manifest.json`, `robots.txt`, `sitemap.xml`, `site.webmanifest`.
- Static documents:
  - `humans.txt`, `security.txt`, legal documents, or public PDFs.

Best practices
- Keep file names stable and meaningful; avoid accidental overrides.
- Organize optional assets in subfolders if adding many files (e.g., `public/images/`, `public/icons/`).
- Use SVG for vector icons where possible; provide PNG fallbacks if necessary.
- Ensure accessibility by providing proper alt text when assets are used in content.
- Validate PWA assets (icon sizes, manifest structure) if you adopt PWA features.

Troubleshooting
- Asset not found (404):
  - Confirm the file exists in `public` and that you’re using a root-relative path (e.g., `/favicon.svg`).
- Browser shows old icon:
  - Clear cache or use a versioned filename; ensure the HTML references the updated file.
- Incorrect MIME type:
  - Use appropriate file extensions (`.svg`, `.png`, `.ico`) and verify server configuration if serving via a custom setup.

Summary
- The `public` folder acts as the project’s static assets agent: it delivers unprocessed, stable files to the app root.
- Use it for favicons, logos, metadata, and any file that needs a fixed URL without bundler processing.
- For dynamic or frequently changing assets, prefer importing via `src` to leverage Vite’s asset pipeline.