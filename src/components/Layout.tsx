import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { common } from '../content'

/**
 * Estructura de las pantallas con navegación inferior.
 * Al cambiar de pantalla vuelve arriba y lleva el foco al contenido (ayuda a lectores de pantalla).
 */
export function Layout({ showNav = true }: { showNav?: boolean }) {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    const main = mainRef.current
    if (!main) return
    main.scrollTop = 0
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    main.focus({ preventScroll: true })
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); mainRef.current?.focus() }}>
        {common.skipToContent}
      </a>
      <main id="main" ref={mainRef} tabIndex={-1} className="content">
        <Outlet />
      </main>
      {showNav && <BottomNav />}
    </>
  )
}
