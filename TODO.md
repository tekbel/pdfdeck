# FileDeck — Future Tasks

## Pre-launch (must do before going live)

- [ ] Swap in-memory rate limit for Supabase row inserts so limits survive deploys and scale across instances. The `usage` Map in `server/routes/tools.js` is the placeholder.
- [ ] Wire waitlist form submissions (`Pricing.jsx` `handleSubmit`) to Supabase or a mailing list (Resend, Mailchimp, etc.) so emails are actually captured.
- [ ] Confirm `CLOUDCONVERT_API_KEY` in Railway is a production key, not a sandbox key. Sandbox keys reject real files.

## Phase 2 — Auth and billing

- [ ] Stripe integration for Pro tier ($8/month). Wire checkout to the pricing page.
- [ ] Supabase auth (email + Google). Gate AI tools behind session check instead of the current client-side `tool.pro` flag.
- [ ] Replace in-memory rate limit with Supabase usage tracking keyed by user ID for logged-in users, IP for guests.
- [ ] Honor the waitlist "first month free" promise — apply a Stripe coupon at checkout for waitlist emails.

## SEO and discoverability

- [ ] Add `robots.txt` and `sitemap.xml` to the client public folder.
- [ ] Add `<meta>` description tags per page (currently missing on tool pages).
- [ ] Add Open Graph tags for link previews when shared on social.

## Reliability

- [ ] Add a React error boundary so a component crash shows a friendly message instead of a blank page.
- [ ] Add CloudConvert webhook support as an alternative to polling, to avoid the 2s × 60 attempts timeout on slow jobs.
- [ ] Handle the case where a CloudConvert job returns partial results (some tasks finish, one errors).

## Nice to have

- [ ] `robots.txt` disallow on `/api/` routes.
- [ ] Toast notifications instead of inline error text for a cleaner UX.
- [ ] File type validation on the client before upload (currently only validated by `accept` attribute, which is bypassable).
- [ ] Dark mode.
