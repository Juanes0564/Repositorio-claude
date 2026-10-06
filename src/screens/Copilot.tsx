import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Check, CircleHelp, Dumbbell, LogOut, Mic, MicOff, Repeat, Send, ShieldAlert, Snail, Square, X,
} from 'lucide-react'
import { CopilotAvatar } from '../components/CopilotAvatar'
import { TopBar } from '../components/TopBar'
import { VoiceConsentDialog } from '../components/VoiceConsentDialog'
import { copilot, getGuide, getIntent, messageHelp, voice, type Copy, type IntentId } from '../content'
import { detectIntent } from '../copilot/intentEngine'
import type { SkillId } from '../lib/storage'
import { useAppState, useCopy } from '../state/useAppState'
import { useSpeech } from '../state/useSpeech'
import { useVoiceInput } from '../state/useVoiceInput'

type View =
  | { kind: 'home' }
  | { kind: 'confirm'; intent: IntentId }
  | { kind: 'choices'; options: IntentId[] }
  | { kind: 'notUnderstood' }
  | { kind: 'guide'; skill: SkillId; step: number; explain: boolean; finished: boolean }
  | { kind: 'message'; answer: string | null }

interface CopilotState {
  view: View
  /** Lo que dice el copiloto (se muestra y se lee en voz alta). */
  bubble: string
  /** Lo que dijo o escribió la persona. */
  heard: string | null
}

/** Órdenes que se cumplen sin preguntar (preguntar "¿Quieres que repita?" no ayuda). */
const DIRECT: IntentId[] = ['repeat', 'slower', 'back', 'home']

/** Convierte lo dicho en la siguiente pantalla del copiloto, según la confianza (sección 6 del brief). */
function analyze(text: string, t: (c: Copy) => string): CopilotState {
  const r = detectIntent(text)
  if (r.confidence === 'high' && r.best) return { view: { kind: 'confirm', intent: r.best }, bubble: getIntent(r.best).confirm, heard: text }
  if (r.confidence === 'medium') {
    const options = r.candidates.length >= 2 ? r.candidates : [...r.candidates, ...copilot.fallbackIntents.filter((i) => !r.candidates.includes(i)).slice(0, 2)]
    return { view: { kind: 'choices', options }, bubble: copilot.choose, heard: text }
  }
  return { view: { kind: 'notUnderstood' }, bubble: t(copilot.notUnderstood), heard: text }
}

