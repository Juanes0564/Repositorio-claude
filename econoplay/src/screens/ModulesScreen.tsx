import { Check, Lock, Scale, Trophy, Users } from 'lucide-react';
import { content, modules } from '../data';
import { ProgressBar } from '../components/ProgressBar';
import { completedLevels, isLevelUnlocked, overallProgress } from '../lib/progress';
import { useProgress } from '../state/ProgressContext';

export function ModulesScreen() {
  const { progress } = useProgress();
  const overall = overallProgress(progress);
  const totalLevels = modules.reduce((n, m) => n + m.niveles.length, 0);

  return (
    <main className="screen">
      <section className="hero-card">
        <h1>Tu camino</h1>
        <p>
          {completedLevels(progress)} de {totalLevels} niveles completados
        </p>
        <ProgressBar value={overall} label="Avance general" tone="gold" />
      </section>

      {modules.map((m) => {
        const done = m.niveles.filter((l) => progress.levels[l.id]?.completed).length;
        return (
          <section key={m.id} className={`module module--${m.numero}`} aria-labelledby={`mod-${m.id}`}>
            <header className="module__head">
              <span className="module__num">Módulo {m.numero}</span>
              <h2 id={`mod-${m.id}`}>{m.titulo}</h2>
              <p>
                {m.subtitulo} · <span className="module__doc">{m.preguntasDocumento}</span>
              </p>
              <ProgressBar value={done / m.niveles.length} label={`Avance del módulo ${m.titulo}`} />
            </header>
            <ol className="levels">
              {m.niveles.map((l) => {
                const unlocked = isLevelUnlocked(progress, l.id);
                const record = progress.levels[l.id];
                const state = record?.completed ? 'done' : unlocked ? 'open' : 'locked';
                const Inner = (
                  <>
                    <span className="level__badge" aria-hidden="true">
                      {state === 'done' ? <Check /> : state === 'locked' ? <Lock size={20} /> : l.numero}
                    </span>
                    <span className="level__text">
                      <span className="level__title">
                        Nivel {l.numero}: {l.titulo}
                      </span>
                      <span className="level__desc">{l.descripcion}</span>
                      <span className="level__status">
                        {state === 'done'
                          ? `Completado · mejor puntaje ${record!.best}/${record!.total}`
                          : state === 'open'
                            ? 'Disponible'
                            : 'Termina el nivel anterior para abrirlo'}
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={l.id}>
                    {unlocked ? (
                      <a className={`level level--${state}`} href={`#/nivel/${l.id}`}>
                        {Inner}
                      </a>
                    ) : (
                      <div className="level level--locked" aria-disabled="true">
                        {Inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <section className="extras" aria-label="Más actividades">
        <a className="extra extra--sim" href="#/simulador">
          <Scale aria-hidden="true" />
          <span>
            <strong>{content.simulador.titulo}</strong>
            <span>Decide y compara las tres escuelas.</span>
          </span>
          {progress.simulator.completed && <Check className="extra__done" aria-label="Completado" />}
        </a>
        <a className="extra extra--reto" href="#/reto">
          <Trophy aria-hidden="true" />
          <span>
            <strong>{content.retoFinal.titulo}</strong>
            <span>Comprueba lo que aprendiste.</span>
          </span>
          {progress.final.completed && <Check className="extra__done" aria-label="Completado" />}
        </a>
        <a className="extra extra--comp" href="#/competencia">
          <Users aria-hidden="true" />
          <span>
            <strong>{content.competencia.titulo}</strong>
            <span>Juega por equipos en clase.</span>
          </span>
        </a>
      </section>
    </main>
  );
}
