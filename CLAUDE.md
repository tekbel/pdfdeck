# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# First-time setup
cp .env.example .env   # fill in API keys
npm run install:all    # installs both client and server deps

# Development (runs both concurrently)
npm run dev            # client on :5173, server on :3001

# Or run individually
npm --prefix server run dev   # server only (node --watch)
npm --prefix client run dev   # client only (vite)

# Production build + start (mirrors Railway)
npm run build          # vite build in client/, npm install in server/
npm start              # node server/index.js
```

No test suite yet.

## Architecture

Monorepo with two packages and a single Railway service:

```
filedeck/
  client/   Vite + React (no state management beyond useState/useRef)
  server/   Express, ESM, single entry point
```

**Request flow:** Browser uploads file(s) via multipart POST to `/api/tools/:slug`. Server dispatches to CloudConvert or Claude depending on the slug. CloudConvert jobs are polled synchronously (2s interval, 60 attempts max). Files are never written to disk — everything goes through multer's memory storage.

**Rate limiting** is in-memory per-IP (10 jobs/day), keyed by `ip:YYYY-MM-DD`. This resets on server restart and is not shared across Railway instances. It's a placeholder for Supabase-backed tracking in Phase 2.

**Tool catalog** lives in `client/src/lib/tools.js`. Each tool entry has a `slug` that doubles as the API route (`/api/tools/:slug`) and the client URL (`/:slug`). Adding a new tool means: add it to `DECKS` in `tools.js`, wire the slug in `server/routes/tools.js` (either add to `CC_FORMAT` map or write a new handler).

**AI tools** use the Anthropic Messages API directly (no SDK). The `summarize-pdf` handler sends the PDF as a base64 `document` block. Model is pinned to `claude-sonnet-4-6`.

**Unimplemented tools** return `501` with a "coming soon" message rather than a fake success. The client displays the error inline.

## Environment variables

| Key | Purpose |
|-----|---------|
| `CLOUDCONVERT_API_KEY` | All conversion tools |
| `ANTHROPIC_API_KEY` | AI deck (summarize-pdf, future tools) |
| `PORT` | Server port (default 3001) |
| `SUPABASE_*` | Phase 2 only, not used yet |

## Phase 2 notes

Supabase (auth, usage tracking, file history) and Stripe are planned but not started. When adding them, replace the in-memory `usage` Map in `server/routes/tools.js` with Supabase row inserts.
