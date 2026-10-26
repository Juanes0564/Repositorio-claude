import { BookMarked } from 'lucide-react';

/** Cita de la fuente, en pequeño, debajo de lecciones y explicaciones. */
export function Source({ text }: { text: string }) {
  return (
    <p className="source">
      <BookMarked size={14} aria-hidden="true" />
      <span>Fuente: {text}</span>
    </p>
  );
}
