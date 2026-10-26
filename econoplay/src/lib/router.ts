import { useEffect, useState } from 'react';

function parse(): string[] {
  return window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
}

/** Rutas con # para que funcione en cualquier hosting estático. */
export function useRoute(): string[] {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => {
      setRoute(parse());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function navigate(path: string): void {
  window.location.hash = path.startsWith('/') ? path : `/${path}`;
}
