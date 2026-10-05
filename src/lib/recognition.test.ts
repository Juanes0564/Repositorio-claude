import { afterEach, describe, expect, it, vi } from 'vitest'
import { TRY_LOCAL_PROCESSING, isRecognitionSupported, listenOnce, mapRecognitionError } from './recognition'
import { FakeRecognition, installFakeRecognition, removeFakeRecognition } from '../test/fakeRecognition'

describe('reconocimiento de voz', () => {
  afterEach(removeFakeRecognition)

  it('traduce los errores del navegador a casos sencillos', () => {
    expect(mapRecognitionError('not-allowed')).toBe('blocked')
    expect(mapRecognitionError('service-not-allowed')).toBe('blocked')
    expect(mapRecognitionError('no-speech')).toBe('noSpeech')
    expect(mapRecognitionError('network')).toBe('offline')
    expect(mapRecognitionError('audio-capture')).toBe('noMic')
    expect(mapRecognitionError('lo-que-sea')).toBe('other')
  })

  it('detecta si el navegador lo permite', () => {
    expect(isRecognitionSupported()).toBe(false)
    installFakeRecognition()
    expect(isRecognitionSupported()).toBe(true)
  })

  it('escucha en español de Colombia y entrega lo que entendió', async () => {
    installFakeRecognition()
    const handlers = { onInterim: vi.fn(), onFinal: vi.fn(), onError: vi.fn(), onEnd: vi.fn() }
    await listenOnce(handlers)
    const rec = FakeRecognition.last!
    expect(rec.lang).toBe('es-CO')
    rec.emit('quiero mandar', false)
    expect(handlers.onInterim).toHaveBeenCalledWith('quiero mandar')
    rec.emit('quiero mandar plata', true)
    rec.end()
    expect(handlers.onFinal).toHaveBeenCalledWith('quiero mandar plata')
    expect(handlers.onEnd).toHaveBeenCalled()
  })

  it('por ahora no pide procesamiento en el celular (cerraba la pestaña en Chromium)', async () => {
    expect(TRY_LOCAL_PROCESSING).toBe(false)
    installFakeRecognition({ local: true })
    await listenOnce({ onInterim: vi.fn(), onFinal: vi.fn(), onError: vi.fn(), onEnd: vi.fn() })
    expect(FakeRecognition.last!.processLocally).toBeUndefined()
  })

  it('si se activa y el navegador lo ofrece, lo usa', async () => {
    installFakeRecognition({ local: true })
    await listenOnce({ onInterim: vi.fn(), onFinal: vi.fn(), onError: vi.fn(), onEnd: vi.fn() }, 'es-CO', true)
    expect(FakeRecognition.last!.processLocally).toBe(true)
  })

  it('si no oye nada, lo avisa', async () => {
    installFakeRecognition()
    const onError = vi.fn()
    await listenOnce({ onInterim: vi.fn(), onFinal: vi.fn(), onError, onEnd: vi.fn() })
    FakeRecognition.last!.end()
    expect(onError).toHaveBeenCalledWith('noSpeech')
  })

  it('micrófono bloqueado', async () => {
    installFakeRecognition()
    const onError = vi.fn()
    await listenOnce({ onInterim: vi.fn(), onFinal: vi.fn(), onError, onEnd: vi.fn() })
    FakeRecognition.last!.fail('not-allowed')
    FakeRecognition.last!.end()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith('blocked')
  })
})
