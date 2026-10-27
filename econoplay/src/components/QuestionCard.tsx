import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, CircleCheck, CircleX, Lightbulb, Timer, X } from 'lucide-react';
import { correctAnswerText, isMatchCorrect, type PreparedQuestion } from '../lib/quiz';
import { questionPrompt } from '../data';
import { Source } from './Source';

const TYPE_LABEL = {
  seleccion: 'Selección múltiple',
  vf: 'Verdadero o falso',
  completar: 'Completa la frase',
  relacionar: 'Relaciona',
} as const;

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

interface Props {
  prepared: PreparedQuestion;
  /** Segundos disponibles. Si no hay, la pregunta no tiene tiempo. */
  timeLimit?: number;
  /** Diseño grande para proyectar (modo competencia). */
  big?: boolean;
  hint?: { label: string; enabled: boolean; onUse: () => boolean };
  onAnswered: (correct: boolean, timeRatio?: number) => void;
  /** Contenido extra en la retroalimentación (puntos ganados, cromos…). */
  extraFeedback?: ReactNode;
  continueLabel?: string;
  onContinue: () => void;
}

function useCountdown(seconds: number | undefined, running: boolean, onExpire: () => void) {
  const [remaining, setRemaining] = useState(seconds ?? 0);
  const expire = useRef(onExpire);
  useEffect(() => {
    expire.current = onExpire;
  });

  useEffect(() => {
    if (!seconds || !running) return;
    const start = Date.now() - (seconds - remaining) * 1000;
    const id = window.setInterval(() => {
      const left = Math.max(0, seconds - (Date.now() - start) / 1000);
      setRemaining(left);
      if (left <= 0) {
        window.clearInterval(id);
        expire.current();
      }
    }, 100);
    return () => window.clearInterval(id);
    // Solo se reinicia al cambiar el tiempo o al pausar; `remaining` se lee al arrancar.
  }, [seconds, running]);

  return remaining;
}

