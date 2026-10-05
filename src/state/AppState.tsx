import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  clearData,
  defaultData,
  loadData,
  saveData,
  withSimpleMode,
  type Settings,
  type StoredData,
} from '../lib/storage'

export interface AppState {
  data: StoredData
  setName: (name: string) => void
  updateSettings: (patch: Partial<Settings>) => void
  setSimpleMode: (on: boolean) => void
  completeOnboarding: () => void
  eraseAll: () => void
}

export const AppStateContext = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredData>(() => loadData())

  useEffect(() => {
    saveData(data)
  }, [data])

  // Aplica los ajustes visuales a toda la app (el CSS lee estos atributos).
  useEffect(() => {
    const root = document.documentElement
    const s = data.settings
    root.dataset.font = s.fontSize
    root.dataset.contrast = s.highContrast ? 'high' : 'normal'
    root.dataset.icons = s.largeIcons ? 'large' : 'normal'
    root.dataset.simple = s.simpleMode ? 'on' : 'off'
  }, [data.settings])

  const setName = useCallback((name: string) => {
    setData((d) => ({ ...d, profile: { ...d.profile, name: name.trim().slice(0, 40) } }))
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }))
  }, [])

  const setSimpleMode = useCallback((on: boolean) => {
    setData((d) => ({ ...d, settings: withSimpleMode(d.settings, on) }))
  }, [])

  const completeOnboarding = useCallback(() => {
    setData((d) => ({ ...d, onboardingDone: true }))
  }, [])

  const eraseAll = useCallback(() => {
    clearData()
    setData(defaultData())
  }, [])

  const value = useMemo(
    () => ({ data, setName, updateSettings, setSimpleMode, completeOnboarding, eraseAll }),
    [data, setName, updateSettings, setSimpleMode, completeOnboarding, eraseAll],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}
