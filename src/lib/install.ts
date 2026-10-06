/**
 * Botón "Instalar ahora" (solo en navegadores que lo permiten, como Chrome en Android).
 * El navegador avisa una sola vez con el evento `beforeinstallprompt`; lo guardamos para usarlo al tocar el botón.
 * Si no está disponible, la pantalla de Ayuda muestra los pasos a mano.
 */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: InstallPromptEvent | null = null
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

export function setupInstallPrompt(): void {
  if (typeof window === 'undefined') return
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e as InstallPromptEvent
    notify()
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    notify()
  })
}

export function canInstall(): boolean {
  return deferred !== null
}

export function isInstalled(): boolean {
  if (typeof window === 'undefined') return false
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches
  return Boolean(standalone || (navigator as Navigator & { standalone?: boolean }).standalone)
}

export async function promptInstall(): Promise<void> {
  if (!deferred) return
  await deferred.prompt()
  await deferred.userChoice.catch(() => undefined)
  deferred = null
  notify()
}

export function subscribeInstall(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
