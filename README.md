# FileDeck

Every file tool in one deck. PDF, image, and AI document tools.

## Stack
- Client: Vite + React (dark premium UI, card-deck design system)
- Server: Express (thin middleware over CloudConvert + Anthropic APIs)
- Deploy: Railway (single service serves API + built client)
- Phase 2: Supabase (auth, usage tracking, file history), Stripe, AdSense

## Local development
```bash
cp .env.example .env   # add your API keys
cd client && npm install && cd ../server && npm install && cd ..
npm --prefix server run dev     # API on :3001
npm --prefix client run dev     # UI on :5173 (proxies /api to :3001)
```

## Deploy to Railway
1. Push this repo to GitHub
2. Railway → New Project → Deploy from GitHub repo
3. Set environment variables (CLOUDCONVERT_API_KEY, ANTHROPIC_API_KEY)
4. Build command: `npm run build` — Start command: `npm start`
5. Add custom domain: filedeck.com

## Wired tools (Phase 1)
- CloudConvert: pdf-to-word, word-to-pdf, pdf-to-jpg, jpg-to-pdf, pdf-to-excel, image-converter, image-to-pdf
- Claude: summarize-pdf
- Coming next: compress-pdf, merge-pdf, split-pdf, chat-with-pdf, extract-data, ocr-pdf

## Architecture notes
- Rate limiting is in-memory per-IP (10 free jobs/day) — swap to Supabase for production
- Files are processed in memory, never written to disk on our server
- CloudConvert handles conversion; download URLs come from their export, expiring automatically
