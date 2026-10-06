/**
 * Voz de entrada con el reconocimiento del navegador (Web Speech API).
 * OJO (privacidad): en Chrome el audio se envía al proveedor del navegador para entenderlo,
 * salvo que el navegador ofrezca procesarlo en el propio celular (processLocally).
 * Por eso siempre se muestra un aviso antes del primer uso y existe la alternativa con botones.
 */

export type ListenError = 'blocked' | 'noSpeech' | 'offline' | 'noMic' | 'other'

interface RecognitionAlternative { transcript: string }
interface RecognitionResult { isFinal: boolean; 0: RecognitionAlternative; length: number }
interface RecognitionEvent { resultIndex: number; results: { length: number; [i: number]: RecognitionResult } }
interface RecognitionErrorEvent { error: string }

export interface Recognition {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  processLocally?: boolean
  onresult: ((e: RecognitionEvent) => void) | null
  onerror: ((e: RecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

interface RecognitionConstructor {
  new (): Recognition
  available?: (opts: { langs: string[]; processLocally: boolean }) => Promise<string>
}

function getConstructor(): RecognitionConstructor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function isRecognitionSupported(): boolean {
  return Boolean(getConstructor())
}

/** Traduce los errores del navegador a los casos que la app explica con palabras sencillas. */
export function mapRecognitionError(code: string): ListenError {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'blocked'
    case 'no-speech':
      return 'noSpeech'
    case 'network':
      return 'offline'
    case 'audio-capture':
      return 'noMic'
    default:
      return 'other'
  }
}

export interface ListenHandlers {
  onInterim: (text: string) => void
  onFinal: (text: string) => void
  onError: (error: ListenError) => void
  onEnd: () => void
}

/**
 * Procesar la voz en el propio celular (sin enviarla) — `processLocally`.
 * APAGADO a propósito: al probarlo (octubre de 2026), en Chromium la sola consulta
 * `SpeechRecognition.available({ processLocally: true })` y también `processLocally = true`
 * cerraron la pestaña de golpe cuando el modelo local no está instalado. No vale la pena el riesgo
 * con personas mayores. Cuando sea estable, cambiar a true y probar en un Android real.
 * Mientras tanto se usa el reconocimiento estándar, siempre con el aviso de privacidad previo.
 */
export const TRY_LOCAL_PROCESSING = false

/** Si el navegador puede entender la voz en el propio celular (sin enviarla), lo usa. */
async function canProcessLocallyChecked(Ctor: RecognitionConstructor, lang: string): Promise<boolean> {
  try {
    if (typeof Ctor.available !== 'function') return false
    return (await Ctor.available({ langs: [lang], processLocally: true })) === 'available'
  } catch {
    return false
  }
}

/** Empieza a escuchar una sola frase. Devuelve una función para detener. */
export async function listenOnce(
  handlers: ListenHandlers,
  lang = 'es-CO',
  tryLocal = TRY_LOCAL_PROCESSING,
): Promise<() => void> {
  const Ctor = getConstructor()
  if (!Ctor) {
    handlers.onError('other')
    handlers.onEnd()
    return () => {}
  }
  const local = tryLocal && (await canProcessLocallyChecked(Ctor, lang))
  if (!local && typeof navigator !== 'undefined' && navigator.onLine === false) {
    handlers.onError('offline')
    handlers.onEnd()
    return () => {}
  }

  const rec = new Ctor()
  rec.lang = lang
  rec.interimResults = true
  rec.continuous = false
  rec.maxAlternatives = 1
  if (local) rec.processLocally = true

  let finalText = ''
  let failed = false
  rec.onresult = (e) => {
    let interim = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i]
      if (r.isFinal) finalText += r[0].transcript
      else interim += r[0].transcript
    }
    handlers.onInterim((finalText + interim).trim())
  }
  rec.onerror = (e) => {
    if (e.error === 'aborted') return
    failed = true
    handlers.onError(mapRecognitionError(e.error))
  }
  rec.onend = () => {
    const text = finalText.trim()
    if (text) handlers.onFinal(text)
    else if (!failed) handlers.onError('noSpeech')
    handlers.onEnd()
  }
  try {
    rec.start()
  } catch {
    handlers.onError('other')
    handlers.onEnd()
  }
  return () => rec.stop()
}
