import { flows } from '../content/flows'
import { workshopForSkill } from '../content/workshops'
import type { SkillId } from './storage'

/** Dirección de la práctica de una habilidad. */
export function practicePath(skill: SkillId): string {
  const flow = flows.find((f) => f.skill === skill)
  return flow ? `/practicar/${flow.platform}/${flow.id}` : '/practicar'
}

/** Dirección del taller de una habilidad. */
export function workshopPath(skill: SkillId): string {
  const w = workshopForSkill(skill)
  return w ? `/talleres/${w.id}` : '/talleres'
}
