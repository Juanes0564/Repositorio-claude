import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { common } from '../content'

/** Encabezado de pantalla con título y botón "Volver" siempre visible. */
export function TopBar({ title, backTo }: { title: string; backTo?: string }) {
  const navigate = useNavigate()
  const goBack = () => {
    if (backTo) navigate(backTo)
    else if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }
  return (
    <header className="top-bar">
      <button type="button" className="btn btn--ghost top-bar__back" onClick={goBack}>
        <ArrowLeft className="icon" aria-hidden="true" />
        <span>{common.back}</span>
      </button>
      <h1 className="top-bar__title">{title}</h1>
    </header>
  )
}
