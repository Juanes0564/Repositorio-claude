import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Clock, Footprints, Lock } from 'lucide-react'
import { PlatformMark } from '../components/PlatformMark'
import { TopBar } from '../components/TopBar'
import { platformDetail, platforms } from '../content'
import { flowsForPlatform } from '../content/flows'
import { NotFound } from './NotFound'
import { useAppState, useCopy } from '../state/useAppState'

/** Prácticas disponibles en una plataforma, con modo Guiado y Libre. */
export function PlatformDetail() {
  const { platformId } = useParams()
  const { data } = useAppState()
  const text = useCopy()
  const platform = platforms.find((p) => p.id === platformId)
  if (!platform) return <NotFound />
  const list = flowsForPlatform(platform.id)

  return (
    <div className="page">
      <TopBar title={platform.name} backTo="/practicar" />
      <div className="platform-hero">
        <PlatformMark id={platform.id} size="lg" />
        <p>{platform.description}</p>
      </div>

      <section aria-labelledby="practices-title" className="stack">
        <h2 id="practices-title">{platformDetail.practicesTitle}</h2>
        {list.length === 0 && <p className="panel">{platformDetail.comingSoon}</p>}
        {list.map((flow) => {
          const progress = data.progress[flow.skill]
          const freeUnlocked = progress.simulatorGuidedDone
          const base = `/practicar/${platform.id}/${flow.id}`
          return (
            <article key={flow.id} className="panel practice-card">
              <h3>{text(flow.title)}</h3>
              <p>{text(flow.summary)}</p>
              <p className="practice-card__meta">
                <span>
                  <Clock className="icon icon--inline" aria-hidden="true" /> {platformDetail.minutes(flow.minutes)}
                </span>
                <span>
                  <Footprints className="icon icon--inline" aria-hidden="true" /> {platformDetail.steps(flow.steps.length)}
                </span>
                {progress.simulatorGuidedDone && (
                  <span className="practice-card__done">
                    <CheckCircle2 className="icon icon--inline" aria-hidden="true" /> {platformDetail.done}
                  </span>
                )}
              </p>
              <Link to={base} className="btn btn--primary btn--block btn--stacked">
                <span>{platformDetail.guided}</span>
                <span className="btn__sub">{platformDetail.guidedHelp}</span>
              </Link>
              {freeUnlocked ? (
                <Link to={`${base}?modo=libre`} className="btn btn--secondary btn--block btn--stacked">
                  <span>{platformDetail.free}</span>
                  <span className="btn__sub">{platformDetail.freeHelp}</span>
                </Link>
              ) : (
                <p className="locked">
                  <Lock className="icon" aria-hidden="true" />
                  <span>
                    <strong>{platformDetail.free}</strong>
                    <br />
                    {platformDetail.freeLocked}
                  </span>
                </p>
              )}
            </article>
          )
        })}
      </section>
    </div>
  )
}
