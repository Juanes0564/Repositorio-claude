import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CircleCheck, CircleHelp, Info, Lightbulb, RotateCcw, ShieldCheck, Square, X,
} from 'lucide-react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { simulator } from '../content'
import { getFlow } from '../content/flows'
import { highlightId, initialState, simReducer, type SimAction } from '../sim/engine'
import { SimContext, type SimContextValue } from '../sim/SimContext'
import { SimScreenView } from '../sim/SimScreenView'
import type { Flow, SimMode } from '../sim/types'
import { useAppState, useCopy } from '../state/useAppState'
import { useSpeech } from '../state/useSpeech'
import { NotFound } from './NotFound'

/** Pantalla 4: simulador paso a paso. */
export function Simulator() {
  const { platformId, flowId } = useParams()
  const flow = flowId ? getFlow(flowId) : undefined
  if (!flow || flow.platform !== platformId) return <NotFound />
  return <SimulatorRun key={flow.id} flow={flow} />
}

type Confirming = 'exit' | 'restart' | null

function SimulatorRun({ flow }: { flow: Flow }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { data, markSimulatorDone } = useAppState()
  const text = useCopy()
  const speech = useSpeech()

  // El modo Libre solo se abre después de terminar el Guiado una vez.
  const [guidedDoneAtStart] = useState(() => data.progress[flow.skill].simulatorGuidedDone)
  const mode: SimMode = params.get('modo') === 'libre' && guidedDoneAtStart ? 'free' : 'guided'

  const reducer = useCallback((s: ReturnType<typeof initialState>, a: SimAction) => simReducer(flow, s, a), [flow])
  const [state, dispatch] = useReducer(reducer, flow, initialState)
  const [confirming, setConfirming] = useState<Confirming>(null)
  const [nextLocked, setNextLocked] = useState(false)
  const coachRef = useRef<HTMLHeadingElement>(null)
  const firstStep = useRef(true)

  const step = flow.steps[state.index]
  const stepState = state.steps[state.index]
  const total = flow.steps.length
  const highlight = highlightId(flow, state, mode)
  const showHint = mode === 'guided' || stepState.hintShown

  // Al cambiar de paso: arriba, y foco en la instrucción para lectores de pantalla.
  useEffect(() => {
    const main = document.getElementById('main')
    if (main) main.scrollTop = 0
    if (firstStep.current) {
      firstStep.current = false
      return
    }
    coachRef.current?.focus()
  }, [state.index, state.finished])

  // Lleva el elemento resaltado a la vista.
  useEffect(() => {
    if (!highlight) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    document
      .querySelector(`[data-sim-id="${highlight.replace(/"/g, '')}"]`)
      ?.scrollIntoView?.({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
  }, [highlight])

  // Al terminar, se guarda el avance.
  useEffect(() => {
    if (state.finished) markSimulatorDone(flow.skill, mode)
  }, [state.finished, flow.skill, mode, markSimulatorDone])

  const ctx = useMemo<SimContextValue>(
    () => ({
      onTap: (id) => {
        setNextLocked(false)
        dispatch({ type: 'tap', id })
      },
      onKey: (keypadId, key) => dispatch({ type: 'key', keypadId, key }),
      highlight,
      doneId: stepState.done && step.target.kind === 'tap' ? step.target.id : null,
      values: step.target.kind === 'input' ? { [step.target.keypadId]: stepState.value } : {},
      text,
    }),
    [highlight, stepState.done, stepState.value, step, text],
  )

  const exit = () => navigate(`/practicar/${flow.platform}`)

  const help = () => {
    dispatch({ type: 'help' })
    speech.say(`${text(step.coach)} ${text(step.hint)}`)
  }

  const next = () => {
    if (!stepState.done) {
      setNextLocked(true)
      return
    }
    setNextLocked(false)
    dispatch({ type: 'next' })
  }

  const back = () => {
    setNextLocked(false)
    if (state.index === 0) setConfirming('exit')
    else dispatch({ type: 'back' })
  }

  if (state.finished) {
    return (
      <FinishView
        flow={flow}
        showFreeUnlocked={mode === 'guided' && !guidedDoneAtStart}
        onAgain={() => dispatch({ type: 'restart' })}
        onWorkshop={() => navigate(`/talleres?habilidad=${flow.skill}`)}
        onHome={() => navigate('/')}
        headingRef={coachRef}
      />
    )
  }

  const feedbackMessage =
    state.feedback === 'success'
      ? text(step.success ?? simulator.success)
      : state.feedback === 'wrong'
        ? text(step.wrong ?? simulator.wrong)
        : nextLocked
          ? simulator.nextLocked
          : ''

  return (
    <SimContext.Provider value={ctx}>
      <div className="sim-page">
        <header className="sim-top">
          <div className="sim-top__row">
            <button type="button" className="btn btn--ghost" onClick={() => setConfirming('exit')}>
              <X className="icon" aria-hidden="true" />
              <span>{simulator.exit}</span>
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setConfirming('restart')}>
              <RotateCcw className="icon" aria-hidden="true" />
              <span>{simulator.restart}</span>
            </button>
          </div>
          <div className="sim-top__title">
            <h1 className="sim-title">{text(flow.title)}</h1>
            <span className="sim-mode">{mode === 'guided' ? simulator.modeGuided : simulator.modeFree}</span>
          </div>
          <div
            className="sim-progress"
            role="progressbar"
            aria-label={simulator.stepOf(state.index + 1, total)}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={state.index + 1}
          >
            <span style={{ width: `${((state.index + 1) / total) * 100}%` }} />
          </div>
        </header>

        <section className="coach" aria-labelledby="coach-text">
          <div className="coach__head">
            <p className="coach__step">{simulator.stepOf(state.index + 1, total)}</p>
            <button type="button" className="btn btn--secondary coach__help" onClick={help}>
              <CircleHelp className="icon" aria-hidden="true" />
              <span>{simulator.help}</span>
            </button>
          </div>
          <h2 id="coach-text" ref={coachRef} tabIndex={-1} className="coach__text">
            {text(step.coach)}
          </h2>
          {showHint && (
            <p className="coach__hint">
              <Lightbulb className="icon" aria-hidden="true" />
              <span>
                <strong>{simulator.hintLabel}:</strong> {text(step.hint)}
              </span>
            </p>
          )}
          {speech.speaking && (
            <button type="button" className="btn btn--secondary" onClick={speech.stop}>
              <Square className="icon" aria-hidden="true" />
              <span>{simulator.stopVoice}</span>
            </button>
          )}
        </section>

        <SimScreenView screen={step.screen} platform={flow.platform} />

        <footer className="sim-bottom">
          <p
            className={`feedback ${state.feedback === 'success' ? 'feedback--success' : feedbackMessage ? 'feedback--info' : ''}`}
            role="status"
            aria-live="polite"
          >
            {feedbackMessage && (
              <>
                {state.feedback === 'success' ? (
                  <CircleCheck className="icon" aria-hidden="true" />
                ) : (
                  <Info className="icon" aria-hidden="true" />
                )}
                <span>
                  {feedbackMessage}
                  {highlight && state.feedback === 'wrong' && ` ${simulator.highlighted}`}
                </span>
              </>
            )}
          </p>
          <div className="sim-bottom__buttons">
            <button type="button" className="btn btn--secondary" onClick={back}>
              <ArrowLeft className="icon" aria-hidden="true" />
              <span>{simulator.back}</span>
            </button>
            <button
              type="button"
              className={`btn btn--primary ${stepState.done ? '' : 'is-waiting'}`}
              aria-disabled={!stepState.done}
              onClick={next}
            >
              <span>{state.index === total - 1 ? simulator.finish : simulator.next}</span>
              <ArrowRight className="icon" aria-hidden="true" />
            </button>
          </div>
        </footer>

        {confirming === 'exit' && (
          <ConfirmDialog
            title={simulator.exitConfirm.title}
            body={simulator.exitConfirm.body}
            confirmLabel={simulator.exitConfirm.yes}
            cancelLabel={simulator.exitConfirm.no}
            onConfirm={exit}
            onCancel={() => setConfirming(null)}
          />
        )}
        {confirming === 'restart' && (
          <ConfirmDialog
            title={simulator.restartConfirm.title}
            body={simulator.restartConfirm.body}
            confirmLabel={simulator.restartConfirm.yes}
            cancelLabel={simulator.restartConfirm.no}
            onConfirm={() => {
              setConfirming(null)
              dispatch({ type: 'restart' })
            }}
            onCancel={() => setConfirming(null)}
          />
        )}
      </div>
    </SimContext.Provider>
  )
}

function FinishView({
  flow,
  showFreeUnlocked,
  onAgain,
  onWorkshop,
  onHome,
  headingRef,
}: {
  flow: Flow
  showFreeUnlocked: boolean
  onAgain: () => void
  onWorkshop: () => void
  onHome: () => void
  headingRef: React.RefObject<HTMLHeadingElement | null>
}) {
  const text = useCopy()
  const d = simulator.done
  return (
    <div className="page finish">
      <div className="finish__hero">
        <CircleCheck className="finish__icon" aria-hidden="true" />
        <h1 ref={headingRef} tabIndex={-1}>
          {d.title}
        </h1>
        <p>{d.body}</p>
        {showFreeUnlocked && <p className="finish__unlocked">{d.freeUnlocked}</p>}
      </div>
      <section className="panel" aria-labelledby="learned">
        <h2 id="learned">{d.learnedTitle}</h2>
        <ul className="checklist">
          {flow.finish.learned.map((item, i) => (
            <li key={i}>
              <CircleCheck className="icon" aria-hidden="true" />
              <span>{text(item)}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="panel panel--tip" aria-labelledby="tip">
        <h2 id="tip">
          <ShieldCheck className="icon icon--inline" aria-hidden="true" /> {d.tipTitle}
        </h2>
        <p>{text(flow.finish.tip)}</p>
      </section>
      <p className="muted">{d.passport}</p>
      <div className="stack stack--tight">
        <button type="button" className="btn btn--primary btn--block btn--xl" onClick={onAgain}>
          <RotateCcw className="icon" aria-hidden="true" />
          <span>{d.again}</span>
        </button>
        <button type="button" className="btn btn--secondary btn--block" onClick={onWorkshop}>
          {d.workshop}
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={onHome}>
          {d.home}
        </button>
      </div>
    </div>
  )
}
