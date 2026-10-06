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
  // En modo sencillo, la voz lenta es aún más lenta.
  const rate = data.settings.simpleMode && data.settings.voiceRate === 'slow' ? RATES.simple : RATES[data.settings.voiceRate]
  const say = useCallback(
    (text: string, opts?: { slower?: boolean }) => {
      if (enabled) speak(text, opts?.slower ? RATES.slower : rate)
    },
    [enabled, rate],
  )

  return { enabled, supported: isSpeechSupported(), speaking, say, stop: stopSpeaking }
}
