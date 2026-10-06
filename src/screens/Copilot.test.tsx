import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import { App } from '../App'
import { AppStateProvider } from '../state/AppState'
import { STORAGE_KEY, defaultData } from '../lib/storage'
import { FakeRecognition, installFakeRecognition, removeFakeRecognition } from '../test/fakeRecognition'
import { copilot, getIntent, resolveCopy, voice } from '../content'

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
  fireEvent.change(screen.getByLabelText(/escr[íi]b[ae]lo aquí/i), { target: { value: text } })
  fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))
}
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }))
const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve() })

describe('pantalla 5: copiloto sin micrófono', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('saluda, muestra las sugerencias del brief y no muestra micrófono', () => {
    renderAt('#/copiloto')
    expect(screen.getByText(resolveCopy(copilot.greeting, false))).toBeTruthy()
    for (const s of copilot.suggestions.map((x) => x.label)) {
      expect(screen.getByRole('button', { name: s })).toBeTruthy()
    }
    expect(screen.queryByRole('button', { name: /To(ca|que) para hablar/ })).toBeNull()
    expect(screen.getByText(/tocar un botón o escribir/)).toBeTruthy()
  })

  it('confianza alta: pide confirmar y abre la guía para hacerlo en la vida real', () => {
    renderAt('#/copiloto')
    typeAndSend('quiero mandar plata a mi hija')
    expect(screen.getByText(getIntent('transfer').confirm)).toBeTruthy()
    click('Sí')
    expect(screen.getByRole('heading', { name: /aplicación de (tu|su) banco/ })).toBeTruthy()
    expect(screen.getByText('Paso 1 de 8')).toBeTruthy()
    for (const b of ['Ya lo hice', 'Repetir', 'Más despacio', 'No entiendo', 'Practicar esto en el simulador']) {
      expect(screen.getByRole('button', { name: b })).toBeTruthy()
    }
    click('Ya lo hice')
    expect(screen.getByText('Paso 2 de 8')).toBeTruthy()
    click('No entiendo')
    expect(screen.getByText(/lo explico de otra forma/)).toBeTruthy()
    click('Paso anterior')
    expect(screen.getByText('Paso 1 de 8')).toBeTruthy()
    click('Practicar esto en el simulador')
    expect(screen.getByText('PRÁCTICA – no es real')).toBeTruthy()
  })

  it('la guía termina con un mensaje de ánimo', () => {
    renderAt('#/copiloto')
    click('Quiero pedir un transporte')
    for (let i = 0; i < 8; i++) click('Ya lo hice')
    expect(screen.getByRole('heading', { name: /Termin(aste|ó) todos los pasos/ })).toBeTruthy()
  })

  it('"No, otra cosa" vuelve a preguntar', () => {
    renderAt('#/copiloto')
    typeAndSend('necesito un taxi')
    click('No, otra cosa')
    expect(screen.getByText(resolveCopy(copilot.greetingAgain, false))).toBeTruthy()
  })

  it('confianza media: ofrece 2 o 3 opciones', () => {
    renderAt('#/copiloto')
    typeAndSend('quiero pagar en la tienda con el banco')
    expect(screen.getByText(/Creo que quiere/)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Ninguna de estas' })).toBeTruthy()
  })

  it('confianza baja: "No te entendí bien" con botones', () => {
    renderAt('#/copiloto')
    typeAndSend('el clima de mañana')
    expect(screen.getByText(resolveCopy(copilot.notUnderstood, false))).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Enviar dinero' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Hablar con una persona' })).toBeTruthy()
  })

  it('"No entiendo un mensaje": pregunta qué pide y orienta con seguridad', () => {
    renderAt('#/copiloto')
    click('No entiendo un mensaje')
    expect(screen.getByText(/No puedo ver (tu|su) pantalla/)).toBeTruthy()
    click('Me pide una clave')
    expect(screen.getByText(/Ningún banco (te|le) pide la clave/)).toBeTruthy()
    expect(screen.getByText(/número que aparece en (tu|su) tarjeta/)).toBeTruthy()
  })

  it('"Háblame más despacio" deja la voz lenta', () => {
    renderAt('#/copiloto', { voiceRate: 'normal' })
    click(copilot.suggestions[4].label)
    expect(screen.getByText(copilot.slowerDone)).toBeTruthy()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).settings.voiceRate).toBe('slow')
  })

  it('el buscador del menú usa el motor del copiloto', () => {
    renderAt('#/')
    fireEvent.change(screen.getByLabelText(/Pregúnt(ame|eme) lo que necesit/), { target: { value: 'me llamaron del banco' } })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(screen.getByText(/llegó algo sospechoso\?/)).toBeTruthy()
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
    click(/To(ca|que) para hablar/)
    expect(screen.getByRole('alertdialog', { name: 'Antes de usar la voz' })).toBeTruthy()
    expect(screen.getByText(/navegador puede enviar (tu|su) voz a su proveedor/)).toBeTruthy()
    click('Usar voz')
    await flush()
    expect(screen.getByText(voice.listening)).toBeTruthy()
    act(() => FakeRecognition.last!.emit('necesito sacar una cita', false))
    expect(screen.getByText('necesito sacar una cita')).toBeTruthy()
    act(() => {
      FakeRecognition.last!.emit('necesito sacar una cita con el médico', true)
      FakeRecognition.last!.end()
    })
    expect(screen.getByText(getIntent('medical').confirm)).toBeTruthy()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).settings.voiceInput).toBe('granted')
  })

  it('"Prefiero botones" esconde el micrófono y lo recuerda', () => {
    renderAt('#/copiloto')
    click(/To(ca|que) para hablar/)
    click('Prefiero botones')
    expect(screen.queryByRole('button', { name: /To(ca|que) para hablar/ })).toBeNull()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).settings.voiceInput).toBe('declined')
  })

  it('micrófono bloqueado: explica cómo activarlo y deja los botones', async () => {
    renderAt('#/copiloto', { voiceInput: 'granted' })
    click(/To(ca|que) para hablar/)
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
    click(/To(ca|que) para hablar/)
    await flush()
    act(() => FakeRecognition.last!.end())
    expect(screen.getByRole('alert').textContent).toMatch(/No (te|le) escuché/)
    expect(screen.getByRole('button', { name: 'Intentar de nuevo' })).toBeTruthy()
  })
})
