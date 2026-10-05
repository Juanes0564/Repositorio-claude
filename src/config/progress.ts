/**
 * Regla del Pasaporte Digital (sección 9 del brief).
 * Cambia los pesos aquí y toda la app los usa. Deben sumar 100.
 */
import type { SkillProgress } from '../lib/storage'

export const PROGRESS_WEIGHTS = {
  /** Completar el simulador en modo Guiado. */
  simulator: 50,
  /** Ver el taller completo. */
  workshop: 50,
} as const

export type SkillStatus = 'notStarted' | 'inProgress' | 'complete'

export function skillPercent(p: SkillProgress): number {
  return (p.simulatorGuidedDone ? PROGRESS_WEIGHTS.simulator : 0) + (p.workshopDone ? PROGRESS_WEIGHTS.workshop : 0)
}

export function skillStatus(p: SkillProgress): SkillStatus {
  const percent = skillPercent(p)
  if (percent >= 100) return 'complete'
  if (percent > 0 || p.simulatorFreeDone) return 'inProgress'
  return 'notStarted'
}
