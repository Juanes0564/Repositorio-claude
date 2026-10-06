import { beforeEach, describe, expect, it } from 'vitest'
import {
  CURRENT_VERSION,
  DEFAULT_SETTINGS,
  STORAGE_KEY,
  SKILL_IDS,
  clearData,
  defaultData,
  loadData,
  migrate,
  saveData,
  withSimpleMode,
} from './storage'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('usa la clave versionada vinculo.v1', () => {
    expect(STORAGE_KEY).toBe('vinculo.v1')
  })

  it('devuelve datos de fábrica cuando no hay nada guardado', () => {
    const data = loadData()
    expect(data).toEqual(defaultData())
    expect(data.version).toBe(CURRENT_VERSION)
    expect(data.onboardingDone).toBe(false)
    expect(Object.keys(data.progress)).toEqual([...SKILL_IDS])
  })

  it('guarda y vuelve a leer lo mismo', () => {
    const data = defaultData()
    data.profile.name = 'Marta'
    data.onboardingDone = true
    data.settings.fontSize = 'xlarge'
    data.progress.transfers.workshopDone = true
    saveData(data)
    expect(loadData()).toEqual(data)
  })

  it('no se rompe con datos dañados', () => {
    localStorage.setItem(STORAGE_KEY, '{esto no es json')
    expect(loadData()).toEqual(defaultData())
  })

  it('repara campos inválidos o faltantes', () => {
    const fixed = migrate({
      version: 1,
      profile: { name: 42 },
      settings: { fontSize: 'gigante', highContrast: 'si', voiceRate: 'normal' },
      progress: { transfers: { workshopDone: true }, desconocida: {} },
    })
    expect(fixed.profile.name).toBe('')
    expect(fixed.settings.fontSize).toBe(DEFAULT_SETTINGS.fontSize)
    expect(fixed.settings.highContrast).toBe(false)
    expect(fixed.settings.voiceRate).toBe('normal')
    expect(fixed.progress.transfers).toEqual({
      simulatorGuidedDone: false,
      simulatorFreeDone: false,
      workshopDone: true,
    })
    expect(fixed.progress).not.toHaveProperty('desconocida')
  })

  it('datos guardados antes de la Fase 3 reciben el permiso de micrófono "sin preguntar"', () => {
    expect(migrate({ version: 1, settings: { fontSize: 'large' } }).settings.voiceInput).toBe('unknown')
    expect(migrate({ settings: { voiceInput: 'declined' } }).settings.voiceInput).toBe('declined')
  })

  it('limita el largo del nombre', () => {
    expect(migrate({ profile: { name: 'a'.repeat(100) } }).profile.name).toHaveLength(40)
  })

  it('borra los datos', () => {
    saveData({ ...defaultData(), onboardingDone: true })
    clearData()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(loadData().onboardingDone).toBe(false)
  })

  it('el modo sencillo enciende y apaga sus ajustes', () => {
    const on = withSimpleMode(DEFAULT_SETTINGS, true)
    expect(on).toMatchObject({ simpleMode: true, fontSize: 'large', highContrast: true, largeIcons: true })
    const off = withSimpleMode({ ...on, voiceEnabled: false }, false)
    expect(off).toMatchObject({ simpleMode: false, fontSize: 'normal', highContrast: false, largeIcons: false })
    expect(off.voiceEnabled).toBe(false)
  })
})
