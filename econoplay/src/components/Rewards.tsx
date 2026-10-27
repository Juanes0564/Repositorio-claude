import { Coins, Medal, Sparkles, Star } from 'lucide-react';
import { content } from '../data';

interface Props {
  points?: number;
  coins?: number;
  collectibles?: string[];
  badges?: string[];
}

/** Resumen de lo ganado al terminar una actividad. */
export function Rewards({ points = 0, coins = 0, collectibles = [], badges = [] }: Props) {
  const unique = (ids: string[]) => [...new Set(ids)];
  if (!points && !coins && !collectibles.length && !badges.length) return null;
  return (
    <ul className="rewards">
      {points > 0 && (
        <li>
          <Star aria-hidden="true" /> <strong>+{points}</strong> puntos
        </li>
      )}
      {coins > 0 && (
        <li>
          <Coins aria-hidden="true" /> <strong>+{coins}</strong> monedas
        </li>
      )}
      {unique(collectibles).map((id) => (
        <li key={id}>
          <Sparkles aria-hidden="true" /> Cromo nuevo: <strong>{content.cromos.find((c) => c.id === id)?.nombre}</strong>
        </li>
      ))}
      {unique(badges).map((id) => (
        <li key={id}>
          <Medal aria-hidden="true" /> Insignia: <strong>{content.insignias.find((b) => b.id === id)?.nombre}</strong>
        </li>
      ))}
    </ul>
  );
}
