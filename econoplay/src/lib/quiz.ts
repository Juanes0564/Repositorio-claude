import type { MatchQuestion, Question } from '../data/types';
import { shuffle } from './shuffle';

export interface Choice {
  label: string;
  correct: boolean;
}

export type PreparedQuestion =
  | { kind: 'choice'; question: Question; choices: Choice[] }
  | {
      kind: 'match';
      question: MatchQuestion;
      left: string[];
      /** Respuesta correcta para cada elemento de `left`. */
      answers: string[];
      /** Opciones únicas para elegir, ya mezcladas. */
      options: string[];
      /** true: cada opción se usa una sola vez (emparejar). false: clasificar. */
      oneToOne: boolean;
    };

/** Prepara una pregunta para mostrarla: mezcla opciones y marca la correcta. */
export function prepareQuestion(q: Question, rng: () => number = Math.random): PreparedQuestion {
  switch (q.tipo) {
    case 'seleccion':
    case 'completar':
      return {
        kind: 'choice',
        question: q,
        choices: shuffle(
          q.opciones.map((label, i) => ({ label, correct: i === q.correcta })),
          rng,
        ),
      };
    case 'vf':
      return {
        kind: 'choice',
        question: q,
        choices: [
          { label: 'Verdadero', correct: q.respuesta },
          { label: 'Falso', correct: !q.respuesta },
        ],
      };
    case 'relacionar': {
      const pairs = shuffle(q.pares, rng);
      const unique = [...new Set(q.pares.map((p) => p.derecha))];
      const oneToOne = unique.length === q.pares.length;
      return {
        kind: 'match',
        question: q,
        left: pairs.map((p) => p.izquierda),
        answers: pairs.map((p) => p.derecha),
        // Para clasificar, el orden de las escuelas se mantiene fijo (más fácil de leer).
        options: oneToOne ? shuffle(unique, rng) : unique,
        oneToOne,
      };
    }
  }
}

export function isMatchCorrect(answers: string[], picks: (string | null)[]): boolean {
  return answers.every((a, i) => picks[i] === a);
}

/** Texto de la respuesta correcta, para mostrarlo cuando se falla. */
export function correctAnswerText(p: PreparedQuestion): string {
  if (p.kind === 'choice') return p.choices.find((c) => c.correct)!.label;
  return p.left.map((l, i) => `${l} → ${p.answers[i]}`).join(' · ');
}
