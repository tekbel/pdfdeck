import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#F8F8F6"/>

  <!-- Decorative blobs -->
  <circle cx="1050" cy="80" r="260" fill="#E55100" opacity="0.07"/>
  <circle cx="120" cy="580" r="200" fill="#0D7377" opacity="0.06"/>

  <!-- Brand accent bar -->
  <rect width="7" height="630" fill="#E55100"/>

  <!-- Logo mark -->
  <rect x="830" y="170" width="210" height="260" rx="18" fill="#FFD0BE"/>
  <rect x="795" y="205" width="210" height="260" rx="18" fill="#FFB49A"/>
  <rect x="760" y="240" width="210" height="260" rx="18" fill="#E55100"/>
  <path d="M800 355 L930 355 M800 393 L880 393" stroke="white" stroke-width="14" stroke-linecap="round"/>

  <!-- Headline -->
  <text x="80" y="220" fill="#111110" font-size="76" font-weight="800" font-family="system-ui, -apple-system, sans-serif" letter-spacing="-3">Every PDF and</text>
  <text x="80" y="316" fill="#111110" font-size="76" font-weight="800" font-family="system-ui, -apple-system, sans-serif" letter-spacing="-3">file tool,</text>
  <text x="80" y="412" fill="#E55100" font-size="76" font-weight="800" font-family="system-ui, -apple-system, sans-serif" letter-spacing="-3">one place.</text>

  <!-- Tagline -->
  <text x="80" y="490" fill="#888" font-size="26" font-family="system-ui, -apple-system, sans-serif">Convert, compress, merge and summarize. Free to start.</text>

  <!-- URL chip -->
  <rect x="80" y="536" width="194" height="42" rx="21" fill="#111110"/>
  <text x="177" y="563" text-anchor="middle" fill="white" font-size="20" font-weight="600" font-family="system-ui, -apple-system, sans-serif">pdfdeck.app</text>
</svg>`

const outDir = join(__dirname, '../client/public')
const outPath = join(outDir, 'og-image.png')

await sharp(Buffer.from(svg))
  .png()
  .toFile(outPath)

console.log('Generated og-image.png')
