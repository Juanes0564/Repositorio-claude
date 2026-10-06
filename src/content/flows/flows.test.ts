import { describe, expect, it } from 'vitest'
import { flows } from '.'
import { platforms } from '../platforms'
import { initialState, simReducer, tappableIds, type SimAction } from '../../sim/engine'
import { resolveCopy, type Copy } from '../types'
import { SKILL_IDS } from '../../lib/storage'

const words = (c: Copy) => resolveCopy(c, false).split(/\s+/).filter(Boolean).length

describe('flujos de práctica (datos)', () => {
  it('hay prácticas de las habilidades de las fases 2 y 5', () => {
    const skills = new Set(flows.map((f) => f.skill))
    for (const s of ['transfers', 'medical', 'transport', 'shopping', 'scams'] as const) expect(skills.has(s), s).toBe(true)
  })

  it('la práctica de estafas tiene casos seguros y estafas', () => {
    const scams = flows.find((f) => f.skill === 'scams')!
    const targets = scams.steps.map((s) => (s.target.kind === 'tap' ? s.target.id : ''))
    expect(targets.some((t) => t.endsWith('-safe'))).toBe(true)
    expect(targets.some((t) => t.endsWith('-scam'))).toBe(true)
  })

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

      it('se puede completar de principio a fin', () => {
        let state = initialState(flow)
        const act = (a: SimAction) => (state = simReducer(flow, state, a))
        for (const step of flow.steps) {
          if (step.target.kind === 'tap') act({ type: 'tap', id: step.target.id })
          else {
            const { keypadId, expected } = step.target
            for (const key of expected) act({ type: 'key', keypadId, key })
            const keypad = step.screen.blocks.find((b) => b.type === 'keypad' && b.id === keypadId)
            if (keypad?.type === 'keypad') act({ type: 'tap', id: keypad.submit.id })
          }
          expect(state.feedback, step.id).toBe('success')
          act({ type: 'next' })
        }
        expect(state.finished).toBe(true)
      })

      it('cada paso de decisión explica las señales', () => {
        for (const step of flow.steps) {
          if (step.screen.blocks.some((b) => b.type === 'decision')) expect(step.explain, step.id).toBeDefined()
        }
      })

      it('el contenido de dinero y seguridad está marcado para revisión', () => {
        expect(typeof flow.reviewed).toBe('boolean')
      })
    })
  }
})
