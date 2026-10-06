/**
 * Videos de los talleres (excepción 4b del brief): solo YouTube y siempre con el modo de
 * privacidad ampliada (youtube-nocookie.com). Si el enlace no es de YouTube, no se muestra nada.
 */
const ID = /^[\w-]{11}$/

export function youtubeId(url: string): string | null {
  let u: URL
  try {
    u = new URL(url.trim())
  } catch {
    return null
  }
  const host = u.hostname.replace(/^www\.|^m\./, '')
  let id: string | null = null
  if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0]
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (u.pathname === '/watch') id = u.searchParams.get('v')
    else {
      const m = u.pathname.match(/^\/(embed|shorts|live)\/([^/?#]+)/)
      if (m) id = m[2]
    }
  }
  return id && ID.test(id) ? id : null
}

/** Dirección para incrustar el video sin cookies de seguimiento. */
export function noCookieEmbedUrl(url: string): string | null {
  const id = youtubeId(url)
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null
}

/** Enlace para abrir el video en YouTube. */
export function watchUrl(url: string): string | null {
  const id = youtubeId(url)
  return id ? `https://www.youtube.com/watch?v=${id}` : null
}
