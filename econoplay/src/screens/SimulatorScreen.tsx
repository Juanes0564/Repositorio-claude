import { useMemo, useState } from 'react';
import { ArrowRight, MessageCircleQuestion, RotateCcw, Scale } from 'lucide-react';
import { content, schoolName } from '../data';
import type { SchoolId } from '../data/types';
import { Rewards } from '../components/Rewards';
import { SchoolTag } from '../components/SchoolTag';
import { Source } from '../components/Source';
import { completeSimulator, type CompletionResult } from '../lib/progress';
import { shuffle } from '../lib/shuffle';
import { useProgress } from '../state/ProgressContext';

const SCHOOLS: SchoolId[] = ['neoclasica', 'austriaca', 'marxista'];

export function SimulatorScreen() {
  const sim = content.simulador;
  const { update } = useProgress();
  const [step, setStep] = useState(-1);
  const [choices, setChoices] = useState<Record<string, SchoolId>>({});
  const [completion, setCompletion] = useState<CompletionResult | null>(null);
  const [round, setRound] = useState(0);

  // Las opciones se mezclan para que no se adivine la escuela por el orden.
  const options = useMemo(
    () => sim.situaciones.map((s) => shuffle(s.opciones)),
    [sim.situaciones, round],
  );

  if (step === -1) {
    return (
      <main className="screen">
        <section className="hero-card hero-card--sim">
          <Scale size={40} aria-hidden="true" />
          <h1>{sim.titulo}</h1>
          <p>{sim.intro}</p>
          <p className="note">{sim.aviso}</p>
        </section>
        <article className="lesson-card">
          <h2>
            <MessageCircleQuestion aria-hidden="true" /> {sim.controversia.titulo}
          </h2>
          <p className="lesson-card__text">{sim.controversia.texto}</p>
          <Source text={sim.controversia.fuente} />
        </article>
        <button type="button" className="btn btn--primary btn--block" onClick={() => setStep(0)}>
          Empezar <ArrowRight aria-hidden="true" />
        </button>
      </main>
    );
  }

  if (step >= sim.situaciones.length) {
    const tally = SCHOOLS.map((s) => ({ school: s, count: Object.values(choices).filter((c) => c === s).length }));
    return (
      <main className="screen">
        <section className="hero-card hero-card--sim center">
          <h1>¡Simulador completado!</h1>
          <p>Así se repartieron tus elecciones:</p>
          <ul className="tally">
            {tally.map(({ school, count }) => (
              <li key={school} className={`tally__item tally__item--${school}`}>
                <SchoolTag school={school} />
                <span className="tally__bar" aria-hidden="true">
                  <span style={{ width: `${(count / sim.situaciones.length) * 100}%` }} />
                </span>
                <span>
                  {count} de {sim.situaciones.length}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <Rewards coins={completion?.coins} badges={completion?.newBadges} />
        <article className="lesson-card">
          <h2>{sim.cierre.titulo}</h2>
          <p className="lesson-card__text">{sim.cierre.texto}</p>
          <Source text={sim.cierre.fuente} />
        </article>
        <article className="lesson-card">
          <h2>{sim.controversia.titulo}</h2>
          <p className="lesson-card__text">{sim.controversia.texto}</p>
          <Source text={sim.controversia.fuente} />
        </article>
        <div className="stack">
          <a className="btn btn--primary btn--block" href="#/reto">
            Ir al reto final <ArrowRight aria-hidden="true" />
          </a>
          <button
            type="button"
            className="btn btn--ghost btn--block"
            onClick={() => {
              setChoices({});
              setCompletion(null);
              setRound((r) => r + 1);
              setStep(0);
            }}
          >
            <RotateCcw aria-hidden="true" /> Jugar otra vez
          </button>
        </div>
      </main>
    );
  }

  const situation = sim.situaciones[step];
  const chosen = choices[situation.id];

  function choose(school: SchoolId) {
    setChoices((c) => ({ ...c, [situation.id]: school }));
  }

  function next() {
    const nextStep = step + 1;
    if (nextStep >= sim.situaciones.length) {
      setCompletion(update((p) => completeSimulator(p, choices)));
    }
    setStep(nextStep);
    window.scrollTo(0, 0);
  }

  return (
    <main className="screen">
      <p className="play__crumb">
        Situación {step + 1} de {sim.situaciones.length}
      </p>
      <article className="situation slide-in" key={situation.id}>
        <h1>{situation.titulo}</h1>
        <p className="situation__story">{situation.historia}</p>
        <h2 className="situation__question">{situation.pregunta}</h2>
        <div className="choices" role="group" aria-label="Opciones">
          {options[step].map((o, i) => (
            <button
              key={o.texto}
              type="button"
              className={`choice choice--${i % 4} ${chosen === o.escuela ? 'is-selected' : ''} ${chosen && chosen !== o.escuela ? 'is-dim' : ''}`}
              aria-pressed={chosen === o.escuela}
              disabled={Boolean(chosen)}
              onClick={() => choose(o.escuela)}
            >
              <span className="choice__letter" aria-hidden="true">
                {'ABC'[i]}
              </span>
              <span className="choice__label">{o.texto}</span>
            </button>
          ))}
        </div>
      </article>

      {chosen && (
        <section className="analysis slide-in" aria-live="polite">
          <p className="analysis__intro">
            Tu elección se acerca a la mirada de la <strong>{schoolName(chosen).toLowerCase()}</strong>. Así lo
            analizaría cada escuela:
          </p>
          {SCHOOLS.map((s) => (
            <article key={s} className={`analysis__card analysis__card--${s} ${chosen === s ? 'is-chosen' : ''}`}>
              <header>
                <SchoolTag school={s} />
                {chosen === s && <span className="chip">Tu elección</span>}
              </header>
              <p>{situation.analisis[s].texto}</p>
              <Source text={situation.analisis[s].fuente} />
            </article>
          ))}
          <p className="note">No hay una respuesta única: cada escuela parte de un marco distinto.</p>
          <button type="button" className="btn btn--primary btn--block" onClick={next}>
            {step + 1 < sim.situaciones.length ? 'Siguiente situación' : 'Ver resumen'}{' '}
            <ArrowRight aria-hidden="true" />
          </button>
        </section>
      )}
    </main>
  );
}
