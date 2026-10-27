import { useState } from 'react';
import { ArrowRight, Crown, Flag, Minus, Plus, RotateCcw, Star, Users } from 'lucide-react';
import { content, levels } from '../data';
import type { Question } from '../data/types';
import { QuestionCard } from '../components/QuestionCard';
import { prepareQuestion, type PreparedQuestion } from '../lib/quiz';
import { sample } from '../lib/shuffle';

const ROUND_OPTIONS = [3, 5, 8];
const MIN_TEAMS = 2;
const MAX_TEAMS = 6;
const BASE_POINTS = 500;
const SPEED_POINTS = 500;

interface Team {
  /** Posición original: define el color del equipo. */
  id: number;
  name: string;
  score: number;
  correct: number;
}

type Phase = 'setup' | 'ready' | 'question' | 'board' | 'final';

/** Puntaje tipo Kahoot: 500 por acertar, hasta 500 más por rapidez. */
export function competitionPoints(correct: boolean, timeRatio = 0): number {
  return correct ? BASE_POINTS + Math.round(SPEED_POINTS * timeRatio) : 0;
}

// En competencia no se usan preguntas de relacionar: son lentas de proyectar.
const POOL: Question[] = levels.flatMap((l) => l.preguntas).filter((q) => q.tipo !== 'relacionar');

