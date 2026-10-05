import type { PlatformId, SimIconName } from '../sim/types'

export type PlatformCategory = 'banks' | 'health' | 'transport' | 'shopping' | 'messaging' | 'phone'

export interface Platform {
  id: PlatformId
  name: string
  category: PlatformCategory
  /** Descripción corta para la lista. */
  description: string
  /** Color propio (texto blanco encima, contraste ≥ 7:1). No imita ninguna marca real. */
  color: string
  icon: SimIconName
  /** Orden en "Más usadas" (menor = más arriba). */
  popularity: number
}

/**
 * Plataformas ficticias del simulador (sección 5 del brief).
 * Colores elegidos para NO parecerse a bancos, EPS ni apps reales de Colombia.
 */
export const platforms: Platform[] = [
  { id: 'bank', name: 'Banco Ejemplo', category: 'banks', description: 'Banco de práctica', color: '#0F5C5C', icon: 'card', popularity: 1 },
  { id: 'eps', name: 'EPS Salud Ejemplo', category: 'health', description: 'Citas médicas de práctica', color: '#1E5675', icon: 'calendar', popularity: 2 },
  { id: 'chat', name: 'Chat Ejemplo', category: 'messaging', description: 'Mensajes de práctica', color: '#3E4C6B', icon: 'chat', popularity: 3 },
  { id: 'transport', name: 'Transporte Ejemplo', category: 'transport', description: 'Pedir un carro de práctica', color: '#1F4E79', icon: 'car', popularity: 4 },
  { id: 'wallet', name: 'Billetera Ejemplo', category: 'banks', description: 'Billetera digital de práctica', color: '#6B4813', icon: 'pay', popularity: 5 },
  { id: 'store', name: 'Tienda Ejemplo', category: 'shopping', description: 'Compras de práctica', color: '#8B3A3A', icon: 'cart', popularity: 6 },
  { id: 'delivery', name: 'Domicilios Ejemplo', category: 'shopping', description: 'Domicilios de práctica', color: '#48551A', icon: 'bag', popularity: 7 },
  { id: 'settings', name: 'Ajustes', category: 'phone', description: 'Configuración del celular', color: '#4A4F55', icon: 'text', popularity: 8 },
]

export function getPlatform(id: PlatformId): Platform {
  const p = platforms.find((x) => x.id === id)
  if (!p) throw new Error(`Plataforma desconocida: ${id}`)
  return p
}
