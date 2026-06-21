# PDF Deck — Future Tasks

## Pre-launch (must do before going live)

- [x] Fix `trust proxy` so rate limiting works correctly behind Railway's load balancer.
- [x] Add helmet.js security headers (X-Frame-Options, X-Content-Type-Options, HSTS, etc.).
- [x] Wire waitlist form to Formspree so emails are actually captured.
- [x] Add `robots.txt` to disallow `/api/` from crawlers.
- [x] Add meta description tags (base in index.html, per-tool on ToolPage).
- [x] Add React error boundary so a component crash shows a friendly message.
- [ ] Confirm `CLOUDCONVERT_API_KEY` in Railway is a production key, not a sandbox key. Sandbox keys reject real files.

## Phase 2 — Auth and billing

- [ ] Stripe integration for Pro tier ($6/month). Wire checkout to the pricing page. Replace waitlist form with a real "Upgrade" button once billing is ready.
- [ ] Email waitlist subscribers when Pro launches with a direct checkout link.
- [ ] Supabase auth (email + Google). Gate AI tools behind session check instead of the current browser cookie. Cookie-based Pro access is the current MVP — it breaks if the user clears cookies, switches devices, or cancels their subscription (cookie stays valid for 30 days after cancel).
- [ ] Replace in-memory rate limit with Supabase usage tracking keyed by user ID for logged-in users, IP for guests.
- [ ] Swap Formspree waitlist for a proper mailing list (Resend, Mailchimp) as volume grows.

## SEO and discoverability

- [ ] Add Open Graph image for link previews when shared on social.
- [ ] Add `sitemap.xml`.

## Reliability

- [ ] Add CloudConvert webhook support as an alternative to polling, to avoid the 2s × 60 attempts timeout on slow jobs.
- [ ] Handle the case where a CloudConvert job returns partial results (some tasks finish, one errors).

## Mobile

- [ ] Build companion mobile app (Flutter, iOS + Android) that mirrors the web tool catalog.

## Nice to have

- [ ] Toast notifications instead of inline error text for a cleaner UX.
- [ ] File type validation on the client before upload (currently only validated by `accept` attribute, which is bypassable).
- [ ] Dark mode.
