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
  prefilledLetters?: string[];
};

function initialGuessedLetters(word: string, prefilledLetters: string[]): Set<string> {
  const letters = new Set<string>();
  const normalizedWord = normalizeWord(word).replace(/\s/g, "");

  for (const letter of prefilledLetters) {
    const normalized = normalizeLetter(letter);
    if (isValidLetter(normalized) && normalizedWord.includes(normalized)) {
      letters.add(normalized);
    }
  }

  return letters;
}

export function parsePrefilledLetters(raw: string, word: string): string[] {
  const normalizedWord = normalizeWord(word).replace(/\s/g, "");
  const seen = new Set<string>();
  const letters: string[] = [];

  for (const part of raw.split(/[,\s]+/)) {
    const normalized = normalizeLetter(part);
    if (!isValidLetter(normalized) || !normalizedWord.includes(normalized) || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    letters.push(normalized);
  }

  return letters;
}

export function createInitialState({
  word,
  hints,
  lesson,
  prefilledLetters = [],
}: MindleGameConfig): MindleGameState {
  const normalizedWord = normalizeWord(word);
  const guessedLetters = initialGuessedLetters(normalizedWord, prefilledLetters);
  const won = isWordComplete(normalizedWord, guessedLetters);

  return {
    word: normalizedWord,
    hints,
    lesson,
    guessedLetters,
    wrongLetters: [],
    revealedHintCount: 0,
    attemptsRemaining: MAX_ATTEMPTS,
    phase: won ? "won" : "playing",
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
