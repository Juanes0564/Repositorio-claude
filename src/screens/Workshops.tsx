import { Link, useSearchParams, Navigate } from 'react-router-dom'
import { CheckCircle2, ChevronRight, Clock, GraduationCap } from 'lucide-react'
import { Illustration } from '../components/Illustration'
import { TopBar } from '../components/TopBar'
import { workshopForSkill, workshops, workshopsUi, type WorkshopCategory } from '../content'
import { SKILL_IDS, type SkillId } from '../lib/storage'
import { useAppState, useCopy } from '../state/useAppState'

const FILTERS: (WorkshopCategory | 'all')[] = ['all', 'banks', 'health', 'security', 'more']

/** Pantalla 6: tutoriales y talleres, con filtros. */
export function Workshops() {
  const [params, setParams] = useSearchParams()
  const { data } = useAppState()
  const text = useCopy()

  // Desde el simulador ("Ver taller") llega ?habilidad=…: se abre directo ese taller.
  const skill = params.get('habilidad')
  if (skill && (SKILL_IDS as readonly string[]).includes(skill)) {
    const w = workshopForSkill(skill as SkillId)
    if (w) return <Navigate to={`/talleres/${w.id}`} replace />
  }

  const active = (FILTERS.find((f) => f === params.get('tema')) ?? 'all') as WorkshopCategory | 'all'
  const list = workshops.filter((w) => active === 'all' || w.category === active)

  return (
    <div className="page">
      <TopBar title={workshopsUi.title} backTo="/" />
      <p>{text(workshopsUi.intro)}</p>
      <div className="filters" role="group" aria-label={workshopsUi.filtersLabel}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className="filter"
            aria-pressed={f === active}
            onClick={() => setParams(f === 'all' ? {} : { tema: f }, { replace: true })}
          >
            {workshopsUi.filters[f]}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p>{workshopsUi.empty}</p>
      ) : (
        <ul className="workshop-list">
          {list.map((w) => {
            const seen = data.progress[w.skill].workshopDone
            return (
              <li key={w.id}>
                <Link to={`/talleres/${w.id}`} className="workshop-card">
                  <span className="workshop-card__art">
                    <Illustration name={w.cards[0].illustration} size="sm" />
                  </span>
                  <span className="workshop-card__text">
                    <span className="workshop-card__title">{text(w.title)}</span>
                    <span className="workshop-card__summary">{text(w.summary)}</span>
                    <span className="workshop-card__meta">
                      <span>
                        <Clock className="icon icon--inline" aria-hidden="true" /> {workshopsUi.minutes(w.minutes)}
                      </span>
                      <span>
                        <GraduationCap className="icon icon--inline" aria-hidden="true" /> {workshopsUi.levels[w.level]}
                      </span>
                      {seen && (
                        <span className="workshop-card__seen">
                          <CheckCircle2 className="icon icon--inline" aria-hidden="true" /> {workshopsUi.seen}
                        </span>
                      )}
                    </span>
                  </span>
                  <ChevronRight className="icon" aria-hidden="true" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
