import { describe, expect, it } from 'vitest'
import { workshops } from './workshops'
import { resolveCopy } from './types'
import { SKILL_IDS } from '../lib/storage'
import { youtubeId } from '../lib/video'

const t = (c: Parameters<typeof resolveCopy>[0]) => resolveCopy(c, false)

describe('talleres (datos)', () => {
  it('hay 8 talleres, uno por habilidad', () => {
    expect(workshops).toHaveLength(8)
    expect(new Set(workshops.map((w) => w.skill))).toEqual(new Set(SKILL_IDS))
    expect(new Set(workshops.map((w) => w.id)).size).toBe(8)
  })

  it('todos los filtros tienen talleres', () => {
    for (const c of ['banks', 'health', 'security', 'more']) {
      expect(workshops.some((w) => w.category === c), c).toBe(true)
    }
  })

  for (const w of workshops) {
    describe(w.id, () => {
      it('es un borrador por revisar (reviewed: false)', () => expect(w.reviewed).toBe(false))

      it('tiene de 4 a 6 tarjetas con 1 o 2 frases', () => {
        expect(w.cards.length).toBeGreaterThanOrEqual(4)
        expect(w.cards.length).toBeLessThanOrEqual(6)
        for (const c of w.cards) {
          const sentences = t(c.body).split(/[.!?]+\s/).filter(Boolean).length
          expect(sentences, t(c.body)).toBeLessThanOrEqual(2)
          expect(t(c.title).length).toBeGreaterThan(0)
        }
      })

      it('muestra duración', () => expect(w.minutes).toBeGreaterThan(0))

      it('el mini repaso tiene 3 preguntas con respuesta válida', () => {
        expect(w.quiz).toHaveLength(3)
        for (const q of w.quiz ?? []) {
          expect(q.answer).toBeGreaterThanOrEqual(0)
          expect(q.answer).toBeLessThan(q.options.length)
          expect(q.options.length).toBeGreaterThanOrEqual(2)
        }
      })

      it('si tiene video, es un enlace válido de YouTube', () => {
        if (w.videoUrl) expect(youtubeId(w.videoUrl)).not.toBeNull()
      })
    })
  }

  it('incluye el taller de accesibilidad del celular (letra, brillo, volumen)', () => {
    const phone = workshops.find((w) => w.skill === 'phoneSettings')!
    const all = phone.cards.map((c) => t(c.title) + ' ' + t(c.body)).join(' ').toLowerCase()
    for (const word of ['letra', 'brillo', 'volumen']) expect(all).toContain(word)
  })
})
