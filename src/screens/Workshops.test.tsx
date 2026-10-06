import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import { App } from '../App'
import { AppStateProvider } from '../state/AppState'
import { STORAGE_KEY, defaultData } from '../lib/storage'
import { workshops } from '../content/workshops'
import { workshopsUi } from '../content'

function renderAt(hash: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultData(), onboardingDone: true }))
  window.location.hash = hash
  return render(
    <AppStateProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AppStateProvider>,
  )
}
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }))

describe('pantalla 6: talleres', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('lista los 8 talleres con duración y nivel, y filtra', () => {
    renderAt('#/talleres')
    expect(screen.getAllByRole('link', { name: /min/ })).toHaveLength(8)
    expect(screen.getAllByText('Básico').length).toBe(8)
    click('Seguridad')
    expect(screen.getAllByRole('link', { name: /min/ })).toHaveLength(2)
    expect(screen.getByRole('link', { name: /Reconocer estafas/ })).toBeTruthy()
    click('Salud')
    expect(screen.getByRole('link', { name: /Sacar una cita médica/ })).toBeTruthy()
  })

  it('recorre las tarjetas con botones, termina y guarda el avance', () => {
    const w = workshops.find((x) => x.id === 'transferencias')!
    renderAt('#/talleres/transferencias')
    expect(screen.getByText(`Tarjeta 1 de ${w.cards.length}`)).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Qué es una transferencia' })).toBeTruthy()
    click('Siguiente')
    expect(screen.getByText(`Tarjeta 2 de ${w.cards.length}`)).toBeTruthy()
    expect(screen.getByText('Ojo:')).toBeTruthy()
    click('Anterior')
    expect(screen.getByText(`Tarjeta 1 de ${w.cards.length}`)).toBeTruthy()
    for (let i = 0; i < w.cards.length - 1; i++) click('Siguiente')
    click('Terminar')
    expect(screen.getByRole('heading', { name: workshopsUi.done.title })).toBeTruthy()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).progress.transfers.workshopDone).toBe(true)
  })

  it('mini repaso: explica la respuesta y da un resultado sin presión', () => {
    renderAt('#/talleres/estafas')
    const w = workshops.find((x) => x.id === 'estafas')!
    for (let i = 0; i < w.cards.length - 1; i++) click('Siguiente')
    click('Terminar')
    click(/mini repaso/)
    expect(screen.getByText('Pregunta 1 de 3')).toBeTruthy()
    click('Es seguro') // respuesta equivocada
    expect(screen.getByText('Casi. La respuesta es otra.')).toBeTruthy()
    expect(screen.getByText('Ningún banco pide claves por llamada.')).toBeTruthy()
    click('Siguiente pregunta')
    click('Borro el mensaje')
    expect(screen.getByText('¡Muy bien!')).toBeTruthy()
    click('Siguiente pregunta')
    click('Cuelgo y lo llamo a su número de siempre')
    click('Ver resultado')
    expect(screen.getByRole('heading', { name: workshopsUi.quiz.result(2, 3) })).toBeTruthy()
  })

  it('"Ver taller" desde el simulador abre el taller de esa habilidad', () => {
    renderAt('#/talleres?habilidad=transfers')
    expect(screen.getByRole('heading', { name: 'Qué es una transferencia' })).toBeTruthy()
  })

  it('sin videoUrl no carga nada de YouTube', () => {
    renderAt('#/talleres/transferencias')
    expect(document.querySelector('iframe')).toBeNull()
    expect(screen.queryByText(/YouTube/)).toBeNull()
  })

  it('con videoUrl: no carga nada hasta tocar, y luego usa youtube-nocookie.com', () => {
    const w = workshops.find((x) => x.id === 'transferencias')!
    w.videoUrl = 'https://youtu.be/dQw4w9WgXcQ'
    try {
      renderAt('#/talleres/transferencias')
      expect(document.querySelector('iframe')).toBeNull()
      expect(screen.getByRole('link', { name: /Abrir el video en YouTube/ }).getAttribute('href')).toBe(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      )
      click('Ver el video aquí')
      expect(document.querySelector('iframe')?.getAttribute('src')).toBe(
        'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0',
      )
    } finally {
      delete w.videoUrl
    }
  })
})
