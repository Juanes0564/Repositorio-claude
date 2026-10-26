import { content, levels, modules } from '../data';
import type { SchoolId } from '../data/types';

export const STORAGE_KEY = 'econoplay.v1';

export const POINTS_PER_CORRECT = 10;
export const MAX_TIME_BONUS = 5;
export const STREAK_BONUS = 2;
export const COINS_LEVEL = 10;
export const COINS_PERFECT = 5;
export const COINS_SIMULATOR = 15;
export const COINS_FINAL = 20;
export const HINT_COST = 5;

export interface LevelRecord {
  completed: boolean;
  best: number;
  total: number;
  perfect: boolean;
}

export interface Progress {
  version: 1;
  points: number;
  coins: number;
  streak: number;
  bestStreak: number;
  levels: Record<string, LevelRecord>;
  collectibles: string[];
  badges: string[];
  simulator: { completed: boolean; choices: Record<string, SchoolId> };
  final: { completed: boolean; best: number; total: number; mastered: string[]; review: string[] };
  /** Modo presentador: abre todos los niveles sin terminarlos. */
  unlockAll: boolean;
}

export const initialProgress: Progress = {
  version: 1,
  points: 0,
  coins: 0,
  streak: 0,
  bestStreak: 0,
  levels: {},
  collectibles: [],
  badges: [],
  simulator: { completed: false, choices: {} },
  final: { completed: false, best: 0, total: 0, mastered: [], review: [] },
  unlockAll: false,
};

export function loadProgress(): Progress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...initialProgress, ...parsed, version: 1 };
  } catch {
    return initialProgress;
  }
}

export function saveProgress(p: Progress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // Sin almacenamiento (modo privado): la app sigue funcionando en memoria.
  }
}

export function isLevelUnlocked(p: Progress, levelId: string): boolean {
  const index = levels.findIndex((l) => l.id === levelId);
  if (index <= 0 || p.unlockAll) return true;
  return Boolean(p.levels[levels[index - 1].id]?.completed);
}

export function completedLevels(p: Progress): number {
  return levels.filter((l) => p.levels[l.id]?.completed).length;
}

/** Avance general de 0 a 1: niveles, simulador y reto final. */
export function overallProgress(p: Progress): number {
  const steps = levels.length + 2;
  const done = completedLevels(p) + (p.simulator.completed ? 1 : 0) + (p.final.completed ? 1 : 0);
  return done / steps;
}

export function pointsFor(correct: boolean, streak: number, timeRatio?: number): number {
  if (!correct) return 0;
  const timeBonus = timeRatio === undefined ? 0 : Math.round(MAX_TIME_BONUS * timeRatio);
  const streakBonus = streak >= 3 ? STREAK_BONUS : 0;
  return POINTS_PER_CORRECT + timeBonus + streakBonus;
}

/** Revisa qué insignias se ganaron con el estado actual y las agrega. */
export function awardBadges(p: Progress): { progress: Progress; newBadges: string[] } {
  const earned = new Set(p.badges);
  const check = (id: string, ok: boolean) => {
    if (ok) earned.add(id);
  };
  check('primer-nivel', completedLevels(p) > 0);
  for (const m of modules) {
    check(`modulo-${m.id}`, m.niveles.every((l) => p.levels[l.id]?.completed));
  }
  check('album', content.cromos.every((c) => p.collectibles.includes(c.id)));
  check('perfecto', Object.values(p.levels).some((l) => l.perfect));
  check('racha', p.bestStreak >= 5);
  check('simulador', p.simulator.completed);
  check('reto', p.final.completed);
  const newBadges = [...earned].filter((b) => !p.badges.includes(b));
  // Se guardan en el orden del archivo de contenido.
  const ordered = content.insignias.map((b) => b.id).filter((id) => earned.has(id));
  return { progress: newBadges.length ? { ...p, badges: ordered } : p, newBadges };
}

export interface AnswerResult {
  points: number;
  streak: number;
  newCollectibles: string[];
  newBadges: string[];
}

export function applyAnswer(
  p: Progress,
  correct: boolean,
  timeRatio?: number,
  unlocks: string[] = [],
): { progress: Progress; result: AnswerResult } {
  const streak = correct ? p.streak + 1 : 0;
  const points = pointsFor(correct, streak, timeRatio);
  const newCollectibles = correct ? unlocks.filter((id) => !p.collectibles.includes(id)) : [];
  const next: Progress = {
    ...p,
    points: p.points + points,
    streak,
    bestStreak: Math.max(p.bestStreak, streak),
    collectibles: [...p.collectibles, ...newCollectibles],
  };
  const { progress, newBadges } = awardBadges(next);
  return { progress, result: { points, streak, newCollectibles, newBadges } };
}

export interface CompletionResult {
  coins: number;
  newBadges: string[];
  firstTime: boolean;
}

export function completeLevel(
  p: Progress,
  levelId: string,
  correct: number,
  total: number,
): { progress: Progress; result: CompletionResult } {
  const prev = p.levels[levelId];
  const perfect = correct === total;
  const firstTime = !prev?.completed;
  let coins = firstTime ? COINS_LEVEL : 0;
  if (perfect && !prev?.perfect) coins += COINS_PERFECT;
  const next: Progress = {
    ...p,
    coins: p.coins + coins,
    levels: {
      ...p.levels,
      [levelId]: {
        completed: true,
        best: Math.max(prev?.best ?? 0, correct),
        total,
        perfect: perfect || Boolean(prev?.perfect),
      },
    },
  };
  const { progress, newBadges } = awardBadges(next);
  return { progress, result: { coins, newBadges, firstTime } };
}

export function completeSimulator(
  p: Progress,
  choices: Record<string, SchoolId>,
): { progress: Progress; result: CompletionResult } {
  const firstTime = !p.simulator.completed;
  const coins = firstTime ? COINS_SIMULATOR : 0;
  const next: Progress = { ...p, coins: p.coins + coins, simulator: { completed: true, choices } };
  const { progress, newBadges } = awardBadges(next);
  return { progress, result: { coins, newBadges, firstTime } };
}

export function completeFinal(
  p: Progress,
  correct: number,
  total: number,
  mastered: string[],
  review: string[],
): { progress: Progress; result: CompletionResult } {
  const firstTime = !p.final.completed;
  const coins = firstTime ? COINS_FINAL : 0;
  const next: Progress = {
    ...p,
    coins: p.coins + coins,
    final: { completed: true, best: Math.max(p.final.best, correct), total, mastered, review },
  };
  const { progress, newBadges } = awardBadges(next);
  return { progress, result: { coins, newBadges, firstTime } };
}

/** Gasta monedas en una pista. Devuelve null si no alcanzan. */
export function spendHint(p: Progress): Progress | null {
  if (p.coins < HINT_COST) return null;
  return { ...p, coins: p.coins - HINT_COST };
}

/** Agrupa resultados por concepto: dominados (todo bien) y por repasar. */
export function summarizeConcepts(results: { concepto: string; correct: boolean }[]): {
  mastered: string[];
  review: string[];
} {
  const byConcept = new Map<string, boolean>();
  for (const r of results) {
    byConcept.set(r.concepto, (byConcept.get(r.concepto) ?? true) && r.correct);
  }
  const mastered = [...byConcept].filter(([, ok]) => ok).map(([c]) => c);
  const review = [...byConcept].filter(([, ok]) => !ok).map(([c]) => c);
  return { mastered, review };
}
