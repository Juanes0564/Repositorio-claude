import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Regla 5 del brief: el simulador nunca usa nombres de marcas reales.
 * Revisa los archivos de plataformas y flujos. (Los talleres sí pueden nombrar apps reales como referencia.)
 */
const BANNED = [
  'bancolombia', 'davivienda', 'daviplata', 'nequi', 'bbva', 'banco de bogota', 'banco de bogotá',
  'banco popular', 'av villas', 'colpatria', 'scotiabank', 'nu colombia', 'movii', 'dale!',
  'sura', 'sanitas', 'compensar', 'nueva eps', 'famisanar', 'salud total', 'coomeva',
  'uber', 'didi', 'cabify', 'indrive', 'picap', 'rappi', 'ifood', 'mercado libre', 'mercadolibre',
  'falabella', 'exito', 'éxito', 'amazon', 'temu', 'whatsapp', 'telegram', 'samsung', 'xiaomi', 'motorola',
]

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : path.endsWith('.ts') && !path.endsWith('.test.ts') ? [path] : []
  })
}

describe('sin marcas reales en el simulador', () => {
  const root = join(process.cwd(), 'src/content')
  const targets = [join(root, 'platforms.ts'), join(root, 'simulator.ts'), ...files(join(root, 'flows'))]
  for (const file of targets) {
    it(file.replace(process.cwd() + '/', ''), () => {
      // `skill: 'whatsapp'` es un nombre interno de la habilidad (no se ve en pantalla).
      const text = readFileSync(file, 'utf8').toLowerCase().replace(/skill: '\w+'/g, '')
      for (const brand of BANNED) {
        const escaped = brand.replace(/[.*+?^${}()|[\]\\!]/g, '\\$&')
        const found = new RegExp(`(^|[^a-záéíóúñ])${escaped}($|[^a-záéíóúñ])`).test(text)
        expect(found, `"${brand}" aparece en ${file}`).toBe(false)
      }
    })
  }
})
