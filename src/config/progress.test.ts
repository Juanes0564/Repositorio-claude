import { describe, expect, it } from 'vitest'
import { PROGRESS_WEIGHTS, completedCount, nextSuggestion, skillPercent, skillStatus } from './progress'
import { SKILL_IDS } from '../lib/storage'

const p = (simulatorGuidedDone: boolean, workshopDone: boolean, simulatorFreeDone = false) => ({
  simulatorGuidedDone,
  workshopDone,
  simulatorFreeDone,
})

describe('progreso de una habilidad', () => {
  it('los pesos suman 100', () => {
    expect(PROGRESS_WEIGHTS.simulator + PROGRESS_WEIGHTS.workshop).toBe(100)
  })
  it('sin empezar', () => {
    expect(skillPercent(p(false, false))).toBe(0)
    expect(skillStatus(p(false, false))).toBe('notStarted')
  })
  it('50 % por el simulador guiado', () => {
    expect(skillPercent(p(true, false))).toBe(50)
    expect(skillStatus(p(true, false))).toBe('inProgress')
  })
  it('50 % por el taller', () => {
    expect(skillPercent(p(false, true))).toBe(50)
    expect(skillStatus(p(false, true))).toBe('inProgress')
  })
  it('completa con las dos cosas', () => {
    expect(skillPercent(p(true, true))).toBe(100)
    expect(skillStatus(p(true, true))).toBe('complete')
  })
  it('el modo libre solo no suma, pero cuenta como "en progreso"', () => {
    expect(skillPercent(p(false, false, true))).toBe(0)
    expect(skillStatus(p(false, false, true))).toBe('inProgress')
  })
})

describe('siguiente reto sugerido', () => {
  const all = (fn: (id: (typeof SKILL_IDS)[number]) => ReturnType<typeof p>) =>
    Object.fromEntries(SKILL_IDS.map((id) => [id, fn(id)])) as Parameters<typeof nextSuggestion>[0]

  it('sin avances: la práctica de la primera habilidad', () => {
    expect(nextSuggestion(all(() => p(false, false)))).toEqual({ skill: 'transfers', action: 'practice' })
  })
  it('termina primero lo que está a medias', () => {
    const prog = all(() => p(false, false))
    prog.scams = p(true, false)
    expect(nextSuggestion(prog)).toEqual({ skill: 'scams', action: 'workshop' })
  })
  it('salta las completas', () => {
    const prog = all(() => p(false, false))
    prog.transfers = p(true, true)
    expect(nextSuggestion(prog)).toEqual({ skill: 'medical', action: 'practice' })
    expect(completedCount(prog)).toBe(1)
  })
  it('null cuando todo está completo', () => {
    const prog = all(() => p(true, true))
    expect(nextSuggestion(prog)).toBeNull()
    expect(completedCount(prog)).toBe(8)
  })
})