/** Pantalla 5: copiloto de voz. Funciona igual con micrófono, con texto o solo con botones. */
export function Copilot() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { updateSettings } = useAppState()
  const text = useCopy()
  const speech = useSpeech()
  const initialQuery = params.get('q')
  const greetingAgain = text(copilot.greetingAgain)
  const initialGuide = params.get('guia')
  const [state, setState] = useState<CopilotState>(() => {
    // Desde el inicio sencillo (pantalla 8) se abre directo la guía de esa tarea.
    const guide = initialGuide ? getGuide(initialGuide as SkillId) : undefined
    if (guide) return { view: { kind: 'guide', skill: guide.skill, step: 0, explain: false, finished: false }, bubble: text(guide.intro), heard: null }
    return initialQuery ? analyze(initialQuery, text) : { view: { kind: 'home' }, bubble: text(copilot.greeting), heard: null }
  })
  const [typed, setTyped] = useState('')
  const { view, bubble, heard } = state
  const bubbleRef = useRef(bubble)
  useEffect(() => {
    bubbleRef.current = bubble
  }, [bubble])

  /** Cambia de pantalla y lo dice en voz alta. */
  const show = useCallback(
    (next: CopilotState, opts?: { slower?: boolean }) => {
      setState(next)
      speech.say(next.bubble, opts)
    },
    [speech],
  )

  const run = useCallback(
    (intent: IntentId, heardText: string | null = null) => {
      const def = getIntent(intent)
      if (def.guide) {
        const guide = getGuide(def.guide)!
        const first = text(guide.steps[0].text)
        setState({ view: { kind: 'guide', skill: def.guide, step: 0, explain: false, finished: false }, bubble: text(guide.intro), heard: heardText })
        speech.say(`${text(guide.intro)} ${first}`)
        return
      }
      switch (intent) {
        case 'scam':
        case 'message':
          show({ view: { kind: 'message', answer: null }, bubble: messageHelp.question, heard: heardText })
          return
        case 'humanHelp':
          navigate('/ayuda')
          return
        case 'practice':
          navigate('/practicar')
          return
        case 'simpleMode':
          navigate('/modo-sencillo')
          return
        case 'progress':
          navigate('/avances')
          return
        case 'home':
          navigate('/')
          return
        case 'repeat':
          speech.say(bubbleRef.current)
          return
        case 'slower':
          updateSettings({ voiceRate: 'slow' })
          setState((s) => ({ ...s, bubble: copilot.slowerDone, heard: heardText ?? s.heard }))
          speech.say(`${copilot.slowerDone} ${bubbleRef.current === copilot.slowerDone ? '' : bubbleRef.current}`, { slower: true })
          return
        case 'back':
          show({ view: { kind: 'home' }, bubble: greetingAgain, heard: null })
          return
        default:
          return
      }
    },
    [navigate, show, speech, text, updateSettings, greetingAgain],
  )

  const handleText = useCallback(
    (input: string) => {
      const clean = input.trim()
      if (!clean) return
      const r = detectIntent(clean)
      if (r.confidence === 'high' && r.best && DIRECT.includes(r.best)) {
        run(r.best, clean)
        return
      }
      show(analyze(clean, text))
    },
    [run, show, text],
  )

  const mic = useVoiceInput(handleText)

  // Si llegó desde el buscador del menú, lee la respuesta. Si tocó "Hablar", empieza a escuchar.
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    if (initialQuery) speech.say(bubbleRef.current)
    if (params.get('voz') === '1' && mic.available) mic.start()
  }, [initialQuery, params, mic, speech])

  const submitTyped = (e: FormEvent) => {
    e.preventDefault()
    handleText(typed)
    setTyped('')
  }

  const showInput = view.kind === 'home' || view.kind === 'notUnderstood' || view.kind === 'choices'

  return (
    <div className="copilot">
      <TopBar title={copilot.title} backTo="/" />

      <section className={view.kind === 'guide' ? 'copilot__talk copilot__talk--small' : 'copilot__talk'} aria-label={copilot.avatarLabel}>
        <CopilotAvatar speaking={speech.speaking} />
        {heard && view.kind !== 'guide' && (
          <p className="copilot__heard">
            <span className="copilot__heard-label">{copilot.you}</span> “{heard}”
          </p>
        )}
        {view.kind !== 'guide' && (
          <p className="copilot__bubble" aria-live="polite">
            {bubble}
          </p>
        )}
        {speech.speaking && (
          <button type="button" className="btn btn--secondary" onClick={speech.stop}>
            <Square className="icon" aria-hidden="true" />
            <span>{voice.stopVoice}</span>
          </button>
        )}
      </section>

      {showInput && (
        <div className="copilot__voice">
          {mic.status === 'listening' ? (
            <div className="copilot__listening" role="status">
              <p className="copilot__listening-label">
                <Mic className="icon" aria-hidden="true" /> {voice.listening}
              </p>
              <p className="copilot__interim">{mic.interim}</p>
              <button type="button" className="btn btn--secondary btn--block" onClick={mic.stop}>
                <MicOff className="icon" aria-hidden="true" />
                <span>{voice.stopListening}</span>
              </button>
            </div>
          ) : (
            mic.available && (
              <button type="button" className="btn btn--talk btn--block" onClick={mic.start}>
                <Mic className="icon" aria-hidden="true" />
                <span>{voice.talk}</span>
              </button>
            )
          )}
          {mic.error && (
            <div className="copilot__error" role="alert">
              <p>{voice.errors[mic.error]}</p>
              {mic.error !== 'blocked' && mic.error !== 'noMic' && (
                <button type="button" className="btn btn--secondary" onClick={mic.start}>
                  {voice.tryAgain}
                </button>
              )}
            </div>
          )}
          {!mic.available && <p className="copilot__note">{copilot.noMicNote}</p>}
        </div>
      )}

      {view.kind === 'home' && (
        <ul className="copilot__options" aria-label={copilot.suggestionsLabel}>
          {copilot.suggestions.map((s) => (
            <li key={s.label}>
              <button type="button" className="btn btn--option btn--block" onClick={() => run(s.intent, s.label)}>
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {view.kind === 'confirm' && (
        <div className="copilot__options">
          <button type="button" className="btn btn--primary btn--block btn--xl" onClick={() => run(view.intent, heard)}>
            <Check className="icon" aria-hidden="true" />
            <span>{copilot.yes}</span>
          </button>
          <button
            type="button"
            className="btn btn--option btn--block"
            onClick={() => show({ view: { kind: 'home' }, bubble: greetingAgain, heard: null })}
          >
            <X className="icon" aria-hidden="true" />
            <span>{copilot.noOther}</span>
          </button>
        </div>
      )}

      {(view.kind === 'choices' || view.kind === 'notUnderstood') && (
        <ul className="copilot__options">
          {(view.kind === 'choices' ? view.options : copilot.fallbackIntents).map((id) => (
            <li key={id}>
              <button type="button" className="btn btn--option btn--block" onClick={() => run(id, heard)}>
                {getIntent(id).label}
              </button>
            </li>
          ))}
          {view.kind === 'choices' && (
            <li>
              <button
                type="button"
                className="btn btn--ghost btn--block"
                onClick={() => show({ view: { kind: 'notUnderstood' }, bubble: text(copilot.notUnderstood), heard })}
              >
                {copilot.noneOfThese}
              </button>
            </li>
          )}
        </ul>
      )}

      {view.kind === 'guide' && (
        <GuideView
          state={view}
          onChange={(next) => setState((s) => ({ ...s, view: next }))}
          onExit={() => show({ view: { kind: 'home' }, bubble: greetingAgain, heard: null })}
        />
      )}

      {view.kind === 'message' && (
        <MessageView
          answer={view.answer}
          onAnswer={(answer) => {
            setState((s) => ({ ...s, view: { kind: 'message', answer } }))
            speech.say(answer ? `${answer} ${messageHelp.remember}` : messageHelp.question)
          }}
          onDone={() => show({ view: { kind: 'home' }, bubble: greetingAgain, heard: null })}
        />
      )}

      {showInput && (
        <div className="copilot__inputs">
          <form className="copilot__type" onSubmit={submitTyped}>
            <label htmlFor="copilot-text">{copilot.typeLabel}</label>
            <div className="copilot__type-row">
              <input
                id="copilot-text"
                type="text"
                enterKeyHint="send"
                placeholder={copilot.typePlaceholder}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
              />
              <button type="submit" className="btn btn--secondary">
                <Send className="icon" aria-hidden="true" />
                <span>{copilot.send}</span>
              </button>
            </div>
          </form>
          {speech.supported && !speech.enabled && <p className="copilot__note">{copilot.voiceOff}</p>}
        </div>
      )}

      {mic.status === 'consent' && <VoiceConsentDialog onAccept={mic.accept} onDecline={mic.decline} />}
    </div>
  )
}

/** Guía "para hacerlo en la vida real": un paso a la vez, la persona confirma cada uno. */
function GuideView({
  state,
  onChange,
  onExit,
}: {
  state: Extract<View, { kind: 'guide' }>
  onChange: (next: Extract<View, { kind: 'guide' }>) => void
  onExit: () => void
}) {
  const navigate = useNavigate()
  const { updateSettings } = useAppState()
  const text = useCopy()
  const speech = useSpeech()
  const guide = getGuide(state.skill)!
  const g = copilot.guide
  const total = guide.steps.length
  const step = guide.steps[state.step]
  const headingRef = useRef<HTMLHeadingElement>(null)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    headingRef.current?.focus()
  }, [state.step, state.finished])

  if (state.finished) {
    return (
      <section className="guide panel" aria-labelledby="guide-done">
        <h2 id="guide-done" ref={headingRef} tabIndex={-1}>
          {g.finished}
        </h2>
        <p>{g.finishedMore}</p>
        <button type="button" className="btn btn--primary btn--block" onClick={onExit}>
          {g.backToCopilot}
        </button>
        <button type="button" className="btn btn--option btn--block" onClick={() => navigate(guide.practicePath)}>
          <Dumbbell className="icon" aria-hidden="true" />
          <span>{g.practice}</span>
        </button>
      </section>
    )
  }

  const go = (index: number) => {
    onChange({ ...state, step: index, explain: false })
    speech.say(text(guide.steps[index].text))
  }

  return (
    <section className="guide" aria-labelledby="guide-step">
      <p className="guide__title">{guide.title}</p>
      <p className="coach__step">{g.stepOf(state.step + 1, total)}</p>
      <h2 id="guide-step" ref={headingRef} tabIndex={-1} className="guide__text" aria-live="polite">
        {text(step.text)}
      </h2>
      {state.explain && (
        <div className="guide__explain" aria-live="polite">
          <p className="guide__explain-title">
            <CircleHelp className="icon icon--inline" aria-hidden="true" /> {g.explainTitle}
          </p>
          <p>{text(step.detail)}</p>
          <p className="muted-on-dark">{g.explainExtra}</p>
        </div>
      )}
      <button
        type="button"
        className="btn btn--primary btn--block btn--xl"
        onClick={() => {
          if (state.step === total - 1) {
            onChange({ ...state, finished: true })
            speech.say(`${g.finished} ${g.finishedMore}`)
          } else go(state.step + 1)
        }}
      >
        <Check className="icon" aria-hidden="true" />
        <span>{g.done}</span>
      </button>
      <div className="guide__grid">
        <button type="button" className="btn btn--option" onClick={() => speech.say(text(step.text))}>
          <Repeat className="icon" aria-hidden="true" />
          <span>{g.repeat}</span>
        </button>
        <button
          type="button"
          className="btn btn--option"
          onClick={() => {
            updateSettings({ voiceRate: 'slow' })
            speech.say(text(step.text), { slower: true })
          }}
        >
          <Snail className="icon" aria-hidden="true" />
          <span>{g.slower}</span>
        </button>
        <button
          type="button"
          className="btn btn--option"
          onClick={() => {
            onChange({ ...state, explain: true })
            speech.say(text(step.detail))
          }}
        >
          <CircleHelp className="icon" aria-hidden="true" />
          <span>{g.notUnderstand}</span>
        </button>
        <button type="button" className="btn btn--option" onClick={() => navigate(guide.practicePath)}>
          <Dumbbell className="icon" aria-hidden="true" />
          <span>{g.practice}</span>
        </button>
      </div>
      <div className="guide__nav">
        {state.step > 0 && (
          <button type="button" className="btn btn--ghost" onClick={() => go(state.step - 1)}>
            <ArrowLeft className="icon" aria-hidden="true" />
            <span>{g.previous}</span>
          </button>
        )}
        <button type="button" className="btn btn--ghost" onClick={onExit}>
          <LogOut className="icon" aria-hidden="true" />
          <span>{g.exit}</span>
        </button>
      </div>
      <p className="copilot__note">{g.reminder}</p>
    </section>
  )
}

/** Rama "No entiendo un mensaje": pregunta qué pide el mensaje y orienta con seguridad. */
function MessageView({
  answer,
  onAnswer,
  onDone,
}: {
  answer: string | null
  onAnswer: (answer: string | null) => void
  onDone: () => void
}) {
  const navigate = useNavigate()
  if (answer) {
    return (
      <section className="guide panel panel--alert" aria-live="polite">
        <p className="guide__explain-title">
          <ShieldAlert className="icon icon--inline" aria-hidden="true" /> {copilot.title}
        </p>
        <p className="guide__answer">{answer}</p>
        <p>
          <strong>{messageHelp.remember}</strong>
        </p>
        <button type="button" className="btn btn--primary btn--block" onClick={() => onAnswer(null)}>
          {messageHelp.otherQuestion}
        </button>
        <button type="button" className="btn btn--option btn--block" onClick={() => navigate('/practicar/chat/scams-check')}>
          <Dumbbell className="icon" aria-hidden="true" />
          <span>{copilot.message.practice}</span>
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={onDone}>
          {copilot.guide.backToCopilot}
        </button>
      </section>
    )
  }
  return (
    <ul className="copilot__options">
      {messageHelp.options.map((o) => (
        <li key={o.id}>
          <button type="button" className="btn btn--option btn--block" onClick={() => onAnswer(o.answer)}>
            {o.label}
          </button>
        </li>
      ))}
    </ul>
  )
}
