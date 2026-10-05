import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import { App } from '../App'
import { AppStateProvider } from '../state/AppState'
import { STORAGE_KEY, defaultData } from '../lib/storage'
import { FakeRecognition, installFakeRecognition, removeFakeRecognition } from '../test/fakeRecognition'

function renderAt(hash: string, settings: Partial<ReturnType<typeof defaultData>['settings']> = {}) {
  const data = defaultData()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...data, onboardingDone: true, settings: { ...data.settings, ...settings } }),
  )
  window.location.hash = hash
  return render(
    <AppStateProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AppStateProvider>,
  )
}

const typeAndSend = (text: string) => {
  fireEvent.change(screen.getByLabelText(/escríbelo aquí/i), { target: { value: text } })
  fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))
}
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }))
const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve() })

describe('pantalla 5: copiloto sin micrófono', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('saluda, muestra las sugerencias del brief y no muestra micrófono', () => {
    renderAt('#/copiloto')
    expect(screen.getByText('Estoy aquí para ayudarte. ¿Qué quieres hacer?')).toBeTruthy()
    for (const s of ['Quiero hacer una transferencia', 'Necesito sacar una cita médica', 'Quiero pedir un transporte', 'No entiendo un mensaje', 'Háblame más despacio']) {
      expect(screen.getByRole('button', { name: s })).toBeTruthy()
    }
    expect(screen.queryByRole('button', { name: /Toca para hablar/ })).toBeNull()
    expect(screen.getByText(/Puedes tocar un botón o escribir/)).toBeTruthy()
  })

  it('confianza alta: pide confirmar y abre la guía para hacerlo en la vida real', () => {
    renderAt('#/copiloto')
    typeAndSend('quiero mandar plata a mi hija')
    expect(screen.getByText('¿Quieres hacer una transferencia?')).toBeTruthy()
    click('Sí')
    expect(screen.getByRole('heading', { name: /Abre la aplicación de tu banco/ })).toBeTruthy()
    expect(screen.getByText('Paso 1 de 8')).toBeTruthy()
    for (const b of ['Ya lo hice', 'Repetir', 'Más despacio', 'No entiendo', 'Practicar esto en el simulador']) {
      expect(screen.getByRole('button', { name: b })).toBeTruthy()
    }
    click('Ya lo hice')
    expect(screen.getByText('Paso 2 de 8')).toBeTruthy()
    click('No entiendo')
    expect(screen.getByText(/Te lo explico de otra forma/)).toBeTruthy()
    click('Paso anterior')
    expect(screen.getByText('Paso 1 de 8')).toBeTruthy()
    click('Practicar esto en el simulador')
    expect(screen.getByText('PRÁCTICA – no es real')).toBeTruthy()
  })

  it('la guía termina con un mensaje de ánimo', () => {
    renderAt('#/copiloto')
    click('Quiero pedir un transporte')
    for (let i = 0; i < 8; i++) click('Ya lo hice')
    expect(screen.getByRole('heading', { name: /Terminaste todos los pasos/ })).toBeTruthy()
  })

  it('"No, otra cosa" vuelve a preguntar', () => {
    renderAt('#/copiloto')
    typeAndSend('necesito un taxi')
    click('No, otra cosa')
    expect(screen.getByText('Está bien. ¿Qué quieres hacer?')).toBeTruthy()
  })

  it('confianza media: ofrece 2 o 3 opciones', () => {
    renderAt('#/copiloto')
    typeAndSend('quiero pagar en la tienda con el banco')
    expect(screen.getByText(/Creo que quieres una de estas cosas/)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Ninguna de estas' })).toBeTruthy()
  })

  it('confianza baja: "No te entendí bien" con botones', () => {
    renderAt('#/copiloto')
    typeAndSend('el clima de mañana')
    expect(screen.getByText('No te entendí bien. ¿Quieres hacer alguna de estas cosas?')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Enviar dinero' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Hablar con una persona' })).toBeTruthy()
  })

  it('"No entiendo un mensaje": pregunta qué pide y orienta con seguridad', () => {
    renderAt('#/copiloto')
    click('No entiendo un mensaje')
    expect(screen.getByText(/No puedo ver tu pantalla/)).toBeTruthy()
    click('Me pide una clave')
    expect(screen.getByText(/Ningún banco te pide la clave/)).toBeTruthy()
    expect(screen.getByText(/número que aparece en tu tarjeta/)).toBeTruthy()
  })

  it('"Háblame más despacio" deja la voz lenta', () => {
    renderAt('#/copiloto', { voiceRate: 'normal' })
    click('Háblame más despacio')
    expect(screen.getByText('Listo. Ahora te hablo más despacio.')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).settings.voiceRate).toBe('slow')
  })

  it('el buscador del menú usa el motor del copiloto', () => {
    renderAt('#/')
    fireEvent.change(screen.getByLabelText(/Pregúntame lo que necesites/), { target: { value: 'me llamaron del banco' } })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(screen.getByText(/¿Te llegó algo sospechoso\?/)).toBeTruthy()
  })
})

describe('pantalla 5: copiloto con micrófono', () => {
  beforeEach(() => {
    localStorage.clear()
    installFakeRecognition()
  })
  afterEach(() => {
    cleanup()
    removeFakeRecognition()
  })

  it('antes del primer uso muestra el aviso de privacidad; "Usar voz" escucha y entiende', async () => {
    renderAt('#/copiloto')
    click(/Toca para hablar/)
    expect(screen.getByRole('alertdialog', { name: 'Antes de usar la voz' })).toBeTruthy()
    expect(screen.getByText(/Tu navegador puede enviar tu voz a su proveedor/)).toBeTruthy()
    click('Usar voz')
    await flush()
    expect(screen.getByText('Te escucho…')).toBeTruthy()
    act(() => FakeRecognition.last!.emit('necesito sacar una cita', false))
    expect(screen.getByText('necesito sacar una cita')).toBeTruthy()
    act(() => {
      FakeRecognition.last!.emit('necesito sacar una cita con el médico', true)
      FakeRecognition.last!.end()
    })
    expect(screen.getByText('¿Quieres sacar una cita médica?')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).settings.voiceInput).toBe('granted')
  })

  it('"Prefiero botones" esconde el micrófono y lo recuerda', () => {
    renderAt('#/copiloto')
    click(/Toca para hablar/)
    click('Prefiero botones')
    expect(screen.queryByRole('button', { name: /Toca para hablar/ })).toBeNull()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).settings.voiceInput).toBe('declined')
  })

  it('micrófono bloqueado: explica cómo activarlo y deja los botones', async () => {
    renderAt('#/copiloto', { voiceInput: 'granted' })
    click(/Toca para hablar/)
    await flush()
    act(() => {
      FakeRecognition.last!.fail('not-allowed')
      FakeRecognition.last!.end()
    })
    expect(screen.getByRole('alert').textContent).toMatch(/micrófono está bloqueado/)
    expect(screen.getByRole('button', { name: 'Quiero hacer una transferencia' })).toBeTruthy()
  })

  it('si no escuchó nada, lo dice con amabilidad y deja intentar de nuevo', async () => {
    renderAt('#/copiloto', { voiceInput: 'granted' })
    click(/Toca para hablar/)
    await flush()
    act(() => FakeRecognition.last!.end())
    expect(screen.getByRole('alert').textContent).toMatch(/No te escuché/)
    expect(screen.getByRole('button', { name: 'Intentar de nuevo' })).toBeTruthy()
  })
})
