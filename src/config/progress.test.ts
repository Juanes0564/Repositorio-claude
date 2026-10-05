import { describe, expect, it } from 'vitest'
import { PROGRESS_WEIGHTS, skillPercent, skillStatus } from './progress'

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
