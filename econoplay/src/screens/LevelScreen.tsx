import { useState } from 'react';
import { ArrowLeft, ArrowRight, Lock, RotateCcw, X } from 'lucide-react';
import { findLevel, levels } from '../data';
import { LessonCard } from '../components/LessonCard';
import { QuizRunner, type QuizOutcome } from '../components/QuizRunner';
import { Rewards } from '../components/Rewards';
import { completeLevel, isLevelUnlocked, type CompletionResult } from '../lib/progress';
import { navigate } from '../lib/router';
import { useProgress } from '../state/ProgressContext';

type Phase = 'lesson' | 'quiz' | 'summary';

export function LevelScreen({ levelId }: { levelId: string }) {
  const found = findLevel(levelId);
  const { progress, update } = useProgress();
  const [phase, setPhase] = useState<Phase>('lesson');
  const [card, setCard] = useState(0);
  const [round, setRound] = useState(0);
  const [outcome, setOutcome] = useState<{ quiz: QuizOutcome; completion: CompletionResult } | null>(null);

  if (!found) {
    return (
      <main className="screen">
        <p>No encontramos ese nivel.</p>
        <a className="btn btn--primary" href="#/modulos">
          Ir a los módulos
        </a>
      </main>
    );
  }

  const { level, module, index } = found;

  if (!isLevelUnlocked(progress, level.id)) {
    return (
      <main className="screen center">
        <Lock size={48} aria-hidden="true" />
        <h1>Nivel {level.numero} bloqueado</h1>
        <p>Termina el nivel {level.numero - 1} para abrirlo. ¡Ya casi!</p>
        <a className="btn btn--primary" href={`#/nivel/${levels[index - 1].id}`}>
          Ir al nivel {level.numero - 1}
        </a>
      </main>
    );
  }

  function finishQuiz(quiz: QuizOutcome) {
    const correct = quiz.results.filter((r) => r.correct).length;
    const completion = update((p) => completeLevel(p, level.id, correct, quiz.results.length));
    setOutcome({ quiz, completion });
    setPhase('summary');
  }

  function restart() {
    setOutcome(null);
    setCard(0);
    setRound((r) => r + 1);
    setPhase('lesson');
  }

  if (phase === 'lesson') {
    const last = card === level.tarjetas.length - 1;
    return (
      <main className="play">
        <div className="play__top">
          <a className="icon-btn" href="#/modulos" aria-label="Volver a los módulos">
            <X aria-hidden="true" />
          </a>
          <p className="play__crumb">
            Módulo {module.numero} · Nivel {level.numero}: {level.titulo}
          </p>
        </div>
        <ol className="dots" aria-label={`Tarjeta ${card + 1} de ${level.tarjetas.length}`}>
          {level.tarjetas.map((_, i) => (
            <li key={i} className={i <= card ? 'is-on' : ''} />
          ))}
        </ol>
        <LessonCard key={card} card={level.tarjetas[card]} />
        <div className="play__actions">
          {card > 0 && (
            <button type="button" className="btn btn--ghost" onClick={() => setCard(card - 1)}>
              <ArrowLeft aria-hidden="true" /> Atrás
            </button>
          )}
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => (last ? setPhase('quiz') : setCard(card + 1))}
          >
            {last ? '¡A practicar!' : 'Siguiente'} <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </main>
    );
  }

  if (phase === 'quiz') {
    return (
      <main>
        <QuizRunner
          key={round}
          questions={level.preguntas}
          title={`Nivel ${level.numero}`}
          onExit={() => navigate('/modulos')}
          onFinish={finishQuiz}
        />
      </main>
    );
  }

  const correct = outcome!.quiz.results.filter((r) => r.correct).length;
  const total = outcome!.quiz.results.length;
  const next = levels[index + 1];
  const moduleDone = module.niveles.every((l) => progress.levels[l.id]?.completed);

  return (
    <main className="screen center summary">
      <div className="score-ring pop" style={{ ['--pct' as string]: `${(correct / total) * 100}%` }}>
        <span>
          {correct}/{total}
        </span>
      </div>
      <h1>{correct === total ? '¡Nivel perfecto!' : correct >= total / 2 ? '¡Nivel completado!' : 'Nivel completado'}</h1>
      <p>
        {correct >= total / 2
          ? 'Muy bien. Sigue así.'
          : 'Ya abriste el siguiente nivel. Si quieres, repasa este otra vez.'}
      </p>
      {moduleDone && <p className="badge-note">Terminaste el módulo «{module.titulo}».</p>}
      <Rewards
        points={outcome!.quiz.points}
        coins={outcome!.completion.coins}
        collectibles={outcome!.quiz.collectibles}
        badges={[...outcome!.quiz.badges, ...outcome!.completion.newBadges]}
      />
      <div className="stack">
        {next ? (
          <a className="btn btn--primary btn--block" href={`#/nivel/${next.id}`}>
            Siguiente: nivel {next.numero} <ArrowRight aria-hidden="true" />
          </a>
        ) : (
          <a className="btn btn--primary btn--block" href="#/simulador">
            Ir al simulador <ArrowRight aria-hidden="true" />
          </a>
        )}
        {level.id === 'nivel-6' && (
          <a className="btn btn--ghost btn--block" href="#/progreso">
            Ver mi álbum de cromos
          </a>
        )}
        <button type="button" className="btn btn--ghost btn--block" onClick={restart}>
          <RotateCcw aria-hidden="true" /> Repetir nivel
        </button>
        <a className="btn btn--link" href="#/modulos">
          Volver a los módulos
        </a>
      </div>
    </main>
  );
}
