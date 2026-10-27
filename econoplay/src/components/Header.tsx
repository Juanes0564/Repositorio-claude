import { Logo } from './Logo';
import { Stats } from './Stats';

export function Header() {
  return (
    <header className="header">
      <a className="header__brand" href="#/">
        <Logo size={34} />
        <span>Econoplay</span>
      </a>
      <Stats />
    </header>
  );
}
