# FileDeck (PDF Deck)

Every file tool in one deck. Free conversion and AI analysis for PDFs, images, and documents.

**Live:** [filedeck.com](https://filedeck.com)

## What It Does

FileDeck bundles file operations (PDF to Word, image compression, PDF summarization) into a single web app. All tools are free, no account required, no file storage.

**Phase 1 (live):**
- Conversion: pdf-to-word, word-to-pdf, pdf-to-jpg, jpg-to-pdf, pdf-to-excel, image-converter, image-to-pdf
- AI: summarize-pdf (Claude)

**Phase 2 (planned):**
- More conversions: compress-pdf, merge-pdf, split-pdf
- More AI: chat-with-pdf, extract-data, ocr-pdf
- Auth (Supabase), usage tracking, file history, Stripe monetization

## Stack

- **Client:** Vite + React, dark premium UI, card-deck design system, zero state management libraries
- **Server:** Express (ESM), thin middleware over CloudConvert + Anthropic APIs
- **Hosting:** Railway (single service, static client + Node API)
- **APIs:** CloudConvert (conversions), Anthropic Claude (AI), later Supabase (auth)

## Quick Start

### Local Development

```bash
# First time
cp .env.example .env    # fill in API keys
npm run install:all     # install client and server deps

# Run both concurrently
npm run dev             # client on :5173, server on :3001

# Or run individually
npm --prefix server run dev     # server only
npm --prefix client run dev     # client only
```

### Environment Variables

```
CLOUDCONVERT_API_KEY=     # Required for all conversion tools
ANTHROPIC_API_KEY=        # Required for AI tools
PORT=3001                 # Optional, defaults to 3001
```

## Architecture

### Monorepo Structure

```
filedeck/
├── client/              Vite + React (npm run dev on :5173)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/       ToolPage (single-tool view), Pricing, Home
│   │   ├── lib/
│   │   │   └── tools.js Tool catalog + DECKS structure
│   │   └── index.css
│   └── vite.config.js
│
├── server/              Express + ESM (npm run dev on :3001)
│   ├── routes/
│   │   └── tools.js     POST /api/tools/:slug routing + handlers
│   ├── index.js         Express entry point
│   └── package.json
│
└── README.md, CLAUDE.md, BRAND.md
```

### Request Flow

1. User uploads file to `/api/tools/:slug` via multipart POST
2. Server receives via multer (memory storage, never disk)
3. Dispatch:
   - CloudConvert tools → call API, poll job status (2s interval, 60 attempts max), return download URL
   - Claude tools → send file as base64 document block, return text response
4. Client downloads result or displays response

### Key Design Decisions

**No persistent storage:** Files are processed in memory and deleted after response. Results are returned immediately, not stored. This keeps costs low and privacy tight.

**Thin middleware:** The server doesn't do the heavy lifting. CloudConvert handles all file conversions, Claude handles all AI analysis. We're a router and orchestrator.

**In-memory rate limiting:** Currently 10 free jobs/day per IP, reset on server restart. For production scaling, this moves to Supabase (Phase 2).

**Tool slug doubles as route and UI path:** Each tool has one slug that determines both the API route (`/api/tools/:slug`) and the URL (`/:slug`). Tool catalog lives in `client/src/lib/tools.js`.

**No frameworks beyond useState/useRef:** The client is vanilla React with hooks. No Redux, Zustand, or context for state. Each page (ToolPage, Pricing, Home) is self-contained.

**AI model pinned:** Claude calls use `claude-sonnet-4-6` hardcoded. If upgraded, change in `server/routes/tools.js` in the summarize-pdf handler.

## Wired Tools

### CloudConvert Tools (Format Conversion)

These map to CloudConvert's `/convert` API. The slug becomes the CloudConvert format code (e.g., `pdf-to-word` becomes `{'input_format': 'pdf', 'output_format': 'docx'}`).

- `pdf-to-word` → PDF to DOCX
- `word-to-pdf` → DOCX to PDF
- `pdf-to-jpg` → PDF pages to JPG images (first page)
- `jpg-to-pdf` → JPG to PDF
- `pdf-to-excel` → PDF to XLSX
- `image-converter` → JPG/PNG to alternative format
- `image-to-pdf` → Image to PDF

### Claude Tools (AI Analysis)

- `summarize-pdf` → Extract and summarize PDF content (Claude vision + document block)

### Coming Soon (Phase 2)

- `compress-pdf`, `merge-pdf`, `split-pdf` (CloudConvert or PyPDF)
- `chat-with-pdf` (Claude conversation API)
- `extract-data`, `ocr-pdf` (Claude vision with layout analysis)

## Adding a New Tool

1. Add entry to `DECKS` in `client/src/lib/tools.js`:
   ```javascript
   {
     slug: "compress-pdf",
     name: "Compress PDF",
     icon: "compress",
     deck: "PDF Tools",
     description: "Reduce file size",
   }
   ```

2. Wire the handler in `server/routes/tools.js`:
   ```javascript
   case "compress-pdf":
     // Call CloudConvert or custom handler
     return cloudConvertJob(file, { ... });
   ```

3. The UI route and API endpoint are auto-generated from the slug.

## Deployment

### To Railway

1. Create repo on GitHub (`tekbel/filedeck`)
2. Railway → New Project → Deploy from GitHub
3. Set environment variables:
   - `CLOUDCONVERT_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `PORT=3001` (if custom)
4. Build command: `npm run build`
5. Start command: `npm start`
6. Add custom domain: filedeck.com

### Build & Start (mirrors Railway)

```bash
npm run build     # Vite build client/, npm install server/
npm start         # node server/index.js
```

Vite outputs to `client/dist/`, and the Express server serves it as static at `/`.

## Pricing & Monetization (Phase 2)

Current: Free, unlimited.

Planned (Phase 2):
- Free tier: 10 jobs/day per IP (current implementation)
- Paid tier (Stripe): Unlimited with persistent file history
- AdSense on home page

## Troubleshooting

### "CloudConvert API error"
- Verify `CLOUDCONVERT_API_KEY` in `.env`
- Check CloudConvert API quota and billing status
- Job polling timeout after 120 seconds; if it fails, the job likely timed out on their end

### "Claude API error"
- Verify `ANTHROPIC_API_KEY` in `.env`
- Check Anthropic account balance and rate limits

### Rate limit (10 jobs/day)
- This is in-memory and resets on server restart
- For production, implement Supabase-backed tracking (Phase 2)

### Port 3001 already in use
```bash
lsof -i :3001    # find process
kill -9 <PID>    # kill it
```

## Development Notes

- No test suite yet. Manual testing via UI.
- Node version: 18+ (ES modules)
- React version: 18+
- Vite config proxies `/api/*` to `http://localhost:3001` during dev

## Brand

See `BRAND.md` for logo, tagline, and voice guidelines. Key point: "Free is a feature" — emphasize no hidden paywalls or upsells on landing.

## License

Proprietary. Built by Addis Stack.

## Support

Issues or questions? Check CLAUDE.md for developer guidance or BRAND.md for brand/messaging questions.
