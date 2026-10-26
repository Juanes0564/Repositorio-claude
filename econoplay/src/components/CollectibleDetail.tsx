import type { Collectible } from '../data/types';
import { Dialog } from './Dialog';
import { SchoolTag } from './SchoolTag';
import { Source } from './Source';

export function CollectibleDetail({ card, onClose }: { card: Collectible; onClose: () => void }) {
  return (
    <Dialog title={card.nombre} onClose={onClose}>
      <div className={`cromo-detail cromo-detail--${card.escuela}`}>
        <span className="cromo__avatar cromo__avatar--big" aria-hidden="true">
          {card.iniciales}
        </span>
        <h2>{card.nombre}</h2>
        <SchoolTag school={card.escuela} />
        <p>{card.aporte}</p>
        <Source text={card.fuente} />
      </div>
    </Dialog>
  );
}
