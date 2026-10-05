import { Link } from 'react-router-dom'
import { Hammer, House } from 'lucide-react'
import { TopBar } from '../components/TopBar'
import { common } from '../content'

/** Pantalla honesta para secciones que se construyen en fases siguientes. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="page">
      <TopBar title={title} />
      <div className="panel panel--center">
        <Hammer className="icon icon--xl" aria-hidden="true" />
        <h2>{common.comingSoon.title}</h2>
        <p>{common.comingSoon.body}</p>
        <Link to="/" className="btn btn--primary btn--block">
          <House className="icon" aria-hidden="true" />
          <span>{common.comingSoon.goHome}</span>
        </Link>
      </div>
    </div>
  )
}
