import { describe, expect, it } from 'vitest'
import { HUMAN_HELP_ENABLED, WHATSAPP_NUMBER, humanHelpLink } from './humanHelp'

describe('ayuda humana', () => {
  it('está apagada mientras no haya guías (brief: "Próximamente")', () => {
    expect(HUMAN_HELP_ENABLED).toBe(false)
    expect(WHATSAPP_NUMBER).toBe('')
    expect(humanHelpLink()).toBeNull()
  })
})
