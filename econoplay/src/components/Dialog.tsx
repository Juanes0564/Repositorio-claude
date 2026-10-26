import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

/** Ventana sencilla y accesible (se cierra con Escape o el botón). */
export function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="overlay" onClick={onClose}>
      <div
        ref={ref}
        className="dialog pop"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="icon-btn dialog__close" aria-label="Cerrar" onClick={onClose}>
          <X aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}
