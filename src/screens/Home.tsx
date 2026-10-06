import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Car,
  ChevronRight,
  Headset,
  Landmark,
  Mic,
  MousePointerClick,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Stethoscope,
} from 'lucide-react'
import { Logo } from '../components/Logo'
import { home, simpleModeUi } from '../content'
import { SimpleHome } from '../components/SimpleHome'
import { useAppState, useCopy } from '../state/useAppState'
import { isRecognitionSupported } from '../lib/recognition'

const cards = [
  { to: '/practicar', Icon: MousePointerClick, copy: home.cards.simulate, tone: 'green' },
  { to: '/copiloto', Icon: Headset, copy: home.cards.copilot, tone: 'yellow' },
  { to: '/talleres', Icon: BookOpen, copy: home.cards.workshops, tone: 'blue' },
  { to: '/modo-sencillo', Icon: SlidersHorizontal, copy: home.cards.simpleMode, tone: 'rose' },
] as const

const quick = [
  { to: '/practicar?categoria=bancos', Icon: Landmark, label: home.quick.banks },
  { to: '/practicar?categoria=salud', Icon: Stethoscope, label: home.quick.health },
  { to: '/practicar?categoria=transporte', Icon: Car, label: home.quick.transport },
  { to: '/practicar?categoria=compras', Icon: ShoppingCart, label: home.quick.shopping },
]

/** Pantalla 2: menú principal. */
export function Home() {
  const { data } = useAppState()
  const text = useCopy()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  // "Menos opciones" (modo sencillo): 4 botones enormes. Se puede ver todo por un rato sin cambiar el ajuste.
  const [showAll, setShowAll] = useState(false)
  const simple = data.settings.fewerOptions && !showAll
  // El micrófono solo se muestra si el navegador lo permite y la persona no eligió "Prefiero botones".
  const micAvailable = isRecognitionSupported() && data.settings.voiceInput !== 'declined'

  // El buscador usa el motor de intención del copiloto: la pregunta se responde en la pantalla del copiloto.
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/copiloto?q=${encodeURIComponent(q)}` : '/copiloto')
  }

  return (
    <div className="page home">
      <header className="home__header">
        <div>
          <h1 className="home__greeting">{home.greeting(data.profile.name)}</h1>
          <p className="home__question">{text(home.question)}</p>
        </div>
        <Logo size={56} />
      </header>

      {simple ? (
        <>
          <SimpleHome />
          <button type="button" className="btn btn--ghost btn--block" onClick={() => setShowAll(true)}>
            {simpleModeUi.home.more}
          </button>
        </>
      ) : (
        <>
        <form className="search" role="search" onSubmit={submit}>
          <label htmlFor="home-search" className="search__label">
            {home.search.label}
          </label>
          <div className="search__box">
            <Search className="icon search__icon" aria-hidden="true" />
            <input
              id="home-search"
              type="search"
              enterKeyHint="search"
              placeholder={home.search.placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className={micAvailable ? 'search__actions' : 'search__actions search__actions--single'}>
            <button type="submit" className="btn btn--secondary">
              <Search className="icon" aria-hidden="true" />
              <span>{home.search.submit}</span>
            </button>
            {micAvailable && (
              <button type="button" className="btn btn--primary" onClick={() => navigate('/copiloto?voz=1')}>
                <Mic className="icon" aria-hidden="true" />
                <span>{home.search.mic}</span>
              </button>
            )}
          </div>
        </form>

        <section aria-label={home.cardsLabel}>
          <ul className="card-grid">
            {cards.map(({ to, Icon, copy, tone }) => (
              <li key={to}>
                <Link to={to} className={`big-card big-card--${tone}`}>
                  <span className="big-card__icon">
                    <Icon className="icon" aria-hidden="true" />
                  </span>
                  <span className="big-card__text">
                    <span className="big-card__title">
                      {copy.title}
                      {'badge' in copy && <span className="badge">{copy.badge}</span>}
                    </span>
                    <span className="big-card__body">{text(copy.body)}</span>
                  </span>
                  <ChevronRight className="icon big-card__chevron" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="quick-title">
          <h2 id="quick-title" className="section-title">
            {home.quickTitle}
          </h2>
          <ul className="quick-grid">
            {quick.map(({ to, Icon, label }) => (
              <li key={to}>
                <Link to={to} className="quick">
                  <Icon className="icon" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
          {data.settings.fewerOptions && (
            <button type="button" className="btn btn--ghost btn--block" onClick={() => setShowAll(false)}>
              {simpleModeUi.home.less}
            </button>
          )}
        </>
      )}
    </div>
  )
}
