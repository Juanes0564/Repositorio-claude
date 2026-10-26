// Toma capturas de las pantallas principales para revisarlas (npm run build antes).
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

// Playwright no es dependencia del proyecto: se usa el que tenga instalado el equipo.
const { chromium } = createRequire(import.meta.url)('playwright');

const PORT = 4179;
const BASE = `http://localhost:${PORT}/`;
const OUT = process.argv[2] ?? 'screenshots';
mkdirSync(OUT, { recursive: true });

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));

const seeded = {
  version: 1, points: 230, coins: 45, streak: 2, bestStreak: 6,
  levels: { 'nivel-1': { completed: true, best: 7, total: 8, perfect: false }, 'nivel-2': { completed: true, best: 8, total: 8, perfect: true } },
  collectibles: ['jevons', 'menger', 'hayek'], badges: ['primer-nivel', 'modulo-origenes', 'perfecto', 'racha'],
  simulator: { completed: false, choices: {} },
  final: { completed: false, best: 0, total: 0, mastered: [], review: [] }, unlockAll: false,
};

const browser = await chromium.launch();
for (const [name, viewport] of [['movil', { width: 390, height: 844 }], ['pc', { width: 1280, height: 800 }]]) {
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  const shot = (n) => page.screenshot({ path: `${OUT}/${name}-${n}.png`, fullPage: true });

  await page.goto(BASE);
  await page.evaluate((s) => localStorage.setItem('econoplay.v1', JSON.stringify(s)), seeded);
  await page.goto(BASE); await shot('01-bienvenida');
  await page.goto(BASE + '#/modulos'); await page.waitForTimeout(300); await shot('02-modulos');
  await page.goto(BASE + '#/nivel/nivel-3'); await page.waitForTimeout(400); await shot('03-leccion');
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: /Siguiente|practicar/ }).click();
  await page.waitForTimeout(300); await shot('04-pregunta');
  await page.locator('.choice, .segment').first().click();
  await page.getByRole('button', { name: 'Comprobar' }).click();
  await page.waitForTimeout(500); await shot('05-retro');
  // Pregunta de clasificar (n3-p5)
  await page.goto(BASE + '#/nivel/nivel-6');
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /Siguiente|practicar/ }).click().catch(() => {});
  await page.goto(BASE + '#/simulador'); await page.getByRole('button', { name: /Empezar/ }).click();
  await page.locator('.choice').first().click(); await page.waitForTimeout(400); await shot('06-simulador');
  await page.goto(BASE + '#/reto'); await page.waitForTimeout(300); await shot('07-reto');
  await page.goto(BASE + '#/progreso'); await page.waitForTimeout(300); await shot('08-progreso');
  await page.goto(BASE + '#/competencia'); await page.waitForTimeout(300); await shot('09-competencia');
  await page.getByRole('button', { name: /Empezar competencia/ }).click(); await shot('10-turno');
  await page.getByRole('button', { name: /Mostrar pregunta/ }).click(); await page.waitForTimeout(1200); await shot('11-pregunta-comp');
  await page.locator('.choice').first().click(); await page.getByRole('button', { name: 'Comprobar' }).click();
  await page.getByRole('button', { name: 'Ver marcador' }).click(); await shot('12-marcador');
  await page.getByRole('button', { name: /Terminar ahora/ }).click(); await page.waitForTimeout(500); await shot('13-podio');
  console.log(name, errors.length ? errors : 'sin errores');
  await page.close();
}
await browser.close();
server.kill();
