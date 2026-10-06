import { Link } from 'react-router-dom'
import { Award, BadgeCheck, BookOpen, Circle, CircleCheck, CircleDashed, Dumbbell, Sparkles } from 'lucide-react'
import { passport as ui, skillNames } from '../content'
import { completedCount, nextSuggestion, skillPercent, skillStatus, type SkillStatus } from '../config/progress'
import { SKILL_IDS } from '../lib/storage'
import { practicePath, workshopPath } from '../lib/paths'
import { useAppState, useCopy } from '../state/useAppState'

const statusIcon: Record<SkillStatus, typeof Circle> = {
  notStarted: Circle,
  inProgress: CircleDashed,
  complete: BadgeCheck,
}

/** Pantalla 9: Pasaporte digital. Estado de las 8 habilidades, siguiente reto y certificado. */
export function Passport() {
  const { data } = useAppState()
  const text = useCopy()
  const total = SKILL_IDS.length
  const done = completedCount(data.progress)
  const next = nextSuggestion(data.progress)

  return (
    <div className="page passport">
      <h1>{ui.title}</h1>

      <section className="passport-badge" aria-labelledby="badge-title">
        <Award className="passport-badge__icon" aria-hidden="true" />
        <div>
          <h2 id="badge-title" className="passport-badge__title">
            {ui.badgeTitle}
          </h2>
          <p className="passport-badge__count">{ui.badgeCount(done, total)}</p>
          <div
            className="passport-badge__bar"
            role="progressbar"
            aria-label={ui.badgeCount(done, total)}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
          >
            <span style={{ width: `${(done / total) * 100}%` }} />
          </div>
        </div>
      </section>
      <p className="passport__encourage">{text(ui.encourage(done, total))}</p>

      {done === total ? (
        <section className="panel panel--good" aria-labelledby="cert-title">
          <h2 id="cert-title">
            <Sparkles className="icon icon--inline" aria-hidden="true" /> {ui.certificate.ready}
          </h2>
          <Link to="/avances/certificado" className="btn btn--primary btn--block btn--xl">
            {ui.certificate.open}
          </Link>
        </section>
      ) : (
        next && (
          <section className="panel panel--tip" aria-labelledby="next-title">
            <h2 id="next-title">{ui.nextTitle}</h2>
            <p className="passport__next">
              {next.action === 'practice'
                ? ui.nextPractice(skillNames[next.skill])
                : ui.nextWorkshop(skillNames[next.skill])}
            </p>
            <Link
              to={next.action === 'practice' ? practicePath(next.skill) : workshopPath(next.skill)}
              className="btn btn--primary btn--block"
            >
              {next.action === 'practice' ? <Dumbbell className="icon" aria-hidden="true" /> : <BookOpen className="icon" aria-hidden="true" />}
              <span>{ui.start}</span>
            </Link>
          </section>
        )
      )}

      <section aria-labelledby="skills-title" className="stack stack--tight">
        <h2 id="skills-title">{ui.listTitle}</h2>
        <p className="muted">{ui.how}</p>
        <ul className="skill-list">
          {SKILL_IDS.map((id) => {
            const p = data.progress[id]
            const status = skillStatus(p)
            const Icon = statusIcon[status]
            const percent = skillPercent(p)
            return (
              <li key={id} className={`skill skill--${status}`}>
                <div className="skill__head">
                  <Icon className="skill__icon" aria-hidden="true" />
                  <div className="skill__text">
                    <h3 className="skill__name">{skillNames[id]}</h3>
                    <p className="skill__status">
                      {ui.status[status]} · {ui.percent(percent)}
                    </p>
                  </div>
                  {status === 'complete' && (
                    <span className="skill__stamp" aria-label={ui.stamp}>
                      <BadgeCheck className="icon" aria-hidden="true" />
                      <span>{ui.stamp}</span>
                    </span>
                  )}
                </div>
                <ul className="skill__parts">
                  <li>
                    {p.simulatorGuidedDone ? <CircleCheck className="icon icon--inline" aria-hidden="true" /> : <Circle className="icon icon--inline" aria-hidden="true" />}{' '}
                    {ui.practice}: {p.simulatorGuidedDone ? ui.doneMark : ui.pendingMark}
                    {!p.simulatorGuidedDone && (
                      <Link to={practicePath(id)} className="skill__link">
                        {ui.doPractice}
                      </Link>
                    )}
                  </li>
                  <li>
                    {p.workshopDone ? <CircleCheck className="icon icon--inline" aria-hidden="true" /> : <Circle className="icon icon--inline" aria-hidden="true" />}{' '}
                    {ui.workshop}: {p.workshopDone ? ui.doneMark : ui.pendingMark}
                    {!p.workshopDone && (
                      <Link to={workshopPath(id)} className="skill__link">
                        {ui.doWorkshop}
                      </Link>
                    )}
                  </li>
                </ul>
              </li>
            )
          })}
        </ul>
      </section>
      {done < total && <p className="muted">{ui.certificate.notYet}</p>}
    </div>
  )
}
