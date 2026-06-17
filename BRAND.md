# FileDeck Brand System

Reference for reusing the FileDeck visual identity across apps and web projects.

---

## Identity

**Product name:** PDF Deck (public-facing), FileDeck (codebase/domain)
**Tagline:** Every file tool, one place.
**Voice:** Direct, confident, tool-focused. No filler. Free is a feature, say it clearly.

---

## Logo

SVG — three stacked document rectangles in warm orange tones, conveying layers/depth.

```jsx
export default function Logo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="8" y="3" width="18" height="22" rx="3" fill="#FFD0BE" />
      <rect x="5" y="6" width="18" height="22" rx="3" fill="#FFB49A" />
      <rect x="2" y="9" width="18" height="22" rx="3" fill="#E55100" />
      <path d="M6 17h10M6 21h7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
```

Logo colors: `#E55100` (base), `#FFB49A` (mid), `#FFD0BE` (light). Always on white or light backgrounds.

---

## Typography

**Font:** Nunito Variable
**Install:** `npm install @fontsource-variable/nunito`
**Import:** `import '@fontsource-variable/nunito'`
**Fallback stack:** `'Nunito Variable', 'Nunito', system-ui, -apple-system, sans-serif`

### Scale

| Role | Size | Weight | Tracking |
|------|------|--------|----------|
| Display / hero | `clamp(40px, 6vw, 68px)` | 800 | `-0.04em` |
| Section heading | `clamp(24px, 3.5vw, 38px)` | 800 | `-0.03em` |
| Card heading | `14px` | 700 | — |
| Nav label | `13.5px` | 600 | `-0.01em` |
| Body | `15px` | 400 | — |
| Caption / label | `12–13px` | 500–700 | — |
| Eyebrow | `11.5px` | 700 | `0.1em` uppercase |

Line height: `1.6` body, `1.08–1.1` display headings.
Anti-aliasing: `-webkit-font-smoothing: antialiased`.

---

## Color Palette

### Base surfaces

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#F8F8F6` | Page background (warm off-white) |
| `--surface` | `#FFFFFF` | Cards, inputs, dropdowns |
| `--surface-2` | `#F3F3F0` | Hover states, secondary surfaces |
| `--border` | `#E5E5E0` | Default borders |
| `--border-hover` | `#C0C0BA` | Focused / hovered borders |

### Ink (text)

| Token | Hex | Use |
|-------|-----|-----|
| `--ink` | `#111110` | Primary text, headings |
| `--ink-dim` | `#6B6B67` | Secondary text, descriptions |
| `--ink-faint` | `#A1A19C` | Placeholders, metadata, labels |

### Brand (orange)

| Token | Hex | Use |
|-------|-----|-----|
| `--brand` | `#E55100` | CTAs, links, accents, logo base |
| `--brand-hover` | `#C94800` | Button hover state |
| `--brand-bg` | `#FFF3EE` | Tinted backgrounds behind brand elements |

### Deck colors

Each tool category has its own color pair (foreground + tinted background).

| Deck | Foreground | Background | Use |
|------|-----------|------------|-----|
| PDF | `#C0392B` | `#FDF3F2` | PDF tool icons, chips, borders |
| Image | `#1A5FBF` | `#EEF4FF` | Image tool icons, chips, borders |
| AI | `#0D7377` | `#E6F4F5` | AI tool icons, chips, borders |

### Status

| Token | Hex | Use |
|-------|-----|-----|
| `--green` | `#059669` | Success, download complete |
| `--red` | `#DC2626` | Error, destructive actions |

---

## Spacing and Shape

| Token | Value | Use |
|-------|-------|-----|
| `--radius` | `10px` | Cards, inputs, small elements |
| `--radius-lg` | `14px` | Larger cards, dropdowns |
| Nav height | `56px` | Sticky top nav |
| Container max-width | `1160px` | Page content |
| Container padding | `24px` horizontal | |

