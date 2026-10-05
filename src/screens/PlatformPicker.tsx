import { Link, useSearchParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { PlatformMark } from '../components/PlatformMark'
import { TopBar } from '../components/TopBar'
import { picker, platforms, type PlatformCategory } from '../content'
import { flowsForPlatform } from '../content/flows'

/** Filtros de la pantalla 3. La clave es la que va en la dirección (?categoria=bancos). */
const FILTERS = [
  { key: 'populares', label: picker.filters.popular, category: null },
  { key: 'bancos', label: picker.filters.banks, category: 'banks' },
  { key: 'salud', label: picker.filters.health, category: 'health' },
  { key: 'transporte', label: picker.filters.transport, category: 'transport' },
  { key: 'compras', label: picker.filters.shopping, category: 'shopping' },
] as const satisfies readonly { key: string; label: string; category: PlatformCategory | null }[]

/** Pantalla 3: selección de plataforma. */
export function PlatformPicker() {
  const [params, setParams] = useSearchParams()
  const active = FILTERS.find((f) => f.key === params.get('categoria')) ?? FILTERS[0]
  const list = platforms
    .filter((p) => active.category === null || p.category === active.category)
    .sort((a, b) => a.popularity - b.popularity)

  return (
    <div className="page">
      <TopBar title={picker.title} backTo="/" />
      <p>{picker.intro}</p>

      <div className="filters" role="group" aria-label={picker.filtersLabel}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className="filter"
            aria-pressed={f.key === active.key}
            onClick={() => setParams(f.key === 'populares' ? {} : { categoria: f.key }, { replace: true })}
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p>{picker.empty}</p>
      ) : (
        <ul className="platform-list">
          {list.map((p) => {
            const count = flowsForPlatform(p.id).length
            return (
              <li key={p.id}>
                <Link to={`/practicar/${p.id}`} className="platform-card">
                  <PlatformMark id={p.id} />
                  <span className="platform-card__text">
                    <span className="platform-card__name">{p.name}</span>
                    <span className="platform-card__meta">
                      {picker.categoryNames[p.category]} · {picker.practicesCount(count)}
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
