import { Coins, Star } from 'lucide-react';
import { useProgress } from '../state/ProgressContext';

/** Puntos y monedas, siempre visibles. */
export function Stats() {
  const { progress } = useProgress();
  return (
    <div className="stats">
      <span className="stat stat--points">
        <Star size={18} aria-hidden="true" />
        <span>
          {progress.points} <span className="sr-only">puntos</span>
        </span>
      </span>
      <span className="stat stat--coins">
        <Coins size={18} aria-hidden="true" />
        <span>
          {progress.coins} <span className="sr-only">monedas</span>
        </span>
      </span>
    </div>
  );
}
