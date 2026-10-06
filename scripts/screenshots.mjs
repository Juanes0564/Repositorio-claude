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

/** Micrófono falso para capturar los estados de voz sin hablar. */
const fakeMic = () => {
  class FakeRec {
    constructor() { window.__rec = this }
    start() {}
    stop() { this.onend?.() }
    abort() { this.onend?.() }
  }
  window.webkitSpeechRecognition = FakeRec
  window.SpeechRecognition = FakeRec
}
const say = (text, final = false) => async (page) =>
  page.evaluate(([t, f]) => {
    window.__rec.onresult?.({ resultIndex: 0, results: [{ isFinal: f, 0: { transcript: t }, length: 1 }] })
    if (f) window.__rec.onend?.()
  }, [text, final])

async function shoot(name, { w = 390, h = 844, scale = 1, data, path = '#/', frame = false, actions = [], mic = false }) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale, reducedMotion: 'reduce' })
  if (mic) await ctx.addInitScript(fakeMic)
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
const btn = (name) => async (page) => page.getByRole('button', { name }).first().click()
const typeCopilot = (text) => async (page) => {
  await page.getByLabel(/escr[íi]b[ae]lo aquí/i).fill(text)
  await page.getByRole('button', { name: 'Enviar' }).click()
}
const micOn = { voiceInput: 'granted' }
const all = (fn) => Object.fromEntries(['transfers', 'medical', 'transport', 'shopping', 'security', 'whatsapp', 'phoneSettings', 'scams'].map((id, i) => [id, fn(id, i)]))
const someProgress = { progress: all((id, i) => ({ simulatorGuidedDone: i < 3, simulatorFreeDone: false, workshopDone: i < 2 })) }
const fullProgress = { progress: all(() => ({ simulatorGuidedDone: true, simulatorFreeDone: false, workshopDone: true })) }
const simpleOn = { ...simple, voiceRate: 'slow' }
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
  'copilot-390': { data: done(), path: '#/copiloto' },
  'copilot-360': { w: 360, h: 640, data: done(), path: '#/copiloto' },
  'copilot-mic-390': { mic: true, data: done(), path: '#/copiloto' },
  'copilot-consent-390': { mic: true, data: done(), path: '#/copiloto', actions: [btn(/To(ca|que) para hablar/)] },
  'copilot-listening-390': { mic: true, data: done({ settings: micOn }), path: '#/copiloto', actions: [btn(/To(ca|que) para hablar/), say('quiero mandar plata a')] },
  'copilot-confirm-390': { mic: true, data: done({ settings: micOn }), path: '#/copiloto', actions: [btn(/To(ca|que) para hablar/), say('quiero mandar plata a mi hija', true)] },
  'copilot-choices-390': { data: done(), path: '#/copiloto', actions: [typeCopilot('quiero pagar en la tienda con el banco')] },
  'copilot-lost-390': { data: done(), path: '#/copiloto', actions: [typeCopilot('el clima de mañana')] },
  'copilot-guide-390': { data: done(), path: '#/copiloto', actions: [typeCopilot('necesito un taxi'), btn('Sí'), btn('Ya lo hice')] },
  'copilot-guide-explain-390': { data: done(), path: '#/copiloto', actions: [btn('Quiero hacer una transferencia'), btn('Ya lo hice'), btn('No entiendo')] },
  'copilot-message-390': { data: done(), path: '#/copiloto', actions: [btn('No entiendo un mensaje')] },
  'copilot-answer-390': { data: done(), path: '#/copiloto', actions: [btn('No entiendo un mensaje'), btn('Me pide un código')] },
  'copilot-xlarge-360': { w: 360, h: 640, mic: true, data: done({ settings: xlarge }), path: '#/copiloto' },
  'copilot-guide-simple-390': { data: done({ settings: simple }), path: '#/copiloto', actions: [btn('Quiero hacer una transferencia')] },
  'copilot-zoom200': { w: 180, h: 320, scale: 4, data: done(), path: '#/copiloto' },
  'copilot-framed': { w: 1280, h: 920, mic: true, data: done(), path: '#/copiloto', frame: true },
  'home-mic-390': { mic: true, data: done() },
  'welcome-name-mic-390': { mic: true, path: '#/bienvenida', actions: [btn(/Comenzar/)] },
  'profile-mic-390': { mic: true, data: done({ settings: micOn }), path: '#/perfil', actions: [async (p) => p.getByText('Velocidad de la voz').scrollIntoViewIfNeeded()] },
  'workshops-390': { data: done(), path: '#/talleres' },
  'workshops-security-360': { w: 360, h: 640, data: done(), path: '#/talleres?tema=security' },
  'workshop-card1-390': { data: done(), path: '#/talleres/transferencias' },
  'workshop-card2-390': { data: done(), path: '#/talleres/transferencias', actions: [btn('Siguiente')] },
  'workshop-card-360': { w: 360, h: 640, data: done(), path: '#/talleres/estafas', actions: [btn('Siguiente'), btn('Siguiente'), btn('Siguiente'), btn('Siguiente')] },
  'workshop-phone-390': { data: done(), path: '#/talleres/celular-comodo', actions: [btn('Siguiente')] },
  'workshop-done-390': { data: done(), path: '#/talleres/transporte', actions: [btn('Siguiente'), btn('Siguiente'), btn('Siguiente'), btn('Siguiente'), btn('Terminar')] },
  'workshop-quiz-390': {
    data: done(), path: '#/talleres/estafas',
    actions: [btn('Siguiente'), btn('Siguiente'), btn('Siguiente'), btn('Siguiente'), btn('Siguiente'), btn('Terminar'), btn(/mini repaso/), btn('Es seguro')],
  },
  'workshop-simple-390': { data: done({ settings: simple }), path: '#/talleres/whatsapp', actions: [btn('Siguiente'), btn('Siguiente')] },
  'workshop-xlarge-360': { w: 360, h: 640, data: done({ settings: xlarge }), path: '#/talleres/seguridad' },
  'workshop-zoom200': { w: 180, h: 320, scale: 4, data: done(), path: '#/talleres/compras' },
  'workshops-framed': { w: 1280, h: 920, data: done(), path: '#/talleres', frame: true },
  'eps-slot-390': { data: done(), path: '#/practicar/eps/appointment-eps', actions: [sim.tap(/EPS Salud Ejemplo/), sim.next, sim.type('2468'), sim.tap('Entrar'), sim.next, sim.tap(/Citas/), sim.next, sim.tap(/Medicina general/), sim.next, sim.tap(/Sede Centro/), sim.next] },
  'eps-receipt-390': { data: done(), path: '#/practicar/eps/appointment-eps', actions: [sim.tap(/EPS Salud Ejemplo/), sim.next, sim.type('2468'), sim.tap('Entrar'), sim.next, sim.tap(/Citas/), sim.next, sim.tap(/Medicina general/), sim.next, sim.tap(/Sede Centro/), sim.next, sim.tap(/Jueves/), sim.next, sim.tap('Confirmar cita'), sim.next] },
  'ride-driver-390': { data: done(), path: '#/practicar/transport/ride-transport', actions: [sim.tap(/Transporte Ejemplo/), sim.next, sim.tap(/Centro de salud/), sim.next, sim.tap(/Económico/), sim.next, sim.tap('Pedir viaje'), sim.next] },
  'ride-plate-390': { data: done(), path: '#/practicar/transport/ride-transport', actions: [sim.tap(/Transporte Ejemplo/), sim.next, sim.tap(/Centro de salud/), sim.next, sim.tap(/Económico/), sim.next, sim.tap('Pedir viaje'), sim.next, sim.tap('Compartir viaje'), sim.next, sim.tap(/Coinciden/)] },
  'ride-rating-390': { data: done(), path: '#/practicar/transport/ride-transport', actions: [sim.tap(/Transporte Ejemplo/), sim.next, sim.tap(/Centro de salud/), sim.next, sim.tap(/Económico/), sim.next, sim.tap('Pedir viaje'), sim.next, sim.tap('Compartir viaje'), sim.next, sim.tap(/Coinciden/), sim.next, sim.tap('Pagué en efectivo'), sim.next, sim.tap('3 estrellas'), sim.tap('2 estrellas')] },
  'shop-cart-390': { data: done(), path: '#/practicar/store/shopping-store', actions: [sim.tap(/Buscar productos/), sim.next, sim.tap(/Olla de presión/), sim.next, sim.tap('Agregar al carrito'), sim.next] },
  'shop-payment-390': { data: done(), path: '#/practicar/store/shopping-store', actions: [sim.tap(/Buscar productos/), sim.next, sim.tap(/Olla de presión/), sim.next, sim.tap('Agregar al carrito'), sim.next, sim.tap('Continuar compra'), sim.next, sim.tap('Usar esta dirección'), sim.next] },
  'scam-sms-390': { data: done(), path: '#/practicar/chat/scams-check' },
  'scam-sms-wrong-390': { data: done(), path: '#/practicar/chat/scams-check', actions: [sim.tap('Es seguro')] },
  'scam-sms-right-390': { data: done(), path: '#/practicar/chat/scams-check', actions: [sim.tap('Es una estafa')] },
  'scam-call-390': { data: done(), path: '#/practicar/chat/scams-check', actions: [sim.tap('Es una estafa'), sim.next] },
  'scam-family-390': { data: done(), path: '#/practicar/chat/scams-check', actions: [sim.tap('Es una estafa'), sim.next, sim.tap('Es una estafa'), sim.next, sim.tap('Es una estafa'), sim.next] },
  'scam-safe-right-390': { data: done(), path: '#/practicar/chat/scams-check', actions: [sim.tap('Es una estafa'), sim.next, sim.tap('Es una estafa'), sim.next, sim.tap('Es una estafa'), sim.next, sim.tap('Es una estafa'), sim.next, sim.tap('Es seguro')] },
  'scam-xlarge-360': { w: 360, h: 640, data: done({ settings: xlarge }), path: '#/practicar/chat/scams-check' },
  'scam-zoom200': { w: 180, h: 320, scale: 4, data: done(), path: '#/practicar/chat/scams-check' },
  'platform-chat-390': { data: done(), path: '#/practicar/chat' },
  'chat-send-390': { data: done(), path: '#/practicar/chat/chat-basics', actions: [sim.tap(/Chat Ejemplo/), sim.next, sim.tap(/Rosa \(hija\)/), sim.next] },
  'chat-video-390': { data: done(), path: '#/practicar/chat/chat-basics', actions: [sim.tap(/Chat Ejemplo/), sim.next, sim.tap(/Rosa \(hija\)/), sim.next, sim.tap('Enviar'), sim.next, sim.tap('Audio'), sim.next, sim.tap('Foto'), sim.next] },
  'chat-mute-390': { data: done(), path: '#/practicar/chat/chat-basics', actions: [sim.tap(/Chat Ejemplo/), sim.next, sim.tap(/Rosa \(hija\)/), sim.next, sim.tap('Enviar'), sim.next, sim.tap('Audio'), sim.next, sim.tap('Foto'), sim.next, sim.tap('Videollamada'), sim.next, sim.tap(/Familia/), sim.next, sim.tap(/Silenciar/)] },
  'settings-list-390': { data: done(), path: '#/practicar/settings/phone-settings', actions: [sim.tap(/Ajustes/), sim.next] },
  'settings-wifi-390': { data: done(), path: '#/practicar/settings/phone-settings', actions: [sim.tap(/Ajustes/), sim.next, sim.tap(/Tamaño de letra/), sim.next, sim.tap(/^Grande/), sim.next, sim.tap('Subir brillo'), sim.next, sim.tap('Subir volumen'), sim.next] },
  'settings-plane-390': { data: done(), path: '#/practicar/settings/phone-settings', actions: [sim.tap(/Ajustes/), sim.next, sim.tap(/Tamaño de letra/), sim.next, sim.tap(/^Grande/), sim.next, sim.tap('Subir brillo'), sim.next, sim.tap('Subir volumen'), sim.next, sim.tap(/Casa Ejemplo/), sim.next, sim.tap('Instalar ahora'), sim.next] },
  'security-pw-390': { data: done(), path: '#/practicar/settings/security-check' },
  'security-pw-wrong2-390': { data: done(), path: '#/practicar/settings/security-check', actions: [sim.tap('1234'), sim.tap(/fecha de nacimiento/)] },
  'security-perm-390': { data: done(), path: '#/practicar/settings/security-check', actions: [sim.tap(/perro come arepa/), sim.next, sim.tap(/No se lo doy/), sim.next, sim.tap(/PIN o mi huella/), sim.next, sim.tap(/La instalo con wifi/), sim.next, sim.tap('No permitir')] },
  'security-xlarge-360': { w: 360, h: 640, data: done({ settings: xlarge }), path: '#/practicar/settings/security-check' },
  'platform-settings-390': { data: done(), path: '#/practicar/settings' },
  'simple-settings-390': { data: done(), path: '#/modo-sencillo' },
  'simple-settings-on-390': { data: done({ settings: simpleOn }), path: '#/modo-sencillo' },
  'simple-home-390': { data: done({ settings: simpleOn }) },
  'simple-home-xlarge-360': { w: 360, h: 640, data: done({ settings: { ...simpleOn, fontSize: 'xlarge' } }) },
  'simple-home-zoom200': { w: 180, h: 320, scale: 4, data: done({ settings: simpleOn }) },
  'passport-empty-390': { data: done(), path: '#/avances' },
  'passport-some-390': { data: done(someProgress), path: '#/avances' },
  'passport-some-simple-390': { data: done({ ...someProgress, settings: simpleOn }), path: '#/avances' },
  'passport-full-390': { data: done(fullProgress), path: '#/avances' },
  'certificate-390': { data: done(fullProgress), path: '#/avances/certificado' },
  'certificate-framed': { w: 1280, h: 920, data: done(fullProgress), path: '#/avances/certificado', frame: true },
  'help-390': { data: done(), path: '#/ayuda' },
  'help-soon-390': { data: done(), path: '#/ayuda', actions: [btn(/Chat en tiempo real/)] },
  'help-simple-xlarge-360': { w: 360, h: 640, data: done({ settings: { ...simpleOn, fontSize: 'xlarge' } }), path: '#/ayuda' },
  'help-install-390': { data: done(), path: '#/ayuda', actions: [async (p) => p.getByText('En iPhone (Safari)').scrollIntoViewIfNeeded()] },
  'profile-simple-xlarge-360': { w: 360, h: 640, data: done({ settings: { ...simpleOn, fontSize: 'xlarge' } }), path: '#/perfil' },
  'copilot-guide-from-simple-390': { data: done({ settings: simpleOn }), path: '#/copiloto?guia=medical' },
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
