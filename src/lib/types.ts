export type Game = {
  id: string;
  word: string;
  hints: string[];
  lesson: string;
  reset_date: string;
  reset_timezone: string;
  prefilled_letters: string[];
  created_at: string;
};

export type Player = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type GameResult = "win" | "lose";

export type GameResultRow = {
  id: string;
  game_id: string;
  player_id: string;
  player_name: string | null;
  game_word: string | null;
  result: GameResult;
  attempts_used: number;
  reflection_building: string | null;
  reflection_challenges: string | null;
  created_at: string;
};

export type GamePhase = "playing" | "won" | "lost";

/** Serializable game progress — never includes the answer. */
export type ClientGameState = {
  guessedLetters: string[];
  wrongLetters: string[];
  revealedHintCount: number;
  attemptsRemaining: number;
  phase: GamePhase;
};

export type PublicPlaySession = {
  gameId: string;
  hints: string[];
  reset_date: string;
  segmentLengths: number[];
  state: ClientGameState;
  signature: string;
  /** Empty string = hidden cell. Populated letters only. */
  displaySegments: string[][];
  /** Included only after the puzzle ends. */
  word?: string;
  lesson?: string;
};
