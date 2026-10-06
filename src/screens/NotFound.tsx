import { Link } from 'react-router-dom'
import { House } from 'lucide-react'
import { TopBar } from '../components/TopBar'
import { common } from '../content'

export function NotFound() {
  return (
    <div className="page">
      <TopBar title={common.notFound.title} backTo="/" />
      <div className="panel panel--center">
        <p>{common.notFound.body}</p>
        <Link to="/" className="btn btn--primary btn--block">
          <House className="icon" aria-hidden="true" />
          <span>{common.comingSoon.goHome}</span>
        </Link>
      </div>
    </div>
  )
}
