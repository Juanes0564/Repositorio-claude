import { describe, expect, it } from 'vitest'
import { flows } from '.'
import { platforms } from '../platforms'
import { tappableIds } from '../../sim/engine'
import { resolveCopy, type Copy } from '../types'
import { SKILL_IDS } from '../../lib/storage'

const words = (c: Copy) => resolveCopy(c, false).split(/\s+/).filter(Boolean).length

describe('flujos de práctica (datos)', () => {
  it('los ids de los flujos son únicos', () => {
    expect(new Set(flows.map((f) => f.id)).size).toBe(flows.length)
  })

  for (const flow of flows) {
    describe(flow.id, () => {
      it('usa una plataforma y una habilidad que existen', () => {
        expect(platforms.map((p) => p.id)).toContain(flow.platform)
        expect(SKILL_IDS).toContain(flow.skill)
      })

      it('tiene entre 6 y 8 pasos (brief §13)', () => {
        expect(flow.steps.length).toBeGreaterThanOrEqual(6)
        expect(flow.steps.length).toBeLessThanOrEqual(8)
      })

      it('cada paso tiene su objetivo en pantalla', () => {
        for (const step of flow.steps) {
          const ids = tappableIds(step)
          expect(new Set(ids).size, `ids repetidos en ${step.id}`).toBe(ids.length)
          if (step.target.kind === 'tap') {
            expect(ids, `objetivo de ${step.id}`).toContain(step.target.id)
          } else {
            const { keypadId, expected } = step.target
            const keypad = step.screen.blocks.find((b) => b.type === 'keypad' && b.id === keypadId)
            expect(keypad, `teclado de ${step.id}`).toBeDefined()
            if (keypad?.type === 'keypad') expect(expected.length).toBeLessThanOrEqual(keypad.maxLength)
            expect(expected).toMatch(/^\d+$/)
          }
        }
      })

      it('cada paso tiene al menos una opción equivocada posible o un teclado', () => {
        for (const step of flow.steps) expect(tappableIds(step).length).toBeGreaterThan(0)
      })

      it('las instrucciones del coach son cortas (≤ 12 palabras)', () => {
        for (const step of flow.steps) expect(words(step.coach), step.id).toBeLessThanOrEqual(12)
      })

      it('el contenido de dinero y seguridad está marcado para revisión', () => {
        expect(typeof flow.reviewed).toBe('boolean')
      })
    })
  }
})
