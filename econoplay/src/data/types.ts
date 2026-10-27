// Tipos del archivo de contenido (src/data/contenido.json).
// Las claves del JSON están en español para que sea fácil de corregir.

export type SchoolId = 'neoclasica' | 'austriaca' | 'marxista';

export interface QuestionBase {
  id: string;
  concepto: string;
  explicacion: string;
  fuente: string;
  /** Segundos para responder. Si existe, la pregunta es contrarreloj. */
  contrarreloj?: number;
  /** Cromos que se desbloquean al responder bien. */
  desbloquea?: string[];
}

export interface MultipleChoiceQuestion extends QuestionBase {
  tipo: 'seleccion';
  enunciado: string;
  opciones: string[];
  correcta: number;
}

export interface FillBlankQuestion extends QuestionBase {
  tipo: 'completar';
  /** Frase con ___ donde va la palabra que falta. */
  frase: string;
  opciones: string[];
  correcta: number;
}

export interface TrueFalseQuestion extends QuestionBase {
  tipo: 'vf';
  afirmacion: string;
  respuesta: boolean;
}

export interface MatchQuestion extends QuestionBase {
  tipo: 'relacionar';
  enunciado: string;
  pares: { izquierda: string; derecha: string }[];
}

export type Question =
  | MultipleChoiceQuestion
  | FillBlankQuestion
  | TrueFalseQuestion
  | MatchQuestion;

export interface LessonCard {
  titulo: string;
  texto?: string;
  comparacion?: Partial<Record<SchoolId, string>>;
  fuente: string;
}

export interface Level {
  id: string;
  numero: number;
  titulo: string;
  descripcion: string;
  usaDelDocumento: string;
  tarjetas: LessonCard[];
  preguntas: Question[];
}

export interface Module {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  preguntasDocumento: string;
  niveles: Level[];
}

export interface Collectible {
  id: string;
  nombre: string;
  iniciales: string;
  escuela: SchoolId;
  etiqueta: string;
  aporte: string;
  fuente: string;
  extra?: boolean;
}

export interface Badge {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface SimulatorOption {
  texto: string;
  escuela: SchoolId;
}

export interface Analysis {
  texto: string;
  fuente: string;
}

export interface SimulatorSituation {
  id: string;
  titulo: string;
  historia: string;
  pregunta: string;
  opciones: SimulatorOption[];
  analisis: Record<SchoolId, Analysis>;
}

export interface ClosingText {
  titulo: string;
  texto: string;
  fuente: string;
}

export interface Content {
  app: {
    nombre: string;
    lema: string;
    descripcion: string;
    documento: string;
    referencia: string;
    aviso: string;
  };
  escuelas: Record<SchoolId, { nombre: string; corto: string }>;
  modulos: Module[];
  cromos: Collectible[];
  insignias: Badge[];
  simulador: {
    titulo: string;
    intro: string;
    aviso: string;
    situaciones: SimulatorSituation[];
    controversia: ClosingText;
    cierre: ClosingText;
  };
  retoFinal: {
    titulo: string;
    intro: string;
    preguntasPorNivel: number;
    cierre: ClosingText;
  };
  competencia: {
    titulo: string;
    intro: string;
    segundosPorPregunta: number;
  };
}
