import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mic, MicOff } from 'lucide-react'
import { Logo } from '../components/Logo'
import { VoiceConsentDialog } from '../components/VoiceConsentDialog'
import { WelcomeIllustration } from '../components/WelcomeIllustration'
import { common, voice, welcome } from '../content'
import { extractName } from '../lib/extractName'
import { useAppState, useCopy } from '../state/useAppState'
import { useVoiceInput } from '../state/useVoiceInput'

type Step = 'intro' | 'name' | 'simple'

/** Pantalla 1: bienvenida. La primera vez pide el nombre (opcional) y si quiere el modo sencillo. */
export function Welcome() {
  const { data, setName, setSimpleMode, completeOnboarding } = useAppState()
  const navigate = useNavigate()
  const text = useCopy()
  const [step, setStep] = useState<Step>('intro')
  const [name, setNameDraft] = useState(data.profile.name)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const mic = useVoiceInput((spoken) => setNameDraft(extractName(spoken)))

  useEffect(() => {
    if (step !== 'intro') headingRef.current?.focus()
  }, [step])

  const finish = (simple: boolean) => {
    setSimpleMode(simple)
    completeOnboarding()
    navigate('/', { replace: true })
  }

  const submitName = (e: FormEvent) => {
    e.preventDefault()
    setName(name)
    setStep('simple')
  }

  if (step === 'intro') {
    return (
      <div className="welcome">
        <div className="welcome__brand">
          <Logo size={112} />
          <h1 className="welcome__title">{common.appName}</h1>
          <p className="welcome__tagline">{common.tagline}</p>
        </div>
        <div className="welcome__art">
          <WelcomeIllustration />
        </div>
        <p className="welcome__intro">{text(welcome.intro)}</p>
        <button type="button" className="btn btn--primary btn--block btn--xl" onClick={() => setStep('name')}>
          <span>{welcome.start}</span>
          <ArrowRight className="icon" aria-hidden="true" />
        </button>
      </div>
    )
  }

  const total = 2
  const current = step === 'name' ? 1 : 2

  return (
    <div className="welcome welcome--step">
      <div className="welcome__top">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setStep(step === 'name' ? 'intro' : 'name')}
        >
          <ArrowLeft className="icon" aria-hidden="true" />
          <span>{common.back}</span>
        </button>
        <p className="step-count">{welcome.stepOf(current, total)}</p>
      </div>

      {step === 'name' ? (
        <form className="stack" onSubmit={submitName}>
          <h1 ref={headingRef} tabIndex={-1}>
            {welcome.nameStep.title}
          </h1>
          <p>{welcome.nameStep.body}</p>
          <div className="field">
            <label htmlFor="welcome-name">{welcome.nameStep.label}</label>
            <input
              id="welcome-name"
              type="text"
              autoComplete="given-name"
              autoCapitalize="words"
              maxLength={40}
              placeholder={welcome.nameStep.placeholder}
              value={name}
              onChange={(e) => setNameDraft(e.target.value)}
            />
            <p className="field__help">{welcome.nameStep.privacy}</p>
          </div>
          {mic.available &&
            (mic.status === 'listening' ? (
              <button type="button" className="btn btn--secondary btn--block" onClick={mic.stop}>
                <MicOff className="icon" aria-hidden="true" />
                <span>{voice.stopListening}</span>
              </button>
            ) : (
              <button type="button" className="btn btn--secondary btn--block" onClick={mic.start}>
                <Mic className="icon" aria-hidden="true" />
                <span>{voice.sayName}</span>
              </button>
            ))}
          {mic.status === 'listening' && (
            <p className="field__help" role="status">
              {voice.listening} {mic.interim}
            </p>
          )}
          {mic.error && (
            <p className="field__help" role="alert">
              {voice.errors[mic.error]}
            </p>
          )}
          <button type="submit" className="btn btn--primary btn--block btn--xl">
            <span>{common.continue}</span>
            <ArrowRight className="icon" aria-hidden="true" />
          </button>
        </form>
      ) : (
        <div className="stack">
          <h1 ref={headingRef} tabIndex={-1}>
            {welcome.simpleStep.title}
          </h1>
          <p>{welcome.simpleStep.body}</p>
          <p className="muted">{welcome.simpleStep.note}</p>
          <div className="stack stack--tight">
            <button type="button" className="btn btn--primary btn--block btn--xl" onClick={() => finish(true)}>
              {welcome.simpleStep.yes}
            </button>
            <button type="button" className="btn btn--secondary btn--block btn--xl" onClick={() => finish(false)}>
              {welcome.simpleStep.no}
            </button>
          </div>
        </div>
      )}
      {mic.status === 'consent' && <VoiceConsentDialog onAccept={mic.accept} onDecline={mic.decline} />}
    </div>
  )
}
