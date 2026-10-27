import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { useRoute } from './lib/router';
import { CompetitionScreen } from './screens/CompetitionScreen';
import { FinalChallengeScreen } from './screens/FinalChallengeScreen';
import { LevelScreen } from './screens/LevelScreen';
import { ModulesScreen } from './screens/ModulesScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { SimulatorScreen } from './screens/SimulatorScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';

export function App() {
  const [section = '', param] = useRoute();

  if (section === '') return <WelcomeScreen />;

  // Dentro de un nivel no hay barra inferior: una sola tarea en pantalla.
  if (section === 'nivel' && param) {
    return (
      <div className="app app--focus">
        <LevelScreen key={param} levelId={param} />
      </div>
    );
  }

  let screen;
  switch (section) {
    case 'simulador':
      screen = <SimulatorScreen />;
      break;
    case 'reto':
      screen = <FinalChallengeScreen />;
      break;
    case 'competencia':
      screen = <CompetitionScreen />;
      break;
    case 'progreso':
      screen = <ProgressScreen />;
      break;
    default:
      screen = <ModulesScreen />;
  }

  return (
    <div className="app">
      <Header />
      {screen}
      <TabBar current={section} />
    </div>
  );
}
