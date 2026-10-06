import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import { App } from '../App'
import { AppStateProvider } from '../state/AppState'
import { STORAGE_KEY, SKILL_IDS, defaultData, type StoredData } from '../lib/storage'
import { help, passport, resolveCopy, simpleModeUi } from '../content'

function renderAt(hash: string, change?: (d: StoredData) => void) {
  const data = { ...defaultData(), onboardingDone: true }
  change?.(data)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  window.location.hash = hash
  return render(
    <AppStateProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AppStateProvider>,
  )
}
const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!) as StoredData
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }))

describe('pantalla 7: modo sencillo', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('el interruptor general aplica todo al instante', () => {
    renderAt('#/modo-sencillo')
    fireEvent.click(screen.getByRole('switch', { name: /Usar modo sencillo/ }))
    expect(document.documentElement.dataset.font).toBe('large')
    expect(document.documentElement.dataset.contrast).toBe('high')
    expect(document.documentElement.dataset.icons).toBe('large')
    expect(saved().settings).toMatchObject({ simpleMode: true, fewerOptions: true, simpleLanguage: true })
  })

  it('cada ajuste se cambia por separado', () => {
    renderAt('#/modo-sencillo')
    fireEvent.click(screen.getByRole('radio', { name: 'Muy grande' }))
    expect(document.documentElement.dataset.font).toBe('xlarge')
    fireEvent.click(screen.getByRole('switch', { name: /Alto contraste/ }))
    expect(document.documentElement.dataset.contrast).toBe('high')
    expect(screen.getByText(simpleModeUi.previewTitle)).toBeTruthy()
  })
})

describe('pantalla 8: inicio simplificado', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('con "menos opciones" muestra 4 botones enormes y barra mínima', () => {
    renderAt('#/', (d) => (d.settings.fewerOptions = true))
    const list = screen.getByRole('list', { name: simpleModeUi.home.label })
    expect(within(list).getAllByRole('link')).toHaveLength(4)
    for (const label of Object.values(simpleModeUi.home.buttons)) expect(screen.getByRole('link', { name: label })).toBeTruthy()
    const nav = screen.getByRole('navigation', { name: 'Navegación principal' })
    expect(within(nav).getAllByRole('link').map((l) => l.textContent)).toEqual(['Inicio', 'Ayuda', 'Perfil'])
    expect(screen.queryByRole('search')).toBeNull()
  })

  it('"Ver todas las opciones" muestra el menú completo sin cambiar el ajuste', () => {
    renderAt('#/', (d) => (d.settings.fewerOptions = true))
    click(simpleModeUi.home.more)
    expect(screen.getByRole('search')).toBeTruthy()
    expect(saved().settings.fewerOptions).toBe(true)
  })

  it('cada botón abre la guía paso a paso', () => {
    renderAt('#/', (d) => (d.settings.fewerOptions = true))
    fireEvent.click(screen.getByRole('link', { name: simpleModeUi.home.buttons.medical }))
    expect(screen.getByText('Paso 1 de 8')).toBeTruthy()
    expect(screen.getByRole('heading', { name: /aplicación o la página de (tu|su) EPS/ })).toBeTruthy()
  })

  it('el lenguaje sencillo acorta los textos clave', () => {
    renderAt('#/', (d) => (d.settings.simpleLanguage = true))
    expect(screen.getByText('Practicar sin miedo.')).toBeTruthy()
  })
})

describe('pantalla 9: Pasaporte', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('muestra cuántas habilidades lleva y el estado de cada una con texto', () => {
    renderAt('#/avances', (d) => {
      d.progress.transfers = { simulatorGuidedDone: true, simulatorFreeDone: false, workshopDone: true }
      d.progress.medical = { simulatorGuidedDone: true, simulatorFreeDone: false, workshopDone: false }
    })
    expect(screen.getByText('1 de 8 habilidades completadas')).toBeTruthy()
    expect(screen.getAllByText(/^Completa · 100 %/)).toHaveLength(1)
    expect(screen.getAllByText(/^En progreso · 50 %/)).toHaveLength(1)
    expect(screen.getAllByText(/^Sin empezar · 0 %/)).toHaveLength(6)
    expect(screen.getByText(passport.stamp)).toBeTruthy()
    // Siguiente reto: terminar lo que está a medias (el taller de citas)
    expect(screen.getByText(/taller: Citas médicas/)).toBeTruthy()
    expect(screen.queryByRole('link', { name: passport.certificate.open })).toBeNull()
  })

  it('con las 8 completas ofrece el certificado con nombre y fecha', () => {
    renderAt('#/avances', (d) => {
      d.profile.name = 'Marta'
      for (const id of SKILL_IDS) d.progress[id] = { simulatorGuidedDone: true, simulatorFreeDone: false, workshopDone: true }
    })
    expect(screen.getByText(resolveCopy(passport.encourage(8, 8), false))).toBeTruthy()
    fireEvent.click(screen.getByRole('link', { name: passport.certificate.open }))
    expect(screen.getByText('Marta')).toBeTruthy()
    expect(screen.getByText(/^Fecha: /)).toBeTruthy()
    expect(screen.getByRole('button', { name: passport.certificate.print })).toBeTruthy()
  })

  it('sin completar todo, el certificado no se puede abrir', () => {
    renderAt('#/avances/certificado')
    expect(screen.getByText('0 de 8 habilidades completadas')).toBeTruthy()
  })
})

describe('pantalla 10: Ayuda', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('la ayuda humana dice "Próximamente" y redirige al copiloto y a los talleres, sin "En línea"', () => {
    renderAt('#/ayuda')
    expect(screen.queryByText(/en línea/i)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /Llamada por videollamada/ }))
    expect(screen.getByText(/todavía no está disponible/)).toBeTruthy()
    expect(screen.getByRole('link', { name: help.human.copilot })).toBeTruthy()
    expect(screen.getByRole('link', { name: help.human.workshops })).toBeTruthy()
  })

  it('tiene preguntas frecuentes y la guía de instalación para Android e iPhone', () => {
    renderAt('#/ayuda')
    expect(screen.getAllByRole('group').length).toBeGreaterThanOrEqual(help.faq.length)
    expect(screen.getByText(help.install.android)).toBeTruthy()
    expect(screen.getByText(help.install.iphone)).toBeTruthy()
  })
})
