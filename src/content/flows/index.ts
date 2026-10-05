import type { Flow, PlatformId } from '../../sim/types'
import { transferBank } from './transfer-bank'

/** Todas las prácticas. Para agregar una nueva, impórtala y súmala a esta lista. */
export const flows: Flow[] = [transferBank]

export function getFlow(id: string): Flow | undefined {
  return flows.find((f) => f.id === id)
}

export function flowsForPlatform(platform: PlatformId): Flow[] {
  return flows.filter((f) => f.platform === platform)
}
