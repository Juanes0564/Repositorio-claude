import type { Flow, PlatformId } from '../../sim/types'
import { appointmentEps } from './appointment-eps'
import { rideTransport } from './ride-transport'
import { scamsCheck } from './scams-check'
import { shoppingStore } from './shopping-store'
import { transferBank } from './transfer-bank'

/** Todas las prácticas. Para agregar una nueva, impórtala y súmala a esta lista. */
export const flows: Flow[] = [transferBank, appointmentEps, rideTransport, shoppingStore, scamsCheck]

export function getFlow(id: string): Flow | undefined {
  return flows.find((f) => f.id === id)
}

export function flowsForPlatform(platform: PlatformId): Flow[] {
  return flows.filter((f) => f.platform === platform)
}