export function QuestionCard({
  prepared,
  timeLimit,
  big,
  hint,
  onAnswered,
  extraFeedback,
  continueLabel = 'Continuar',
  onContinue,
}: Props) {
  const q = prepared.question;
  const [selected, setSelected] = useState<number | null>(null);
  const [picks, setPicks] = useState<(string | null)[]>(
    prepared.kind === 'match' ? prepared.left.map(() => null) : [],
  );
  const [activeSlot, setActiveSlot] = useState(0);
  const [removed, setRemoved] = useState<number[]>([]);
  const [result, setResult] = useState<{ correct: boolean; timeout: boolean } | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const remaining = useCountdown(timeLimit, result === null, () => finish(false, true));

  function finish(correct: boolean, timeout = false) {
    if (result) return;
    setResult({ correct, timeout });
    const ratio = timeLimit ? Math.max(0, remaining) / timeLimit : undefined;
    onAnswered(correct, timeout ? 0 : ratio);
  }

  useEffect(() => {
    if (result) feedbackRef.current?.focus();
  }, [result]);

  const ready =
    prepared.kind === 'choice' ? selected !== null : picks.every((p) => p !== null);

  function check() {
    if (!ready) return;
    if (prepared.kind === 'choice') finish(prepared.choices[selected!].correct);
    else finish(isMatchCorrect(prepared.answers, picks));
  }

  /** Pista: quita una opción incorrecta. */
  function applyHint() {
    if (prepared.kind !== 'choice' || !hint) return;
    const wrong = prepared.choices
      .map((c, i) => ({ c, i }))
      .filter(({ c, i }) => !c.correct && !removed.includes(i));
    if (wrong.length === 0 || !hint.onUse()) return;
    const drop = wrong[Math.floor(Math.random() * wrong.length)].i;
    setRemoved((r) => [...r, drop]);
    if (selected === drop) setSelected(null);
  }

  function pick(option: string) {
    if (prepared.kind !== 'match' || result) return;
    const next = [...picks];
    if (prepared.oneToOne) {
      const used = next.indexOf(option);
      if (used !== -1) next[used] = null;
    }
    next[activeSlot] = option;
    setPicks(next);
    const nextEmpty = next.findIndex((p) => p === null);
    if (nextEmpty !== -1) setActiveSlot(nextEmpty);
  }

  const canHint =
    hint &&
    !result &&
    prepared.kind === 'choice' &&
    q.tipo !== 'vf' &&
    prepared.choices.length - removed.length > 2;

  const timePct = timeLimit ? (remaining / timeLimit) * 100 : 0;

  return (
    <div className={`question ${big ? 'question--big' : ''}`}>
      <div className="question__meta">
        <span className="chip">{TYPE_LABEL[q.tipo]}</span>
        {timeLimit ? (
          <span className={`chip chip--timer ${remaining < 5 && !result ? 'chip--urgent' : ''}`} role="timer">
            <Timer size={16} aria-hidden="true" />
            <span aria-hidden="true">{Math.ceil(remaining)} s</span>
            <span className="sr-only">Contrarreloj de {timeLimit} segundos</span>
          </span>
        ) : null}
      </div>
      {timeLimit ? (
        <div className="timebar" aria-hidden="true">
          <div className="timebar__fill" style={{ width: `${timePct}%` }} />
        </div>
      ) : null}

      <h2 className="question__prompt">
        {q.tipo === 'completar' ? (
          <FillPrompt
            text={q.frase}
            word={
              prepared.kind === 'choice' && selected !== null ? prepared.choices[selected].label : null
            }
          />
        ) : (
          questionPrompt(q)
        )}
      </h2>

      {prepared.kind === 'choice' && (
        <div className={`choices ${q.tipo === 'vf' ? 'choices--vf' : ''}`} role="group" aria-label="Opciones">
          {prepared.choices.map((c, i) => {
            if (removed.includes(i)) return null;
            const state = result
              ? c.correct
                ? 'correct'
                : selected === i
                  ? 'wrong'
                  : 'dim'
              : selected === i
                ? 'selected'
                : '';
            return (
              <button
                key={c.label}
                type="button"
                className={`choice choice--${i % 4} ${state ? `is-${state}` : ''}`}
                aria-pressed={selected === i}
                disabled={Boolean(result)}
                onClick={() => setSelected(i)}
              >
                <span className="choice__letter" aria-hidden="true">
                  {q.tipo === 'vf' ? (i === 0 ? <Check size={22} /> : <X size={22} />) : LETTERS[i]}
                </span>
                <span className="choice__label">{c.label}</span>
                {result && c.correct && <CircleCheck className="choice__mark" aria-label="Respuesta correcta" />}
                {result && !c.correct && selected === i && (
                  <CircleX className="choice__mark" aria-label="Tu respuesta" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {prepared.kind === 'match' && !prepared.oneToOne && (
        <ul className="classify">
          {prepared.left.map((item, i) => (
            <li key={item} className="classify__row">
              <p className="classify__item">{item}</p>
              <div className="segmented" role="group" aria-label={`Escuela para: ${item}`}>
                {prepared.options.map((opt) => {
                  const chosen = picks[i] === opt;
                  const state = result
                    ? prepared.answers[i] === opt
                      ? 'correct'
                      : chosen
                        ? 'wrong'
                        : 'dim'
                    : chosen
                      ? 'selected'
                      : '';
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`segment ${state ? `is-${state}` : ''}`}
                      aria-pressed={chosen}
                      disabled={Boolean(result)}
                      onClick={() => {
                        const next = [...picks];
                        next[i] = opt;
                        setPicks(next);
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}

      {prepared.kind === 'match' && prepared.oneToOne && (
        <div className="match">
          <p className="match__help">Toca un espacio y luego elige su pareja.</p>
          <ol className="match__slots">
            {prepared.left.map((item, i) => {
              const state = result
                ? picks[i] === prepared.answers[i]
                  ? 'correct'
                  : 'wrong'
                : activeSlot === i
                  ? 'active'
                  : '';
              return (
                <li key={item}>
                  <button
                    type="button"
                    className={`slot ${state ? `is-${state}` : ''}`}
                    aria-pressed={activeSlot === i && !result}
                    disabled={Boolean(result)}
                    onClick={() => setActiveSlot(i)}
                  >
                    <span className="slot__left">{item}</span>
                    <span className="slot__right">{picks[i] ?? 'Elige abajo'}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          {!result && (
            <div className="bank" role="group" aria-label={`Opciones para: ${prepared.left[activeSlot]}`}>
              {prepared.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`bank__chip ${picks.includes(opt) ? 'is-used' : ''}`}
                  onClick={() => pick(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {!result ? (
        <div className="question__actions">
          {canHint && (
            <button type="button" className="btn btn--ghost" disabled={!hint.enabled} onClick={applyHint}>
              <Lightbulb size={20} aria-hidden="true" />
              {hint.label}
            </button>
          )}
          <button type="button" className="btn btn--primary" disabled={!ready} onClick={check}>
            Comprobar
          </button>
        </div>
      ) : (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          className={`feedback ${result.correct ? 'feedback--ok' : 'feedback--bad'}`}
          role="status"
        >
          <p className="feedback__title">
            {result.correct ? (
              <>
                <CircleCheck aria-hidden="true" /> ¡Correcto!
              </>
            ) : (
              <>
                <CircleX aria-hidden="true" /> {result.timeout ? 'Se acabó el tiempo' : 'No es correcto'}
              </>
            )}
          </p>
          {!result.correct && (
            <p className="feedback__answer">
              <strong>Respuesta correcta:</strong> {correctAnswerText(prepared)}
            </p>
          )}
          <p className="feedback__text">{q.explicacion}</p>
          <Source text={q.fuente} />
          {extraFeedback}
          <button type="button" className="btn btn--primary btn--block" onClick={onContinue}>
            {continueLabel}
          </button>
        </div>
      )}
    </div>
  );
}

function FillPrompt({ text, word }: { text: string; word: string | null }) {
  const [before, after] = text.split('___');
  return (
    <>
      {before}
      <span className={`blank ${word ? 'blank--filled' : ''}`}>
        {word ?? <span aria-label="espacio en blanco">______</span>}
      </span>
      {after}
    </>
  );
}
