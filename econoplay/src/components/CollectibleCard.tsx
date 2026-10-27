import { Lock } from 'lucide-react';
import type { Collectible } from '../data/types';
import { schoolName } from '../data';

interface Props {
  card: Collectible;
  unlocked: boolean;
  number: number;
  onOpen?: () => void;
}

/** Cromo coleccionable de un autor. */
export function CollectibleCard({ card, unlocked, number, onOpen }: Props) {
  if (!unlocked) {
    return (
      <div className="cromo cromo--locked" aria-label={`Cromo ${number} bloqueado`}>
        <span className="cromo__number">#{number}</span>
        <Lock size={32} aria-hidden="true" />
        <span className="cromo__hint">{card.extra ? 'Cromo extra' : 'Por descubrir'}</span>
      </div>
    );
  }
  return (
    <button type="button" className={`cromo cromo--${card.escuela}`} onClick={onOpen}>
      <span className="cromo__number">#{number}</span>
      {card.extra && <span className="cromo__extra">Extra</span>}
      <span className="cromo__avatar" aria-hidden="true">
        {card.iniciales}
      </span>
      <span className="cromo__name">{card.nombre}</span>
      <span className="cromo__school">
        {card.etiqueta} · {schoolName(card.escuela, true)}
      </span>
    </button>
  );
}