---

## Shadows

```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 14px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
```

Prefer `shadow-sm` for resting cards, `shadow-md` on hover/lift. No heavy shadows — the border does the work at rest.

---

## Component Patterns

### Primary button

```css
background: var(--brand);
color: #fff;
padding: 12px 28px;
border-radius: 10px;
font-size: 14.5px;
font-weight: 600;
box-shadow: 0 1px 3px rgba(229,81,0,0.22);
transition: background 0.15s, transform 0.15s, box-shadow 0.15s;

/* Hover */
background: var(--brand-hover);
transform: translateY(-1px);
box-shadow: 0 4px 14px rgba(229,81,0,0.28);
```

### Outline button

```css
background: none;
border: 1.5px solid var(--border);
color: var(--ink);
padding: 11px 28px;
border-radius: 10px;
font-size: 14.5px;
font-weight: 600;

/* Hover */
border-color: var(--border-hover);
background: var(--surface-2);
```

### Card

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: var(--radius);
box-shadow: var(--shadow-sm);
transition: box-shadow 0.18s, border-color 0.18s, transform 0.18s;

/* Hover */
box-shadow: var(--shadow-md);
transform: translateY(-2px);
border-color: <deck-color>;
```

### Pill / chip label

```css
display: inline-flex;
align-items: center;
gap: 7px;
padding: 5px 12px 5px 8px;
border-radius: 20px;
font-size: 13px;
font-weight: 700;
/* background: deck-bg color, color: deck-fg color */
```

### Eyebrow label (section intro)

```css
font-size: 11.5px;
font-weight: 700;
letter-spacing: 0.1em;
text-transform: uppercase;
color: var(--brand);
margin-bottom: 10px;
```

### Dark CTA banner

```css
background: var(--ink);   /* #111110 */
border-radius: 20px;
padding: 52px 56px;
/* Accent orb: radial-gradient brand color at low opacity, top-right */
```

---

## Animation

**Libraries:** GSAP 3 + ScrollTrigger, Lenis (smooth scroll)

### Standard scroll reveal

```js
gsap.from(el, {
  y: 24,
  opacity: 0,
  duration: 0.65,
  ease: 'power3.out',
  scrollTrigger: { trigger: el, start: 'top 86%' },
})
```

### Staggered grid

```js
gsap.from(cards, {
  y: 24,
  opacity: 0,
  duration: 0.5,
  stagger: 0.06,
  ease: 'power2.out',
  scrollTrigger: { trigger: grid, start: 'top 86%' },
})
```

### Hero above-fold

```js
gsap.from('.hero-h1', { y: 28, opacity: 0, duration: 0.85, ease: 'power3.out', delay: 0.05 })
gsap.from('.hero-sub', { y: 18, opacity: 0, duration: 0.75, ease: 'power3.out', delay: 0.28 })
```

### Lenis setup (global, once per app)

```js
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add(time => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

Always wrap GSAP animations in `gsap.context()` and call `.revert()` on React unmount.

---

## CSS Variables (copy-paste block)

```css
:root {
  --bg: #F8F8F6;
  --surface: #FFFFFF;
  --surface-2: #F3F3F0;
  --border: #E5E5E0;
  --border-hover: #C0C0BA;

  --ink: #111110;
  --ink-dim: #6B6B67;
  --ink-faint: #A1A19C;

  --brand: #E55100;
  --brand-hover: #C94800;
  --brand-bg: #FFF3EE;

  --pdf: #C0392B;
  --pdf-bg: #FDF3F2;
  --image: #1A5FBF;
  --image-bg: #EEF4FF;
  --ai: #0D7377;
  --ai-bg: #E6F4F5;

  --green: #059669;
  --red: #DC2626;

  --font: 'Nunito Variable', 'Nunito', system-ui, -apple-system, sans-serif;

  --radius: 10px;
  --radius-lg: 14px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 14px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
}
```
