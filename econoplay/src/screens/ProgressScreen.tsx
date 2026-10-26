import { useState } from 'react';
import { Award, BookMarked, Coins, Flame, Lock, Medal, Star, Trash2 } from 'lucide-react';
import { content, levels } from '../data';
import type { Collectible } from '../data/types';
import { CollectibleCard } from '../components/CollectibleCard';
import { CollectibleDetail } from '../components/CollectibleDetail';
import { ProgressBar } from '../components/ProgressBar';
import { ALL_LEVELS_OPEN, completedLevels, overallProgress } from '../lib/progress';
import { useProgress } from '../state/ProgressContext';

export function ProgressScreen() {
  const { progress, set, reset } = useProgress();
  const [open, setOpen] = useState<Collectible | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const stats = [
    { Icon: Star, label: 'Puntos', value: progress.points },
    { Icon: Coins, label: 'Monedas', value: progress.coins },
    { Icon: Flame, label: 'Mejor racha', value: progress.bestStreak },
    { Icon: Award, label: 'Niveles', value: `${completedLevels(progress)}/${levels.length}` },
  ];

  return (
    <main className="screen">
      <section className="hero-card">
        <h1>Progreso y recompensas</h1>
        <p>Avance general: {Math.round(overallProgress(progress) * 100)} %</p>
        <ProgressBar value={overallProgress(progress)} label="Avance general" tone="gold" />
      </section>

      <ul className="stat-grid">
        {stats.map(({ Icon, label, value }) => (
          <li key={label} className="stat-card">
            <Icon aria-hidden="true" />
            <strong>{value}</strong>
            <span>{label}</span>
          </li>
        ))}
      </ul>
      <p className="note">Las monedas sirven para pedir pistas: quitan una opción incorrecta.</p>

      <section aria-labelledby="album-title">
        <h2 id="album-title">
          Álbum de cromos ({progress.collectibles.length}/{content.cromos.length})
        </h2>
        <p className="note">Desbloquea cromos respondiendo bien en el nivel 6. Toca un cromo para leerlo.</p>
        <div className="album">
          {content.cromos.map((c, i) => (
            <CollectibleCard
              key={c.id}
              card={c}
              number={i + 1}
              unlocked={progress.collectibles.includes(c.id)}
              onOpen={() => setOpen(c)}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="badges-title">
        <h2 id="badges-title">
          Insignias ({progress.badges.length}/{content.insignias.length})
        </h2>
        <ul className="badges">
          {content.insignias.map((b) => {
            const has = progress.badges.includes(b.id);
            return (
              <li key={b.id} className={`badge ${has ? 'badge--on' : ''}`}>
                <span className="badge__icon" aria-hidden="true">
                  {has ? <Medal /> : <Lock size={20} />}
                </span>
                <span>
                  <strong>{b.nombre}</strong>
                  <span>{b.descripcion}</span>
                  <span className="sr-only">{has ? 'Ganada' : 'Pendiente'}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="panel" aria-labelledby="settings-title">
        <h2 id="settings-title">Opciones</h2>
        {!ALL_LEVELS_OPEN && (
          <label className="switch">
            <input
              type="checkbox"
              checked={progress.unlockAll}
              onChange={(e) => set((p) => ({ ...p, unlockAll: e.target.checked }))}
            />
            <span>
              <strong>Modo presentador</strong>
              <span>Abre todos los niveles sin terminarlos. Útil para exponer en clase.</span>
            </span>
          </label>
        )}
        {!confirmReset ? (
          <button type="button" className="btn btn--ghost btn--block" onClick={() => setConfirmReset(true)}>
            <Trash2 aria-hidden="true" /> Borrar mi progreso
          </button>
        ) : (
          <div className="confirm" role="alertdialog" aria-labelledby="reset-title">
            <p id="reset-title">¿Seguro? Se borran puntos, monedas, cromos e insignias de este navegador.</p>
            <div className="confirm__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setConfirmReset(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => {
                  reset();
                  setConfirmReset(false);
                }}
              >
                Sí, borrar
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="panel about" aria-labelledby="about-title">
        <h2 id="about-title">
          <BookMarked aria-hidden="true" /> Sobre el contenido
        </h2>
        <p>{content.app.aviso}</p>
        <p>
          <strong>Documento base:</strong> {content.app.documento}
        </p>
        <p>
          <strong>Referencia:</strong> {content.app.referencia}
        </p>
        <p className="note">Tu progreso se guarda solo en este navegador. No se envía a ningún servidor.</p>
      </section>

      {open && <CollectibleDetail card={open} onClose={() => setOpen(null)} />}
    </main>
  );
}
