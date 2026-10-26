import { describe, expect, it } from 'vitest';
import { content, levels } from '../src/data';
import {
  COINS_LEVEL,
  COINS_PERFECT,
  HINT_COST,
  applyAnswer,
  awardBadges,
  completeFinal,
  completeLevel,
  completeSimulator,
  initialProgress,
  isLevelUnlocked,
  pointsFor,
  spendHint,
  summarizeConcepts,
} from '../src/lib/progress';

describe('desbloqueo de niveles', () => {
  it('solo el nivel 1 está abierto al inicio', () => {
    expect(isLevelUnlocked(initialProgress, 'nivel-1')).toBe(true);
    expect(isLevelUnlocked(initialProgress, 'nivel-2')).toBe(false);
  });

  it('terminar un nivel abre el siguiente, sin importar el puntaje', () => {
    const { progress } = completeLevel(initialProgress, 'nivel-1', 0, 8);
    expect(isLevelUnlocked(progress, 'nivel-2')).toBe(true);
    expect(isLevelUnlocked(progress, 'nivel-3')).toBe(false);
  });

  it('el modo presentador abre todo', () => {
    const p = { ...initialProgress, unlockAll: true };
    expect(levels.every((l) => isLevelUnlocked(p, l.id))).toBe(true);
  });
});

describe('puntos y monedas', () => {
  it('da puntos por acierto, rapidez y racha', () => {
    expect(pointsFor(false, 0)).toBe(0);
    expect(pointsFor(true, 1)).toBe(10);
    expect(pointsFor(true, 1, 1)).toBe(15);
    expect(pointsFor(true, 3)).toBe(12);
  });

  it('suma racha y la reinicia al fallar', () => {
    let p = initialProgress;
    for (let i = 0; i < 5; i++) p = applyAnswer(p, true).progress;
    expect(p.streak).toBe(5);
    expect(p.badges).toContain('racha');
    p = applyAnswer(p, false).progress;
    expect(p.streak).toBe(0);
    expect(p.bestStreak).toBe(5);
  });

  it('desbloquea cromos solo al acertar', () => {
    expect(applyAnswer(initialProgress, false, undefined, ['jevons']).progress.collectibles).toEqual([]);
    const { progress, result } = applyAnswer(initialProgress, true, undefined, ['jevons']);
    expect(progress.collectibles).toEqual(['jevons']);
    expect(result.newCollectibles).toEqual(['jevons']);
    expect(applyAnswer(progress, true, undefined, ['jevons']).result.newCollectibles).toEqual([]);
  });

  it('da monedas la primera vez y extra por nivel perfecto', () => {
    const first = completeLevel(initialProgress, 'nivel-1', 8, 8);
    expect(first.result.coins).toBe(COINS_LEVEL + COINS_PERFECT);
    const again = completeLevel(first.progress, 'nivel-1', 8, 8);
    expect(again.result.coins).toBe(0);
    expect(first.progress.badges).toEqual(expect.arrayContaining(['primer-nivel', 'perfecto']));
  });

  it('la pista cuesta monedas y no deja saldo negativo', () => {
    expect(spendHint(initialProgress)).toBeNull();
    const p = spendHint({ ...initialProgress, coins: HINT_COST })!;
    expect(p.coins).toBe(0);
  });
});

describe('insignias', () => {
  it('módulo completo y álbum completo', () => {
    let p = completeLevel(initialProgress, 'nivel-1', 6, 8).progress;
    p = completeLevel(p, 'nivel-2', 6, 8).progress;
    expect(p.badges).toContain('modulo-origenes');
    const album = awardBadges({ ...p, collectibles: content.cromos.map((c) => c.id) });
    expect(album.newBadges).toContain('album');
  });

  it('simulador y reto final', () => {
    const sim = completeSimulator(initialProgress, {});
    expect(sim.progress.badges).toContain('simulador');
    const fin = completeFinal(sim.progress, 10, 16, ['A'], ['B']);
    expect(fin.progress.badges).toContain('reto');
    expect(fin.progress.final).toMatchObject({ best: 10, total: 16, mastered: ['A'], review: ['B'] });
  });

  it('todas las insignias que otorga la lógica existen en el contenido', () => {
    const ids = new Set(content.insignias.map((b) => b.id));
    const all = {
      ...initialProgress,
      bestStreak: 5,
      collectibles: content.cromos.map((c) => c.id),
      levels: Object.fromEntries(levels.map((l) => [l.id, { completed: true, best: 8, total: 8, perfect: true }])),
      simulator: { completed: true, choices: {} },
      final: { ...initialProgress.final, completed: true },
    };
    const { progress } = awardBadges(all);
    expect(progress.badges.length).toBe(ids.size);
  });
});

describe('resumen de conceptos', () => {
  it('separa dominados y por repasar', () => {
    const r = summarizeConcepts([
      { concepto: 'Utilidad marginal', correct: true },
      { concepto: 'Utilidad marginal', correct: true },
      { concepto: 'Críticas', correct: true },
      { concepto: 'Críticas', correct: false },
    ]);
    expect(r).toEqual({ mastered: ['Utilidad marginal'], review: ['Críticas'] });
  });
});
