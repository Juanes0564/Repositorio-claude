import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const SKILLS = ['transfers', 'medical', 'transport', 'shopping', 'security', 'whatsapp', 'phoneSettings', 'scams']
const progress = (guided: boolean, workshop: boolean) =>
  Object.fromEntries(SKILLS.map((id) => [id, { simulatorGuidedDone: guided, simulatorFreeDone: false, workshopDone: workshop }]))

/** Abre la app con datos guardados (como si ya hubiera pasado la bienvenida). */
async function openWith(page: Page, path: string, extra: Record<string, unknown> = {}) {
  await page.goto('manifest.webmanifest')
  await page.evaluate(
    (data) => localStorage.setItem('vinculo.v1', JSON.stringify(data)),
    { version: 1, onboardingDone: true, profile: { name: 'Marta' }, ...extra },
  )
  await page.goto(`?frame=0${path}`)
}

/** Revisión automática de accesibilidad (axe). Falla con problemas serios o críticos. */
async function expectAccessible(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  expect(serious.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`), label).toEqual([])
}

/** Nada sale a internet: solo pedidos a la propia app. */
function watchExternal(page: Page) {
  const external: string[] = []
  page.on('request', (r) => {
    if (!r.url().startsWith('http://localhost:4173')) external.push(r.url())
  })
  return external
}

test('bienvenida → menú principal, sin pedidos a internet', async ({ page }) => {
  const external = watchExternal(page)
  await page.goto('?frame=0#/')
  await expect(page.getByRole('heading', { name: 'Vínculo' })).toBeVisible()
  await expectAccessible(page, 'bienvenida')
  await page.getByRole('button', { name: /Comenzar/ }).click()
  await page.getByLabel('Su nombre').fill('Marta')
  await page.getByRole('button', { name: /Continuar/ }).click()
  await page.getByRole('button', { name: 'No, por ahora' }).click()
  await expect(page.getByRole('heading', { name: '¡Hola, Marta!' })).toBeVisible()
  expect(external).toEqual([])
})

test('práctica completa de transferencia y avance en el Pasaporte', async ({ page }) => {
  await openWith(page, '#/practicar/bank/transfer-bank')
  const device = page.getByRole('region', { name: 'Pantalla de práctica' })
  const tap = (name: string | RegExp) => device.getByRole('button', { name }).first().click()
  const next = () => page.getByRole('button', { name: /Siguiente|Terminar/ }).click()
  const type = async (digits: string) => {
    for (const d of digits) await tap(d)
  }
  await expect(page.getByText('PRÁCTICA – no es real')).toBeVisible()
  await expectAccessible(page, 'simulador')
  await tap(/Banco Ejemplo/); await next()
  await type('1234'); await tap('Entrar'); await next()
  await tap(/Transferir/); await next()
  await tap(/Rosa Ejemplo/); await next()
  await type('50000'); await tap('Continuar'); await next()
  await tap('Confirmar'); await next()
  await type('5678'); await tap('Enviar dinero'); await next()
  await tap('Guardar comprobante'); await next()
  await expect(page.getByRole('heading', { name: '¡Lo logró!' })).toBeVisible()
  await page.evaluate(() => (window.location.hash = '#/avances'))
  await expect(page.getByRole('heading', { name: 'Transferencias bancarias' })).toBeVisible()
  await expect(page.getByText('Vea el taller: Transferencias bancarias')).toBeVisible()
  await expect(page.getByText(/^En progreso · 50 %/)).toBeVisible()
})

test('copiloto sin micrófono: escribir, confirmar y seguir la guía', async ({ page }) => {
  await openWith(page, '#/copiloto')
  await page.getByLabel(/escríbalo aquí/i).fill('quiero mandar plata a mi hija')
  await page.getByRole('button', { name: 'Enviar' }).click()
  await expect(page.getByText('¿Quiere hacer una transferencia?')).toBeVisible()
  await page.getByRole('button', { name: 'Sí' }).click()
  await expect(page.getByText('Paso 1 de 8')).toBeVisible()
  await page.getByRole('button', { name: 'Ya lo hice' }).click()
  await expect(page.getByText('Paso 2 de 8')).toBeVisible()
  await expectAccessible(page, 'copiloto')
})

test('taller completo marca el avance', async ({ page }) => {
  await openWith(page, '#/talleres/estafas')
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Siguiente' }).click()
  await page.getByRole('button', { name: 'Terminar' }).click()
  await expect(page.getByRole('heading', { name: '¡Terminó el taller!' })).toBeVisible()
})

const routes = [
  '#/',
  '#/practicar',
  '#/practicar/chat',
  '#/practicar/chat/scams-check',
  '#/copiloto',
  '#/talleres',
  '#/talleres/transferencias',
  '#/modo-sencillo',
  '#/avances',
  '#/ayuda',
  '#/perfil',
]

for (const route of routes) {
  test(`accesibilidad: ${route}`, async ({ page }) => {
    await openWith(page, route)
    await page.waitForLoadState('networkidle')
    await expectAccessible(page, route)
  })
  test(`accesibilidad en modo sencillo y letra muy grande: ${route}`, async ({ page }) => {
    await openWith(page, route, {
      settings: { simpleMode: true, fontSize: 'xlarge', largeIcons: true, fewerOptions: true, simpleLanguage: true, highContrast: true },
    })
    await page.waitForLoadState('networkidle')
    await expectAccessible(page, route)
  })
}

test('certificado con las 8 habilidades completas', async ({ page }) => {
  await openWith(page, '#/avances/certificado', { progress: progress(true, true) })
  await expect(page.getByText('Pasaporte Digital Vínculo')).toBeVisible()
  await expect(page.getByText('Marta')).toBeVisible()
  await expectAccessible(page, 'certificado')
})

test('teclado: saltar al contenido, foco visible y navegación', async ({ page }) => {
  await openWith(page, '#/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Saltar al contenido' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeInViewport()
  await page.keyboard.press('Tab')
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineStyle)
  expect(outline).not.toBe('none')
  // Con el teclado se llega a "Perfil" en la barra inferior y se abre con Enter.
  const perfil = page.getByRole('link', { name: 'Perfil' })
  for (let i = 0; i < 40 && !(await perfil.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press('Tab')
  await expect(perfil).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Mi perfil' })).toBeVisible()
})

test('funciona sin conexión después de la primera carga', async ({ page, context }) => {
  await openWith(page, '#/')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  await page.reload()
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { name: '¡Hola, Marta!' })).toBeVisible()
  await page.getByRole('link', { name: /Tutoriales y talleres/ }).click()
  await page.getByRole('link', { name: /Reconocer estafas/ }).click()
  await expect(page.getByText(/Tarjeta 1 de/)).toBeVisible()
  await context.setOffline(false)
})

test('zoom al 200 %: nada se sale por los lados', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 195, height: 422 }, deviceScaleFactor: 4 })
  const page = await context.newPage()
  for (const route of ['#/', '#/practicar/bank/transfer-bank', '#/copiloto', '#/talleres/compras', '#/avances', '#/ayuda']) {
    await openWith(page, route)
    const overflow = await page.evaluate(() => {
      const m = document.querySelector('.content')!
      return m.scrollWidth - m.clientWidth
    })
    expect(overflow, route).toBeLessThanOrEqual(1)
  }
  await context.close()
})