export function CompetitionScreen() {
  const comp = content.competencia;
  const [phase, setPhase] = useState<Phase>('setup');
  const [names, setNames] = useState(['Equipo 1', 'Equipo 2', 'Equipo 3']);
  const [rounds, setRounds] = useState(5);
  const [teams, setTeams] = useState<Team[]>([]);
  const [queue, setQueue] = useState<PreparedQuestion[]>([]);
  const [turn, setTurn] = useState(0);
  const [lastPoints, setLastPoints] = useState<number | null>(null);

  const teamCount = teams.length || names.length;
  const current = teams[turn % teamCount];
  const round = Math.floor(turn / teamCount) + 1;

  function start(teamNames = names) {
    const clean = teamNames.map((n, i) => n.trim() || `Equipo ${i + 1}`);
    setTeams(clean.map((name, id) => ({ id, name, score: 0, correct: 0 })));
    setQueue(sample(POOL, rounds * clean.length).map((q) => prepareQuestion(q)));
    setTurn(0);
    setPhase('ready');
  }

  function answered(correct: boolean, ratio?: number) {
    const pts = competitionPoints(correct, ratio);
    setLastPoints(pts);
    setTeams((ts) =>
      ts.map((t, i) => (i === turn % ts.length ? { ...t, score: t.score + pts, correct: t.correct + (correct ? 1 : 0) } : t)),
    );
  }

  function nextTurn() {
    if (turn + 1 >= queue.length) {
      setPhase('final');
    } else {
      setTurn(turn + 1);
      setPhase('ready');
    }
  }

  const ranking = [...teams].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(1, ...teams.map((t) => t.score));

  if (phase === 'setup') {
    return (
      <main className="screen">
        <section className="hero-card hero-card--comp">
          <Users size={40} aria-hidden="true" />
          <h1>{comp.titulo}</h1>
          <p>{comp.intro}</p>
          <p className="note">
            {comp.segundosPorPregunta} segundos por pregunta · {BASE_POINTS} puntos por acertar + hasta {SPEED_POINTS} por
            rapidez.
          </p>
        </section>

        <section className="panel" aria-labelledby="teams-title">
          <div className="panel__row">
            <h2 id="teams-title">Equipos</h2>
            <div className="stepper">
              <button
                type="button"
                className="icon-btn"
                aria-label="Quitar un equipo"
                disabled={names.length <= MIN_TEAMS}
                onClick={() => setNames(names.slice(0, -1))}
              >
                <Minus aria-hidden="true" />
              </button>
              <span aria-live="polite">{names.length}</span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Agregar un equipo"
                disabled={names.length >= MAX_TEAMS}
                onClick={() => setNames([...names, `Equipo ${names.length + 1}`])}
              >
                <Plus aria-hidden="true" />
              </button>
            </div>
          </div>
          <ol className="team-inputs">
            {names.map((n, i) => (
              <li key={i}>
                <label>
                  <span className="sr-only">Nombre del equipo {i + 1}</span>
                  <span className={`team-dot team-dot--${i}`} aria-hidden="true" />
                  <input
                    value={n}
                    maxLength={24}
                    onChange={(e) => setNames(names.map((x, j) => (j === i ? e.target.value : x)))}
                  />
                </label>
              </li>
            ))}
          </ol>
        </section>

        <section className="panel" aria-labelledby="rounds-title">
          <h2 id="rounds-title">Rondas</h2>
          <p className="note">En cada ronda, cada equipo responde una pregunta.</p>
          <div className="segmented" role="group" aria-label="Número de rondas">
            {ROUND_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                className={`segment ${rounds === r ? 'is-selected' : ''}`}
                aria-pressed={rounds === r}
                onClick={() => setRounds(r)}
              >
                {r} rondas
              </button>
            ))}
          </div>
        </section>

        <button type="button" className="btn btn--primary btn--block" onClick={() => start()}>
          ¡Empezar competencia! <ArrowRight aria-hidden="true" />
        </button>
      </main>
    );
  }

  if (phase === 'ready') {
    return (
      <main className="screen screen--wide center">
        <p className="play__crumb">
          Ronda {round} de {rounds} · Pregunta {turn + 1} de {queue.length}
        </p>
        <div className={`turn-card turn-card--${turn % teamCount} pop`}>
          <p>Turno de</p>
          <h1>{current.name}</h1>
        </div>
        <p>El equipo tendrá {comp.segundosPorPregunta} segundos. ¿Listos?</p>
        <button type="button" className="btn btn--primary btn--xl" onClick={() => setPhase('question')}>
          Mostrar pregunta <ArrowRight aria-hidden="true" />
        </button>
      </main>
    );
  }

  if (phase === 'question') {
    return (
      <main className="screen screen--wide">
        <p className={`turn-banner turn-banner--${turn % teamCount}`}>
          Turno de <strong>{current.name}</strong> · Ronda {round} de {rounds}
        </p>
        <QuestionCard
          key={turn}
          big
          prepared={queue[turn]}
          timeLimit={comp.segundosPorPregunta}
          onAnswered={answered}
          extraFeedback={
            lastPoints !== null && (
              <p className="points-won pop">
                <Star aria-hidden="true" /> +{lastPoints} puntos para {current.name}
              </p>
            )
          }
          continueLabel="Ver marcador"
          onContinue={() => {
            setLastPoints(null);
            setPhase('board');
          }}
        />
      </main>
    );
  }

  if (phase === 'board') {
    const last = turn + 1 >= queue.length;
    return (
      <main className="screen screen--wide">
        <h1>Marcador</h1>
        <Scoreboard ranking={ranking} maxScore={maxScore} />
        <div className="stack">
          <button type="button" className="btn btn--primary btn--block" onClick={nextTurn}>
            {last ? 'Ver resultados finales' : 'Siguiente turno'} <ArrowRight aria-hidden="true" />
          </button>
          {!last && (
            <button type="button" className="btn btn--ghost btn--block" onClick={() => setPhase('final')}>
              <Flag aria-hidden="true" /> Terminar ahora
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="screen screen--wide center">
      <h1>¡Resultados finales!</h1>
      <ol className="podium">
        {ranking.slice(0, 3).map((t, i) => (
          <li key={t.id} className={`podium__place podium__place--${i + 1} pop`}>
            {i === 0 && <Crown aria-hidden="true" />}
            <span className="podium__pos">{i + 1}.º</span>
            <span className="podium__name">{t.name}</span>
            <span className="podium__score">{t.score} pts</span>
          </li>
        ))}
      </ol>
      <Scoreboard ranking={ranking} maxScore={maxScore} />
      <div className="stack">
        <button type="button" className="btn btn--primary btn--block" onClick={() => start(teams.map((t) => t.name))}>
          <RotateCcw aria-hidden="true" /> Revancha con los mismos equipos
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={() => setPhase('setup')}>
          Cambiar equipos
        </button>
      </div>
    </main>
  );
}

function Scoreboard({ ranking, maxScore }: { ranking: Team[]; maxScore: number }) {
  return (
    <ol className="scoreboard">
      {ranking.map((t, i) => {
        return (
          <li key={t.id} className="scoreboard__row">
            <span className="scoreboard__pos">{i + 1}</span>
            <span className={`team-dot team-dot--${t.id}`} aria-hidden="true" />
            <span className="scoreboard__name">{t.name}</span>
            <span className="scoreboard__bar" aria-hidden="true">
              <span className={`team-fill team-fill--${t.id}`} style={{ width: `${(t.score / maxScore) * 100}%` }} />
            </span>
            <span className="scoreboard__score">
              {t.score} <span className="sr-only">puntos</span>
              <small>{t.correct} aciertos</small>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
