import { useCallback, useEffect, useRef, useState } from 'react'
import { isRecognitionSupported, listenOnce, type ListenError } from '../lib/recognition'
import { stopSpeaking } from '../lib/speech'
import { useAppState } from './useAppState'

export type VoiceStatus = 'idle' | 'consent' | 'listening'

/**
 * Escuchar una frase con el micrófono.
 * - Si el navegador no lo permite, `available` es false y la app usa solo botones y texto.
 * - Antes del primer uso pide permiso con el aviso de privacidad (status 'consent').
 */
export function useVoiceInput(onResult: (text: string) => void) {
  const { data, updateSettings } = useAppState()
  const supported = isRecognitionSupported()
  const consent = data.settings.voiceInput
  const [status, setStatus] = useState<VoiceStatus>('idle')
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<ListenError | null>(null)
  const stopRef = useRef<(() => void) | null>(null)
  const onResultRef = useRef(onResult)
  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])
  useEffect(() => () => stopRef.current?.(), [])

  const begin = useCallback(async () => {
    stopSpeaking()
    setError(null)
    setInterim('')
    setStatus('listening')
    stopRef.current = await listenOnce({
      onInterim: setInterim,
      onFinal: (text) => onResultRef.current(text),
      onError: setError,
      onEnd: () => {
        stopRef.current = null
        setStatus('idle')
      },
    })
  }, [])

  /** Tocar "Toca para hablar". */
  const start = useCallback(() => {
    if (!supported) return
    if (consent === 'granted') void begin()
    else setStatus('consent')
  }, [supported, consent, begin])

  const stop = useCallback(() => stopRef.current?.(), [])

  /** "Usar voz" en el aviso de privacidad. */
  const accept = useCallback(() => {
    updateSettings({ voiceInput: 'granted' })
    void begin()
  }, [updateSettings, begin])

  /** "Prefiero botones" en el aviso de privacidad. */
  const decline = useCallback(() => {
    updateSettings({ voiceInput: 'declined' })
    setStatus('idle')
  }, [updateSettings])

  const clearError = useCallback(() => setError(null), [])

  return {
    /** El micrófono se puede ofrecer (el navegador lo permite y la persona no eligió botones). */
    available: supported && consent !== 'declined',
    supported,
    status,
    interim,
    error,
    start,
    stop,
    accept,
    decline,
    clearError,
  }
}
