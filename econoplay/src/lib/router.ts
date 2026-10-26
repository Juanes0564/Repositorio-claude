import { useEffect, useState } from 'react';

// La ruta vive en memoria y, si se puede, también en la dirección (#/modulos).
// Así funciona igual en un hosting normal y dentro de páginas incrustadas,
// donde cambiar la dirección puede estar bloqueado.

type Listener = (route: string[]) => void;

function parse(hash: string): string[] {
  return hash.replace(/^#\/?/, '').split('/').filter(Boolean);
}

function initialHash(): string {
  try {
    return window.location.hash;
  } catch {
    return '';
  }
}

let current = parse(initialHash());
const listeners = new Set<Listener>();

export function navigate(path: string): void {
  const hash = `#${path.startsWith('/') ? path : `/${path}`}`;
  current = parse(hash);
  try {
    window.history.pushState(null, '', hash);
  } catch {
    // Sin acceso a la dirección: la ruta en memoria basta.
  }
  listeners.forEach((l) => l(current));
  window.scrollTo(0, 0);
}

// Los enlaces internos (<a href="#/...">) se manejan aquí para no depender de la dirección.
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element | null)?.closest?.('a[href^="#/"], a[href="#"]');
    if (!link) return;
    e.preventDefault();
    navigate(link.getAttribute('href')!.slice(1) || '/');
  });
  window.addEventListener('popstate', () => {
    current = parse(initialHash());
    listeners.forEach((l) => l(current));
  });
}

export function useRoute(): string[] {
  const [route, setRoute] = useState(current);
  useEffect(() => {
    listeners.add(setRoute);
    return () => {
      listeners.delete(setRoute);
    };
  }, []);
  return route;
}
