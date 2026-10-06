import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import { App } from './App'
import { AppStateProvider } from './state/AppState'
import { STORAGE_KEY } from './lib/storage'
import { tv } from './content'

function renderApp() {
  return render(
    <AppStateProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AppStateProvider>,
  )
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = '#/'
  })
  afterEach(cleanup)

  it('la primera vez muestra la bienvenida y luego saluda por el nombre', () => {
    renderApp()
    expect(screen.getByRole('heading', { name: 'Vínculo' })).toBeTruthy()
    expect(screen.getByText('Aprende, practica y hazlo tú')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /Comenzar/ }))
    fireEvent.change(screen.getByLabelText(tv('Tu nombre', 'Su nombre')), { target: { value: 'Marta' } })
    fireEvent.click(screen.getByRole('button', { name: /Continuar/ }))
    fireEvent.click(screen.getByRole('button', { name: 'No, por ahora' }))

    expect(screen.getByRole('heading', { name: '¡Hola, Marta!' })).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeTruthy()
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(saved.onboardingDone).toBe(true)
    expect(saved.profile.name).toBe('Marta')
  })

  it('activar el modo sencillo en la bienvenida agranda la letra', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /Comenzar/ }))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Sí, activarlo' }))
    expect(screen.getByRole('heading', { name: '¡Hola!' })).toBeTruthy()
    expect(document.documentElement.dataset.font).toBe('large')
    expect(document.documentElement.dataset.contrast).toBe('high')
  })

  it('borrar mis datos pide confirmación y vuelve a la bienvenida', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, onboardingDone: true, profile: { name: 'Luis' } }),
    )
    window.location.hash = '#/perfil'
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'Borrar mis datos' }))
    expect(screen.getByRole('alertdialog')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'No, conservarlos' }))
    expect(screen.queryByRole('alertdialog')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Borrar mis datos' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sí, borrar todo' }))
    expect(screen.getByRole('heading', { name: 'Vínculo' })).toBeTruthy()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).profile.name).toBe('')
  })
})
