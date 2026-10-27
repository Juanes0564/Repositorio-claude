import type { LessonCard as LessonCardData, SchoolId } from '../data/types';
import { SchoolTag } from './SchoolTag';
import { Source } from './Source';

export function LessonCard({ card }: { card: LessonCardData }) {
  const comparison = card.comparacion
    ? (Object.entries(card.comparacion) as [SchoolId, string][])
    : [];
  return (
    <article className="lesson-card slide-in">
      <h2>{card.titulo}</h2>
      {card.texto && <p className="lesson-card__text">{card.texto}</p>}
      {comparison.length > 0 && (
        <div className="compare">
          {comparison.map(([school, text]) => (
            <div key={school} className={`compare__item compare__item--${school}`}>
              <SchoolTag school={school} />
              <p>{text}</p>
            </div>
          ))}
        </div>
      )}
      <Source text={card.fuente} />
    </article>
  );
}
