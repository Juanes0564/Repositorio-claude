import { Link } from 'react-router-dom'
import { Car, Send, ShoppingCart, Stethoscope } from 'lucide-react'
import { simpleModeUi } from '../content'

const buttons = [
  { skill: 'transfers', Icon: Send, label: simpleModeUi.home.buttons.transfers },
  { skill: 'medical', Icon: Stethoscope, label: simpleModeUi.home.buttons.medical },
  { skill: 'transport', Icon: Car, label: simpleModeUi.home.buttons.transport },
  { skill: 'shopping', Icon: ShoppingCart, label: simpleModeUi.home.buttons.shopping },
] as const

/**
 * Pantalla 8: inicio simplificado con 4 botones enormes.
 * Cada botón abre la guía del copiloto para hacerlo paso a paso (desde ahí se puede practicar).
 */
export function SimpleHome() {
  return (
    <ul className="simple-home" aria-label={simpleModeUi.home.label}>
      {buttons.map(({ skill, Icon, label }) => (
        <li key={skill}>
          <Link to={`/copiloto?guia=${skill}`} className="simple-home__btn">
            <Icon className="simple-home__icon" aria-hidden="true" />
            <span>{label}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
