// Toma capturas de las pantallas principales para revisarlas.
// Uso: npm run build && npm run preview  (en otra terminal)  y luego: npm run screenshots [carpeta]
// Revisa también que no haya desbordes horizontales ni pedidos a internet.
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const OUT = process.argv[2] || 'screenshots'
const BASE = process.env.BASE_URL || 'http://localhost:4173/'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
const external = new Set()
const problems = []

const done = (extra = {}) => ({ version: 1, onboardingDone: true, profile: { name: 'Marta' }, ...extra })
const simple = { simpleMode: true, fontSize: 'large', largeIcons: true, fewerOptions: true, simpleLanguage: true, highContrast: true }
const xlarge = { ...simple, fontSize: 'xlarge' }
const guidedDone = { progress: { transfers: { simulatorGuidedDone: true, simulatorFreeDone: false, workshopDone: false } } }

/** Acciones de ejemplo dentro del simulador. */
const sim = {
  tap: (name) => async (page) => page.getByRole('region', { name: 'Pantalla de práctica' }).getByRole('button', { name }).first().click(),
  next: async (page) => page.getByRole('button', { name: /Siguiente|Terminar/ }).click(),
  type: (digits) => async (page) => {
    for (const d of digits) await sim.tap(d)(page)
  },
}

async function shoot(name, { w = 390, h = 844, scale = 1, data, path = '#/', frame = false, actions = [] }) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  page.on('request', (r) => { if (!r.url().startsWith(BASE)) external.add(r.url()) })
  page.on('console', (m) => { if (m.type() === 'error') problems.push(`${name}: consola: ${m.text()}`) })
  page.on('pageerror', (e) => problems.push(`${name}: ${e.message}`))
  await page.goto(BASE + 'manifest.webmanifest')
  if (data) await page.evaluate((d) => localStorage.setItem('vinculo.v1', JSON.stringify(d)), data)
  await page.goto(BASE + (frame ? '' : '?frame=0') + path)
  await page.waitForTimeout(300)
  for (const action of actions) await action(page)
  await page.waitForTimeout(200)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  const overflow = await page.evaluate(() => {
    const m = document.querySelector('.content')
    if (!m || m.scrollWidth <= m.clientWidth + 1) return []
    return [...m.querySelectorAll('*')]
      .filter((e) => e.getBoundingClientRect().right > m.getBoundingClientRect().right + 1)
      .map((e) => `${e.tagName}.${e.className}`)
      .slice(0, 5)
  })
  if (overflow.length) problems.push(`${name}: desborde horizontal: ${overflow.join(', ')}`)
  await ctx.close()
}

const transfer = '#/practicar/bank/transfer-bank'
const shots = {
  'welcome-360': { w: 360, h: 640 },
  'home-390': { data: done() },
  'profile-390': { data: done(), path: '#/perfil' },
  'home-framed': { w: 1280, h: 920, data: done(), frame: true },
  'home-simple-390': { data: done({ settings: simple }) },
  'home-xlarge-360': { w: 360, h: 640, data: done({ settings: xlarge }) },
  'home-zoom200': { w: 180, h: 320, scale: 4, data: done() },
  'picker-390': { data: done(), path: '#/practicar' },
  'picker-banks-360': { w: 360, h: 640, data: done(), path: '#/practicar?categoria=bancos' },
  'platform-bank-390': { data: done(), path: '#/practicar/bank' },
  'platform-bank-unlocked-390': { data: done(guidedDone), path: '#/practicar/bank' },
  'sim-step1-390': { data: done(), path: transfer },
  'sim-step1-360': { w: 360, h: 640, data: done(), path: transfer },
  'sim-step1-wrong2-390': { data: done(), path: transfer, actions: [sim.tap(/Chat Ejemplo/), sim.tap(/Ajustes/)] },
  'sim-step1-ok-390': { data: done(), path: transfer, actions: [sim.tap(/Banco Ejemplo/)] },
  'sim-login-typing-390': { data: done(), path: transfer, actions: [sim.tap(/Banco Ejemplo/), sim.next, sim.type('12')] },
  'sim-home-bank-390': { data: done(), path: transfer, actions: [sim.tap(/Banco Ejemplo/), sim.next, sim.type('1234'), sim.tap('Entrar'), sim.next] },
  'sim-amount-wrong-390': {
    data: done(), path: transfer,
    actions: [sim.tap(/Banco Ejemplo/), sim.next, sim.type('1234'), sim.tap('Entrar'), sim.next, sim.tap(/Transferir/), sim.next, sim.tap(/Rosa/), sim.next, sim.type('5001'), sim.tap('Continuar'), sim.tap('Continuar')],
  },
  'sim-review-390': {
    data: done(), path: transfer,
    actions: [sim.tap(/Banco Ejemplo/), sim.next, sim.type('1234'), sim.tap('Entrar'), sim.next, sim.tap(/Transferir/), sim.next, sim.tap(/Rosa/), sim.next, sim.type('50000'), sim.tap('Continuar'), sim.next],
  },
  'sim-code-390': {
    data: done(), path: transfer,
    actions: [sim.tap(/Banco Ejemplo/), sim.next, sim.type('1234'), sim.tap('Entrar'), sim.next, sim.tap(/Transferir/), sim.next, sim.tap(/Rosa/), sim.next, sim.type('50000'), sim.tap('Continuar'), sim.next, sim.tap('Confirmar'), sim.next],
  },
  'sim-receipt-390': {
    data: done(), path: transfer,
    actions: [sim.tap(/Banco Ejemplo/), sim.next, sim.type('1234'), sim.tap('Entrar'), sim.next, sim.tap(/Transferir/), sim.next, sim.tap(/Rosa/), sim.next, sim.type('50000'), sim.tap('Continuar'), sim.next, sim.tap('Confirmar'), sim.next, sim.type('5678'), sim.tap('Enviar dinero'), sim.next],
  },
  'sim-finish-390': {
    data: done(), path: transfer,
    actions: [sim.tap(/Banco Ejemplo/), sim.next, sim.type('1234'), sim.tap('Entrar'), sim.next, sim.tap(/Transferir/), sim.next, sim.tap(/Rosa/), sim.next, sim.type('50000'), sim.tap('Continuar'), sim.next, sim.tap('Confirmar'), sim.next, sim.type('5678'), sim.tap('Enviar dinero'), sim.next, sim.tap('Guardar comprobante'), sim.next],
  },
  'sim-free-390': { data: done(guidedDone), path: transfer + '?modo=libre' },
  'sim-simple-390': { data: done({ settings: simple }), path: transfer, actions: [sim.tap(/Banco Ejemplo/), sim.next] },
  'sim-xlarge-360': { w: 360, h: 640, data: done({ settings: xlarge }), path: transfer },
  'sim-zoom200': { w: 180, h: 320, scale: 4, data: done(), path: transfer },
  'sim-framed': { w: 1280, h: 920, data: done(), path: transfer, frame: true, actions: [sim.tap(/Banco Ejemplo/), sim.next] },
}

const only = process.env.ONLY ? new RegExp(process.env.ONLY) : null
for (const [name, opts] of Object.entries(shots)) {
  if (only && !only.test(name)) continue
  await shoot(name, opts)
}
await browser.close()
console.log(`Capturas en ${OUT}/`)
console.log('Pedidos a internet:', external.size ? [...external] : 'ninguno')
console.log(problems.length ? 'Problemas:\n- ' + problems.join('\n- ') : 'Sin problemas detectados')
