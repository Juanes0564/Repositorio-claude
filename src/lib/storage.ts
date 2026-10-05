/**
 * Persistencia local de Vínculo.
 * Todo vive en una sola clave versionada de localStorage. Nada sale del dispositivo.
 */

export const STORAGE_KEY = 'vinculo.v1'
export const CURRENT_VERSION = 1

export const SKILL_IDS = [
  'transfers',
  'medical',
  'transport',
  'shopping',
  'security',
  'whatsapp',
  'phoneSettings',
  'scams',
] as const
export type SkillId = (typeof SKILL_IDS)[number]

export type FontSize = 'normal' | 'large' | 'xlarge'
export type VoiceRate = 'slow' | 'normal'
/** Permiso para usar el micrófono: se pregunta con un aviso de privacidad antes del primer uso. */
export type VoiceInputConsent = 'unknown' | 'granted' | 'declined'

export interface Settings {
  /** Interruptor general del modo sencillo. */
  simpleMode: boolean
  fontSize: FontSize
  largeIcons: boolean
  fewerOptions: boolean
  simpleLanguage: boolean
  highContrast: boolean
  voiceEnabled: boolean
  voiceRate: VoiceRate
  voiceInput: VoiceInputConsent
}

export interface SkillProgress {
  simulatorGuidedDone: boolean
  simulatorFreeDone: boolean
  workshopDone: boolean
}

export interface StoredData {
  version: number
  profile: { name: string }
  settings: Settings
  progress: Record<SkillId, SkillProgress>
  onboardingDone: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  simpleMode: false,
  fontSize: 'normal',
  largeIcons: false,
  fewerOptions: false,
  simpleLanguage: false,
  highContrast: false,
  voiceEnabled: true,
  voiceRate: 'slow',
  voiceInput: 'unknown',
}

/** Ajustes que se aplican al encender el modo sencillo (sección 8 del brief). */
export const SIMPLE_MODE_PRESET: Partial<Settings> = {
  fontSize: 'large',
  largeIcons: true,
  fewerOptions: true,
  simpleLanguage: true,
  highContrast: true,
  voiceRate: 'slow',
}

export function emptyProgress(): Record<SkillId, SkillProgress> {
  return Object.fromEntries(
    SKILL_IDS.map((id) => [id, { simulatorGuidedDone: false, simulatorFreeDone: false, workshopDone: false }]),
  ) as Record<SkillId, SkillProgress>
}

export function defaultData(): StoredData {
  return {
    version: CURRENT_VERSION,
    profile: { name: '' },
    settings: { ...DEFAULT_SETTINGS },
    progress: emptyProgress(),
    onboardingDone: false,
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function pickBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function pickOneOf<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return typeof value === 'string' && (options as readonly string[]).includes(value) ? (value as T) : fallback
}

/**
 * Convierte cualquier dato guardado (de cualquier versión, o dañado) en datos válidos
 * de la versión actual. Los campos que falten o estén mal se reemplazan por los de fábrica.
 */
export function migrate(raw: unknown): StoredData {
  const base = defaultData()
  if (!isObject(raw)) return base

  // Aquí irán los pasos de migración entre versiones, por ejemplo:
  // if (raw.version === 1) raw = migrateV1toV2(raw)

  const profile = isObject(raw.profile) ? raw.profile : {}
  const settings = isObject(raw.settings) ? raw.settings : {}
  const progress = isObject(raw.progress) ? raw.progress : {}

  const d = DEFAULT_SETTINGS
  return {
    version: CURRENT_VERSION,
    profile: { name: typeof profile.name === 'string' ? profile.name.slice(0, 40) : '' },
    settings: {
      simpleMode: pickBoolean(settings.simpleMode, d.simpleMode),
      fontSize: pickOneOf(settings.fontSize, ['normal', 'large', 'xlarge'] as const, d.fontSize),
      largeIcons: pickBoolean(settings.largeIcons, d.largeIcons),
      fewerOptions: pickBoolean(settings.fewerOptions, d.fewerOptions),
      simpleLanguage: pickBoolean(settings.simpleLanguage, d.simpleLanguage),
      highContrast: pickBoolean(settings.highContrast, d.highContrast),
      voiceEnabled: pickBoolean(settings.voiceEnabled, d.voiceEnabled),
      voiceRate: pickOneOf(settings.voiceRate, ['slow', 'normal'] as const, d.voiceRate),
      voiceInput: pickOneOf(settings.voiceInput, ['unknown', 'granted', 'declined'] as const, d.voiceInput),
    },
    progress: Object.fromEntries(
      SKILL_IDS.map((id) => {
        const p = isObject(progress[id]) ? progress[id] : {}
        return [
          id,
          {
            simulatorGuidedDone: pickBoolean(p.simulatorGuidedDone, false),
            simulatorFreeDone: pickBoolean(p.simulatorFreeDone, false),
            workshopDone: pickBoolean(p.workshopDone, false),
          },
        ]
      }),
    ) as Record<SkillId, SkillProgress>,
    onboardingDone: pickBoolean(raw.onboardingDone, false),
  }
}

/** Lee los datos. Si el navegador no permite guardar (modo privado, etc.), usa los de fábrica. */
export function loadData(storage: Storage | undefined = safeStorage()): StoredData {
  if (!storage) return defaultData()
  try {
    const text = storage.getItem(STORAGE_KEY)
    return text ? migrate(JSON.parse(text)) : defaultData()
  } catch {
    return defaultData()
  }
}

export function saveData(data: StoredData, storage: Storage | undefined = safeStorage()): void {
  if (!storage) return
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Sin espacio o sin permiso: la app sigue funcionando, solo que no recuerda.
  }
}

export function clearData(storage: Storage | undefined = safeStorage()): void {
  if (!storage) return
  try {
    storage.removeItem(STORAGE_KEY)
  } catch {
    // Nada que hacer.
  }
}

function safeStorage(): Storage | undefined {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined
  } catch {
    return undefined
  }
}

/** Aplica o quita el modo sencillo y sus ajustes asociados. */
export function withSimpleMode(settings: Settings, on: boolean): Settings {
  if (on) return { ...settings, ...SIMPLE_MODE_PRESET, simpleMode: true }
  return {
    ...settings,
    simpleMode: false,
    fontSize: DEFAULT_SETTINGS.fontSize,
    largeIcons: DEFAULT_SETTINGS.largeIcons,
    fewerOptions: DEFAULT_SETTINGS.fewerOptions,
    simpleLanguage: DEFAULT_SETTINGS.simpleLanguage,
    highContrast: DEFAULT_SETTINGS.highContrast,
  }
}
