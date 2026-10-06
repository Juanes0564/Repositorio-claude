import { defineConfig, devices } from '@playwright/test'

/**
 * Pruebas de humo de punta a punta: abren la app de verdad en un navegador.
 * Uso: npm run test:e2e   (construye la app y la sirve en http://localhost:4173)
 * Si el navegador de Playwright no está instalado, define CHROMIUM_PATH con la ruta de Chromium.
 */
export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173/',
    ...devices['Pixel 7'],
    locale: 'es-CO',
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
