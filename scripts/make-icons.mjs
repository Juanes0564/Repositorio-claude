// Genera los íconos PNG de la app a partir del logo SVG. Uso: npm run icons
// Requiere Chromium de Playwright (solo en desarrollo; la app publicada no lo usa).
import { chromium } from '@playwright/test'
import { writeFile } from 'node:fs/promises'

const logo = (bg, pad) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${120 + 2 * pad} ${120 + 2 * pad}" width="100%" height="100%">
  <rect x="${-pad}" y="${-pad}" width="${120 + 2 * pad}" height="${120 + 2 * pad}" fill="${bg}"/>
  <g transform="rotate(24 60 98)"><rect x="41" y="10" width="38" height="96" rx="19" fill="#F2C14E"/></g>
  <g transform="rotate(-24 60 98)"><rect x="41" y="10" width="38" height="96" rx="19" fill="#2E8A63"/></g>
  <circle cx="60" cy="96" r="10" fill="#1D5C46"/>
</svg>`

const targets = [
  { file: 'public/icon-192.png', size: 192, pad: 14 },
  { file: 'public/icon-512.png', size: 512, pad: 14 },
  { file: 'public/icon-maskable-512.png', size: 512, pad: 40 },
  { file: 'public/apple-touch-icon.png', size: 180, pad: 18 },
]

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
for (const { file, size, pad } of targets) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(`<html><body style="margin:0">${logo('#FBF7EE', pad)}</body></html>`)
  await writeFile(file, await page.screenshot({ type: 'png' }))
  await page.close()
  console.log('ok', file)
}
await browser.close()
