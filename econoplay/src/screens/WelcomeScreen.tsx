import { ArrowRight, BookOpen, Gamepad2, Scale, Trophy, Users } from 'lucide-react';
import { content } from '../data';
import { Logo } from '../components/Logo';
import { overallProgress } from '../lib/progress';
import { useProgress } from '../state/ProgressContext';

const FEATURES = [
  { Icon: BookOpen, text: 'Lecciones cortas' },
  { Icon: Gamepad2, text: 'Retos y cromos' },
  { Icon: Scale, text: 'Simulador de decisiones' },
  { Icon: Trophy, text: 'Reto final' },
];

export function WelcomeScreen() {
  const { progress } = useProgress();
  const started = overallProgress(progress) > 0 || progress.points > 0;

  return (
    <main className="welcome">
      <div className="welcome__inner">
        <div className="welcome__logo float">
          <Logo size={112} />
        </div>
        <h1 className="welcome__title">{content.app.nombre}</h1>
        <p className="welcome__lema">{content.app.lema}</p>
        <p className="welcome__desc">{content.app.descripcion}</p>
        <ul className="welcome__features">
          {FEATURES.map(({ Icon, text }) => (
            <li key={text}>
              <Icon aria-hidden="true" /> {text}
            </li>
          ))}
        </ul>
        <div className="stack">
          <a className="btn btn--primary btn--xl btn--block" href="#/modulos">
            {started ? 'Continuar' : 'Empezar a jugar'} <ArrowRight aria-hidden="true" />
          </a>
          <a className="btn btn--light btn--block" href="#/competencia">
            <Users aria-hidden="true" /> Modo competencia
          </a>
        </div>
        <p className="welcome__credit">
          Historia del Pensamiento Económico II · UNAB
          <br />
          Basado en la ficha de investigación del equipo y en Ekelund y Hébert (1992).
        </p>
      </div>
    </main>
  );
}
