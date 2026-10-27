import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { initialProgress, loadProgress, saveProgress, type Progress } from '../lib/progress';

interface ProgressApi {
  progress: Progress;
  /** Aplica una función pura al progreso, lo guarda y devuelve su resultado. */
  update: <R>(fn: (p: Progress) => { progress: Progress; result: R }) => R;
  set: (fn: (p: Progress) => Progress) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const ref = useRef(progress);

  const commit = useCallback((next: Progress) => {
    ref.current = next;
    setProgress(next);
    saveProgress(next);
  }, []);

  const update = useCallback(
    <R,>(fn: (p: Progress) => { progress: Progress; result: R }): R => {
      const out = fn(ref.current);
      commit(out.progress);
      return out.result;
    },
    [commit],
  );

  const set = useCallback((fn: (p: Progress) => Progress) => commit(fn(ref.current)), [commit]);
  const reset = useCallback(() => commit(initialProgress), [commit]);

  const api = useMemo(() => ({ progress, update, set, reset }), [progress, update, set, reset]);
  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress debe usarse dentro de ProgressProvider');
  return ctx;
}
