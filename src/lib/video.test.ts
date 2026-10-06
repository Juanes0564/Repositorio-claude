import { describe, expect, it } from 'vitest'
import { noCookieEmbedUrl, watchUrl, youtubeId } from './video'

describe('videos de YouTube', () => {
  it.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ?si=abc', 'dQw4w9WgXcQ'],
    ['https://m.youtube.com/watch?v=dQw4w9WgXcQ&t=10', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ])('reconoce %s', (url, id) => {
    expect(youtubeId(url)).toBe(id)
  })

  it.each(['https://vimeo.com/123', 'no es un enlace', 'https://youtube.com/watch?v=corto', 'https://evil.com/youtu.be/dQw4w9WgXcQ'])(
    'rechaza %s',
    (url) => expect(youtubeId(url)).toBeNull(),
  )

  it('siempre incrusta con youtube-nocookie.com', () => {
    expect(noCookieEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0')
    expect(watchUrl('https://youtu.be/dQw4w9WgXcQ')).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  })
})
