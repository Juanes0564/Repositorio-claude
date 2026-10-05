import { useContext } from 'react'
import { AppStateContext, type AppState } from './AppState'
import { resolveCopy, type Copy } from '../content'

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState debe usarse dentro de AppStateProvider')
  return ctx
}

/** Devuelve una función que elige la versión "lenguaje sencillo" de un texto si está activada. */
export function useCopy(): (copy: Copy) => string {
  const { data } = useAppState()
  return (copy: Copy) => resolveCopy(copy, data.settings.simpleLanguage)
}
