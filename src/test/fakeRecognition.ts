/** Reconocimiento de voz falso para las pruebas (no usa micrófono ni internet). */
export class FakeRecognition {
  static last: FakeRecognition | null = null
  static local = false
  static available = async () => (FakeRecognition.local ? 'available' : 'unavailable')
  lang = ''
  interimResults = false
  continuous = false
  maxAlternatives = 1
  processLocally?: boolean
  started = false
  onresult: ((e: unknown) => void) | null = null
  onerror: ((e: { error: string }) => void) | null = null
  onend: (() => void) | null = null
  private results: { isFinal: boolean; 0: { transcript: string }; length: number }[] = []

  constructor() {
    FakeRecognition.last = this
  }
  start() {
    this.started = true
  }
  stop() {
    this.end()
  }
  abort() {
    this.end()
  }
  emit(transcript: string, isFinal: boolean) {
    this.results = [{ isFinal, 0: { transcript }, length: 1 }]
    this.onresult?.({ resultIndex: 0, results: this.results })
  }
  fail(error: string) {
    this.onerror?.({ error })
  }
  end() {
    if (!this.started) return
    this.started = false
    this.onend?.()
  }
}

export function installFakeRecognition({ local = false } = {}) {
  FakeRecognition.local = local
  FakeRecognition.last = null
  ;(window as unknown as Record<string, unknown>).webkitSpeechRecognition = FakeRecognition
}

export function removeFakeRecognition() {
  delete (window as unknown as Record<string, unknown>).webkitSpeechRecognition
  FakeRecognition.last = null
}
