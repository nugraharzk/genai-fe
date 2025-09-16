# GenAI FE

A lightweight React + Vite + Tailwind web app to interact with the NestJS GenAI backend. Supports prompting text and uploading image, document, or audio with optional model and system instruction.

## Setup

- Copy env example and adjust if needed:

```
cp .env.example .env
# edit VITE_API_BASE_URL if your backend runs elsewhere
```

- Install deps and run dev server:

```
pnpm install
pnpm dev
# or: npm i && npm run dev
```

- Open: http://localhost:5173

## Build

```
pnpm build
pnpm preview
```

## Notes

- Expects the backend available with CORS at `VITE_API_BASE_URL` (default `http://localhost:5000`).
- Endpoints used:
  - POST `/generate-text` (JSON body)
  - POST `/generate-from-image` (FormData: `image`)
  - POST `/generate-from-document` (FormData: `document`)
  - POST `/generate-from-audio` (FormData: `audio`)

