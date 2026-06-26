import type { GamePhase } from "@/lib/types";

export const MAX_ATTEMPTS = 13;

export type MindleGameState = {
  word: string;
  hints: string[];
  lesson: string;
  guessedLetters: Set<string>;
  wrongLetters: string[];
  revealedHintCount: number;
  attemptsRemaining: number;
  phase: GamePhase;
};

export type MindleGameConfig = {
  word: string;
  hints: string[];
  lesson: string;
};

export function createInitialState({ word, hints, lesson }: MindleGameConfig): MindleGameState {
  return {
    word: normalizeWord(word),
    hints,
    lesson,
    guessedLetters: new Set(),
    wrongLetters: [],
    revealedHintCount: 0,
    attemptsRemaining: MAX_ATTEMPTS,
    phase: "playing",
  };
}

export function normalizeWord(word: string): string {
  return word.trim().toUpperCase();
}

export function normalizeLetter(letter: string): string {
  return letter.trim().toUpperCase();
}

export function isValidLetter(letter: string): boolean {
  return /^[A-Z]$/.test(normalizeLetter(letter));
}

export function getDisplayLetters(word: string, guessedLetters: ReadonlySet<string>): string[] {
  return [...word].map((char) => (guessedLetters.has(char) ? char : "_"));
}

export function isWordComplete(word: string, guessedLetters: ReadonlySet<string>): boolean {
  return [...word].every((char) => char === " " || guessedLetters.has(char));
}

export function guessLetter(state: MindleGameState, letter: string): MindleGameState {
  if (state.phase !== "playing") return state;

  const normalized = normalizeLetter(letter);
  if (!isValidLetter(normalized)) return state;
  if (state.guessedLetters.has(normalized)) return state;

  const guessedLetters = new Set(state.guessedLetters);
  guessedLetters.add(normalized);

  if (state.word.includes(normalized)) {
    const won = isWordComplete(state.word, guessedLetters);
    return {
      ...state,
      guessedLetters,
      phase: won ? "won" : "playing",
    };
  }

  const attemptsRemaining = state.attemptsRemaining - 1;
  return {
    ...state,
    guessedLetters,
    wrongLetters: [...state.wrongLetters, normalized],
    attemptsRemaining,
    phase: attemptsRemaining <= 0 ? "lost" : "playing",
  };
}

export function guessFullWord(state: MindleGameState, guess: string): MindleGameState {
  if (state.phase !== "playing") return state;

  const normalized = normalizeWord(guess);
  if (!normalized) return state;

  if (normalized === state.word) {
    return {
      ...state,
      guessedLetters: new Set(state.word),
      phase: "won",
    };
  }

  const attemptsRemaining = state.attemptsRemaining - 1;
  return {
    ...state,
    attemptsRemaining,
    phase: attemptsRemaining <= 0 ? "lost" : "playing",
  };
}

export function revealHint(state: MindleGameState, hintIndex: number): MindleGameState {
  if (state.phase !== "playing") return state;
  if (hintIndex < 0 || hintIndex >= state.hints.length) return state;
  if (hintIndex !== state.revealedHintCount) return state;

  return {
    ...state,
    revealedHintCount: state.revealedHintCount + 1,
  };
}
