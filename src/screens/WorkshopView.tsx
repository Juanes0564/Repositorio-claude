import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CircleCheck, CircleX, Dumbbell, ExternalLink, Lightbulb, Play, RotateCcw, Square, Volume2 } from 'lucide-react'
import { Illustration } from '../components/Illustration'
import { TopBar } from '../components/TopBar'
import { getWorkshop, workshopsUi, type Workshop } from '../content'
import { flows } from '../content/flows'
import { noCookieEmbedUrl, watchUrl } from '../lib/video'
import { useAppState, useCopy } from '../state/useAppState'
import { useSpeech } from '../state/useSpeech'
import { NotFound } from './NotFound'

type Stage = { kind: 'cards'; index: number } | { kind: 'done' } | { kind: 'quiz'; index: number; chosen: number | null; right: number } | { kind: 'result'; right: number }

/** Un taller: tarjetas una a la vez (sin deslizar), lectura en voz alta, video opcional y mini repaso. */
export function WorkshopView() {
  const { workshopId } = useParams()
  const workshop = workshopId ? getWorkshop(workshopId) : undefined
  if (!workshop) return <NotFound />
  return <WorkshopRun key={workshop.id} workshop={workshop} />
}

function WorkshopRun({ workshop }: { workshop: Workshop }) {
  const navigate = useNavigate()
  const { markWorkshopDone } = useAppState()
  const text = useCopy()
  const speech = useSpeech()
  const [stage, setStage] = useState<Stage>({ kind: 'cards', index: 0 })
  const headingRef = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)
  const ui = workshopsUi
  const total = workshop.cards.length

  const stageIndex = 'index' in stage ? stage.index : -1
  // Al cambiar de tarjeta o de etapa: arriba y foco en el título.
  useEffect(() => {
    const main = document.getElementById('main')
    if (main) main.scrollTop = 0
    if (first.current) {
      first.current = false
      return
    }
    headingRef.current?.focus()
  }, [stage.kind, stageIndex])

  // Ver el taller completo suma al Pasaporte.
  useEffect(() => {
    if (stage.kind === 'done') markWorkshopDone(workshop.skill)
  }, [stage.kind, workshop.skill, markWorkshopDone])

  const practicePath = (() => {
    const flow = flows.find((f) => f.skill === workshop.skill)
    return flow ? `/practicar/${flow.platform}/${flow.id}` : '/practicar'
  })()

  if (stage.kind === 'done') {
    return (
      <div className="page finish">
        <TopBar title={text(workshop.title)} backTo="/talleres" />
        <div className="finish__hero">
          <CircleCheck className="finish__icon" aria-hidden="true" />
          <h2 ref={headingRef} tabIndex={-1}>
            {ui.done.title}
          </h2>
          <p>{ui.done.body}</p>
          <p className="muted">{ui.done.passport}</p>
        </div>
        <div className="stack stack--tight">
          {workshop.quiz && workshop.quiz.length > 0 && (
            <button type="button" className="btn btn--primary btn--block btn--xl" onClick={() => setStage({ kind: 'quiz', index: 0, chosen: null, right: 0 })}>
              {ui.done.quiz}
            </button>
          )}
          <button type="button" className="btn btn--secondary btn--block" onClick={() => navigate(practicePath)}>
            <Dumbbell className="icon" aria-hidden="true" />
            <span>{ui.done.practice}</span>
          </button>
          <button type="button" className="btn btn--ghost btn--block" onClick={() => setStage({ kind: 'cards', index: 0 })}>
            <RotateCcw className="icon" aria-hidden="true" />
            <span>{ui.done.again}</span>
          </button>
          <button type="button" className="btn btn--ghost btn--block" onClick={() => navigate('/talleres')}>
            {ui.done.back}
          </button>
        </div>
      </div>
    )
  }

  if (stage.kind === 'quiz' && workshop.quiz) {
    const q = workshop.quiz[stage.index]
    const qTotal = workshop.quiz.length
    const answered = stage.chosen !== null
    const isRight = stage.chosen === q.answer
    return (
      <div className="page">
        <TopBar title={ui.quiz.title} backTo="/talleres" />
        <p className="coach__step">{ui.quiz.questionOf(stage.index + 1, qTotal)}</p>
        <h2 ref={headingRef} tabIndex={-1} className="quiz__question">
          {text(q.question)}
        </h2>
        <div className="quiz__options" role="group" aria-label={text(q.question)}>
          {q.options.map((o, i) => {
            const state = !answered ? '' : i === q.answer ? 'is-right' : i === stage.chosen ? 'is-wrong' : 'is-dim'
            return (
              <button
                key={i}
                type="button"
                className={`btn btn--option-light btn--block ${state}`}
                aria-pressed={stage.chosen === i}
                disabled={answered}
                onClick={() =>
                  setStage({ ...stage, chosen: i, right: stage.right + (i === q.answer ? 1 : 0) })
                }
              >
                {answered && i === q.answer && <CircleCheck className="icon" aria-hidden="true" />}
                {answered && i === stage.chosen && i !== q.answer && <CircleX className="icon" aria-hidden="true" />}
                <span>{text(o)}</span>
                {answered && i === q.answer && <span className="quiz__tag">{ui.quiz.rightAnswer}</span>}
                {answered && i === stage.chosen && i !== q.answer && <span className="quiz__tag">{ui.quiz.yourAnswer}</span>}
              </button>
            )
          })}
        </div>
        <div aria-live="polite">
          {answered && (
            <div className={`panel ${isRight ? 'panel--good' : 'panel--tip'}`}>
              <p className="quiz__verdict">{isRight ? ui.quiz.correct : ui.quiz.incorrect}</p>
              <p>{text(q.explanation)}</p>
            </div>
          )}
        </div>
        {answered && (
          <button
            type="button"
            className="btn btn--primary btn--block btn--xl"
            onClick={() =>
              stage.index === qTotal - 1
                ? setStage({ kind: 'result', right: stage.right })
                : setStage({ kind: 'quiz', index: stage.index + 1, chosen: null, right: stage.right })
            }
          >
            <span>{stage.index === qTotal - 1 ? ui.quiz.finish : ui.quiz.next}</span>
            <ArrowRight className="icon" aria-hidden="true" />
          </button>
        )}
      </div>
    )
  }

  if (stage.kind === 'result') {
    return (
      <div className="page finish">
        <TopBar title={ui.quiz.title} backTo="/talleres" />
        <div className="finish__hero">
          <CircleCheck className="finish__icon" aria-hidden="true" />
          <h2 ref={headingRef} tabIndex={-1}>
            {ui.quiz.result(stage.right, workshop.quiz?.length ?? 0)}
          </h2>
          <p>{ui.quiz.encourage}</p>
        </div>
        <button type="button" className="btn btn--primary btn--block" onClick={() => navigate(practicePath)}>
          <Dumbbell className="icon" aria-hidden="true" />
          <span>{ui.done.practice}</span>
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={() => navigate('/talleres')}>
          {ui.done.back}
        </button>
      </div>
    )
  }

  if (stage.kind !== 'cards') return null
  const card = workshop.cards[stage.index]
  const last = stage.index === total - 1
  const read = () => {
    const parts = [text(card.title), text(card.body)]
    if (card.tip) parts.push(`${ui.tipLabel} ${text(card.tip)}`)
    speech.say(parts.join('. '))
  }

  return (
    <div className="page workshop">
      <TopBar title={text(workshop.title)} backTo="/talleres" />
      {stage.index === 0 && workshop.videoUrl && <VideoBlock url={workshop.videoUrl} title={text(workshop.title)} />}
      <p className="coach__step">{ui.cardOf(stage.index + 1, total)}</p>
      <article className="workshop-slide panel">
        <Illustration name={card.illustration} />
        <h2 ref={headingRef} tabIndex={-1} className="workshop-slide__title">
          {text(card.title)}
        </h2>
        <p className="workshop-slide__body">{text(card.body)}</p>
        {card.tip && (
          <p className="workshop-slide__tip">
            <Lightbulb className="icon" aria-hidden="true" />
            <span>
              <strong>{ui.tipLabel}</strong> {text(card.tip)}
            </span>
          </p>
        )}
        {speech.enabled &&
          (speech.speaking ? (
            <button type="button" className="btn btn--secondary btn--block" onClick={speech.stop}>
              <Square className="icon" aria-hidden="true" />
              <span>{ui.stopVoice}</span>
            </button>
          ) : (
            <button type="button" className="btn btn--secondary btn--block" onClick={read}>
              <Volume2 className="icon" aria-hidden="true" />
              <span>{ui.readAloud}</span>
            </button>
          ))}
      </article>
      <div className="workshop-nav">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => (stage.index === 0 ? navigate('/talleres') : setStage({ kind: 'cards', index: stage.index - 1 }))}
        >
          <ArrowLeft className="icon" aria-hidden="true" />
          <span>{ui.previous}</span>
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            speech.stop()
            setStage(last ? { kind: 'done' } : { kind: 'cards', index: stage.index + 1 })
          }}
        >
          <span>{last ? ui.finish : ui.next}</span>
          <ArrowRight className="icon" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/** Video opcional: solo se carga si la persona lo pide, y siempre con youtube-nocookie.com. */
function VideoBlock({ url, title }: { url: string; title: string }) {
  const [show, setShow] = useState(false)
  const embed = noCookieEmbedUrl(url)
  const link = watchUrl(url)
  if (!embed || !link) return null
  const ui = workshopsUi.video
  return (
    <section className="video panel" aria-label={ui.title}>
      {show ? (
        <div className="video__frame">
          <iframe
            src={embed}
            title={ui.frameTitle(title)}
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
          />
        </div>
      ) : (
        <>
          <button type="button" className="btn btn--primary btn--block" onClick={() => setShow(true)}>
            <Play className="icon" aria-hidden="true" />
            <span>{ui.show}</span>
          </button>
          <p className="muted">{ui.note}</p>
        </>
      )}
      <a className="row-link" href={link} target="_blank" rel="noopener noreferrer">
        <span>{ui.open}</span>
        <ExternalLink className="icon" aria-hidden="true" />
      </a>
    </section>
  )
}
