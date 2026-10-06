/**
 * Regla del Pasaporte Digital (sección 9 del brief).
 * Cambia los pesos aquí y toda la app los usa. Deben sumar 100.
 */
import { SKILL_IDS, type SkillId, type SkillProgress } from '../lib/storage'

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

export interface Suggestion {
  skill: SkillId
  /** Qué falta: la práctica con guía o el taller. */
  action: 'practice' | 'workshop'
}

/**
 * Siguiente reto sugerido: la primera habilidad sin completar, en el orden del Pasaporte.
 * Primero la práctica (es lo más práctico) y luego el taller. null si ya completó todo.
 */
export function nextSuggestion(progress: Record<SkillId, SkillProgress>): Suggestion | null {
  // Si alguna habilidad está a medias, se sugiere terminarla antes de empezar otra.
  const half = SKILL_IDS.find((id) => skillStatus(progress[id]) === 'inProgress' && skillPercent(progress[id]) > 0)
  const skill = half ?? SKILL_IDS.find((id) => skillStatus(progress[id]) !== 'complete')
  if (!skill) return null
  return { skill, action: progress[skill].simulatorGuidedDone ? 'workshop' : 'practice' }
}

export function completedCount(progress: Record<SkillId, SkillProgress>): number {
  return SKILL_IDS.filter((id) => skillStatus(progress[id]) === 'complete').length
}
