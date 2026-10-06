import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { guides } from './guides'
import { messageHelp } from './messageHelp'
import { flows } from './flows'
import { resolveCopy } from './types'

/** Regla 8 del brief: sin teléfonos ni enlaces reales; contenido sensible marcado para revisión. */
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : path.endsWith('.ts') && !path.endsWith('.test.ts') ? [path] : []
  })
}

describe('contenido seguro', () => {
  for (const file of files(join(process.cwd(), 'src/content'))) {
    it(`sin enlaces ni teléfonos: ${file.replace(process.cwd() + '/', '')}`, () => {
      // Único enlace permitido: el videoUrl de un taller, y solo de YouTube (excepción 4b del brief).
      const text = readFileSync(file, 'utf8').replace(/videoUrl:\s*'https:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^']*'/g, '')
      expect(text).not.toMatch(/https?:\/\/|www\./i)
      expect(text).not.toMatch(/\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/) // celulares de 10 dígitos
      expect(text).not.toMatch(/01\s?8000/) // líneas gratuitas
    })
  }

  it('las guías y la ayuda con mensajes están marcadas para revisión', () => {
    expect(messageHelp.reviewed).toBe(false)
    for (const g of guides) expect(g.reviewed, g.skill).toBe(false)
    for (const f of flows) expect(f.reviewed, f.id).toBe(false)
  })

  it('las guías tienen pasos cortos (≤ 12 palabras) y una explicación para "No entiendo"', () => {
    for (const g of guides) {
      expect(g.steps.length).toBeGreaterThanOrEqual(4)
      for (const s of g.steps) {
        const words = resolveCopy(s.text, false).split(/\s+/).length
        expect(words, resolveCopy(s.text, false)).toBeLessThanOrEqual(12)
        expect(resolveCopy(s.detail, false).length).toBeGreaterThan(10)
      }
    }
  })
})
