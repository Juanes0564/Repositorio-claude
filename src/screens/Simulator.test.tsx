import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import { App } from '../App'
import { AppStateProvider } from '../state/AppState'
import { STORAGE_KEY, defaultData } from '../lib/storage'
import { tv } from '../content'

function renderAt(hash: string, seed = defaultData()) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...seed, onboardingDone: true }))
  window.location.hash = hash
  return render(
    <AppStateProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AppStateProvider>,
  )
}

const device = () => within(screen.getByRole('region', { name: 'Pantalla de práctica' }))
const tap = (name: string | RegExp) => fireEvent.click(device().getByRole('button', { name }))
const next = () => fireEvent.click(screen.getByRole('button', { name: /Siguiente|Terminar/ }))
const typeDigits = (digits: string) => [...digits].forEach((d) => tap(d))

describe('pantalla 3: selección de plataforma', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('filtra por categoría desde los accesos rápidos', () => {
    renderAt('#/practicar?categoria=bancos')
    expect(screen.getByRole('button', { name: 'Bancos', pressed: true })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Banco Ejemplo/ })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Billetera Ejemplo/ })).toBeTruthy()
    expect(screen.queryByRole('link', { name: /EPS Salud Ejemplo/ })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Salud' }))
    expect(screen.getByRole('link', { name: /EPS Salud Ejemplo/ })).toBeTruthy()
  })

  it('el modo Libre está bloqueado hasta completar el Guiado', () => {
    renderAt('#/practicar/bank')
    expect(screen.getByRole('link', { name: /Practicar con guía/ })).toBeTruthy()
    expect(screen.queryByRole('link', { name: /Practicar solo/ })).toBeNull()
    expect(screen.getByText(/Se activa cuando termin/)).toBeTruthy()
  })
})

describe('pantalla 4: simulador de transferencia', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('muestra la cinta de práctica y el paso actual', () => {
    renderAt('#/practicar/bank/transfer-bank')
    expect(screen.getByText('PRÁCTICA – no es real')).toBeTruthy()
    expect(screen.getByText('Paso 1 de 8', { selector: 'p' })).toBeTruthy()
  })

  it('error amable, resaltado tras dos errores y "¡Bien!" al acertar', () => {
    renderAt('#/practicar/bank/transfer-bank')
    tap(/Chat Ejemplo/)
    expect(screen.getByRole('status').textContent).toMatch(/Esa es otra aplicación/)
    expect(document.querySelector('.is-highlighted')).toBeNull()
    tap(/Ajustes/)
    const highlighted = document.querySelector('.is-highlighted')
    expect(highlighted?.textContent).toMatch(/Banco Ejemplo/)
    expect(highlighted?.textContent).toMatch(/Aquí/)
    tap(/Banco Ejemplo/)
    expect(screen.getByRole('status').textContent).toMatch('¡Bien!')
  })

  it('"Siguiente" no avanza sin hacer el paso, y explica por qué', () => {
    renderAt('#/practicar/bank/transfer-bank')
    next()
    expect(screen.getByText('Paso 1 de 8', { selector: 'p' })).toBeTruthy()
    expect(screen.getByRole('status').textContent).toMatch(/Primero ha(z|ga) lo que dice el paso/)
  })

  it('se completa toda la práctica y se guarda el avance', () => {
    renderAt('#/practicar/bank/transfer-bank')
    tap(/Banco Ejemplo/); next()
    typeDigits('1234'); tap('Entrar'); next()
    tap(/Transferir/); next()
    tap(/Rosa Ejemplo/); next()
    typeDigits('50000'); tap('Continuar'); next()
    tap('Confirmar'); next()
    typeDigits('5678'); tap('Enviar dinero'); next()
    tap('Guardar comprobante'); next()

    expect(screen.getByRole('heading', { name: tv('¡Lo lograste!', '¡Lo logró!') })).toBeTruthy()
    expect(screen.getByText(/Ahora también pued(es|e) practicar solo/)).toBeTruthy()
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(saved.progress.transfers.simulatorGuidedDone).toBe(true)
  })

  it('salir pide confirmación', () => {
    renderAt('#/practicar/bank/transfer-bank')
    fireEvent.click(screen.getByRole('button', { name: 'Salir' }))
    expect(screen.getByRole('alertdialog')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'No, seguir practicando' }))
    expect(screen.queryByRole('alertdialog')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Salir' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sí, salir' }))
    expect(screen.getByRole('heading', { name: 'Banco Ejemplo' })).toBeTruthy()
  })

  it('en modo Libre no hay pista hasta pedir Ayuda, ni resaltado', () => {
    const seed = defaultData()
    seed.progress.transfers.simulatorGuidedDone = true
    renderAt('#/practicar/bank/transfer-bank?modo=libre', seed)
    expect(screen.getByText('Solo')).toBeTruthy()
    expect(screen.queryByText(/Pista/)).toBeNull()
    tap(/Chat Ejemplo/); tap(/Ajustes/); tap(/Tienda Ejemplo/)
    expect(document.querySelector('.is-highlighted')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Ayuda' }))
    expect(screen.getByText(/Pista/)).toBeTruthy()
  })

  it('el modo Libre bloqueado abre en Guiado', () => {
    renderAt('#/practicar/bank/transfer-bank?modo=libre')
    expect(screen.getByText('Con guía')).toBeTruthy()
  })

  it('estafas: decide, recibe un aviso amable si se equivoca y ve las señales al acertar', () => {
    renderAt('#/practicar/chat/scams-check')
    expect(screen.getByText('PRÁCTICA – no es real')).toBeTruthy()
    tap('Es seguro')
    expect(screen.getByRole('status').textContent).toMatch(/enlace/)
    expect(screen.queryByText('Las señales')).toBeNull()
    tap('Es una estafa')
    expect(screen.getByRole('status').textContent).toMatch(/Es una estafa/)
    expect(screen.getByText('Las señales')).toBeTruthy()
    expect(screen.getByText(/número de (tu|su) tarjeta/)).toBeTruthy()
  })

  it('transporte: calificar con estrellas', () => {
    renderAt('#/practicar/transport/ride-transport')
    tap(/Transporte Ejemplo/); next()
    tap(/Centro de salud Ejemplo/); next()
    tap(/Económico/); next()
    tap('Pedir viaje'); next()
    tap('Compartir viaje'); next()
    tap(/Coinciden, me subo/); next()
    tap('Pagué en efectivo'); next()
    tap('4 estrellas')
    expect(screen.getByRole('status').textContent).toMatch(/quinta estrella|última estrella/)
    tap('5 estrellas')
    expect(screen.getByRole('status').textContent).toMatch('¡Bien!')
  })
})

