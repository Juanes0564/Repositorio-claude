import { useCallback, useEffect, useState } from 'react'
import { RATES, isSpeaking, isSpeechSupported, speak, stopSpeaking, subscribeSpeaking } from '../lib/speech'
import { useAppState } from './useAppState'

/** Leer en voz alta respetando los ajustes (voz activada y velocidad). */
export function useSpeech() {
  const { data } = useAppState()
  const [speaking, setSpeaking] = useState(isSpeaking)
  useEffect(() => subscribeSpeaking(setSpeaking), [])
  useEffect(() => () => stopSpeaking(), [])

  const enabled = data.settings.voiceEnabled && isSpeechSupported()
  const rate = RATES[data.settings.voiceRate]
  const say = useCallback((text: string) => enabled && speak(text, rate), [enabled, rate])

  return { enabled, speaking, say, stop: stopSpeaking }
}
