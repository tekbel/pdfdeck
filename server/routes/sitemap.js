import { Router } from 'express'
import { ALL_TOOLS } from '../../client/src/lib/tools.js'

const router = Router()

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/pricing', priority: '0.8', changefreq: 'monthly' },
]

router.get('/sitemap.xml', (_req, res) => {
  const base = 'https://pdfdeck.app'
  const today = new Date().toISOString().slice(0, 10)

  const urls = [
    ...STATIC_PAGES.map(p => ({ loc: `${base}${p.path}`, priority: p.priority, changefreq: p.changefreq })),
    ...ALL_TOOLS.map(t => ({ loc: `${base}/${t.slug}`, priority: t.pro ? '0.7' : '0.9', changefreq: 'monthly' })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.send(xml)
})

export { router as sitemapRouter }
