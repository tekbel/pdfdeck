// Tool icons: 20x20 viewBox, white fills/strokes on transparent bg.
// Rendered inside a solid-colored 40px square set by CSS per deck.

function Svg({ children, stroke }) {
  return (
    <svg
      width="20" height="20" viewBox="0 0 20 20"
      fill={stroke ? 'none' : undefined}
      aria-hidden="true" focusable="false"
    >
      {children}
    </svg>
  )
}

// Reusable document silhouette (page with folded corner)
function Doc({ x = 3, y = 1, w = 12, fold = 4, op = 0.92 }) {
  const r = x + w
  const fx = r - fold
  const fy = y + fold
  return (
    <>
      <path d={`M${x} ${y}H${fx}L${r} ${fy}V19H${x}Z`} fill="white" fillOpacity={op} />
      <path d={`M${fx} ${y}L${r} ${fy}H${fx}Z`} fill="white" fillOpacity={0.45} />
    </>
  )
}

const ICONS = {
  // ── PDF Deck ──────────────────────────────────────────────

  'pdf-to-word': () => (
    <Svg>
      <text x="1" y="15.5" fontSize="16" fontWeight="900" fill="white"
        fontFamily="Arial Black, Arial, sans-serif" letterSpacing="-0.5">W</text>
    </Svg>
  ),

  'word-to-pdf': () => (
    <Svg>
      <Doc />
      <path d="M6 9h6M6 12h4" stroke="white" strokeWidth="1.2"
        strokeLinecap="round" strokeOpacity="0.45" fill="none" />
    </Svg>
  ),

  'compress-pdf': () => (
    <Svg stroke>
      {/* Top arrow pointing down */}
      <path d="M10 1v7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 5l3 3 3-3" stroke="white" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom arrow pointing up */}
      <path d="M10 19v-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 15l3-3 3 3" stroke="white" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10h10" stroke="white" strokeWidth="1" strokeOpacity="0.35"
        strokeDasharray="2 1.5" strokeLinecap="round" />
    </Svg>
  ),

  'merge-pdf': () => (
    <Svg>
      {/* Two source docs */}
      <rect x="1" y="1" width="7.5" height="10" rx="1.5" fill="white" fillOpacity="0.6" />
      <rect x="11.5" y="1" width="7.5" height="10" rx="1.5" fill="white" fillOpacity="0.6" />
      {/* Funnel lines converging downward */}
      <path d="M4.75 11v2L10 17l5.25-4v-2" stroke="white" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  ),

  'split-pdf': () => (
    <Svg>
      <rect x="2" y="1" width="16" height="8" rx="1.5" fill="white" fillOpacity="0.92" />
      <rect x="2" y="11" width="16" height="8" rx="1.5" fill="white" fillOpacity="0.92" />
    </Svg>
  ),

  'rotate-pdf': () => (
    <Svg stroke>
      <Doc x={4} y={3} w={10} fold={3} op={0.9} />
      <path d="M15 2.5a8 8 0 11-6-2" stroke="white" strokeWidth="1.7"
        strokeLinecap="round" fill="none" />
      <path d="M9 0.5l3.5 2.5-3.5 2" stroke="white" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  ),

  'delete-pdf-pages': () => (
    <Svg stroke>
      <Doc x={3} y={1} w={10} fold={3} op={0.9} />
      <path d="M5 14h10M7.5 14v4h5v-4" stroke="white" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 11v3M11 11v3" stroke="white" strokeWidth="1.4"
        strokeLinecap="round" strokeOpacity="0.7" />
    </Svg>
  ),

  'pdf-to-jpg': () => (
    <Svg>
      {/* Image frame */}
      <rect x="1.5" y="3" width="17" height="14" rx="2"
        fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5" />
      {/* Sun */}
      <circle cx="6.5" cy="7.5" r="2" fill="white" fillOpacity="0.9" />
      {/* Mountain */}
      <path d="M1.5 14.5l4.5-5 3.5 4 2.5-3.5 5.5 6.5H1.5z"
        fill="white" fillOpacity="0.75" />
    </Svg>
  ),

  'jpg-to-pdf': () => (
    <Svg>
      {/* Source image frame */}
      <rect x="1" y="2" width="9" height="8" rx="1.5" fill="white" fillOpacity="0.65" />
      <circle cx="4" cy="5" r="1.5" fill="white" fillOpacity="0.35" />
      {/* Arrow */}
      <path d="M11 6l2.5 4.5-2.5 4" stroke="white" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Output PDF doc */}
      <Doc x={14} y={8} w={5} fold={2.5} op={0.92} />
    </Svg>
  ),

  'pdf-to-excel': () => (
    <Svg>
      {/* Grid */}
      <rect x="2" y="2" width="16" height="16" rx="2"
        fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.4" />
      <path d="M2 8h16M2 14h16M8 2v16M14 2v16"
        stroke="white" strokeWidth="1.1" strokeOpacity="0.8" fill="none" />
    </Svg>
  ),

  // ── Image Deck ────────────────────────────────────────────

  'image-converter': () => (
    <Svg stroke>
      {/* Two bidirectional arrows */}
      <path d="M3 8h14M14 5l3 3-3 3" stroke="white" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 13H3M6 10l-3 3 3 3" stroke="white" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),

  'compress-image': () => (
    <Svg>
      {/* Dashed outer: original size */}
      <rect x="1" y="1" width="18" height="18" rx="2.5"
        fill="none" stroke="white" strokeWidth="1.3"
        strokeOpacity="0.45" strokeDasharray="2 1.5" />
      {/* Solid inner: compressed result */}
      <rect x="5.5" y="5.5" width="9" height="9" rx="2"
        fill="white" fillOpacity="0.9" />
    </Svg>
  ),

  'resize-image': () => (
    <Svg stroke>
      {/* Diagonal expand line */}
      <path d="M2 18L17 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* Top-right arrowhead */}
      <path d="M17 3h-6M17 3v6" stroke="white" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom-left arrowhead */}
      <path d="M2 18h6M2 18v-6" stroke="white" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),

  'image-to-pdf': () => (
    <Svg>
      {/* Source image (top-left) */}
      <rect x="1" y="2" width="11" height="9" rx="1.5"
        fill="white" fillOpacity="0.6" />
      <circle cx="5" cy="5.5" r="1.8" fill="white" fillOpacity="0.35" />
      <path d="M1 9l4-3.5 3 3.5" stroke="white" strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" fill="none" />
      {/* Output PDF (overlapping bottom-right) */}
      <Doc x={9} y={10} w={10} fold={3} op={0.93} />
    </Svg>
  ),

  // ── AI Deck ───────────────────────────────────────────────

  'summarize-pdf': () => (
    <Svg stroke>
      {/* Lines of varying length = summary/document */}
      <path d="M3 5h14M3 9h11M3 13h13M3 17h8"
        stroke="white" strokeWidth="1.9" strokeLinecap="round" />
    </Svg>
  ),

  'chat-with-pdf': () => (
    <Svg>
      {/* Chat bubble outline */}
      <path d="M2 3h16v11H9.5L6 18.5V14H2V3z"
        fill="white" fillOpacity="0.18" stroke="white"
        strokeWidth="1.5" strokeLinejoin="round" />
      {/* Three dots inside */}
      <circle cx="7" cy="8.5" r="1.4" fill="white" />
      <circle cx="10" cy="8.5" r="1.4" fill="white" />
      <circle cx="13" cy="8.5" r="1.4" fill="white" />
    </Svg>
  ),

  'extract-data': () => (
    <Svg>
      {/* Table grid */}
      <rect x="2" y="2" width="16" height="16" rx="2"
        fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.3" />
      <path d="M2 7.5h16M2 12.5h16M8 2v16"
        stroke="white" strokeWidth="1.1" strokeOpacity="0.7" fill="none" />
      {/* Highlighted row */}
      <rect x="8" y="12.6" width="10" height="4.9"
        fill="white" fillOpacity="0.55" />
    </Svg>
  ),

  'ocr-pdf': () => (
    <Svg stroke>
      {/* Magnifying glass */}
      <circle cx="8.5" cy="8.5" r="5.5" stroke="white" strokeWidth="1.8" />
      <path d="M13 13l5.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* Text lines inside lens */}
      <path d="M6 8h5M6 10.5h3.5" stroke="white" strokeWidth="1.3"
        strokeLinecap="round" strokeOpacity="0.7" />
    </Svg>
  ),
}

export function ToolIcon({ slug }) {
  const Icon = ICONS[slug]
  return Icon ? <Icon /> : null
}
