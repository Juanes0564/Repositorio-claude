import { useMemo, useState } from 'react';
import { Flame, Medal, Sparkles, Star, X } from 'lucide-react';
import { content } from '../data';
import type { Question } from '../data/types';
import { prepareQuestion } from '../lib/quiz';
import { HINT_COST, applyAnswer, spendHint, type AnswerResult } from '../lib/progress';
import { useProgress } from '../state/ProgressContext';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { Stats } from './Stats';

export interface QuizOutcome {
  results: { question: Question; correct: boolean }[];
  points: number;
  collectibles: string[];
  badges: string[];
}

interface Props {
  questions: Question[];
  title: string;
  onExit: () => void;
  onFinish: (outcome: QuizOutcome) => void;
}

export function QuizRunner({ questions, title, onExit, onFinish }: Props) {
  const { progress, update, set } = useProgress();
  const prepared = useMemo(() => questions.map((q) => prepareQuestion(q)), [questions]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<QuizOutcome['results']>([]);
  const [gained, setGained] = useState({ points: 0, collectibles: [] as string[], badges: [] as string[] });
  const [last, setLast] = useState<AnswerResult | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);

  const current = prepared[index];
  const q = current.question;

  function handleAnswered(correct: boolean, timeRatio?: number) {
    const r = update((p) => applyAnswer(p, correct, timeRatio, q.desbloquea));
    setLast(r);
    setResults((prev) => [...prev, { question: q, correct }]);
    setGained((g) => ({
      points: g.points + r.points,
      collectibles: [...g.collectibles, ...r.newCollectibles],
      badges: [...g.badges, ...r.newBadges],
    }));
  }

  function handleContinue() {
    setLast(null);
    if (index + 1 < prepared.length) {
      setIndex(index + 1);
      window.scrollTo(0, 0);
    } else {
      onFinish({ results, ...gained });
    }
  }

  const answered = results.length;

  return (
    <div className="play">
      <div className="play__top">
        <button type="button" className="icon-btn" aria-label="Salir" onClick={() => setConfirmExit(true)}>
          <X aria-hidden="true" />
        </button>
        <ProgressBar value={answered / prepared.length} label={`Pregunta ${index + 1} de ${prepared.length}`} />
        <Stats />
      </div>
      {confirmExit && (
        <div className="confirm" role="alertdialog" aria-labelledby="exit-title">
          <p id="exit-title">¿Salir? Perderás el avance de esta ronda.</p>
          <div className="confirm__actions">
            <button type="button" className="btn btn--ghost" onClick={() => setConfirmExit(false)}>
              Seguir jugando
            </button>
            <button type="button" className="btn btn--danger" onClick={onExit}>
              Salir
            </button>
          </div>
        </div>
      )}
      <p className="play__title">
        {title} · Pregunta {index + 1} de {prepared.length}
      </p>
      <QuestionCard
        key={q.id}
        prepared={current}
        timeLimit={q.contrarreloj}
        hint={{
          label: `Pista (${HINT_COST} monedas)`,
          enabled: progress.coins >= HINT_COST,
          onUse: () => {
            let ok = false;
            set((p) => {
              const next = spendHint(p);
              ok = next !== null;
              return next ?? p;
            });
            return ok;
          },
        }}
        onAnswered={handleAnswered}
        continueLabel={index + 1 < prepared.length ? 'Continuar' : 'Ver resultados'}
        onContinue={handleContinue}
        extraFeedback={last && <AnswerRewards result={last} />}
      />
    </div>
  );
}

function AnswerRewards({ result }: { result: AnswerResult }) {
  if (!result.points && !result.newCollectibles.length && !result.newBadges.length) return null;
  return (
    <ul className="rewards-inline">
      {result.points > 0 && (
        <li className="pop">
          <Star size={18} aria-hidden="true" /> +{result.points} puntos
        </li>
      )}
      {result.streak >= 3 && (
        <li className="pop">
          <Flame size={18} aria-hidden="true" /> Racha de {result.streak}
        </li>
      )}
      {result.newCollectibles.map((id) => (
        <li key={id} className="pop">
          <Sparkles size={18} aria-hidden="true" /> Nuevo cromo: {content.cromos.find((c) => c.id === id)?.nombre}
        </li>
      ))}
      {result.newBadges.map((id) => (
        <li key={id} className="pop">
          <Medal size={18} aria-hidden="true" /> Insignia: {content.insignias.find((b) => b.id === id)?.nombre}
        </li>
      ))}
    </ul>
  );
}
