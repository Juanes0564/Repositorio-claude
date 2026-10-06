import { createContext, useContext } from 'react'
import type { Copy } from '../content/types'

export interface SimContextValue {
  onTap: (id: string) => void
  onKey: (keypadId: string, key: string) => void
  /** Elemento resaltado con contorno y flecha (o null). */
  highlight: string | null
  /** Elemento correcto ya tocado en este paso (muestra la marca verde). */
  doneId: string | null
  /** Lo escrito en cada teclado. */
  values: Record<string, string>
  text: (copy: Copy) => string
}

export const SimContext = createContext<SimContextValue | null>(null)

export function useSim(): SimContextValue {
  const ctx = useContext(SimContext)
  if (!ctx) throw new Error('useSim debe usarse dentro del simulador')
  return ctx
}
