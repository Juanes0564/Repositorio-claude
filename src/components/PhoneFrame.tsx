import { useEffect, useState, type ReactNode } from 'react'
import { BatteryFull, Signal, Wifi } from 'lucide-react'

/** `?frame=0` en la dirección apaga el marco de teléfono (sirve antes o después del #). */
export function isFrameDisabled(location: Pick<Location, 'search' | 'hash'> = window.location): boolean {
  const fromSearch = new URLSearchParams(location.search).get('frame')
  const hashQuery = location.hash.includes('?') ? location.hash.slice(location.hash.indexOf('?')) : ''
  const fromHash = new URLSearchParams(hashQuery).get('frame')
  return fromSearch === '0' || fromHash === '0'
}

function useClock(): string {
  const format = () =>
    new Date().toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: false })
  const [time, setTime] = useState(format)
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

/** Barra de estado decorativa. Está oculta para lectores de pantalla. */
function StatusBar() {
  const time = useClock()
  return (
    <div className="status-bar" aria-hidden="true">
      <span>{time}</span>
      <span className="status-icons">
        <Signal size={16} strokeWidth={2.5} />
        <Wifi size={16} strokeWidth={2.5} />
        <BatteryFull size={20} strokeWidth={2} />
      </span>
    </div>
  )
}

/**
 * En pantallas anchas (≥ 768 px) muestra la app dentro de un marco de teléfono.
 * En celulares ocupa toda la pantalla (el CSS oculta el marco).
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const [framed] = useState(() => !isFrameDisabled())
  return (
    <div className={framed ? 'stage stage--framed' : 'stage'}>
      <div className="device">
        {framed && <StatusBar />}
        <div className="screen">{children}</div>
      </div>
    </div>
  )
}
