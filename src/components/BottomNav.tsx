import { NavLink } from 'react-router-dom'
import { Award, House, LifeBuoy, UserRound } from 'lucide-react'
import { common } from '../content'

const items = [
  { to: '/', label: common.nav.home, Icon: House, end: true },
  { to: '/avances', label: common.nav.progress, Icon: Award, end: false },
  { to: '/ayuda', label: common.nav.help, Icon: LifeBuoy, end: false },
  { to: '/perfil', label: common.nav.profile, Icon: UserRound, end: false },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label={common.nav.label}>
      <ul>
        {items.map(({ to, label, Icon, end }) => (
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
