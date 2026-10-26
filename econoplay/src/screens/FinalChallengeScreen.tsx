import { useState } from 'react';
import { ArrowRight, BookOpen, CircleCheck, Lightbulb, RotateCcw, Trophy } from 'lucide-react';
import { content, levels } from '../data';
import type { Question } from '../data/types';
import { QuizRunner, type QuizOutcome } from '../components/QuizRunner';
import { Rewards } from '../components/Rewards';
import { Source } from '../components/Source';
import { completeFinal, completedLevels, summarizeConcepts, type CompletionResult } from '../lib/progress';
import { sample, shuffle } from '../lib/shuffle';
import { useProgress } from '../state/ProgressContext';

function buildChallenge(): Question[] {
  const perLevel = content.retoFinal.preguntasPorNivel;
  return shuffle(levels.flatMap((l) => sample(l.preguntas, perLevel)));
}

/** Primer nivel que trabaja un concepto, para enviar a repasar. */
function levelForConcept(concepto: string) {
  return levels.find((l) => l.preguntas.some((q) => q.concepto === concepto));
}

export function FinalChallengeScreen() {
  const reto = content.retoFinal;
  const { progress, update } = useProgress();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [result, setResult] = useState<{
    quiz: QuizOutcome;
    completion: CompletionResult;
    mastered: string[];
    review: string[];
  } | null>(null);

  function start() {
    setResult(null);
    setQuestions(buildChallenge());
  }

  function finish(quiz: QuizOutcome) {
    const correct = quiz.results.filter((r) => r.correct).length;
    const { mastered, review } = summarizeConcepts(
      quiz.results.map((r) => ({ concepto: r.question.concepto, correct: r.correct })),
    );
    const completion = update((p) => completeFinal(p, correct, quiz.results.length, mastered, review));
    setResult({ quiz, completion, mastered, review });
    setQuestions(null);
    window.scrollTo(0, 0);
  }

  if (questions) {
    return (
      <main>
        <QuizRunner questions={questions} title="Reto final" onExit={() => setQuestions(null)} onFinish={finish} />
      </main>
    );
  }

  if (result) {
    const correct = result.quiz.results.filter((r) => r.correct).length;
    const total = result.quiz.results.length;
    return (
      <main className="screen">
        <section className="hero-card hero-card--reto center">
          <div className="score-ring pop" style={{ ['--pct' as string]: `${(correct / total) * 100}%` }}>
            <span>
              {correct}/{total}
            </span>
          </div>
          <h1>¡Reto terminado!</h1>
        </section>
        <Rewards
          points={result.quiz.points}
          coins={result.completion.coins}
          collectibles={result.quiz.collectibles}
          badges={[...result.quiz.badges, ...result.completion.newBadges]}
        />

        <section className="concepts">
          <h2>
            <CircleCheck aria-hidden="true" /> Conceptos que dominas
          </h2>
          {result.mastered.length ? (
            <ul className="concept-list">
              {result.mastered.map((c) => (
                <li key={c} className="concept concept--ok">
                  {c}
                </li>
              ))}
            </ul>
          ) : (
            <p>Todavía ninguno por completo. ¡Con un repaso lo logras!</p>
          )}
        </section>

        <section className="concepts">
          <h2>
            <BookOpen aria-hidden="true" /> Conceptos para repasar
          </h2>
          {result.review.length ? (
            <ul className="concept-list">
              {result.review.map((c) => {
                const level = levelForConcept(c);
                return (
                  <li key={c} className="concept concept--review">
                    <span>{c}</span>
                    {level && (
                      <a className="btn btn--small" href={`#/nivel/${level.id}`}>
                        Repasar nivel {level.numero}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>¡Nada! Respondiste bien todos los conceptos.</p>
          )}
        </section>

        <article className="lesson-card lesson-card--idea">
          <h2>
            <Lightbulb aria-hidden="true" /> {reto.cierre.titulo}
          </h2>
          <p className="lesson-card__text">{reto.cierre.texto}</p>
          <Source text={reto.cierre.fuente} />
        </article>

        <div className="stack">
          <button type="button" className="btn btn--primary btn--block" onClick={start}>
            <RotateCcw aria-hidden="true" /> Intentar otro reto
          </button>
          <a className="btn btn--ghost btn--block" href="#/progreso">
            Ver mi progreso
          </a>
        </div>
      </main>
    );
  }

  const total = levels.length * reto.preguntasPorNivel;
  const pending = levels.length - completedLevels(progress);

  return (
    <main className="screen">
      <section className="hero-card hero-card--reto">
        <Trophy size={40} aria-hidden="true" />
        <h1>{reto.titulo}</h1>
        <p>{reto.intro}</p>
        <p>
          <strong>{total} preguntas</strong> de los 4 módulos. Algunas son contrarreloj.
        </p>
        {progress.final.completed && (
          <p>
            Tu mejor resultado: {progress.final.best}/{progress.final.total}
          </p>
        )}
      </section>
      {pending > 0 && (
        <p className="note">
          Te faltan {pending} niveles. Puedes intentar el reto ya, pero te irá mejor si los terminas primero.
        </p>
      )}
      <button type="button" className="btn btn--primary btn--block" onClick={start}>
        Empezar el reto <ArrowRight aria-hidden="true" />
      </button>
    </main>
  );
}
