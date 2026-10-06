import { NavLink } from 'react-router-dom'
import { Award, House, LifeBuoy, UserRound } from 'lucide-react'
import { common } from '../content'
import { useAppState } from '../state/useAppState'

const items = [
  { to: '/', label: common.nav.home, Icon: House, end: true },
  { to: '/avances', label: common.nav.progress, Icon: Award, end: false },
  { to: '/ayuda', label: common.nav.help, Icon: LifeBuoy, end: false },
  { to: '/perfil', label: common.nav.profile, Icon: UserRound, end: false },
]

export function BottomNav() {
  const { data } = useAppState()
  // Con "menos opciones", la barra queda mínima: Inicio, Ayuda y Perfil.
  const shown = data.settings.fewerOptions ? items.filter((i) => i.to !== '/avances') : items
  return (
    <nav className={`bottom-nav bottom-nav--${shown.length}`} aria-label={common.nav.label}>
      <ul>
        {shown.map(({ to, label, Icon, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className="bottom-nav__link">
              <Icon className="icon" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
