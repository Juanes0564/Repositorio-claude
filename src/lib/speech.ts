/**
 * Voz de salida con `speechSynthesis` del navegador (sin servicios externos).
 * Elige voz en este orden: es-CO, es-419, es-MX, es-US, cualquier español.
 */

export const VOICE_ORDER = ['es-CO', 'es-419', 'es-MX', 'es-US'] as const
/** Velocidades: lenta (por defecto, 0,9), normal, lenta del modo sencillo (0,8) y "Más despacio" (0,75). */
export const RATES = { slower: 0.75, simple: 0.8, slow: 0.9, normal: 1 } as const

type Listener = (speaking: boolean) => void
const listeners = new Set<Listener>()
let speaking = false

function setSpeaking(value: boolean) {
  speaking = value
  listeners.forEach((l) => l(value))
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

export function pickVoice(voices: Pick<SpeechSynthesisVoice, 'lang'>[]): number {
  const norm = (lang: string) => lang.replace('_', '-').toLowerCase()
  for (const wanted of VOICE_ORDER) {
    const i = voices.findIndex((v) => norm(v.lang) === wanted.toLowerCase())
    if (i >= 0) return i
  }
  return voices.findIndex((v) => norm(v.lang).startsWith('es'))
}

/** Divide un texto en frases para evitar cortes en textos largos. */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?¡¿:;])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

let cachedVoice: SpeechSynthesisVoice | null = null

function currentVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice
  const voices = window.speechSynthesis.getVoices()
  const i = pickVoice(voices)
  cachedVoice = i >= 0 ? voices[i] : null
  return cachedVoice
}

if (isSpeechSupported()) {
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    cachedVoice = null
  })
}

export function speak(text: string, rate: number = RATES.slow): void {
  if (!isSpeechSupported()) return
  const synth = window.speechSynthesis
  synth.cancel()
  const parts = splitSentences(text)
  if (parts.length === 0) return
  const voice = currentVoice()
  parts.forEach((part, i) => {
    const u = new SpeechSynthesisUtterance(part)
    u.lang = voice?.lang ?? 'es-CO'
    if (voice) u.voice = voice
    u.rate = rate
    if (i === 0) u.onstart = () => setSpeaking(true)
    if (i === parts.length - 1) {
      u.onend = () => setSpeaking(false)
      u.onerror = () => setSpeaking(false)
    }
    synth.speak(u)
  })
  setSpeaking(true)
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
  setSpeaking(false)
}

export function subscribeSpeaking(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function isSpeaking(): boolean {
  return speaking
}
