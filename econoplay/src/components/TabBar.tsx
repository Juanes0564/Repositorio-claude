import { Award, LayoutGrid, Scale, Trophy, Users } from 'lucide-react';

const TABS = [
  { path: 'modulos', label: 'Módulos', Icon: LayoutGrid },
  { path: 'simulador', label: 'Simulador', Icon: Scale },
  { path: 'reto', label: 'Reto final', Icon: Trophy },
  { path: 'competencia', label: 'Competir', Icon: Users },
  { path: 'progreso', label: 'Progreso', Icon: Award },
];

export function TabBar({ current }: { current: string }) {
  return (
    <nav className="tabbar" aria-label="Secciones">
      {TABS.map(({ path, label, Icon }) => (
        <a key={path} href={`#/${path}`} className="tabbar__item" aria-current={current === path ? 'page' : undefined}>
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
