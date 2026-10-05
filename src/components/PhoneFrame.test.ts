import { describe, expect, it } from 'vitest'
import { isFrameDisabled } from './PhoneFrame'

describe('isFrameDisabled', () => {
  it('muestra el marco por defecto', () => {
    expect(isFrameDisabled({ search: '', hash: '#/' })).toBe(false)
  })
  it('lo apaga con ?frame=0 antes del #', () => {
    expect(isFrameDisabled({ search: '?frame=0', hash: '#/perfil' })).toBe(true)
  })
  it('lo apaga con ?frame=0 después del #', () => {
    expect(isFrameDisabled({ search: '', hash: '#/perfil?frame=0' })).toBe(true)
  })
  it('ignora otros valores', () => {
    expect(isFrameDisabled({ search: '?frame=1', hash: '' })).toBe(false)
  })
})
