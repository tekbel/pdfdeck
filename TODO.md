# PDF Deck — Future Tasks

## Pre-launch (must do before going live)

- [x] Fix `trust proxy` so rate limiting works correctly behind Railway's load balancer.
- [x] Add helmet.js security headers (X-Frame-Options, X-Content-Type-Options, HSTS, etc.).
- [x] Wire waitlist form to Formspree so emails are actually captured.
- [x] Add `robots.txt` to disallow `/api/` from crawlers.
- [x] Add meta description tags (base in index.html, per-tool on ToolPage).
- [x] Add React error boundary so a component crash shows a friendly message.
- [x] Confirm `CLOUDCONVERT_API_KEY` in Railway is a production key, not a sandbox key. Sandbox keys reject real files.

## Phase 2 — Auth and billing

- [x] Stripe integration for Pro tier ($6/month). Wire checkout to the pricing page. Replace waitlist form with a real "Upgrade" button once billing is ready.
- [x] Email waitlist subscribers when Pro launches with a direct checkout link.
- [x] Supabase auth (email + password). Gate AI tools behind session check instead of the current browser cookie. Cookie fallback kept for existing Pro users during transition.
- [x] Replace in-memory rate limit with Supabase usage tracking keyed by user ID for logged-in users, IP for guests.
- [ ] Add a weekly cleanup job to delete `pdf_usage` rows older than 7 days (e.g. Supabase scheduled function or Railway cron).
- [ ] Swap Formspree waitlist for a proper mailing list (Resend, Mailchimp) as volume grows.

## SEO and discoverability

- [x] Add Open Graph image for link previews when shared on social.
- [x] Add `sitemap.xml`.

## Reliability

- [ ] Add CloudConvert webhook support as an alternative to polling, to avoid the 2s × 60 attempts timeout on slow jobs.
- [ ] Handle the case where a CloudConvert job returns partial results (some tasks finish, one errors).

## Mobile

- [ ] Build companion mobile app (Flutter, iOS + Android) that mirrors the web tool catalog.

## Cost controls

- [x] Add page count limit on AI tools (max 20 pages per document) to cap Claude API cost per request.
- [ ] Add a monthly AI usage cap per Pro user (e.g. 100 AI jobs/month) to prevent abuse. Track in Supabase once auth is in place.
- [ ] Consider tiered Pro pricing in future (e.g. $6 basic, $12 unlimited AI) once usage data shows who the heavy users are.

## New tools — PDF editing & organization

Inspired by real Acrobat workflows (editing, signing, annotating, organizing). Build our own versions with a better UX angle.

- [ ] Rotate PDF — rotate individual pages or all pages, with a visual page preview.
- [ ] Delete PDF pages — remove unwanted pages with a thumbnail picker.
- [ ] Reorder PDF pages — drag-and-drop page thumbnails to reorder, then export. Missing from current catalog and frequently needed for document assembly.
- [ ] Number pages — add customizable page numbers (position, font, starting number).
- [ ] Crop PDF — trim page margins or extract a region.
- [ ] Redact PDF — black out sensitive text or regions permanently.
- [ ] Watermark PDF — add text or image watermarks with opacity and position control.
- [ ] Protect PDF — add a password to lock a PDF.
- [ ] Unlock PDF — remove password from a PDF the user owns.
- [ ] PDF Form Filler — fill out PDF form fields in the browser, download filled PDF.
- [ ] E-signature — draw, type, or upload a signature and place it on a PDF. Pro feature. DocuSign charges $15-25/month for this alone; including it in Pro at $6 is a strong differentiator.
- [ ] PDF Annotator — add highlights, sticky notes, and comments in the browser. Export with annotations baked in. Useful for document review workflows.
- [ ] Edit PDF text — update text inline without converting to Word. Technically the hardest tool (requires font handling and layout engine). Long-term goal; consider pdf-lib or a WASM-based approach.
- [ ] Compare PDFs — show a diff between two versions of a document. Useful for contracts and legal review.

## New tools — more conversions

- [ ] PDF to PowerPoint (PDF to PPT/PPTX).
- [ ] PowerPoint to PDF (PPT/PPTX to PDF).
- [ ] Word to PDF (DOCX to PDF) — one of the most searched conversions. CloudConvert supports it.
- [ ] Excel to PDF.
- [ ] HTML to PDF — paste a URL or HTML, get a PDF.
- [ ] TXT to PDF — plain text to formatted PDF.

## New AI tools

- [ ] Translate PDF — AI-powered translation of PDF content into another language.
- [ ] AI Question Generator — generate quiz questions or study guides from a PDF.

## Homepage improvements

- [ ] Add a "Why PDFDeck" trust section — privacy stats, no-account pitch, speed proof. Do it better than the generic competitor version (concrete numbers, not vague claims).
- [ ] Add a brief pricing teaser on the homepage — one line with a "See plans" link, not a full pricing table.
- [ ] Add app store download buttons to footer once mobile app is live.

## Mobile

- [ ] Build companion mobile app (Flutter, iOS + Android) that mirrors the web tool catalog.

## Nice to have

- [x] Toast notifications instead of inline error text for a cleaner UX.
- [x] File type validation on the client before upload (currently only validated by `accept` attribute, which is bypassable).
- [ ] Dark mode.
