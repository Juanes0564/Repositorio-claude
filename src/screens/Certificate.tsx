import { Link, Navigate } from 'react-router-dom'
import { Printer, UserRound } from 'lucide-react'
import { Logo } from '../components/Logo'
import { TopBar } from '../components/TopBar'
import { passport, skillNames } from '../content'
import { completedCount } from '../config/progress'
import { SKILL_IDS } from '../lib/storage'
import { useAppState } from '../state/useAppState'

/** Certificado sencillo cuando las 8 habilidades están completas. Se imprime o se guarda como PDF desde el navegador. */
export function Certificate() {
  const { data } = useAppState()
  const ui = passport.certificate
  if (completedCount(data.progress) < SKILL_IDS.length) return <Navigate to="/avances" replace />
  const name = data.profile.name
  const date = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="page">
      <div className="no-print">
        <TopBar title={ui.title} backTo="/avances" />
      </div>
      <article className="certificate" aria-label={ui.title}>
        <Logo size={72} />
        <p className="certificate__heading">{ui.heading}</p>
        <p>{ui.certifies}</p>
        <p className="certificate__name">{name || ui.noName}</p>
        <p>{ui.completed}</p>
        <ul className="certificate__skills">
          {SKILL_IDS.map((id) => (
            <li key={id}>{skillNames[id]}</li>
          ))}
        </ul>
        <p className="certificate__date">{ui.date(date)}</p>
        <p className="certificate__note">{ui.note}</p>
      </article>
      <div className="no-print stack stack--tight">
        <button type="button" className="btn btn--primary btn--block btn--xl" onClick={() => window.print()}>
          <Printer className="icon" aria-hidden="true" />
          <span>{ui.print}</span>
        </button>
        <p className="muted">{ui.printHelp}</p>
        {!name && (
          <>
            <p>{ui.addName}</p>
            <Link to="/perfil" className="btn btn--secondary btn--block">
              <UserRound className="icon" aria-hidden="true" />
              <span>{ui.goProfile}</span>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
